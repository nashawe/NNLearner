"""network.py - simple vectorized MLP (fixed gradients)
========================================================
This version restores stable training for binary (sigmoid + BCE)
and multiclass (softmax + CE) while keeping full-batch vectorization.
All shapes are kept consistent so loss/accuracy metrics behave.

Quick checklist
---------------
* Each layer ⇢ `(W, b)` NumPy arrays.
* Forward pass returns `zs` (pre-activations) & `acts` (post-activations).
* Back-prop uses delta notation
  otherwise generic `loss_grad * d_act`.
* Gradients are averaged over the mini-batch.
* Accuracy logging reshapes vectors so broadcasting can't explode.
"""
from __future__ import annotations
import numpy as np
import os
from utils.lr_scheduler import cosine_decay
from utils.metrics import accuracy, multiclass_accuracy

# --------------------------------------------------- helper --------------------------------------------------- #

def _zeros(shape):
    return np.zeros(shape, dtype=np.float64)

# --------------------------------------------------- class ---------------------------------------------------- #

class NeuralNetwork:
    """Fully-vectorised feed-forward network supporting SGD / RMSprop / Adam."""

    def __init__(
        self,
        input_dim: int,
        hidden_units: int,
        hidden_layers_count: int,
        output_dim: int,
        mode_cfg: dict,
        dropout_rate: float = 0.0,
        init_fn=None,
        optimizer_choice: int = 1,   # 1=SGD  2=RMSprop  3=Adam
        use_scheduler: bool = False,
        learn_rate: float = 1e-3,
    ) -> None:
        # -------- hyper‑params
        self.in_dim = input_dim
        self.hid_units = hidden_units
        self.n_hidden = hidden_layers_count
        self.out_dim = output_dim
        self.dropout = dropout_rate
        self.init_fn = init_fn or (lambda fan_in, fan_out: np.random.randn(fan_in, fan_out) * 0.01)
        self.opt = optimizer_choice
        self.scheduler = use_scheduler
        self.base_lr = learn_rate

        # -------- activations / loss from mode cfg
        self.f_h = mode_cfg["hidden_activation"]
        self.d_f_h = mode_cfg["hidden_deriv"]
        self.f_o = mode_cfg["output_activation"]
        self.d_f_o = mode_cfg["output_deriv"]
        self.loss = mode_cfg["loss"]
        self.loss_grad = mode_cfg["loss_grad"]

        # -------- weights & biases
        self.weights, self.biases = [], []
        prev = input_dim
        for _ in range(self.n_hidden):
            self.weights.append(self.init_fn(prev, hidden_units))
            self.biases.append(_zeros(hidden_units))
            prev = hidden_units
        self.weights.append(self.init_fn(prev, output_dim))
        self.biases.append(_zeros(output_dim))

        # -------- optimizer state (per‑layer)
        self.state = [{"m": _zeros(W.shape), "v": _zeros(W.shape),
                       "mb": _zeros(b.shape), "vb": _zeros(b.shape)}
                      for W, b in zip(self.weights, self.biases)]
        self.t = 1  # Adam timestep

        # history
        self.loss_history, self.acc_history = [], []

    # ------------------------------------------------ forward -------------------------------------------------- #
    def _forward(self, X: np.ndarray):
        acts = [X]
        zs = []
        A = X
        for i in range(self.n_hidden):
            Z = A @ self.weights[i] + self.biases[i]
            A = self.f_h(Z)
            if self.dropout > 0:
                mask = (np.random.rand(*A.shape) >= self.dropout).astype(np.float64)
                A = A * mask / (1.0 - self.dropout)
            zs.append(Z)
            acts.append(A)
        Z_out = A @ self.weights[-1] + self.biases[-1]
        zs.append(Z_out)
        acts.append(self.f_o(Z_out))
        return zs, acts

    # ------------------------------------------------ backward ------------------------------------------------- #
    def _backward(self, zs, acts, y_true):
        batch = y_true.shape[0]
        dWs = [None] * len(self.weights)
        dBs = [None] * len(self.biases)

        y_pred = acts[-1]
        # Ensure y_true has same 2‑D shape for binary case
        if self.out_dim == 1 and y_true.ndim == 1:
            y_true = y_true.reshape(-1, 1)

        # ---- output delta
        if self.out_dim == 1 and self.f_o.__name__ == "sigmoid" and self.loss.__name__ == "bce_loss":
            delta = y_pred - y_true  # fast path
        elif self.f_o.__name__ == "softmax" and self.loss.__name__ == "cross_entropy":
            delta = y_pred - y_true  # softmax + CE shortcut
        else:
            delta = self.loss_grad(y_pred, y_true)
            if self.d_f_o is not None:
                delta *= self.d_f_o(zs[-1])

        # gradients for output layer
        dWs[-1] = acts[-2].T @ delta / batch
        dBs[-1] = delta.mean(axis=0)

        # ---- hidden layers
        for i in reversed(range(self.n_hidden)):
            delta = (delta @ self.weights[i + 1].T) * self.d_f_h(zs[i])
            dWs[i] = acts[i].T @ delta / batch
            dBs[i] = delta.mean(axis=0)
        return dWs, dBs

    # -------------------------------------------- optimizer step ---------------------------------------------- #
    def _step(self, dWs, dBs, lr):
        eps = 1e-8
        beta1, beta2 = 0.9, 0.999
        self.t += 1
        for i in range(len(self.weights)):
            if self.opt == 1:  # SGD
                self.weights[i] -= lr * dWs[i]
                self.biases[i] -= lr * dBs[i]
            elif self.opt == 2:  # RMSprop
                s = self.state[i]
                s["v"] = 0.9 * s["v"] + 0.1 * (dWs[i] ** 2)
                s["vb"] = 0.9 * s["vb"] + 0.1 * (dBs[i] ** 2)
                self.weights[i] -= lr * dWs[i] / (np.sqrt(s["v"]) + eps)
                self.biases[i] -= lr * dBs[i] / (np.sqrt(s["vb"]) + eps)
            else:  # Adam
                s = self.state[i]
                s["m"] = beta1 * s["m"] + (1 - beta1) * dWs[i]
                s["v"] = beta2 * s["v"] + (1 - beta2) * (dWs[i] ** 2)
                s["mb"] = beta1 * s["mb"] + (1 - beta1) * dBs[i]
                s["vb"] = beta2 * s["vb"] + (1 - beta2) * (dBs[i] ** 2)

                m_hat = s["m"] / (1 - beta1 ** self.t)
                v_hat = s["v"] / (1 - beta2 ** self.t)
                mb_hat = s["mb"] / (1 - beta1 ** self.t)
                vb_hat = s["vb"] / (1 - beta2 ** self.t)

                self.weights[i] -= lr * m_hat / (np.sqrt(v_hat) + eps)
                self.biases[i] -= lr * mb_hat / (np.sqrt(vb_hat) + eps)

    # ---------------------------------------------- training loop --------------------------------------------- #
    def train(
        self,
        X,
        y,
        epochs: int = 1000,
        batch_size: int | None = None,
        lr_min: float = 1e-4,
        on_epoch_end: Callable[[int, float], None] | None = None,
        end_on_epoch: int = 1,
    ):
        """
        Train the network for a given number of epochs.

        Parameters:
        - X: input data, shape (n_samples, n_features)
        - y: true labels, shape (n_samples,) or (n_samples, n_outputs)
        - epochs: total epochs to train
        - batch_size: mini-batch size; if None, use full batch
        - lr_min: minimum learning rate for cosine decay
        - loss_history: list to store loss values
        - acc_history: list to store accuracy values
        - lr_history: list to store learning rates
        """
        # initialize histories
        self.loss_history = []
        self.acc_history = []
        self.lr_history = []

        # determine batch size
        if batch_size is None or batch_size < 1:
            batch_size = len(X)

        for epoch in range(epochs):
            # update learning rate
            lr = (
                cosine_decay(epoch, epochs, self.base_lr, lr_min)
                if getattr(self, 'scheduler', False)
                else self.base_lr
            )

            # shuffle data
            perm = np.random.permutation(len(X))
            X_shuf, y_shuf = X[perm], y[perm]

            # mini-batch updates
            for start in range(0, len(X_shuf), batch_size):
                end = start + batch_size
                zs, acts = self._forward(X_shuf[start:end])
                dWs, dBs = self._backward(zs, acts, y_shuf[start:end])
                self._step(dWs, dBs, lr)

            # compute full-data metrics
            _, acts_full = self._forward(X_shuf)
            y_pred_full = acts_full[-1]
            if self.out_dim == 1:
                y_true = y_shuf.reshape(-1, 1)
                loss_val = float(self.loss(y_true, y_pred_full))
                acc_val = accuracy(y_shuf, y_pred_full.flatten())
            else:
                loss_val = float(self.loss(y_shuf, y_pred_full))
                acc_val = multiclass_accuracy(y_shuf, y_pred_full)

            # record histories
            self.loss_history.append(loss_val)
            self.acc_history.append(acc_val)
            self.lr_history.append(lr)
            self.final_metrics = {
                "loss": loss_val,
                "accuracy": acc_val,
                "learning_rate": lr,
            }
            
            if epoch % 100 == 0:
                print(f"Epoch {epoch}/{epochs} - Loss: {loss_val:.6f} - Accuracy: {acc_val:.3f} - Learning Rate: {lr:.4f}")
    
                
    # ---------------------------------------------- save model --------------------------------------------- #
    def save_model(self, filename: str, mode_id: int,
                norm_stats: dict | None = None):
        import os, numpy as np
        os.makedirs("saved_models", exist_ok=True)
        fp = f"saved_models/{filename}.npz"

        params = {
            "in_dim":   self.in_dim,
            "hid_units": self.hid_units,
            "n_hidden": self.n_hidden,
            "out_dim":  self.out_dim,
            "mode_id":  mode_id,
        }

        # layer params
        for i, (W, b) in enumerate(zip(self.weights, self.biases)):
            params[f"W{i}"] = W
            params[f"b{i}"] = b

        # add normalization meta
        if norm_stats:
            params["norm_method"] = norm_stats["method"]          # "max" | "zscore"
            for k, v in norm_stats.items():
                if k != "method":
                    params[f"norm_{k}"] = v

        np.savez(fp, **params)
        print(f"Model has been successfully saved to {fp}")

    def _apply_norm(self, X):
        if getattr(self, "norm_method", "none") == "max":
            return X / self.norm_max
        if self.norm_method == "zscore":
            return (X - self.norm_mean) / self.norm_std
        return X



    # ---------------------------------------------- inference -------------------------------------------------- #
    def predict(self, X):
        return self._forward(X)[1][-1]

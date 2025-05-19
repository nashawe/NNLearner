import numpy as np

def accuracy(y_true, y_pred):
    preds = (y_pred >= 0.5).astype(int)
    return (preds == y_true).mean()

def precision(y_true, y_pred):
    preds = (y_pred >= 0.5).astype(int)
    tp = ((preds == 1) & (y_true == 1)).sum()
    fp = ((preds == 1) & (y_true == 0)).sum()
    return tp / (tp + fp + 1e-10)

def recall(y_true, y_pred):
    preds = (y_pred >= 0.5).astype(int)
    tp = ((preds == 1) & (y_true == 1)).sum()
    fn = ((preds == 0) & (y_true == 1)).sum()
    return tp / (tp + fn + 1e-10)

def f1_score(y_true, y_pred):
    p = precision(y_true, y_pred)
    r = recall(y_true, y_pred)
    return 2 * p * r / (p + r + 1e-10)

def multiclass_accuracy(y_true, y_pred):
    true_labels = np.argmax(y_true, axis=1)
    pred_labels = np.argmax(y_pred, axis=1)
    return np.mean(true_labels == pred_labels)

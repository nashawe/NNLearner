import numpy as np
from utils.model_loader import load_full_model

def run_prediction_from_api(model_path, test_data):
    # Load model and config
    network, config = load_full_model(model_path)

    test_data = np.array(test_data, dtype=np.float64)
    if config.get("normalize"):
        test_data = test_data / 10.0

    predictions = []
    for sample in test_data:
        pred = network.feedforward(sample)
        if len(pred) == 1:
            predictions.append(float(pred[0]))  # Binary case
        else:
            predictions.append([float(p) for p in pred])  # Multiclass case

    return {
        "model": model_path,
        "num_samples": len(test_data),
        "predictions": predictions
    }

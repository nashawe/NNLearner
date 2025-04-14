import numpy as np

def test_model_loop(network, config):
    while True:
        print("\nPaste your test data here (each line is a sample, comma-separated values).")
        print("When you're done, enter an empty line to finish:")
        test_data_lines = []
        while True:
            line = input()
            if line.strip() == "":
                break
            test_data_lines.append(line)
        if not test_data_lines:
            print("No test data entered. Exiting test loop.")
            break
        test_data = np.array([[float(value.strip()) for value in line.split(',')] for line in test_data_lines])
        if config.get("normalize"):
            test_data = test_data / 10.0

        print("\nModel predictions:")
        for sample in test_data:
            prediction = network.feedforward(sample)
            print(f"Input: {sample} so prediction: {prediction}")

        again = input("\nWould you like to test more data? (y/n): ").strip().lower()
        if again != 'y':
            break
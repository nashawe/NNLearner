# NNLearner: Deep Learning From Scratch & Beyond

---

## 🚀 Project Overview

**NNLearner** is a comprehensive, full-stack web application designed to demystify deep learning. It empowers users to build, train, and understand custom neural networks from the ground up, all powered by a deep learning engine built **entirely from scratch using NumPy – no TensorFlow, PyTorch, or other high-level ML libraries.**

More than just a training tool, NNLearner is an interactive educational platform. It provides a visually rich, sci-fi inspired interface where users can experiment with hyperparameters, visually construct network architectures, analyze training dynamics, and receive intelligent insights into their model's performance.

**🌐 Deployed Website:** [https://neural-network-eight.vercel.app/](https://neural-network-eight.vercel.app/)

---

## ✨ Key Features & Innovations

### 🧠 **Deep Learning Engine: NumPy From Scratch**
*   **Fundamental Implementation:** The core of NNLearner is a meticulously crafted deep learning engine written entirely in pure NumPy. This includes vectorized implementations of:
    *   Forward and Backward (Backpropagation) passes for multi-layered networks.
    *   Multiple optimization algorithms (SGD, RMSprop, Adam) with bias correction and adaptive learning rates.
    *   Support for various activation functions (Sigmoid, ReLU, Tanh, Softmax) and loss functions (Binary Cross-Entropy, Categorical Cross-Entropy, Mean Squared Error).
    *   Dropout for regularization, and a cosine decay learning rate scheduler.
*   **Mathematical Precision:** Demonstrates a deep understanding of the underlying linear algebra and calculus that power modern neural networks.
*   **Efficiency:** Designed for vectorized computation, ensuring optimal performance for a from-scratch implementation.

### ⚙️ **Interactive Network Builder & Hyperparameter Tuning**
*   **Visual Architecture Design:** Users can intuitively build custom neural network architectures layer-by-layer, node-by-node, through an interactive interface.
*   **Extensive Hyperparameter Control:** Fine-tune various core hyperparameters including learning rate, optimizer, number of hidden layers/units, activation functions, batch size, dropout rate, weight initialization schemes, and epochs.
*   **Custom Data Uploads:** Supports custom CSV data uploads for both binary and multi-class classification tasks, allowing for diverse experimentation.
*   **Model and Data Presets:** Users can select from a range of pre-made models and clean data that ensures a smooth training experience. This is perfect for those who want to explore the building process without having to input anything on their own.

### 📊 **Real-time Training Visualization & Insight Engine**
*   **Dynamic Training Graphs:** Observe model performance in real-time with graphs for loss, accuracy, and learning rate after the training process.
*   **Intelligent Performance Diagnostics:** After training, a custom-built logic algorithm analyzes training results (e.g., loss curves, accuracy trends) to provide plain-English feedback. It intelligently diagnoses common issues like:
    *   Underfitting
    *   Overfitting
    *   Plateauing learning rates
    *   Suboptimal hyperparameter choices
*   **Actionable Suggestions:** Based on its diagnosis, the insight engine offers concrete, actionable suggestions for hyperparameter adjustments or architectural changes to improve model performance, fostering deeper understanding.

### 🧪 **Powerful "Edit & Re-train" Experimentation Loop**
*   Enter a dedicated "edit" mode post-training to modify network architecture or hyperparameters.
*   Instantly re-train the model with the new configuration, enabling rapid experimentation and a fast-feedback loop to understand the impact of each design decision.

### 📚 **Comprehensive Educational Content**
*   **"Learn" Page:** A digital textbook explaining the core of the project itself, with optional advanced breakdowns on the mathematics behind the neural networks.
*   **"Explore" Page:**
    *   **Activation Function Playground:** Visually interact with different activation curves to understand their behavior.
    *   **Iconic Architecture Gallery:** Explore visual representations and breakdowns of famous neural network architectures (e.g., LeNet, AlexNet).
    *   **Animated Neuron Anatomy Diagram:** A clear visualization of a single neuron, showing the calculations it does on input data.
*   **Embedded Video Tutorials [COMING SOON]:** Clear, concise video walkthroughs covering app navigation, network building, training, result interpretation, and experimentation.
*   **Academic-Style Documentation:** Extensive, beautifully formatted documentation pages with math support, illustrative examples, and accessible language, providing a deep dive into neural network principles.

---

## 🛠️ Technology Stack

**Frontend:**
*   **React:** For building the interactive, component-based user interface.
*   **TailwindCSS:** For rapid and highly customizable styling.
*   **Framer Motion & GSAP:** For fluid, sci-fi inspired animations and engaging user interactions.
*   **Recharts:** For clear data visualization of training metrics.

**Backend:**
*   **Python (FastAPI):** For handling API requests, managing training jobs, and serving the deep learning engine.
*   **NumPy:** The sole library used for the core neural network computations.
  
**Deployment:**
*   **Vercel:** For frontend hosting.
*   **Render:** For backend hosting.
  
---

## 🚀 How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nashawe/neural-network.git
    cd neural-network
    ```
2.  **Backend Setup:**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
    pip install -r requirements.txt

    uvicorn api.api:app --reload
    ```
3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```
4.  **Access:** Open your browser and navigate to `http://localhost:5173`.

---

## 📈 Future Enhancements

*   Add more advanced optimizers (e.g., AdaGrad, Nesterov Momentum).
*   Implement convolutional layers (CNNs) for image data.
*   Introduce recurrent layers (RNNs) for sequential data.
*   Expand the insight engine with more nuanced diagnostics and suggestions using LLMs.
*   Integrate a custom dataset builder or a gallery.
*   Allow saving/loading of trained models within the UI.
*   User accounts for saving experiment history.

---

## 🙏 Acknowledgements

*   Inspired by the foundational concepts of neural networks and the elegance of vectorized computation.
*   Special thanks to the open-source community for countless resources and inspiration.

---

**© Nathaniel Shawe**

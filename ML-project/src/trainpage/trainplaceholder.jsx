import { useNavigate } from "react-router-dom";

export default function TrainPlaceholder() {
  const navigate = useNavigate();

  function goBack() {
    navigate("/build");
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Training Placeholder</h1>
      <p className="text-gray-700 mb-6">
        This is a placeholder for the training page. The training functionality
        will be implemented soon.
      </p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded shadow"
        onClick={goBack}
      >
        Build a new model
      </button>
    </div>
  );
}

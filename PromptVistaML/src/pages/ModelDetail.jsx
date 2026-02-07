import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PromptBox from "../components/PromptBox";
import OutputPanel from "../components/OutputPanel";
import { fetchModelByNumber } from "../services/supabase";

const ModelDetail = () => {
  const { modelNumber } = useParams();
  const navigate = useNavigate();

  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    loadModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelNumber]);

  const loadModel = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await fetchModelByNumber(modelNumber);

      if (!data) {
        setModel(null);
        setError("Model not found");
        return;
      }

      setModel(data);
    } catch (err) {
      console.error("Error loading model:", err);
      setModel(null);
      setError("Model not found");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * payload will be:
   * { type: "text", value: "..." }
   * { type: "image", value: File }
   * { type: "audio", value: File }
   */
  const handleGenerate = async (payload) => {
    if (!model?.backend_url) {
      setError("Model backend URL is not configured");
      return;
    }

    setIsGenerating(true);
    setError("");
    setOutput("");

    try {
      let response;

      // TEXT REQUEST
      if (payload.type === "text") {
        response = await fetch(model.backend_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: payload.value,
            model_id: model.id, // ✅ send UUID
            timestamp: new Date().toISOString(),
          }),
        });
      }

      // FILE REQUEST (IMAGE/AUDIO)
      if (payload.type === "image" || payload.type === "audio") {
        const formData = new FormData();
        formData.append("file", payload.value);
        formData.append("model_id", model.id); // ✅ send UUID
        formData.append("timestamp", new Date().toISOString());
        formData.append("input_category", payload.type);

        response = await fetch(model.backend_url, {
          method: "POST",
          body: formData,
        });
      }

      if (!response) {
        throw new Error("No request was sent. Invalid input type.");
      }

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const data = await response.json();

      // Normalize output
      const finalOutput =
        data?.output ||
        data?.result ||
        data?.message ||
        JSON.stringify(data, null, 2);

      setOutput(finalOutput);
    } catch (err) {
      console.error("Error generating response:", err);
      setError(`Failed to generate response: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyExample = async (example, index) => {
    try {
      await navigator.clipboard.writeText(example);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1200);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleExampleClick = (example) => {
    // Only works for text models
    // If model is image/audio, examples should not be used.
    if (model?.input_category !== "text") return;

    // We will pass initialPrompt to PromptBox via a key refresh method
    // easiest is: just store it in a state and pass it down.
    // (done below using promptExample)
    setPromptExample(example);
  };

  const [promptExample, setPromptExample] = useState("");

  // ---------------- UI STATES ----------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-purple-600 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">Loading model...</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          Model Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The model with ID <span className="font-mono">{modelNumber}</span> does
          not exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/models")}
          className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
        >
          Browse All Models
        </button>
      </div>
    );
  }

  // If input_category is missing in old DB rows
  const inputCategory = model.input_category || "text";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate("/models")}
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Models
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          {model.model_name}
        </h1>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-sm font-mono px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            {model.model_number}
          </span>

          {model.category && (
            <span className="text-sm px-3 py-1 rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
              {model.category}
            </span>
          )}

          {/* Input Category Badge */}
          <span className="text-sm px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
            {inputCategory}
          </span>

          {model.deployment_status && (
            <span
              className={`text-sm px-3 py-1 rounded-md border ${
                model.deployment_status === "live"
                  ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800"
                  : "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-100 dark:border-yellow-800"
              }`}
            >
              {model.deployment_status}
            </span>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-3xl">
          {model.model_description}
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Prompt card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Test the Model
            </h3>

            <PromptBox
              backendUrl={model.backend_url}
              modelId={model.id}
              inputCategory={inputCategory}
              onResponse={(data) => {
                const finalOutput =
                  data?.output ||
                  data?.result ||
                  data?.message ||
                  JSON.stringify(data, null, 2);

                setOutput(finalOutput);
              }}
              onSubmit={handleGenerate}
              isLoading={isGenerating}
              setIsLoading={setIsGenerating}
              initialPrompt={promptExample}
            />
          </div>

          {/* Example prompts (ONLY for TEXT models) */}
          {inputCategory === "text" &&
            model.example_prompts &&
            model.example_prompts.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Example Prompts
                </h3>

                <div className="space-y-3">
                  {model.example_prompts.map((example, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-800 rounded-md p-3"
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {example}
                      </p>

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => handleExampleClick(example)}
                          className="px-3 py-1.5 text-sm rounded-md bg-purple-600 hover:bg-purple-700 text-white transition"
                        >
                          Use
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyExample(example, index)}
                          className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          {copiedIndex === index ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Output */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Output
            </h3>
            <OutputPanel output={output} isLoading={isGenerating} error={error} />
          </div>

          {/* Model info */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Model Information
            </h3>

            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">
                  Backend Endpoint
                </dt>
                <dd className="text-sm font-mono text-gray-900 dark:text-gray-200 break-all mt-1">
                  {model.backend_url || "Not configured"}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">
                  Input Type
                </dt>
                <dd className="text-sm text-gray-900 dark:text-gray-200 mt-1">
                  {inputCategory === "text"
                    ? "Text prompt (JSON)"
                    : inputCategory === "image"
                    ? "Image upload (multipart/form-data)"
                    : "Audio upload (multipart/form-data)"}
                </dd>
              </div>

              {inputCategory === "text" && (
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">
                    Processing
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-200 mt-1">
                    Prompts are converted to structured input via Gemini API layer
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetail;

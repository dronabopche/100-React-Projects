import { useEffect, useMemo, useState } from "react";

const PromptBox = ({
  backendUrl,
  modelId,
  inputCategory = "text", // "text" | "image" | "audio"
  onResponse,
  isLoading,
  setIsLoading,
  initialPrompt = "",
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    // reset when category changes
    setFile(null);
    setPrompt("");
    setError("");
  }, [inputCategory]);

  const acceptTypes = useMemo(() => {
    if (inputCategory === "image") return ".png,.jpg,.jpeg,.webp";
    if (inputCategory === "audio") return ".mp3,.wav,.m4a,.ogg";
    return "";
  }, [inputCategory]);

  const labelText = useMemo(() => {
    if (inputCategory === "image") return "Upload an Image (png, jpg, jpeg, webp)";
    if (inputCategory === "audio") return "Upload an Audio file (mp3, wav, m4a, ogg)";
    return "Enter your prompt here...";
  }, [inputCategory]);

  const validateFile = (selectedFile) => {
    if (!selectedFile) return "";

    if (inputCategory === "image") {
      const allowed = ["image/png", "image/jpeg", "image/webp"];
      if (!allowed.includes(selectedFile.type)) {
        return "Invalid image type. Only PNG, JPG, JPEG, WEBP allowed.";
      }
    }

    if (inputCategory === "audio") {
      const allowed = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/ogg"];
      if (!allowed.includes(selectedFile.type)) {
        return "Invalid audio type. Only MP3, WAV, M4A, OGG allowed.";
      }
    }

    // Optional size limit (25MB)
    const maxSize = 25 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      return "File too large. Max size allowed is 25MB.";
    }

    return "";
  };

  const sendTextRequest = async () => {
    const payload = {
      prompt: prompt,
      model_id: modelId,
      timestamp: new Date().toISOString(),
    };

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  };

  const sendFileRequest = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model_id", modelId);
    formData.append("timestamp", new Date().toISOString());
    formData.append("input_category", inputCategory);

    const res = await fetch(backendUrl, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!backendUrl) {
      setError("backendUrl is missing.");
      return;
    }

    if (!modelId) {
      setError("modelId is missing.");
      return;
    }

    try {
      setIsLoading(true);

      let result;

      if (inputCategory === "text") {
        if (!prompt.trim()) {
          setError("Prompt cannot be empty.");
          return;
        }
        result = await sendTextRequest();
      } else {
        if (!file) {
          setError("Please upload a file.");
          return;
        }
        result = await sendFileRequest();
      }

      onResponse?.(result);
    } catch (err) {
      setError("Request failed. Check backend URL and API response.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* TEXT MODE */}
      {inputCategory === "text" && (
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={labelText}
            className="input-field min-h-[120px] resize-none"
            rows={4}
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            {prompt.length}/2000
          </div>
        </div>
      )}

      {/* IMAGE/AUDIO MODE */}
      {(inputCategory === "image" || inputCategory === "audio") && (
        <div className="border-2 border-dashed rounded-xl p-6 space-y-4">

          <div className="text-center">
            <p className="text-sm text-gray-700 font-medium">{labelText}</p>
            <p className="text-xs text-gray-500 mt-1">
              Max size: 25MB
            </p>
          </div>

          <input
            type="file"
            accept={acceptTypes}
            disabled={isLoading}
            onChange={(e) => {
              const selected = e.target.files?.[0] || null;
              const msg = validateFile(selected);
              setError(msg);
              setFile(msg ? null : selected);
            }}
            className="block w-full text-sm"
          />

          {file && (
            <div className="text-xs text-gray-600">
              Selected file: <span className="font-medium">{file.name}</span>
            </div>
          )}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={
          isLoading ||
          (inputCategory === "text" && !prompt.trim()) ||
          ((inputCategory === "image" || inputCategory === "audio") && !file)
        }
        className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : "Send"}
      </button>
    </form>
  );
};

export default PromptBox;

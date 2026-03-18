import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"

const Architecture = () => {
  const [active, setActive] = useState("overview")

  const sections = useMemo(
    () => [
      { id: "overview", title: "Overview" },
      { id: "input-flow", title: "Multi-Modal Input Flow" },
      { id: "pages", title: "Pages & UI Layer" },
      { id: "prompt-flow", title: "Prompt → Result Flow" },
      { id: "genai-layer", title: "GenAI API Layer" },
      { id: "model-execution", title: "Model Execution Pipeline" },
      { id: "data-sufficiency", title: "Data Sufficiency Logic" },
      { id: "audio-processing", title: "Audio Processing Flow" },
      { id: "image-processing", title: "Image Processing Flow" },
      { id: "text-processing", title: "Text Processing Flow" },
      { id: "supabase", title: "Supabase Backend" },
      { id: "system-architecture", title: "System Architecture Diagram" },
      { id: "data-flow", title: "End-to-End Data Flow" },
      { id: "api-flow", title: "API Request Flow" },
      { id: "component-diagram", title: "Component Architecture" },
      { id: "why-this", title: "Why This Architecture" }
    ],
    []
  )

  const refs = useRef({})

  useEffect(() => {
    // Create refs
    sections.forEach((s) => {
      if (!refs.current[s.id]) refs.current[s.id] = null
    })
  }, [sections])

  useEffect(() => {
    const onScroll = () => {
      const entries = sections
        .map((s) => {
          const el = refs.current[s.id]
          if (!el) return null
          const rect = el.getBoundingClientRect()
          return { id: s.id, top: rect.top }
        })
        .filter(Boolean)

      // Pick the closest section to the top
      const visible = entries
        .filter((e) => e.top <= 160)
        .sort((a, b) => b.top - a.top)[0]

      if (visible?.id) setActive(visible.id)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener("scroll", onScroll)
  }, [sections])

  const scrollToSection = (id) => {
    const el = refs.current[id]
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    setActive(id)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Multi-Modal Architecture
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl">
              PromptVista ML is built around a clean multi-modal flow: users select a model, 
              provide input (text/audio/image), the GenAI prompt-engineering layer validates 
              input sufficiency, processes the data through appropriate pipelines, and returns 
              the result. All models, schemas, and docs are loaded dynamically from Supabase.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/models"
              className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Models
            </Link>
            <Link
              to="/api-docs"
              className="border border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 px-4 py-2 text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              API Docs
            </Link>
          </div>
        </div>
      </div>

      {/* Layout: Content + Right Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* SECTION: OVERVIEW */}
          <section
            ref={(el) => (refs.current["overview"] = el)}
            id="overview"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Multi-Modal Architecture Overview
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              The architecture supports three input modalities:{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                Text, Audio, and Image
              </span>
              . Each modality follows a specialized processing pipeline while 
              maintaining a consistent interface. The GenAI layer acts as an 
              intelligent router, validating input sufficiency and directing 
              data to appropriate processing engines.
            </p>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-800 rounded">
                    <span className="text-blue-600 dark:text-blue-300 font-bold">T</span>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    Text Processing
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Direct prompt parsing, schema validation, and structured extraction
                </p>
              </div>

              <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-800 rounded">
                    <span className="text-green-600 dark:text-green-300 font-bold">A</span>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    Audio Processing
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Speech-to-text conversion, audio feature extraction, transcription analysis
                </p>
              </div>

              <div className="border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-800 rounded">
                    <span className="text-purple-600 dark:text-purple-300 font-bold">I</span>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    Image Processing
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Image analysis, object detection, visual feature extraction, OCR
                </p>
              </div>
            </div>
          </section>

          {/* SECTION: INPUT FLOW */}
          <section
            ref={(el) => (refs.current["input-flow"] = el)}
            id="input-flow"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Multi-Modal Input Flow
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              The system intelligently routes different input types through specialized 
              processing pipelines while maintaining a unified interface.
            </p>

            <div className="mt-6">
              <MultiModalFlowDiagram />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  Text Input Path
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Direct schema validation</li>
                  <li>• Prompt engineering</li>
                  <li>• Structured extraction</li>
                  <li>• Fast processing path</li>
                </ul>
              </div>

              <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  Audio Input Path
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Audio preprocessing</li>
                  <li>• Speech-to-text conversion</li>
                  <li>• Audio feature extraction</li>
                  <li>• Transcription analysis</li>
                </ul>
              </div>

              <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  Image Input Path
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Image preprocessing</li>
                  <li>• Feature extraction</li>
                  <li>• Object detection</li>
                  <li>• OCR text extraction</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION: PAGES */}
          <section
            ref={(el) => (refs.current["pages"] = el)}
            id="pages"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Pages & UI Layer
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              The UI supports all three input modalities with specialized interfaces 
              for each type. Content is dynamically loaded from Supabase.
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  Model Selection
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose from text, audio, or image models. Each shows supported 
                  input types and example formats.
                </p>
              </div>

              <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  Input Interface
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Dynamic UI based on selected model type: text area, file upload 
                  for audio/images, or example selection.
                </p>
              </div>

              <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  Results Display
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Shows prediction, confidence scores, processing time, and 
                  intermediate steps for each modality.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION: PROMPT FLOW */}
          <section
            ref={(el) => (refs.current["prompt-flow"] = el)}
            id="prompt-flow"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Prompt → Result Flow
            </h2>

            <div className="mt-5 space-y-3">
              <FlowStep
                index="01"
                title="Model Selection"
                desc="User selects appropriate model (text, audio, or image) from available options."
              />
              <FlowStep
                index="02"
                title="Input Submission"
                desc="User provides input: text prompt, audio file upload, or image upload."
              />
              <FlowStep
                index="03"
                title="Input Type Detection"
                desc="System detects input modality and routes to appropriate processing pipeline."
              />
              <FlowStep
                index="04"
                title="Modality-Specific Processing"
                desc="Text: direct parsing. Audio: speech-to-text. Image: feature extraction."
              />
              <FlowStep
                index="05"
                title="GenAI Validation Layer"
                desc="Validates processed input against model schema for sufficiency."
              />
              <FlowStep
                index="06"
                title="Model Execution"
                desc="Selected model processes the validated input and generates prediction."
              />
              <FlowStep
                index="07"
                title="Result Formatting"
                desc="Results formatted appropriately for each modality with confidence scores."
              />
            </div>
          </section>

          {/* SECTION: GENAI LAYER */}
          <section
            ref={(el) => (refs.current["genai-layer"] = el)}
            id="genai-layer"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              GenAI API Layer
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              This intelligent routing layer handles all three modalities, validating 
              input sufficiency and directing data to appropriate processing engines.
            </p>

            <div className="mt-5 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4">
              <p className="font-medium text-gray-900 dark:text-white mb-2">
                Multi-Modal Responsibilities
              </p>

              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Detect input modality (text/audio/image)</li>
                <li>• Route to appropriate preprocessing pipeline</li>
                <li>• Validate processed input against model schema</li>
                <li>• Convert multimodal input to structured format</li>
                <li>• Handle modality-specific enrichment rules</li>
                <li>• Return clear error reasons for insufficient input</li>
              </ul>
            </div>
          </section>

          {/* SECTION: MODEL EXECUTION */}
          <section
            ref={(el) => (refs.current["model-execution"] = el)}
            id="model-execution"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Model Execution Pipeline
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Each modality follows a specialized execution pipeline with optimized 
              processing for its data type.
            </p>

            <div className="mt-6">
              <ModelExecutionDiagram />
            </div>
          </section>

          {/* SECTION: DATA SUFFICIENCY */}
          <section
            ref={(el) => (refs.current["data-sufficiency"] = el)}
            id="data-sufficiency"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Multi-Modal Data Sufficiency Logic
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Sufficiency checks are modality-specific. Each model defines required 
              inputs with type-specific validation rules.
            </p>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  Text Sufficiency
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Validates required fields, checks text length, format compliance, 
                  and semantic completeness.
                </p>
              </div>

              <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  Audio Sufficiency
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Validates audio format, duration, sample rate, clarity, and 
                  speech intelligibility.
                </p>
              </div>

              <div className="border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-4">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  Image Sufficiency
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Validates image format, resolution, clarity, relevant content 
                  presence, and file size.
                </p>
              </div>
            </div>

            <div className="mt-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4">
              <p className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
{`{
  "status": "data_insufficient_for_delivery",
  "input_type": "audio",
  "missing_fields": ["audio_clarity", "minimum_duration"],
  "detected_issues": ["background_noise_too_high", "sample_rate_low"],
  "suggested_fixes": ["use_high_quality_microphone", "record_in_quiet_environment"],
  "message": "Audio input does not meet minimum quality requirements."
}`}
              </p>
            </div>
          </section>

          {/* SECTION: AUDIO PROCESSING */}
          <section
            ref={(el) => (refs.current["audio-processing"] = el)}
            id="audio-processing"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Audio Processing Flow
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Audio inputs go through a multi-stage processing pipeline to extract 
              meaningful features for model consumption.
            </p>

            <div className="mt-6">
              <AudioProcessingDiagram />
            </div>
          </section>

          {/* SECTION: IMAGE PROCESSING */}
          <section
            ref={(el) => (refs.current["image-processing"] = el)}
            id="image-processing"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Image Processing Flow
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Image inputs are processed through computer vision pipelines to extract 
              features, detect objects, and prepare data for model inference.
            </p>

            <div className="mt-6">
              <ImageProcessingDiagram />
            </div>
          </section>

          {/* SECTION: TEXT PROCESSING */}
          <section
            ref={(el) => (refs.current["text-processing"] = el)}
            id="text-processing"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Text Processing Flow
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Text inputs follow the most direct path with sophisticated NLP 
              preprocessing and prompt engineering.
            </p>

            <div className="mt-6">
              <TextProcessingDiagram />
            </div>
          </section>

          {/* SECTION: SUPABASE */}
          <section
            ref={(el) => (refs.current["supabase"] = el)}
            id="supabase"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Supabase Backend
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Supabase stores multi-modal model configurations, example inputs for 
              all modalities, and processing pipeline definitions.
            </p>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  Multi-Modal Tables
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Models table (with modality_type field)</li>
                  <li>• Audio_processing_config table</li>
                  <li>• Image_processing_config table</li>
                  <li>• Example_inputs table (with modality field)</li>
                  <li>• Processing_pipelines table</li>
                </ul>
              </div>

              <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  Dynamic Configuration
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Modality-specific preprocessing rules</li>
                  <li>• File format validations</li>
                  <li>• Quality thresholds per modality</li>
                  <li>• Example datasets for each input type</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION: SYSTEM ARCHITECTURE */}
          <section
            ref={(el) => (refs.current["system-architecture"] = el)}
            id="system-architecture"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              System Architecture Diagram
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Complete system architecture showing how all components interact 
              across the three input modalities.
            </p>

            <SystemArchitectureDiagram />
          </section>

          {/* SECTION: DATA FLOW */}
          <section
            ref={(el) => (refs.current["data-flow"] = el)}
            id="data-flow"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              End-to-End Data Flow
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Detailed data flow showing how information moves through the system 
              for each input modality.
            </p>

            <DataFlowDiagram />
          </section>

          {/* SECTION: API FLOW */}
          <section
            ref={(el) => (refs.current["api-flow"] = el)}
            id="api-flow"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              API Request Flow
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              API request handling flow showing endpoint routing, authentication, 
              and processing for multi-modal inputs.
            </p>

            <ApiFlowDiagram />
          </section>

          {/* SECTION: COMPONENT DIAGRAM */}
          <section
            ref={(el) => (refs.current["component-diagram"] = el)}
            id="component-diagram"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Component Architecture
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Component-level architecture showing how UI components interact 
              with backend services for each modality.
            </p>

            <ComponentArchitectureDiagram />
          </section>

          {/* SECTION: WHY THIS */}
          <section
            ref={(el) => (refs.current["why-this"] = el)}
            id="why-this"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Why This Architecture Works
            </h2>

            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                This multi-modal architecture scales elegantly because each modality 
                has its own optimized pipeline while sharing common infrastructure. 
                Adding new modalities or models doesn't require rewriting core systems.
              </p>

              <p>
                The GenAI layer acts as a{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  smart multimodal router
                </span>
                , not just a validator. It understands the nuances of each input type 
                and applies appropriate preprocessing and validation rules.
              </p>

              <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4">
                <p className="font-medium text-gray-900 dark:text-white mb-2">
                  Key Advantages
                </p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Unified interface for all input types</li>
                  <li>• Modality-specific optimization</li>
                  <li>• Shared validation infrastructure</li>
                  <li>• Easy addition of new modalities</li>
                  <li>• Consistent user experience</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Right Navigation */}
        <div className="lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
              <p className="font-bold text-gray-900 dark:text-white mb-3">
                Architecture Navigation
              </p>

              <div className="space-y-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`w-full text-left px-3 py-2 text-sm border transition-colors duration-200 ${
                      active === s.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                Input Modalities
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Text</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Audio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Image</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Tip: All diagrams show real system flows. Hover over diagram 
                elements to see detailed descriptions of each component.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page-level styles for animation */}
      <style>{`
        @keyframes pvPulse {
          0% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(1); opacity: 0.85; }
        }

        @keyframes pvFlow {
          0% { transform: translateX(0); opacity: 0.35; }
          50% { transform: translateX(6px); opacity: 1; }
          100% { transform: translateX(0); opacity: 0.35; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pv-animate-pulse {
          animation: pvPulse 2.4s ease-in-out infinite;
        }

        .pv-animate-flow {
          animation: pvFlow 1.8s ease-in-out infinite;
        }

        .pv-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .diagram-container {
          position: relative;
          overflow: hidden;
        }

        .diagram-grid {
          display: grid;
          gap: 1rem;
        }

        .diagram-node {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .diagram-node:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .dark .diagram-node {
          border-color: #374151;
        }

        .dark .diagram-node:hover {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}

export default Architecture

/* ----------------------------- Components ----------------------------- */

const FlowStep = ({ index, title, desc }) => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 border border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 font-mono px-3 py-1 text-sm">
          {index}
        </div>

        <div>
          <p className="font-bold text-gray-900 dark:text-white">{title}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {desc}
          </p>
        </div>
      </div>
    </div>
  )
}

const MultiModalFlowDiagram = () => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 diagram-container">
      <div className="diagram-grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Flow */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-lg">
              <span className="text-blue-600 dark:text-blue-300 text-xl font-bold">T</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Text Flow</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Direct processing path</p>
            </div>
          </div>
          
          <DiagramStep title="Text Input" desc="User enters or pastes text" />
          <Arrow />
          <DiagramStep title="Text Preprocessing" desc="Tokenization, cleaning, formatting" />
          <Arrow />
          <DiagramStep title="Schema Validation" desc="Check required fields" pulse />
          <Arrow />
          <DiagramStep title="Model Execution" desc="Text model processes input" />
          <Arrow />
          <DiagramStep title="Text Results" desc="Classification/regression output" />
        </div>

        {/* Audio Flow */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-lg">
              <span className="text-green-600 dark:text-green-300 text-xl font-bold">A</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Audio Flow</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Speech processing path</p>
            </div>
          </div>
          
          <DiagramStep title="Audio Upload" desc="User uploads audio file" />
          <Arrow />
          <DiagramStep title="Audio Validation" desc="Format, duration, quality check" />
          <Arrow />
          <DiagramStep title="Speech-to-Text" desc="Convert audio to transcript" pulse />
          <Arrow />
          <DiagramStep title="Audio Features" desc="Extract tone, emotion, features" />
          <Arrow />
          <DiagramStep title="Model Execution" desc="Audio model processes features" />
          <Arrow />
          <DiagramStep title="Audio Results" desc="Speech analysis output" />
        </div>

        {/* Image Flow */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-lg">
              <span className="text-purple-600 dark:text-purple-300 text-xl font-bold">I</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Image Flow</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Visual processing path</p>
            </div>
          </div>
          
          <DiagramStep title="Image Upload" desc="User uploads image file" />
          <Arrow />
          <DiagramStep title="Image Validation" desc="Format, resolution, size check" />
          <Arrow />
          <DiagramStep title="Feature Extraction" desc="Extract visual features" pulse />
          <Arrow />
          <DiagramStep title="Object Detection" desc="Identify objects in image" />
          <Arrow />
          <DiagramStep title="Model Execution" desc="Image model processes features" />
          <Arrow />
          <DiagramStep title="Image Results" desc="Visual analysis output" />
        </div>
      </div>

      {/* Common Final Step */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-center">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="pv-animate-pulse">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  <span className="text-white text-xl">✓</span>
                </div>
              </div>
            </div>
            <p className="font-bold text-gray-900 dark:text-white">Unified Results Display</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              All modalities converge to a consistent results interface with 
              confidence scores and processing details
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ModelExecutionDiagram = () => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 diagram-container">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Input Layer */}
        <div className="space-y-4">
          <p className="font-bold text-gray-900 dark:text-white mb-4 text-center">Input Layer</p>
          <DiagramNode title="Text Input" color="blue" />
          <DiagramNode title="Audio Upload" color="green" />
          <DiagramNode title="Image Upload" color="purple" />
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <div className="rotate-90 md:rotate-0">
            <ArrowBlock label="PROCESS" />
          </div>
        </div>

        {/* Processing Layer */}
        <div className="space-y-4">
          <p className="font-bold text-gray-900 dark:text-white mb-4 text-center">Processing Layer</p>
          <DiagramNode title="Text Parser" color="blue" />
          <DiagramNode title="Speech-to-Text" color="green" pulse />
          <DiagramNode title="Image Processor" color="purple" pulse />
          <DiagramNode title="Feature Extractor" color="yellow" />
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <div className="rotate-90 md:rotate-0">
            <ArrowBlock label="VALIDATE" />
          </div>
        </div>

        {/* Model Layer */}
        <div className="space-y-4">
          <p className="font-bold text-gray-900 dark:text-white mb-4 text-center">Model Layer</p>
          <DiagramNode title="Text Models" color="blue" />
          <DiagramNode title="Audio Models" color="green" />
          <DiagramNode title="Image Models" color="purple" />
          <DiagramNode title="Multi-Modal" color="pink" pulse />
        </div>
      </div>

      {/* Output Section */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center">
          <ArrowBlock label="OUTPUT" />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <DiagramNode title="Text Results" subtitle="Classification/Regression" />
            <DiagramNode title="Audio Results" subtitle="Transcription/Analysis" />
            <DiagramNode title="Image Results" subtitle="Detection/Recognition" />
          </div>
        </div>
      </div>
    </div>
  )
}

const AudioProcessingDiagram = () => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <DiagramNode title="Audio Upload" subtitle="WAV/MP3 upload" color="green" />
        <Arrow />
        <DiagramNode title="Preprocessing" subtitle="Noise reduction, normalization" pulse />
        <Arrow />
        <DiagramNode title="Feature Extraction" subtitle="MFCC, spectral features" pulse />
        <Arrow />
        <DiagramNode title="Speech-to-Text" subtitle="Transcription engine" pulse />
        <Arrow />
        <DiagramNode title="Audio Analysis" subtitle="Emotion, tone, sentiment" />
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <p className="font-bold text-gray-900 dark:text-white mb-2">Supported Formats</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">WAV, MP3, FLAC, OGG up to 50MB</p>
        </div>
        <div className="p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <p className="font-bold text-gray-900 dark:text-white mb-2">Processing Features</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Noise reduction, volume normalization, speed adjustment</p>
        </div>
        <div className="p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <p className="font-bold text-gray-900 dark:text-white mb-2">Output Types</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Transcript, emotion scores, speaker diarization</p>
        </div>
      </div>
    </div>
  )
}

const ImageProcessingDiagram = () => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <DiagramNode title="Image Upload" subtitle="JPG/PNG upload" color="purple" />
        <Arrow />
        <DiagramNode title="Preprocessing" subtitle="Resize, normalize, augment" pulse />
        <Arrow />
        <DiagramNode title="Feature Extraction" subtitle="CNN features, embeddings" pulse />
        <Arrow />
        <DiagramNode title="Object Detection" subtitle="YOLO, Detectron" pulse />
        <Arrow />
        <DiagramNode title="Image Analysis" subtitle="Classification, segmentation" />
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
          <p className="font-bold text-gray-900 dark:text-white mb-2">Supported Formats</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">JPG, PNG, WebP up to 20MB, max 4096px</p>
        </div>
        <div className="p-4 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
          <p className="font-bold text-gray-900 dark:text-white mb-2">Processing Features</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Auto-crop, color correction, object detection</p>
        </div>
        <div className="p-4 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
          <p className="font-bold text-gray-900 dark:text-white mb-2">Output Types</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Labels, bounding boxes, segmentation masks</p>
        </div>
      </div>
    </div>
  )
}

const TextProcessingDiagram = () => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <DiagramNode title="Text Input" subtitle="Direct text entry" color="blue" />
        <Arrow />
        <DiagramNode title="Text Cleaning" subtitle="Remove noise, normalize" />
        <Arrow />
        <DiagramNode title="Tokenization" subtitle="Split into tokens" />
        <Arrow />
        <DiagramNode title="Embedding" subtitle="Convert to vectors" pulse />
        <Arrow />
        <DiagramNode title="Model Input" subtitle="Prepare for model" />
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <p className="font-bold text-gray-900 dark:text-white mb-2">Input Methods</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Direct typing, file upload, API call</p>
        </div>
        <div className="p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <p className="font-bold text-gray-900 dark:text-white mb-2">Processing Features</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">NER, sentiment analysis, summarization</p>
        </div>
        <div className="p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <p className="font-bold text-gray-900 dark:text-white mb-2">Output Types</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Classifications, regressions, embeddings</p>
        </div>
      </div>
    </div>
  )
}

const SystemArchitectureDiagram = () => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Client Layer */}
        <div className="space-y-4">
          <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="font-bold text-gray-900 dark:text-white mb-3">Client Layer</p>
            <div className="space-y-3">
              <DiagramNode title="React UI" subtitle="Model selection interface" />
              <DiagramNode title="Input Components" subtitle="Text/audio/image inputs" pulse />
              <DiagramNode title="Results Display" subtitle="Unified results view" />
            </div>
          </div>
        </div>

        {/* API Layer */}
        <div className="space-y-4">
          <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="font-bold text-gray-900 dark:text-white mb-3">API Layer</p>
            <div className="space-y-3">
              <DiagramNode title="GenAI Router" subtitle="Input type detection" pulse />
              <DiagramNode title="Validation Service" subtitle="Schema validation" />
              <DiagramNode title="Processing Service" subtitle="Modality processing" />
            </div>
          </div>
        </div>

        {/* Backend Layer */}
        <div className="space-y-4">
          <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="font-bold text-gray-900 dark:text-white mb-3">Backend Layer</p>
            <div className="space-y-3">
              <DiagramNode title="Model Servers" subtitle="Text/audio/image models" />
              <DiagramNode title="Supabase DB" subtitle="Model metadata storage" />
              <DiagramNode title="File Storage" subtitle="Audio/image storage" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-bold text-gray-900 dark:text-white">Text Models</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Fast inference</p>
        </div>
        <div className="text-center p-4 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-bold text-gray-900 dark:text-white">Audio Models</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Real-time processing</p>
        </div>
        <div className="text-center p-4 border border-purple-200 dark:border-purple-800 rounded-lg">
          <p className="text-sm font-bold text-gray-900 dark:text-white">Image Models</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">GPU accelerated</p>
        </div>
        <div className="text-center p-4 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm font-bold text-gray-900 dark:text-white">Multi-Modal</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Combined analysis</p>
        </div>
      </div>
    </div>
  )
}

const DataFlowDiagram = () => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
      <div className="space-y-6">
        {/* Flow Row 1 */}
        <div className="flex items-center justify-between gap-4">
          <FlowStepNode title="User Input" type="start" />
          <Arrow />
          <FlowStepNode title="Type Detection" type="process" pulse />
          <Arrow />
          <FlowStepNode title="Routing" type="decision" />
        </div>

        {/* Flow Row 2 - Branches */}
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-4">
            <FlowStepNode title="Text Pipeline" type="process" color="blue" />
            <Arrow vertical />
            <FlowStepNode title="Text Processing" type="process" />
            <Arrow vertical />
            <FlowStepNode title="Text Model" type="model" />
          </div>
          
          <div className="space-y-4">
            <FlowStepNode title="Audio Pipeline" type="process" color="green" />
            <Arrow vertical />
            <FlowStepNode title="Audio Processing" type="process" pulse />
            <Arrow vertical />
            <FlowStepNode title="Audio Model" type="model" />
          </div>
          
          <div className="space-y-4">
            <FlowStepNode title="Image Pipeline" type="process" color="purple" />
            <Arrow vertical />
            <FlowStepNode title="Image Processing" type="process" pulse />
            <Arrow vertical />
            <FlowStepNode title="Image Model" type="model" />
          </div>
        </div>

        {/* Flow Row 3 - Convergence */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1"></div>
          <Arrow />
          <FlowStepNode title="Results Aggregation" type="process" pulse />
          <Arrow />
          <FlowStepNode title="Response" type="end" />
        </div>
      </div>
    </div>
  )
}

const ApiFlowDiagram = () => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
      <div className="space-y-4">
        <ApiStep title="API Request" subtitle="POST /api/predict" />
        <Arrow />
        <ApiStep title="Authentication" subtitle="API key validation" />
        <Arrow />
        <ApiStep title="Rate Limiting" subtitle="Check usage limits" />
        <Arrow />
        <ApiStep title="Input Validation" subtitle="Format and size checks" pulse />
        <Arrow />
        <ApiStep title="Processing" subtitle="Modality-specific pipeline" pulse />
        <Arrow />
        <ApiStep title="Model Execution" subtitle="Inference engine" />
        <Arrow />
        <ApiStep title="Response Formatting" subtitle="JSON structure" />
        <Arrow />
        <ApiStep title="API Response" subtitle="200 OK with results" />
      </div>
    </div>
  )
}

const ComponentArchitectureDiagram = () => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ComponentNode title="ModelSelector" type="UI" tech="React" />
        <ComponentNode title="InputUploader" type="UI" tech="React" />
        <ComponentNode title="ResultsViewer" type="UI" tech="React" />
        
        <ComponentNode title="GenAIService" type="Service" tech="Node.js" pulse />
        <ComponentNode title="AudioProcessor" type="Service" tech="Python" />
        <ComponentNode title="ImageProcessor" type="Service" tech="Python" />
        
        <ComponentNode title="ModelRegistry" type="Service" tech="Supabase" />
        <ComponentNode title="FileStorage" type="Service" tech="S3/Supabase" />
        <ComponentNode title="CacheService" type="Service" tech="Redis" />
      </div>
    </div>
  )
}

/* ----------------------------- Diagram Components ----------------------------- */

const DiagramNode = ({ title, subtitle, color = "gray", pulse = false }) => {
  const colorClasses = {
    blue: "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20",
    green: "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20",
    purple: "border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20",
    yellow: "border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20",
    pink: "border-pink-300 dark:border-pink-700 bg-pink-50 dark:bg-pink-900/20",
    gray: "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
  }

  return (
    <div className={`diagram-node ${colorClasses[color]} ${pulse ? 'pv-animate-pulse' : ''}`}>
      <p className="font-medium text-gray-900 dark:text-white">{title}</p>
      {subtitle && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  )
}

const DiagramStep = ({ title, desc, pulse = false }) => {
  return (
    <div className={`p-4 border border-gray-300 dark:border-gray-700 rounded-lg ${pulse ? 'pv-animate-pulse' : ''}`}>
      <p className="font-medium text-gray-900 dark:text-white">{title}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{desc}</p>
    </div>
  )
}

const Arrow = ({ vertical = false }) => {
  return (
    <div className={`flex items-center justify-center ${vertical ? 'py-2' : 'px-2'}`}>
      <div className={`pv-animate-flow text-gray-400 dark:text-gray-500 ${vertical ? 'rotate-90' : ''}`}>
        {vertical ? '↓' : '→'}
      </div>
    </div>
  )
}

const ArrowBlock = ({ label }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1 text-xs font-mono text-gray-700 dark:text-gray-300">
        {label}
      </div>
      <div className="mt-2 pv-animate-flow text-gray-600 dark:text-gray-400">
        ➜
      </div>
    </div>
  )
}

const FlowStepNode = ({ title, type = "process", color = "gray", pulse = false }) => {
  const typeStyles = {
    start: "border-green-500 bg-green-50 dark:bg-green-900/20",
    end: "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
    decision: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
    process: "border-gray-500 bg-gray-50 dark:bg-gray-800",
    model: "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
  }

  return (
    <div className={`p-4 border-2 rounded-lg ${typeStyles[type]} ${pulse ? 'pv-animate-pulse' : ''}`}>
      <p className="font-medium text-gray-900 dark:text-white text-center">{title}</p>
    </div>
  )
}

const ApiStep = ({ title, subtitle, pulse = false }) => {
  return (
    <div className={`flex items-center gap-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg ${pulse ? 'pv-animate-pulse' : ''}`}>
      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
        <span className="text-gray-600 dark:text-gray-400">→</span>
      </div>
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  )
}

const ComponentNode = ({ title, type, tech, pulse = false }) => {
  return (
    <div className={`p-4 border border-gray-300 dark:border-gray-700 rounded-lg ${pulse ? 'pv-animate-pulse' : ''}`}>
      <p className="font-bold text-gray-900 dark:text-white">{title}</p>
      <div className="flex gap-2 mt-2">
        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
          {type}
        </span>
        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded">
          {tech}
        </span>
      </div>
    </div>
  )
}
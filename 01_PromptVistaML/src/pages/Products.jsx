import React from "react";

function Products() {

  const products = [
    {
      id: 1,
      name: "AI HR Assistant",
      description: "Automates recruitment, screening, and HR workflows using AI.",
      url: "https://ai-hr.yoursite.com"
    },
    {
      id: 2,
      name: "Data Insight Extractor",
      description: "Extracts meaningful insights and patterns from raw datasets.",
      url: "https://data-insight.yoursite.com"
    },
    {
      id: 3,
      name: "AI Hallucination Detector",
      description: "Detects and analyzes hallucinations in AI-generated content.",
      url: "https://hallucination.yoursite.com"
    },
    {
      id: 4,
      name: "ATS Analyzer",
      description: "Evaluates resumes against job descriptions for ATS optimization.",
      url: "https://ats.yoursite.com"
    },
    {
      id: 5,
      name: "AI Attendance System",
      description: "Smart attendance tracking using AI and automation.",
      url: "https://attendance.yoursite.com"
    }
  ];

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">

      {/* Heading */}
      <h1 className="text-3xl font-bold text-center mb-10">
        Our Products
      </h1>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {product.name}
            </h2>

            <p className="text-gray-600 mb-4">
              {product.description}
            </p>

            <a href={product.url}>
              <button className="bg-black text-white px-4 py-2 rounded-lg">
                Open Product
              </button>
            </a>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Products;
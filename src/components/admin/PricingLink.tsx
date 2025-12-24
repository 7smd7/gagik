'use client'

import React from 'react'

export const GeminiPricingLink: React.FC = () => {
  return (
    <div className="text-sm -mt-2 mb-4">
      <a
        href="https://ai.google.dev/gemini-api/docs/pricing"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        View Gemini API pricing and model details →
      </a>
    </div>
  )
}

export const OpenAIPricingLink: React.FC = () => {
  return (
    <div className="text-sm -mt-2 mb-4">
      <a
        href="https://platform.openai.com/docs/pricing"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        View OpenAI pricing and model details →
      </a>
    </div>
  )
}

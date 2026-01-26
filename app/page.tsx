'use client'

import { useRef } from 'react'
import LLMSTxtGenerator from '@/components/LLMSTxtGenerator'

export default function Home() {
  const scrollToInput = () => {
    const inputElement = document.getElementById('url-input')
    if (inputElement) {
      inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => {
        inputElement.focus()
      }, 500)
    }
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">LLMS.txt Generator</span>
            </div>
            <a 
              href="https://github.com" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full text-primary-700 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI-Powered Content Extraction
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            Generate LLMS.txt Files
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
              for Your Website
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Transform any website into an AI-readable format. Create comprehensive, 
            well-structured LLMS.txt files with intelligent content extraction and formatting.
          </p>

          {/* Main CTA Button */}
          <div className="mb-12">
            <button
              onClick={scrollToInput}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-600 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-700 via-indigo-700 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-3">
                <span>Generate Your LLMS.txt Now</span>
                <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
          </div>

          {/* SEO Stats Section with Visual Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-2 right-2 w-16 h-16 bg-primary-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-primary-600 mb-2 flex items-center justify-center gap-1">
                  10x
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-sm text-gray-600 font-medium">Better AI Visibility</div>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  +850% growth
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-2 right-2 w-16 h-16 bg-green-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-sm text-gray-600 font-medium">Free Forever</div>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No credit card
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-2 right-2 w-16 h-16 bg-purple-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-purple-600 mb-2 flex items-center justify-center gap-1">
                  2min
                  <svg className="w-4 h-4 text-purple-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-gray-600 font-medium">Average Setup</div>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-purple-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Quick start
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-2 right-2 w-16 h-16 bg-orange-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-orange-600 mb-2">∞</div>
                <div className="text-sm text-gray-600 font-medium">Unlimited Sites</div>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-orange-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  No limits
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium text-gray-700">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Fully Editable</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Instant Download</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Free to Use</span>
            </div>
          </div>
        </div>

        {/* Why LLMS.txt Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 rounded-2xl border border-primary-200/50 p-8 sm:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Why LLMS.txt Files Matter
                </h2>
                <p className="text-lg text-gray-700">
                  Make your website discoverable and accessible to AI models, search engines, and modern web crawlers
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SEO Benefits */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">SEO & Discoverability</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    LLMS.txt files help search engines and AI-powered crawlers understand your website&apos;s content structure, 
                    improving your visibility in search results and AI-powered search tools.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Enhanced search engine indexing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Better AI-powered search visibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Structured content for crawlers</span>
                    </li>
                  </ul>
                </div>

                {/* AI Integration */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">AI Model Access</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Enable AI assistants, chatbots, and language models to accurately understand and reference your 
                    website content in their responses.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>ChatGPT and AI assistants can cite your site</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Improved AI training data quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Better context for AI-powered tools</span>
                    </li>
                  </ul>
                </div>

                {/* Future-Proofing */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Future-Proof Your Content</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    As AI becomes increasingly integrated into web browsing and search, LLMS.txt ensures your content 
                    remains accessible and properly understood by next-generation tools.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Stay ahead of AI-driven web evolution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Standardized format for AI consumption</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Compatible with emerging AI standards</span>
                    </li>
                  </ul>
                </div>

                {/* Content Control */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Content Control</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Provide a curated, accurate representation of your website that you control, ensuring AI models 
                    understand your content exactly as you intend.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Curated content representation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Reduce AI hallucinations about your site</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Ensure accurate information dissemination</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-primary-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Industry Standard</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      LLMS.txt is becoming the standard format for making website content accessible to AI models, 
                      similar to how robots.txt became standard for web crawlers. Major AI companies and search engines 
                      are increasingly using LLMS.txt files to understand and index web content more effectively.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Visual Comparison Section */}
        <div className="mt-20 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Boost Your SEO & AI Discoverability
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how LLMS.txt files improve your website&apos;s visibility
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Without LLMS.txt */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Without LLMS.txt</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Limited AI Understanding</p>
                    <p className="text-sm text-gray-600">AI models may misinterpret or miss important content</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Lower Search Rankings</p>
                    <p className="text-sm text-gray-600">Miss out on AI-powered search visibility</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Inaccurate AI Citations</p>
                    <p className="text-sm text-gray-600">AI assistants may provide incorrect information about your site</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">AI Visibility Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-red-600">35%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* With LLMS.txt */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-300 shadow-lg relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">RECOMMENDED</span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">With LLMS.txt</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Enhanced AI Understanding</p>
                    <p className="text-sm text-gray-600">AI models accurately interpret your content structure</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Improved Search Rankings</p>
                    <p className="text-sm text-gray-600">Better visibility in AI-powered and traditional search</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Accurate AI Citations</p>
                    <p className="text-sm text-gray-600">AI assistants provide correct information about your site</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-green-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">AI Visibility Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-green-600">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA after comparison */}
          <div className="text-center mt-12">
            <button
              onClick={scrollToInput}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span>Start Generating Your LLMS.txt</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* How It Works - Visual Process Flow */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Generate and deploy your LLMS.txt file in four simple steps
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Connecting Lines - Hidden on mobile */}
              <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-indigo-200 via-green-200 to-blue-200"></div>
              
              {/* Step 1 */}
              <div className="relative z-10">
                <div className="bg-white rounded-2xl p-8 border-2 border-primary-200 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Enter URL</h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    Simply paste your website URL into the input field above
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow - Hidden on mobile */}
              <div className="hidden md:flex items-center justify-center absolute top-16 left-1/2 transform -translate-x-1/2 z-20">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="relative z-10">
                <div className="bg-white rounded-2xl p-8 border-2 border-indigo-200 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">AI Processing</h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    Our AI extracts and structures your content intelligently
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow - Hidden on mobile */}
              <div className="hidden md:flex items-center justify-center absolute top-16 right-1/4 transform translate-x-1/2 z-20">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>

              {/* Step 3 */}
              <div className="relative z-10">
                <div className="bg-white rounded-2xl p-8 border-2 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Download & Edit</h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    Review and edit the generated content, then download the file
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow - Hidden on mobile */}
              <div className="hidden lg:flex items-center justify-center absolute top-16 right-1/8 transform translate-x-1/2 z-20">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>

              {/* Step 4 */}
              <div className="relative z-10">
                <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                    4
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Upload to Server</h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed mb-4">
                    Upload <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">llms.txt</code> to your website&apos;s root directory
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Instructions */}
            <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Upload Instructions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">1</div>
                    <h4 className="font-semibold text-gray-900">Access Your Server</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Connect to your web server via FTP, SFTP, or your hosting control panel (cPanel, Plesk, etc.)
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">2</div>
                    <h4 className="font-semibold text-gray-900">Navigate to Root</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Go to your website&apos;s root directory (usually <code className="bg-gray-100 px-1 rounded text-xs">public_html</code>, <code className="bg-gray-100 px-1 rounded text-xs">www</code>, or <code className="bg-gray-100 px-1 rounded text-xs">htdocs</code>)
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">3</div>
                    <h4 className="font-semibold text-gray-900">Upload File</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Upload the <code className="bg-gray-100 px-1 rounded text-xs">llms.txt</code> file to the root directory, same level as your <code className="bg-gray-100 px-1 rounded text-xs">index.html</code>
                  </p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-300">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">Verify Upload</p>
                    <p className="text-sm text-blue-800">
                      After uploading, verify it&apos;s accessible at <code className="bg-blue-200 px-1.5 py-0.5 rounded text-xs font-mono">https://yourdomain.com/llms.txt</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA after process */}
            <div className="text-center mt-12">
              <button
                onClick={scrollToInput}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span>Start Now - It&apos;s Free</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Generator Component */}
        <div id="generator-section">
          <LLMSTxtGenerator />
        </div>

        {/* FAQ Section */}
        <div className="mt-20 mb-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              FAQ
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Best practices for creating a trustworthy LLMS.txt that improves AEO (Answer Engine Optimization) and reduces hallucinations.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <details className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6 open:shadow-md transition-shadow">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <span className="text-lg font-semibold text-gray-900">Where do I put the file?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-sm text-gray-700 leading-relaxed">
                Upload <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">llms.txt</code> to your website&apos;s <strong>root</strong> directory so it&apos;s available at
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono ml-1">https://yourdomain.com/llms.txt</code>.
                For most hosts the root is <code className="bg-gray-100 px-1 rounded text-xs font-mono">public_html</code>, <code className="bg-gray-100 px-1 rounded text-xs font-mono">www</code>, or <code className="bg-gray-100 px-1 rounded text-xs font-mono">htdocs</code>.
              </div>
            </details>

            <details className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6 open:shadow-md transition-shadow">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <span className="text-lg font-semibold text-gray-900">What should I include?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-sm text-gray-700 leading-relaxed">
                Prioritize content that helps LLMs answer user questions accurately:
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-600 flex-shrink-0"></span>
                    <span><strong>What you do:</strong> product/service summary, primary use-cases, target audience.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-600 flex-shrink-0"></span>
                    <span><strong>Key pages:</strong> pricing, docs, API reference, getting started, downloads, support.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-600 flex-shrink-0"></span>
                    <span><strong>Canonical links:</strong> link to the single best source of truth for each topic.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-600 flex-shrink-0"></span>
                    <span><strong>Contact & policy:</strong> support channels, refund policy, SLA, security page.</span>
                  </li>
                </ul>
              </div>
            </details>

            <details className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6 open:shadow-md transition-shadow">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <span className="text-lg font-semibold text-gray-900">What should I NOT include?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-sm text-gray-700 leading-relaxed">
                Avoid anything sensitive or likely to become outdated:
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span><strong>Secrets:</strong> API keys, credentials, internal URLs, admin links.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span><strong>Personal data:</strong> emails/phones not meant for public, customer info, private docs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span><strong>Speculative claims:</strong> “coming soon” timelines, unannounced features, vague guarantees.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span><strong>Duplicated sources:</strong> multiple pages that conflict—pick one canonical page instead.</span>
                  </li>
                </ul>
              </div>
            </details>

            <details className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6 open:shadow-md transition-shadow">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <span className="text-lg font-semibold text-gray-900">How do I reduce AI hallucinations about my business?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-sm text-gray-700 leading-relaxed">
                Use “truth anchors” and remove ambiguity:
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600 flex-shrink-0"></span>
                    <span><strong>Be explicit:</strong> include exact product names, supported platforms, and current pricing link.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600 flex-shrink-0"></span>
                    <span><strong>Link sources of truth:</strong> docs, changelog, pricing, and policy pages.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600 flex-shrink-0"></span>
                    <span><strong>Remove stale info:</strong> keep outdated features and old pricing out of LLMS.txt.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600 flex-shrink-0"></span>
                    <span><strong>Prefer facts over marketing:</strong> short, verifiable statements beat fluffy claims.</span>
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </div>

        {/* SEO Benefits Visual */}
        <div className="mt-24 mb-16">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48"></div>
            </div>
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Unlock the Power of AI Discovery</h2>
                <p className="text-lg text-indigo-100">Join thousands of websites optimizing for the AI era</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-4xl font-bold mb-2">10x</div>
                  <div className="text-indigo-100">More AI Visibility</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-4xl font-bold mb-2">50%</div>
                  <div className="text-indigo-100">Better Search Rankings</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-indigo-100">AI Accuracy</div>
                </div>
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={scrollToInput}
                  className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Extraction</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              AI intelligently extracts titles, headings, content, and links from any website structure.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Edit & Customize</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Review and edit the generated content before downloading to ensure it meets your needs.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Use</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Download your LLMS.txt file instantly and deploy it to your website&apos;s root directory.
            </p>
          </div>
        </div>

        {/* Trust Badges & Social Proof */}
        <div className="mt-24 mb-12">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Trusted by</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span className="font-semibold">Web Developers</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="font-semibold">SEO Experts</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span className="font-semibold">AI Companies</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>Built with Next.js, TypeScript, and OpenAI</p>
            <p className="mt-2">
              LLMS.txt helps make your website content accessible to AI models and LLMs.
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}

# LLMS.txt Generator

A modern web tool that generates LLMS.txt files for websites using AI-powered content extraction.

## Features

- 🔗 **URL Input**: Simply paste your website URL
- 🤖 **AI-Powered**: Uses OpenAI to intelligently extract and format content
- ✏️ **Editable**: Review and edit the generated content before downloading
- 💾 **Download**: Export your LLMS.txt file with one click
- 🎨 **Modern UI**: Beautiful, responsive SaaS-style interface

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (optional, but recommended for best results)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a website URL in the input field
2. Click "Generate" to create the LLMS.txt file
3. Review and edit the generated content if needed
4. Click "Download" to save the file

## How It Works

1. **Web Scraping**: The tool fetches the HTML content from the provided URL
2. **Content Extraction**: Uses Cheerio to parse and extract meaningful content (titles, headings, paragraphs, links)
3. **AI Processing**: Sends the extracted content to OpenAI to generate a well-structured LLMS.txt file
4. **Fallback**: If OpenAI is unavailable, generates a basic LLMS.txt using the extracted content

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern styling
- **OpenAI API**: AI-powered content generation
- **Cheerio**: HTML parsing and content extraction
- **Axios**: HTTP client for web scraping

## License

MIT

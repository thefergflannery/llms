import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

async function scrapeWebsite(url: string) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000,
    })
    return response.data
  } catch (error: any) {
    throw new Error(`Failed to fetch website: ${error.message}`)
  }
}

function extractTextContent(html: string) {
  const $ = cheerio.load(html)
  
  // Remove script and style elements
  $('script, style, noscript').remove()
  
  // Extract main content
  const title = $('title').text() || ''
  const metaDescription = $('meta[name="description"]').attr('content') || ''
  const headings = $('h1, h2, h3, h4, h5, h6').map((_, el) => $(el).text()).get()
  const paragraphs = $('p').map((_, el) => $(el).text().trim()).get().filter(p => p.length > 0)
  const links = $('a[href]').map((_, el) => ({
    text: $(el).text().trim(),
    href: $(el).attr('href'),
  })).get().filter(link => link.text && link.href)
  
  return {
    title,
    metaDescription,
    headings,
    paragraphs,
    links,
    rawText: $('body').text().replace(/\s+/g, ' ').trim(),
  }
}

async function generateLLMSTxt(url: string, extractedContent: any) {
  const prompt = `You are an expert at creating LLMS.txt files. Generate a comprehensive LLMS.txt file for the following website:

URL: ${url}
Title: ${extractedContent.title}
Description: ${extractedContent.metaDescription}

Headings:
${extractedContent.headings.slice(0, 20).join('\n')}

Key Content:
${extractedContent.paragraphs.slice(0, 30).join('\n\n')}

Important Links:
${extractedContent.links.slice(0, 20).map((l: any) => `- ${l.text}: ${l.href}`).join('\n')}

Create a well-structured LLMS.txt file that includes:
1. A clear title and description
2. Main content sections
3. Important links and resources
4. Contact information if available
5. Any other relevant information that would help an LLM understand this website

Format it according to LLMS.txt standards with clear sections and markdown-style formatting.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating LLMS.txt files. Generate clear, well-structured, and comprehensive LLMS.txt content that helps LLMs understand websites.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    return completion.choices[0]?.message?.content || ''
  } catch (error: any) {
    // Fallback to manual generation if OpenAI fails
    return generateFallbackLLMSTxt(url, extractedContent)
  }
}

function generateFallbackLLMSTxt(url: string, extractedContent: any) {
  const lines = [
    `# ${extractedContent.title || 'Website Documentation'}`,
    '',
    `**URL:** ${url}`,
    '',
    extractedContent.metaDescription ? `**Description:** ${extractedContent.metaDescription}` : '',
    '',
    '## Overview',
    '',
    ...extractedContent.paragraphs.slice(0, 10).map((p: string) => p),
    '',
    '## Key Sections',
    '',
    ...extractedContent.headings.slice(0, 15).map((h: string) => `### ${h}`),
    '',
    '## Important Links',
    '',
    ...extractedContent.links.slice(0, 20).map((l: any) => `- [${l.text}](${l.href})`),
    '',
    '---',
    `Generated on: ${new Date().toISOString()}`,
  ]

  return lines.filter(line => line !== '').join('\n')
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Scrape the website
    const html = await scrapeWebsite(url)
    
    // Extract content
    const extractedContent = extractTextContent(html)
    
    // Generate LLMS.txt using AI
    let llmsTxtContent = ''
    if (process.env.OPENAI_API_KEY) {
      llmsTxtContent = await generateLLMSTxt(url, extractedContent)
    } else {
      // Use fallback if no API key
      llmsTxtContent = generateFallbackLLMSTxt(url, extractedContent)
    }

    return NextResponse.json({ content: llmsTxtContent })
  } catch (error: any) {
    console.error('Error generating LLMS.txt:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate LLMS.txt' },
      { status: 500 }
    )
  }
}

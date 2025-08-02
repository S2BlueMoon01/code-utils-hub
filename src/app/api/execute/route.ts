import { NextRequest, NextResponse } from 'next/server'

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com'
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ''

const languageMap: Record<string, number> = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  java: 62,       // Java
  cpp: 54,        // C++
  csharp: 51,     // C#
  php: 68,        // PHP
  go: 60,         // Go
  rust: 73,       // Rust
  typescript: 74  // TypeScript
}

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json()
    
    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      )
    }

    const languageId = languageMap[language]
    
    if (!languageId) {
      return NextResponse.json(
        { error: `Language ${language} is not supported for execution` },
        { status: 400 }
      )
    }

    // If no RapidAPI key, return mock response
    if (!RAPIDAPI_KEY) {
      return NextResponse.json({
        output: `Mock execution for ${language}:\n${code}\n\n--- Execution completed ---`,
        error: null
      })
    }

    // Submit code to Judge0
    const submissionResponse = await fetch(`${JUDGE0_API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId
      })
    })

    if (!submissionResponse.ok) {
      throw new Error('Failed to submit code')
    }

    const submission = await submissionResponse.json()
    const token = submission.token

    // Poll for result
    let result
    let attempts = 0
    const maxAttempts = 10

    do {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
      
      const resultResponse = await fetch(
        `${JUDGE0_API_URL}/submissions/${token}`,
        {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        }
      )

      if (!resultResponse.ok) {
        throw new Error('Failed to get result')
      }

      result = await resultResponse.json()
      attempts++
    } while (result.status.id <= 2 && attempts < maxAttempts) // In Queue or Processing

    if (result.status.id <= 3) { // Success
      const output = result.stdout || 'Code executed successfully (no output)'
      const timing = `\n\n--- Execution completed in ${result.time ? (parseFloat(result.time) * 1000).toFixed(2) : '0'}ms ---`
      
      return NextResponse.json({
        output: output + timing,
        error: null
      })
    } else {
      const errorOutput = result.stderr || result.status.description || 'Unknown error'
      
      return NextResponse.json({
        output: result.stdout || '',
        error: errorOutput
      })
    }

  } catch (error) {
    console.error('Code execution error:', error)
    
    return NextResponse.json(
      { 
        output: '', 
        error: `Execution failed: ${(error as Error).message}` 
      },
      { status: 500 }
    )
  }
}

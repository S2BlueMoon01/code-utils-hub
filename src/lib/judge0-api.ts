/**
 * Judge0 API Integration for Multi-language Code Execution
 * Supports server-side execution for multiple programming languages
 */

// Judge0 API Configuration
const JUDGE0_API_URL = process.env.NEXT_PUBLIC_JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'
const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || 'demo-key'

export interface Judge0Language {
  id: number
  name: string
  compile_cmd?: string
  run_cmd?: string
}

export interface Judge0Submission {
  language_id: number
  source_code: string
  stdin?: string
  expected_output?: string
  cpu_time_limit?: number
  memory_limit?: number
}

export interface Judge0Result {
  token: string
  status: {
    id: number
    description: string
  }
  stdout?: string
  stderr?: string
  compile_output?: string
  message?: string
  time?: string
  memory?: number
  exit_code?: number
}

// Supported languages with Judge0 language IDs
export const SUPPORTED_LANGUAGES: Record<string, Judge0Language> = {
  cpp: { id: 54, name: 'C++ (GCC 9.2.0)' },
  c: { id: 50, name: 'C (GCC 9.2.0)' },
  java: { id: 62, name: 'Java (OpenJDK 13.0.1)' },
  python3: { id: 71, name: 'Python (3.8.1)' },
  csharp: { id: 51, name: 'C# (Mono 6.6.0.161)' },
  go: { id: 60, name: 'Go (1.13.5)' },
  rust: { id: 73, name: 'Rust (1.40.0)' },
  php: { id: 68, name: 'PHP (7.4.1)' },
  ruby: { id: 72, name: 'Ruby (2.7.0)' },
  swift: { id: 83, name: 'Swift (5.2.3)' },
  kotlin: { id: 78, name: 'Kotlin (1.3.70)' },
  scala: { id: 81, name: 'Scala (2.13.2)' },
  dart: { id: 90, name: 'Dart (2.19.2)' },
  r: { id: 80, name: 'R (4.0.0)' },
  perl: { id: 85, name: 'Perl (5.28.1)' },
  lua: { id: 64, name: 'Lua (5.3.5)' }
}

// Default code templates for each language
export const DEFAULT_CODE_TEMPLATES: Record<string, string> = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  python3: `# Python 3
print("Hello, World!")

# Example: Simple calculation
def add_numbers(a, b):
    return a + b

result = add_numbers(5, 3)
print(f"5 + 3 = {result}")`,
  csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
  rust: `fn main() {
    println!("Hello, World!");
}`,
  php: `<?php
echo "Hello, World!\\n";
?>`,
  ruby: `puts "Hello, World!"

# Example: Simple method
def greet(name)
  "Hello, #{name}!"
end

puts greet("Ruby")`,
  swift: `import Foundation

print("Hello, World!")`,
  kotlin: `fun main() {
    println("Hello, World!")
}`,
  scala: `object Main extends App {
    println("Hello, World!")
}`,
  dart: `void main() {
  print('Hello, World!');
}`,
  r: `print("Hello, World!")

# Example: Simple calculation
numbers <- c(1, 2, 3, 4, 5)
mean_value <- mean(numbers)
print(paste("Mean:", mean_value))`,
  perl: `#!/usr/bin/perl
print "Hello, World!\\n";`,
  lua: `print("Hello, World!")

-- Example: Simple function
function greet(name)
    return "Hello, " .. name .. "!"
end

print(greet("Lua"))`
}

export class Judge0API {
  private static instance: Judge0API
  private baseURL: string
  private apiKey: string

  constructor() {
    this.baseURL = JUDGE0_API_URL
    this.apiKey = RAPIDAPI_KEY
  }

  static getInstance(): Judge0API {
    if (!Judge0API.instance) {
      Judge0API.instance = new Judge0API()
    }
    return Judge0API.instance
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<unknown> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Judge0 API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getLanguages(): Promise<Judge0Language[]> {
    try {
      const response = await this.makeRequest('/languages') as Judge0Language[]
      return response
    } catch (error) {
      console.error('Failed to fetch languages:', error)
      // Return supported languages as fallback
      return Object.values(SUPPORTED_LANGUAGES)
    }
  }

  async submitCode(submission: Judge0Submission): Promise<{ token: string }> {
    const response = await this.makeRequest('/submissions?base64_encoded=false&wait=false', {
      method: 'POST',
      body: JSON.stringify(submission),
    }) as { token: string }

    return { token: response.token }
  }

  async getSubmissionResult(token: string, maxRetries = 10): Promise<Judge0Result> {
    let retries = 0
    
    while (retries < maxRetries) {
      const result = await this.makeRequest(`/submissions/${token}?base64_encoded=false`) as Judge0Result
      
      // Status ID 1 = In Queue, 2 = Processing
      if (result.status.id > 2) {
        return result
      }
      
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, 1000))
      retries++
    }
    
    throw new Error('Execution timeout')
  }

  async executeCode(
    languageKey: string, 
    sourceCode: string, 
    stdin?: string
  ): Promise<{
    success: boolean
    output: string
    error?: string
    executionTime?: string
    memory?: number
  }> {
    try {
      const language = SUPPORTED_LANGUAGES[languageKey]
      if (!language) {
        throw new Error(`Unsupported language: ${languageKey}`)
      }

      // Submit code for execution
      const { token } = await this.submitCode({
        language_id: language.id,
        source_code: sourceCode,
        stdin: stdin || '',
        cpu_time_limit: 10, // 10 seconds limit
        memory_limit: 128000, // 128MB limit
      })

      // Get execution result
      const result = await this.getSubmissionResult(token)

      // Process result
      if (result.status.id === 3) { // Accepted
        return {
          success: true,
          output: result.stdout || 'Code executed successfully',
          executionTime: result.time,
          memory: result.memory,
        }
      } else {
        // Handle different error types
        let errorMessage = result.status.description
        
        if (result.compile_output) {
          errorMessage += `\n\nCompile Error:\n${result.compile_output}`
        }
        
        if (result.stderr) {
          errorMessage += `\n\nRuntime Error:\n${result.stderr}`
        }
        
        if (result.message) {
          errorMessage += `\n\nMessage:\n${result.message}`
        }

        return {
          success: false,
          output: result.stdout || '',
          error: errorMessage,
          executionTime: result.time,
          memory: result.memory,
        }
      }
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown execution error',
      }
    }
  }

  getDefaultCode(languageKey: string): string {
    return DEFAULT_CODE_TEMPLATES[languageKey] || '// Write your code here'
  }

  getSupportedLanguages(): Array<{ key: string; name: string; id: number }> {
    return Object.entries(SUPPORTED_LANGUAGES).map(([key, lang]) => ({
      key,
      name: lang.name,
      id: lang.id,
    }))
  }
}

// Export singleton instance
export const judge0API = Judge0API.getInstance()

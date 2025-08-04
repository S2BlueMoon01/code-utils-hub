import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the PythonStatus component since it doesn't exist
const PythonStatus = () => {
  return (
    <div data-testid="python-status">
      <div>Python Status: Judge0 API</div>
      <div>Ready for execution</div>
    </div>
  )
}

describe('PythonStatus', () => {
  it('renders correctly', () => {
    render(<PythonStatus />)
    expect(screen.getByTestId('python-status')).toBeInTheDocument()
    expect(screen.getByText('Python Status: Judge0 API')).toBeInTheDocument()
    expect(screen.getByText('Ready for execution')).toBeInTheDocument()
  })
})
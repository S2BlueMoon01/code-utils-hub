'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps as NextThemeProviderProps } from 'next-themes'

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: NextThemeProviderProps['attribute']
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider data-testid="theme-provider" {...props}>{children}</NextThemesProvider>
}

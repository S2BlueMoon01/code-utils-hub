# CodeUtilsHub - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js TypeScript project for CodeUtilsHub - a modern platform for developers providing:
- Utility functions library (JavaScript, Python, TypeScript)
- Code playground with live execution
- Community features (authentication, contributions, ratings)
- Full testing suite (Unit, Integration, E2E, Lighthouse)

## Technical Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Code Editor**: Monaco Editor
- **Testing**: Vitest (unit), Playwright (E2E), Lighthouse CI
- **Database**: Supabase
- **Code Execution**: Pyodide (Python), Judge0 (multi-language)
- **Search**: Algolia/Fuse.js
- **PWA**: next-pwa

## Code Standards
- Follow SOLID principles and DRY patterns
- Use TypeScript strictly with proper type definitions
- Implement responsive design (mobile-first approach)
- Ensure accessibility (WCAG 2.1 AA compliance)
- Target Lighthouse scores 90+ for all metrics
- Write comprehensive tests with 80%+ coverage
- Use semantic HTML and proper ARIA attributes

## Component Structure
- Use functional components with hooks
- Implement proper error boundaries
- Add loading states and skeleton loaders
- Include proper TypeScript interfaces
- Follow atomic design principles (atoms, molecules, organisms)

## Performance Guidelines
- Use Next.js Image optimization
- Implement proper code splitting
- Add lazy loading where appropriate
- Optimize bundle size
- Use proper caching strategies

## Testing Requirements
- Write unit tests for all utility functions
- Add integration tests for API routes
- Include E2E tests for critical user flows
- Maintain test coverage reports
- Test accessibility with axe-core

## Feature Tracking
- Update FEATURES.md when adding new features
- Follow the established status tracking system
- Document any breaking changes
- Update documentation as needed

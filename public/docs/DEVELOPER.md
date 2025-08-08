# CodeUtilsHub Developer Documentation

Welcome to the CodeUtilsHub developer documentation! This guide provides comprehensive information for developers who want to contribute to the platform, integrate with our APIs, or set up their own development environment.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Architecture Overview](#architecture-overview)
3. [Contributing Guidelines](#contributing-guidelines)
4. [API Integration](#api-integration)
5. [Testing & Quality Assurance](#testing--quality-assurance)
6. [Deployment & DevOps](#deployment--devops)
7. [Code Style & Standards](#code-style--standards)
8. [Feature Development Workflow](#feature-development-workflow)
9. [Performance Guidelines](#performance-guidelines)
10. [Security Best Practices](#security-best-practices)

## Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.17+ and npm/yarn
- **Git** for version control
- **VS Code** (recommended) with extensions:
  - TypeScript
  - Prettier
  - ESLint
  - Tailwind CSS IntelliSense

### Local Development

1. **Clone the Repository**
```bash
git clone https://github.com/your-org/code-utils-hub.git
cd code-utils-hub
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

Configure the following environment variables:
```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token

# Judge0 API (for code execution)
JUDGE0_API_URL=your_judge0_api_url
JUDGE0_API_KEY=your_judge0_api_key
```

4. **Database Setup**
```bash
# Run Supabase migrations
npx supabase db push
```

5. **Start Development Server**
```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Development Tools

**Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run test:coverage # Generate coverage report
```

## Architecture Overview

### Technology Stack

**Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **Zustand** - State management

**Backend**
- **Next.js API Routes** - Backend API endpoints
- **Supabase** - Database and authentication
- **NextAuth.js** - Authentication framework
- **Judge0 API** - Code execution service

**Development & Deployment**
- **Vercel** - Hosting and deployment
- **GitHub Actions** - CI/CD pipeline
- **Sentry** - Error monitoring
- **Lighthouse CI** - Performance monitoring

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── ...                # Feature pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── features/         # Feature-specific components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── stores/               # Zustand state stores
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

### Component Architecture

We follow **Atomic Design** principles:

- **Atoms**: Basic UI elements (Button, Input, Badge)
- **Molecules**: Combinations of atoms (SearchBox, Card)
- **Organisms**: Complex components (Header, FunctionList)
- **Templates**: Page layouts
- **Pages**: Complete page implementations

### State Management

**Global State (Zustand)**
- Authentication state
- User preferences
- Language settings
- Favorites management

**Server State (React Query)**
- API data fetching
- Caching and synchronization
- Background updates
- Optimistic updates

## Contributing Guidelines

### Code Contribution Process

1. **Fork & Clone**
```bash
git fork https://github.com/your-org/code-utils-hub.git
git clone https://github.com/your-username/code-utils-hub.git
```

2. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Development Workflow**
- Write code following our style guidelines
- Add comprehensive tests
- Update documentation
- Run quality checks

4. **Quality Checks**
```bash
npm run lint           # Check code style
npm run type-check     # Verify TypeScript
npm run test           # Run unit tests
npm run test:e2e       # Run E2E tests
```

5. **Commit & Push**
```bash
git add .
git commit -m "feat: add new feature description"
git push origin feature/your-feature-name
```

6. **Create Pull Request**
- Use our PR template
- Include comprehensive description
- Link related issues
- Request reviews

### Commit Message Convention

We use **Conventional Commits** format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build/tooling changes

**Examples:**
```
feat(auth): add GitHub OAuth integration
fix(playground): resolve Monaco editor loading issue
docs(api): update endpoint documentation
```

### Pull Request Guidelines

**PR Requirements:**
- Clear, descriptive title
- Comprehensive description
- Screenshots for UI changes
- Test coverage for new features
- Documentation updates
- No breaking changes without discussion

**PR Template:**
```markdown
## Description
Brief description of changes

## Changes Made
- List of specific changes
- New features added
- Bugs fixed

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
```

## API Integration

### Authentication

All API endpoints require authentication using NextAuth.js:

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your API logic here
}
```

### API Endpoints

**Function Management**
```typescript
// GET /api/functions - List functions
// POST /api/functions - Create function
// GET /api/functions/[id] - Get function details
// PUT /api/functions/[id] - Update function
// DELETE /api/functions/[id] - Delete function
```

**Search & Analytics**
```typescript
// GET /api/search - Search functions
// POST /api/analytics/search - Track search
// GET /api/analytics/popular - Popular functions
```

**User Management**
```typescript
// GET /api/user/profile - User profile
// PUT /api/user/profile - Update profile
// GET /api/user/favorites - User favorites
// POST /api/user/favorites - Add favorite
```

### SDK Development

Create TypeScript SDK for external integrations:

```typescript
class CodeUtilsHubSDK {
  constructor(private apiKey: string, private baseUrl: string) {}
  
  async searchFunctions(query: string, filters?: SearchFilters) {
    // Implementation
  }
  
  async getFunction(id: string) {
    // Implementation
  }
  
  async executeCode(code: string, language: string) {
    // Implementation
  }
}
```

## Testing & Quality Assurance

### Testing Strategy

**Unit Testing (Vitest)**
- Component testing with React Testing Library
- Utility function testing
- Custom hook testing
- API route testing

**Integration Testing**
- Database integration tests
- Authentication flow tests
- API endpoint integration tests

**End-to-End Testing (Playwright)**
- User journey testing
- Cross-browser compatibility
- Performance testing
- Accessibility testing

### Writing Tests

**Component Tests**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**API Tests**
```typescript
import { POST } from '@/app/api/functions/route';

describe('/api/functions', () => {
  it('creates a new function', async () => {
    const request = new Request('http://localhost:3000/api/functions', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Function',
        code: 'function test() { return true; }',
        language: 'javascript'
      })
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.name).toBe('Test Function');
  });
});
```

### Quality Metrics

**Target Metrics:**
- **Code Coverage**: >80%
- **TypeScript**: Strict mode, no `any` types
- **Performance**: Core Web Vitals scores >90
- **Accessibility**: WCAG 2.1 AA compliance
- **Bundle Size**: <100KB main bundle

**Quality Gates:**
- All tests must pass
- No TypeScript errors
- ESLint score >95%
- Lighthouse scores >90%

## Deployment & DevOps

### CI/CD Pipeline

**GitHub Actions Workflow:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Build project
        run: npm run build
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Environment Management

**Environment Hierarchy:**
1. **Development** - Local development
2. **Preview** - Feature branch deployments
3. **Staging** - Pre-production testing
4. **Production** - Live application

**Environment Variables:**
- Use Vercel environment variables
- Separate configs per environment
- Sensitive data in secrets

### Monitoring & Observability

**Error Monitoring**
- Sentry for error tracking
- Performance monitoring
- User session tracking
- Custom error boundaries

**Performance Monitoring**
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- API response time monitoring
- Database query performance

**Analytics**
- Custom analytics implementation
- User behavior tracking
- Feature usage metrics
- Search analytics

## Code Style & Standards

### TypeScript Guidelines

**Type Safety**
```typescript
// ✅ Good: Explicit types
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Good: Generic constraints
function processItems<T extends { id: string }>(items: T[]): T[] {
  return items.filter(item => item.id);
}

// ❌ Avoid: Any types
function process(data: any): any {
  return data;
}
```

**Component Types**
```typescript
// ✅ Good: Proper component typing
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  // Implementation
}
```

### React Best Practices

**Component Structure**
```typescript
// ✅ Good: Clear component structure
export function UserProfile({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = useCallback((data: UserData) => {
    // Save logic
  }, []);
  
  if (!user) {
    return <UserProfileSkeleton />;
  }
  
  return (
    <div className="user-profile">
      {/* Component JSX */}
    </div>
  );
}
```

**Custom Hooks**
```typescript
// ✅ Good: Reusable custom hook
export function useUserData(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading, error };
}
```

### CSS & Styling

**Tailwind CSS Guidelines**
```tsx
// ✅ Good: Semantic class organization
<div className="
  flex items-center justify-between
  p-4 rounded-lg
  bg-white dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  hover:shadow-lg transition-shadow
">
  {/* Content */}
</div>

// ✅ Good: Custom CSS variables for consistency
<div className="bg-primary text-primary-foreground">
  {/* Content */}
</div>
```

**Component Variants**
```typescript
// ✅ Good: cva for component variants
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
      },
    },
  }
);
```

## Feature Development Workflow

### Planning Phase

1. **Feature Specification**
   - Define requirements and acceptance criteria
   - Create technical design document
   - Identify dependencies and risks
   - Estimate development effort

2. **Technical Design**
   - API endpoint design
   - Database schema changes
   - Component architecture
   - Integration points

### Development Phase

1. **Feature Branch Creation**
```bash
git checkout -b feature/feature-name
```

2. **Test-Driven Development**
   - Write tests first
   - Implement functionality
   - Refactor and optimize
   - Ensure all tests pass

3. **Implementation Steps**
   - Backend API development
   - Frontend component development
   - Integration and testing
   - Documentation updates

### Review & Deployment

1. **Code Review Process**
   - Self-review checklist
   - Peer review requirements
   - Security review for sensitive features
   - Performance review for critical paths

2. **Testing Checklist**
   - Unit tests passing
   - Integration tests passing
   - E2E tests passing
   - Manual testing completed
   - Accessibility testing
   - Performance testing

3. **Deployment Process**
   - Merge to main branch
   - Automated deployment to staging
   - Staging verification
   - Production deployment
   - Post-deployment monitoring

## Performance Guidelines

### Frontend Optimization

**Bundle Optimization**
```typescript
// ✅ Good: Dynamic imports for code splitting
const CodePlayground = lazy(() => import('@/components/CodePlayground'));

// ✅ Good: Component lazy loading
const LazyComponent = dynamic(() => import('./Component'), {
  loading: () => <ComponentSkeleton />,
  ssr: false
});
```

**Image Optimization**
```tsx
// ✅ Good: Next.js Image component
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

**API Optimization**
```typescript
// ✅ Good: Request deduplication
export async function getUser(id: string) {
  return fetch(`/api/users/${id}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
}

// ✅ Good: Streaming responses
export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      // Stream large datasets
    }
  });
  
  return new Response(stream);
}
```

### Database Optimization

**Query Optimization**
```sql
-- ✅ Good: Efficient queries with indexes
CREATE INDEX idx_functions_language_category 
ON functions(language, category, created_at);

-- ✅ Good: Pagination with cursors
SELECT * FROM functions 
WHERE created_at > $cursor 
ORDER BY created_at 
LIMIT 20;
```

**Caching Strategy**
- Redis for session storage
- CDN for static assets
- Database query caching
- API response caching

## Security Best Practices

### Authentication & Authorization

**JWT Security**
```typescript
// ✅ Good: Secure JWT configuration
const jwtConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60,    // 24 hours
};

// ✅ Good: Role-based access control
export function requireAuth(roles?: string[]) {
  return async (req: Request) => {
    const session = await getServerSession();
    
    if (!session) {
      throw new UnauthorizedError();
    }
    
    if (roles && !roles.includes(session.user.role)) {
      throw new ForbiddenError();
    }
    
    return session;
  };
}
```

### Input Validation

**Schema Validation**
```typescript
import { z } from 'zod';

// ✅ Good: Strict input validation
const createFunctionSchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(10000),
  language: z.enum(['javascript', 'typescript', 'python']),
  description: z.string().max(500),
});

export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const data = createFunctionSchema.parse(body);
    // Process validated data
  } catch (error) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }
}
```

### XSS Prevention

**Content Sanitization**
```typescript
import DOMPurify from 'dompurify';

// ✅ Good: Sanitize user content
function sanitizeHtml(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre'],
    ALLOWED_ATTR: []
  });
}

// ✅ Good: CSP headers
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
`;
```

### CSRF Protection

**Token Validation**
```typescript
// ✅ Good: CSRF token validation
import { getCsrfToken } from 'next-auth/csrf';

export async function POST(request: Request) {
  const token = request.headers.get('x-csrf-token');
  const expectedToken = await getCsrfToken();
  
  if (token !== expectedToken) {
    return Response.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }
  
  // Process request
}
```

---

## Support & Resources

### Documentation

- **API Documentation**: `/docs/API.md`
- **Deployment Guide**: `/docs/DEPLOYMENT.md`
- **User Guide**: `/docs/USER_GUIDE.md`
- **Architecture Decisions**: `/docs/ADR/`

### Community

- **GitHub Discussions**: Ask questions and share ideas
- **Discord Server**: Real-time community chat
- **Weekly Calls**: Developer community meetings
- **Bug Reports**: GitHub Issues

### Development Resources

- **Code Examples**: `/examples/` directory
- **Component Storybook**: Design system documentation
- **API Playground**: Interactive API testing
- **Performance Dashboard**: Real-time metrics

---

**Ready to Contribute?**

Start with our [Good First Issues](https://github.com/your-org/code-utils-hub/labels/good-first-issue) or check out our [Feature Roadmap](https://github.com/your-org/code-utils-hub/projects) to see what's coming next!

**Questions?**

Join our developer community on [Discord](https://discord.gg/your-invite) or start a [GitHub Discussion](https://github.com/your-org/code-utils-hub/discussions).

**Happy Coding! 🚀**

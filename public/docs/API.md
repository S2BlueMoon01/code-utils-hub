# CodeUtilsHub API Documentation

## Overview

CodeUtilsHub provides a RESTful API for interacting with utility functions, code execution, analytics, and user data. All API endpoints are built with Next.js API routes and support JSON request/response format.

**Base URL**: `https://your-domain.com/api`

## Authentication

Most endpoints require authentication via Supabase JWT tokens.

### Authentication Header
```bash
Authorization: Bearer <jwt_token>
```

### Getting a Token
```javascript
// Client-side authentication
import { supabase } from '@/lib/supabase'

const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token
```

## Error Handling

All API responses follow a consistent error format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

## Endpoints

### Analytics

#### GET /api/analytics

Get analytics data with optional filtering.

**Query Parameters:**
- `type` (string, optional): Filter by analytics type (`search`, `usage`, etc.)
- `limit` (number, optional): Number of results to return (default: 100)
- `timeframe` (string, optional): Time period (`1d`, `7d`, `30d`, `90d`)

**Response:**
```json
{
  "data": [
    {
      "type": "search",
      "timestamp": 1703980800000,
      "sessionId": "session_123",
      "metadata": {}
    }
  ],
  "stats": {
    "total": 150,
    "byType": {
      "search": 100,
      "click": 50
    },
    "uniqueSessions": 75,
    "dateRange": {
      "from": 1703980800000,
      "to": 1704067200000
    }
  },
  "success": true
}
```

**Search Analytics:**
```json
{
  "searches": [
    {
      "id": "search_123",
      "query": "format date",
      "category": "formatting",
      "language": "javascript",
      "timestamp": 1703980800000,
      "resultsCount": 15,
      "userId": "user_123"
    }
  ],
  "summary": {
    "totalSearches": 500,
    "uniqueQueries": 200,
    "averageResults": 12.5,
    "popularQueries": [
      {
        "query": "format date",
        "count": 45
      }
    ],
    "trendingCategories": [
      {
        "category": "formatting",
        "count": 120
      }
    ],
    "trendingLanguages": [
      {
        "language": "javascript",
        "count": 300
      }
    ]
  }
}
```

#### POST /api/analytics

Track analytics events.

**Request Body:**
```json
{
  "type": "search",
  "data": {
    "query": "format date",
    "resultsCount": 15,
    "category": "formatting",
    "language": "javascript"
  },
  "sessionId": "session_123",
  "userId": "user_123" // optional
}
```

**Response:**
```json
{
  "success": true
}
```

### Code Execution

#### POST /api/execute

Execute code in various programming languages.

**Request Body:**
```json
{
  "code": "console.log('Hello World')",
  "language": "javascript",
  "input": "", // optional
  "options": {
    "timeout": 5000,
    "memory": 128
  }
}
```

**Supported Languages:**
- `javascript` - Node.js runtime
- `python` - Python 3.9+
- `typescript` - TypeScript compilation + Node.js
- `html` - HTML with CSS/JS preview
- `java` - Java 11+
- `cpp` - C++ 17
- `c` - C99

**Response:**
```json
{
  "success": true,
  "output": "Hello World\n",
  "error": null,
  "executionTime": 45,
  "memory": 12.5,
  "language": "javascript",
  "version": "18.0.0"
}
```

**Error Response:**
```json
{
  "success": false,
  "output": "",
  "error": "SyntaxError: Unexpected token",
  "executionTime": 12,
  "language": "javascript"
}
```

### Authentication

#### GET /auth/callback

OAuth callback handler for GitHub/Google authentication.

**Query Parameters:**
- `code` (string): OAuth authorization code
- `state` (string): OAuth state parameter

**Response:**
Redirects to appropriate page with authentication status.

### Error Reporting

#### POST /api/errors

Report client-side errors for monitoring.

**Request Body:**
```json
{
  "message": "TypeError: Cannot read property 'x' of undefined",
  "stack": "Error stack trace...",
  "url": "https://app.com/page",
  "userAgent": "Mozilla/5.0...",
  "timestamp": 1703980800000,
  "userId": "user_123", // optional
  "feature": "search", // optional
  "action": "click_result", // optional
  "metadata": {
    "customData": "value"
  },
  "level": "error" // error|warning|info|debug
}
```

**Response:**
```json
{
  "success": true,
  "message": "Error reported successfully"
}
```

#### GET /api/errors

Get error statistics (development only).

**Response:**
```json
{
  "message": "Error monitoring is active",
  "environment": "development",
  "timestamp": 1703980800000
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Default**: 60 requests per minute per IP
- **Code Execution**: 10 requests per minute per IP
- **Analytics**: 100 requests per minute per IP

Rate limit headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1703980860
```

## SDK Usage Examples

### JavaScript/TypeScript

```javascript
// Analytics tracking
async function trackSearch(query, results) {
  const response = await fetch('/api/analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      type: 'search',
      data: {
        query,
        resultsCount: results.length,
        category: 'utility',
        language: 'javascript'
      },
      sessionId: sessionId
    })
  })
  
  return response.json()
}

// Code execution
async function executeCode(code, language) {
  const response = await fetch('/api/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code,
      language,
      options: {
        timeout: 5000
      }
    })
  })
  
  return response.json()
}

// Error reporting
async function reportError(error, context) {
  const response = await fetch('/api/errors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      feature: context.feature,
      action: context.action,
      level: 'error'
    })
  })
  
  return response.json()
}
```

### Python

```python
import requests
import json

class CodeUtilsAPI:
    def __init__(self, base_url, token=None):
        self.base_url = base_url
        self.token = token
        self.session = requests.Session()
        
        if token:
            self.session.headers.update({
                'Authorization': f'Bearer {token}'
            })
    
    def execute_code(self, code, language, options=None):
        """Execute code via API"""
        payload = {
            'code': code,
            'language': language,
            'options': options or {}
        }
        
        response = self.session.post(
            f'{self.base_url}/api/execute',
            json=payload
        )
        
        return response.json()
    
    def track_analytics(self, event_type, data, session_id):
        """Track analytics event"""
        payload = {
            'type': event_type,
            'data': data,
            'sessionId': session_id
        }
        
        response = self.session.post(
            f'{self.base_url}/api/analytics',
            json=payload
        )
        
        return response.json()

# Usage
api = CodeUtilsAPI('https://your-domain.com')

# Execute Python code
result = api.execute_code(
    'print("Hello from API")',
    'python'
)

print(result['output'])  # "Hello from API"
```

### cURL Examples

```bash
# Execute JavaScript code
curl -X POST https://your-domain.com/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "console.log(Math.random())",
    "language": "javascript"
  }'

# Track search analytics
curl -X POST https://your-domain.com/api/analytics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "type": "search",
    "data": {
      "query": "format date",
      "resultsCount": 15,
      "category": "formatting"
    },
    "sessionId": "session_123"
  }'

# Get analytics data
curl "https://your-domain.com/api/analytics?type=search&limit=50&timeframe=7d" \
  -H "Authorization: Bearer <token>"

# Report error
curl -X POST https://your-domain.com/api/errors \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Network error",
    "level": "error",
    "url": "https://app.com/page",
    "timestamp": 1703980800000
  }'
```

## Webhooks (Future)

Coming soon: Webhook support for real-time notifications.

## API Versioning

Current version: `v1`

Future versions will be accessible via:
- `/api/v2/endpoint`
- Header: `API-Version: v2`

## Support

- **Documentation**: [your-domain.com/docs/api](https://your-domain.com/docs/api)
- **Status Page**: [status.your-domain.com](https://status.your-domain.com)
- **Support**: [support@your-domain.com](mailto:support@your-domain.com)

## Changelog

### v1.0.0 (Current)
- Initial API release
- Analytics endpoints
- Code execution
- Error reporting
- Authentication support

---

**Note**: This API is under active development. Breaking changes will be communicated in advance with migration guides.

# Code Template Generator Prompt

## Prompt Template cho AI Code Generation

```text
Generate an optimized {LANGUAGE} {CODE_TYPE} based on the provided template and requirements. The code should be efficient, follow best practices, handle edge cases, and be production-ready for web applications. Implement the functionality described in the template's comments or TODO section.

**Important:** Return only the completed code, no explanations or additional text.

## 📋 TEMPLATE
```{LANGUAGE}
{TEMPLATE_CODE}
```

## 🎯 REQUIREMENTS
{REQUIREMENTS}

## 🔧 TECHNICAL SPECIFICATIONS
- Language: {LANGUAGE}
- Code Type: {CODE_TYPE}
- Performance: Optimize for efficiency and minimal resource usage
- Error Handling: Include comprehensive error handling for edge cases
- Type Safety: Use strict typing (if applicable)
- Best Practices: Follow language-specific conventions and patterns
- Browser Compatibility: Ensure compatibility with modern browsers
- Security: Implement proper input validation and sanitization

## 📝 OUTPUT FORMAT
- Return only the complete, executable code
- Include proper JSDoc comments for functions
- Use descriptive variable and function names
- Implement proper error boundaries
- Add inline comments for complex logic
- Follow consistent code formatting

## ✅ QUALITY CHECKLIST
Ensure the code has:
- ✅ Proper error handling
- ✅ Input validation
- ✅ Performance optimization
- ✅ Clear documentation
- ✅ Edge case handling
- ✅ Security considerations
- ✅ Type safety (if applicable)
- ✅ Clean, readable structure
```

## 🎯 Ví dụ sử dụng:

### JavaScript Function Template
```text
Generate an optimized JavaScript function based on the provided template and requirements. The code should be efficient, follow best practices, handle edge cases, and be production-ready for web applications. Implement the functionality described in the template's comments or TODO section.

**Important:** Return only the completed code, no explanations or additional text.

## 📋 TEMPLATE
```javascript
function validateEmail(email) {
  // TODO: Implement email validation
  // Should validate common email formats
  // Return boolean result
}
```

## 🎯 REQUIREMENTS
Validate an email address using a robust regex pattern, returning a boolean. Handle common email formats (e.g., user@domain.com, user.name@sub.domain.co), reject invalid inputs (e.g., missing @, invalid characters, spaces), and return false for non-string inputs.

## 🔧 TECHNICAL SPECIFICATIONS
- Language: JavaScript
- Code Type: function
- Performance: Optimize for efficiency and minimal resource usage
- Error Handling: Include comprehensive error handling for edge cases
- Type Safety: Use strict typing (if applicable)
- Best Practices: Follow language-specific conventions and patterns
- Browser Compatibility: Ensure compatibility with modern browsers
- Security: Implement proper input validation and sanitization
```

### React Component Template
```text
Generate an optimized React component based on the provided template and requirements. The code should be efficient, follow best practices, handle edge cases, and be production-ready for web applications. Implement the functionality described in the template's comments or TODO section.

**Important:** Return only the completed code, no explanations or additional text.

## 📋 TEMPLATE
```jsx
import React from 'react';

function UserCard({ user }) {
  // TODO: Implement user card component
  // Display user avatar, name, email
  // Handle loading and error states
  
  return (
    <div>
      {/* Component implementation here */}
    </div>
  );
}

export default UserCard;
```

## 🎯 REQUIREMENTS
Create a responsive user card component that displays user avatar, name, email, and status. Include loading skeleton, error boundary, accessibility features (ARIA labels, keyboard navigation), and hover effects with smooth animations.

## 🔧 TECHNICAL SPECIFICATIONS
- Language: JavaScript/JSX
- Code Type: React component
- Performance: Optimize for efficiency and minimal resource usage
- Error Handling: Include comprehensive error handling for edge cases
- Type Safety: Use PropTypes or TypeScript interfaces
- Best Practices: Follow React best practices and hooks
- Browser Compatibility: Ensure compatibility with modern browsers
- Security: Implement proper input validation and sanitization
```

## 🎨 Template Variables

- `{LANGUAGE}` - Programming language (JavaScript, TypeScript, Python, etc.)
- `{CODE_TYPE}` - Type of code (function, component, class, utility, etc.)
- `{TEMPLATE_CODE}` - The actual template code with TODO comments
- `{REQUIREMENTS}` - Detailed functional requirements

## 🚀 Usage Instructions

1. **Replace variables** với thông tin cụ thể
2. **Paste template code** vào {TEMPLATE_CODE}
3. **Describe requirements** chi tiết trong {REQUIREMENTS}
4. **Send to AI** (GPT-4, Claude, etc.)
5. **Receive production-ready code**

## 💡 Best Practices

- **Be specific** trong requirements
- **Include edge cases** cần handle
- **Mention performance** requirements
- **Specify error handling** needs
- **Add accessibility** requirements if needed
- **Include testing** considerations

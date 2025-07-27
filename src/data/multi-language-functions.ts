// Multi-language versions of the utility functions
// This demonstrates how each function can be implemented in different languages

export const multiLanguageVersions = {
  // Function 1: isPalindrome
  isPalindrome: {
    javascript: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

console.log(isPalindrome("A man a plan a canal Panama")); // true`,

    typescript: `function isPalindrome(str: string): boolean {
  const cleaned: string = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

console.log(isPalindrome("A man a plan a canal Panama")); // true`,

    python: `def is_palindrome(s: str) -> bool:
    """Check if a string is a palindrome."""
    cleaned = ''.join(char.lower() for char in s if char.isalnum())
    return cleaned == cleaned[::-1]

print(is_palindrome("A man a plan a canal Panama"))  # True`
  },

  // Function 2: fibonacci
  fibonacci: {
    javascript: `function fibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  if (n === 2) return [0, 1];
  
  const result = [0, 1];
  for (let i = 2; i < n; i++) {
    result[i] = result[i - 1] + result[i - 2];
  }
  return result;
}

console.log(fibonacci(10)); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,

    typescript: `function fibonacci(n: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [0];
  if (n === 2) return [0, 1];
  
  const result: number[] = [0, 1];
  for (let i = 2; i < n; i++) {
    result[i] = result[i - 1] + result[i - 2];
  }
  return result;
}

console.log(fibonacci(10)); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,

    python: `def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence up to n numbers."""
    if n <= 0:
        return []
    if n == 1:
        return [0]
    if n == 2:
        return [0, 1]
    
    result = [0, 1]
    for i in range(2, n):
        result.append(result[i - 1] + result[i - 2])
    
    return result

print(fibonacci(10))  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`
  },

  // Function 3: arraySum
  arraySum: {
    javascript: `function arraySum(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

console.log(arraySum([1, 2, 3, 4, 5])); // 15`,

    typescript: `function arraySum(numbers: number[]): number {
  return numbers.reduce((sum: number, num: number) => sum + num, 0);
}

console.log(arraySum([1, 2, 3, 4, 5])); // 15`,

    python: `def array_sum(numbers: list[int]) -> int:
    """Calculate the sum of all numbers in an array."""
    return sum(numbers)

print(array_sum([1, 2, 3, 4, 5]))  # 15`
  },

  // Function 4: isPrime
  isPrime: {
    javascript: `function isPrime(num) {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

console.log(isPrime(17)); // true`,

    typescript: `function isPrime(num: number): boolean {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

console.log(isPrime(17)); // true`,

    python: `import math

def is_prime(num: int) -> bool:
    """Check if a number is prime."""
    if num < 2:
        return False
    if num == 2:
        return True
    if num % 2 == 0:
        return False
    
    for i in range(3, int(math.sqrt(num)) + 1, 2):
        if num % i == 0:
            return False
    
    return True

print(is_prime(17))  # True`
  },

  // Function 5: reverseString
  reverseString: {
    javascript: `function reverseString(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

console.log(reverseString("hello")); // "olleh"`,

    typescript: `function reverseString(str: string): string {
  let reversed: string = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

console.log(reverseString("hello")); // "olleh"`,

    python: `def reverse_string(s: str) -> str:
    """Reverse a string without using built-in reverse method."""
    reversed_str = ''
    for i in range(len(s) - 1, -1, -1):
        reversed_str += s[i]
    return reversed_str

print(reverse_string("hello"))  # "olleh"`
  },

  // Function 6: factorial
  factorial: {
    javascript: `function factorial(n) {
  if (n < 0) return undefined;
  if (n === 0 || n === 1) return 1;
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

console.log(factorial(5)); // 120`,

    typescript: `function factorial(n: number): number | undefined {
  if (n < 0) return undefined;
  if (n === 0 || n === 1) return 1;
  
  let result: number = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

console.log(factorial(5)); // 120`,

    python: `def factorial(n: int) -> int | None:
    """Calculate factorial of a number (n!)."""
    if n < 0:
        return None
    if n == 0 or n == 1:
        return 1
    
    result = 1
    for i in range(2, n + 1):
        result *= i
    
    return result

print(factorial(5))  # 120`
  },

  // Function 7: findMax
  findMax: {
    javascript: `function findMax(numbers) {
  if (numbers.length === 0) return undefined;
  
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  return max;
}

console.log(findMax([3, 7, 2, 9, 1])); // 9`,

    typescript: `function findMax(numbers: number[]): number | undefined {
  if (numbers.length === 0) return undefined;
  
  let max: number = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  return max;
}

console.log(findMax([3, 7, 2, 9, 1])); // 9`,

    python: `def find_max(numbers: list[int]) -> int | None:
    """Find the maximum value in an array of numbers."""
    if not numbers:
        return None
    
    max_val = numbers[0]
    for num in numbers[1:]:
        if num > max_val:
            max_val = num
    
    return max_val

print(find_max([3, 7, 2, 9, 1]))  # 9`
  },

  // Function 8: countChars
  countChars: {
    javascript: `function countChars(str) {
  const charCount = {};
  
  for (let char of str.toLowerCase()) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  
  return charCount;
}

console.log(countChars("hello")); // {h: 1, e: 1, l: 2, o: 1}`,

    typescript: `function countChars(str: string): Record<string, number> {
  const charCount: Record<string, number> = {};
  
  for (let char of str.toLowerCase()) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  
  return charCount;
}

console.log(countChars("hello")); // {h: 1, e: 1, l: 2, o: 1}`,

    python: `def count_chars(s: str) -> dict[str, int]:
    """Count frequency of each character in a string."""
    char_count = {}
    
    for char in s.lower():
        char_count[char] = char_count.get(char, 0) + 1
    
    return char_count

print(count_chars("hello"))  # {'h': 1, 'e': 1, 'l': 2, 'o': 1}`
  },

  // Function 9: removeDuplicates
  removeDuplicates: {
    javascript: `function removeDuplicates(arr) {
  const unique = [];
  const seen = new Set();
  
  for (let item of arr) {
    if (!seen.has(item)) {
      seen.add(item);
      unique.push(item);
    }
  }
  
  return unique;
}

console.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]`,

    typescript: `function removeDuplicates<T>(arr: T[]): T[] {
  const unique: T[] = [];
  const seen = new Set<T>();
  
  for (let item of arr) {
    if (!seen.has(item)) {
      seen.add(item);
      unique.push(item);
    }
  }
  
  return unique;
}

console.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]`,

    python: `def remove_duplicates(arr: list) -> list:
    """Remove duplicate values from an array."""
    unique = []
    seen = set()
    
    for item in arr:
        if item not in seen:
            seen.add(item)
            unique.append(item)
    
    return unique

print(remove_duplicates([1, 2, 2, 3, 4, 4, 5]))  # [1, 2, 3, 4, 5]`
  },

  // Function 10: calculator
  calculator: {
    javascript: `function calculator(num1, operator, num2) {
  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      return num2 !== 0 ? num1 / num2 : 'Error: Division by zero';
    default:
      return 'Error: Invalid operator';
  }
}

console.log(calculator(10, '+', 5));  // 15`,

    typescript: `function calculator(num1: number, operator: string, num2: number): number | string {
  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      return num2 !== 0 ? num1 / num2 : 'Error: Division by zero';
    default:
      return 'Error: Invalid operator';
  }
}

console.log(calculator(10, '+', 5));  // 15`,

    python: `def calculator(num1: float, operator: str, num2: float) -> float | str:
    """Simple calculator for basic arithmetic operations."""
    if operator == '+':
        return num1 + num2
    elif operator == '-':
        return num1 - num2
    elif operator == '*':
        return num1 * num2
    elif operator == '/':
        return num1 / num2 if num2 != 0 else 'Error: Division by zero'
    else:
        return 'Error: Invalid operator'

print(calculator(10, '+', 5))  # 15.0`
  }
};

// Function to convert a function to different language
export function convertToLanguage(functionName: string, targetLanguage: 'javascript' | 'typescript' | 'python') {
  const versions = multiLanguageVersions[functionName as keyof typeof multiLanguageVersions];
  if (!versions) {
    throw new Error(`Function ${functionName} not found`);
  }
  
  return versions[targetLanguage];
}

// Export for use in CodePlayground
export default multiLanguageVersions;

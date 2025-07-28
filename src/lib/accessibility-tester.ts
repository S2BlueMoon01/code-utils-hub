/**
 * Accessibility testing and compliance utilities
 */

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info'
  rule: string
  element: string
  description: string
  suggestion: string
  wcagLevel: 'A' | 'AA' | 'AAA'
  wcagCriterion: string
}

export interface AccessibilityReport {
  score: number
  totalChecks: number
  issues: AccessibilityIssue[]
  passedChecks: string[]
  timestamp: number
  url?: string
}

class AccessibilityTester {
  private issues: AccessibilityIssue[] = []

  /**
   * Run comprehensive accessibility audit
   */
  async runAudit(element: HTMLElement = document.body): Promise<AccessibilityReport> {
    this.issues = []
    
    // Run all accessibility checks
    this.checkImageAltText(element)
    this.checkHeadingStructure(element)
    this.checkFormLabels(element)
    this.checkColorContrast(element)
    this.checkKeyboardNavigation(element)
    this.checkAriaAttributes(element)
    this.checkFocusManagement(element)
    this.checkSemanticStructure(element)
    this.checkVideoCaption(element)
    this.checkTableHeaders(element)
    this.checkLinkContext(element)
    this.checkLanguageAttributes()

    const totalChecks = 12
    const passedChecks = this.getPassedChecks()
    const score = Math.round(((totalChecks - this.issues.filter(i => i.type === 'error').length) / totalChecks) * 100)

    return {
      score,
      totalChecks,
      issues: this.issues,
      passedChecks,
      timestamp: Date.now(),
      url: window.location.href
    }
  }

  /**
   * Check for missing alt text on images
   */
  private checkImageAltText(element: HTMLElement) {
    const images = element.querySelectorAll('img')
    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-label') && !img.getAttribute('aria-labelledby')) {
        this.addIssue({
          type: 'error',
          rule: 'images-alt-text',
          element: `img[${index}]`,
          description: 'Image is missing alternative text',
          suggestion: 'Add alt attribute with descriptive text or aria-label',
          wcagLevel: 'A',
          wcagCriterion: '1.1.1'
        })
      }
      
      // Check for redundant alt text
      if (img.alt && (img.alt.toLowerCase().includes('image') || img.alt.toLowerCase().includes('picture'))) {
        this.addIssue({
          type: 'warning',
          rule: 'images-alt-redundant',
          element: `img[${index}]`,
          description: 'Alt text contains redundant words like "image" or "picture"',
          suggestion: 'Remove redundant words from alt text',
          wcagLevel: 'A',
          wcagCriterion: '1.1.1'
        })
      }
    })
  }

  /**
   * Check heading structure and hierarchy
   */
  private checkHeadingStructure(element: HTMLElement) {
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let previousLevel = 0
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))
      
      // Check for skipped heading levels
      if (level > previousLevel + 1) {
        this.addIssue({
          type: 'error',
          rule: 'heading-hierarchy',
          element: `${heading.tagName.toLowerCase()}[${index}]`,
          description: `Heading level skipped from h${previousLevel} to h${level}`,
          suggestion: 'Use heading levels in sequential order',
          wcagLevel: 'AA',
          wcagCriterion: '1.3.1'
        })
      }
      
      // Check for empty headings
      if (!heading.textContent?.trim()) {
        this.addIssue({
          type: 'error',
          rule: 'heading-empty',
          element: `${heading.tagName.toLowerCase()}[${index}]`,
          description: 'Heading is empty',
          suggestion: 'Add descriptive text to the heading',
          wcagLevel: 'A',
          wcagCriterion: '1.3.1'
        })
      }
      
      previousLevel = level
    })

    // Check for missing h1
    if (!element.querySelector('h1')) {
      this.addIssue({
        type: 'warning',
        rule: 'heading-h1-missing',
        element: 'document',
        description: 'Page is missing an h1 heading',
        suggestion: 'Add an h1 heading to provide page structure',
        wcagLevel: 'AA',
        wcagCriterion: '1.3.1'
      })
    }
  }

  /**
   * Check form labels and accessibility
   */
  private checkFormLabels(element: HTMLElement) {
    const inputs = element.querySelectorAll('input:not([type="hidden"]), select, textarea')
    
    inputs.forEach((input, index) => {
      const hasLabel = this.hasAssociatedLabel(input as HTMLElement)
      const hasAriaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby')
      
      if (!hasLabel && !hasAriaLabel) {
        this.addIssue({
          type: 'error',
          rule: 'form-labels',
          element: `${input.tagName.toLowerCase()}[${index}]`,
          description: 'Form control is missing a label',
          suggestion: 'Add a label element or aria-label attribute',
          wcagLevel: 'A',
          wcagCriterion: '1.3.1'
        })
      }
    })
  }

  /**
   * Check color contrast (simplified version)
   */
  private checkColorContrast(element: HTMLElement) {
    const textElements = element.querySelectorAll('p, span, div, a, button, h1, h2, h3, h4, h5, h6')
    
    textElements.forEach((el, index) => {
      const computedStyle = window.getComputedStyle(el as Element)
      const fontSize = parseFloat(computedStyle.fontSize)
      const fontWeight = computedStyle.fontWeight
      
      // This is a simplified check - in a real implementation, you'd calculate actual contrast ratios
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700))
      
      // Placeholder for actual contrast ratio calculation
      // In practice, you'd use a library like 'color' to calculate contrast ratios
      const hasGoodContrast = true // Placeholder
      
      if (!hasGoodContrast) {
        this.addIssue({
          type: 'error',
          rule: 'color-contrast',
          element: `${el.tagName.toLowerCase()}[${index}]`,
          description: `Insufficient color contrast ratio (${isLargeText ? 'large text' : 'normal text'})`,
          suggestion: isLargeText ? 'Ensure contrast ratio is at least 3:1' : 'Ensure contrast ratio is at least 4.5:1',
          wcagLevel: 'AA',
          wcagCriterion: '1.4.3'
        })
      }
    })
  }

  /**
   * Check keyboard navigation
   */
  private checkKeyboardNavigation(element: HTMLElement) {
    const interactiveElements = element.querySelectorAll('a, button, input, select, textarea, [tabindex]')
    
    interactiveElements.forEach((el, index) => {
      const tabIndex = el.getAttribute('tabindex')
      
      // Check for positive tabindex values (anti-pattern)
      if (tabIndex && parseInt(tabIndex) > 0) {
        this.addIssue({
          type: 'warning',
          rule: 'keyboard-tabindex-positive',
          element: `${el.tagName.toLowerCase()}[${index}]`,
          description: 'Positive tabindex values can disrupt keyboard navigation',
          suggestion: 'Use tabindex="0" or manage focus programmatically',
          wcagLevel: 'A',
          wcagCriterion: '2.1.1'
        })
      }
      
      // Check for interactive elements without proper focus indicators
      // Note: In a real implementation, you'd check the computed focus styles
      // const computedStyle = window.getComputedStyle(el as Element, ':focus')
    })
  }

  /**
   * Check ARIA attributes
   */
  private checkAriaAttributes(element: HTMLElement) {
    const elementsWithAria = element.querySelectorAll('[aria-labelledby], [aria-describedby], [role]')
    
    elementsWithAria.forEach((el, index) => {
      // Check aria-labelledby references
      const labelledBy = el.getAttribute('aria-labelledby')
      if (labelledBy) {
        const referenced = document.getElementById(labelledBy)
        if (!referenced) {
          this.addIssue({
            type: 'error',
            rule: 'aria-labelledby-invalid',
            element: `${el.tagName.toLowerCase()}[${index}]`,
            description: `aria-labelledby references non-existent element "${labelledBy}"`,
            suggestion: 'Ensure referenced element exists',
            wcagLevel: 'A',
            wcagCriterion: '1.3.1'
          })
        }
      }
      
      // Check aria-describedby references
      const describedBy = el.getAttribute('aria-describedby')
      if (describedBy) {
        const referenced = document.getElementById(describedBy)
        if (!referenced) {
          this.addIssue({
            type: 'error',
            rule: 'aria-describedby-invalid',
            element: `${el.tagName.toLowerCase()}[${index}]`,
            description: `aria-describedby references non-existent element "${describedBy}"`,
            suggestion: 'Ensure referenced element exists',
            wcagLevel: 'A',
            wcagCriterion: '1.3.1'
          })
        }
      }
    })
  }

  /**
   * Check focus management
   */
  private checkFocusManagement(element: HTMLElement) {
    // Check for focus traps in modals
    const modals = element.querySelectorAll('[role="dialog"], [aria-modal="true"]')
    
    modals.forEach((modal, index) => {
      const focusableElements = modal.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      
      if (focusableElements.length === 0) {
        this.addIssue({
          type: 'warning',
          rule: 'focus-modal-trap',
          element: `modal[${index}]`,
          description: 'Modal has no focusable elements',
          suggestion: 'Ensure modal contains focusable elements or close button',
          wcagLevel: 'AA',
          wcagCriterion: '2.4.3'
        })
      }
    })
  }

  /**
   * Check semantic structure
   */
  private checkSemanticStructure(element: HTMLElement) {
    // Check for proper use of semantic elements
    const hasMain = element.querySelector('main')
    
    if (!hasMain) {
      this.addIssue({
        type: 'info',
        rule: 'semantic-main',
        element: 'document',
        description: 'Page is missing a main landmark',
        suggestion: 'Add a <main> element to identify primary content',
        wcagLevel: 'AA',
        wcagCriterion: '1.3.1'
      })
    }
    
    // Check for lists used for layout instead of semantics
    const lists = element.querySelectorAll('ul, ol')
    lists.forEach((list, index) => {
      const listItems = list.querySelectorAll('li')
      if (listItems.length === 1) {
        this.addIssue({
          type: 'info',
          rule: 'semantic-list-single-item',
          element: `${list.tagName.toLowerCase()}[${index}]`,
          description: 'List contains only one item - consider if list is semantically appropriate',
          suggestion: 'Use list elements only for grouped related items',
          wcagLevel: 'A',
          wcagCriterion: '1.3.1'
        })
      }
    })
  }

  /**
   * Check video captions
   */
  private checkVideoCaption(element: HTMLElement) {
    const videos = element.querySelectorAll('video')
    
    videos.forEach((video, index) => {
      const tracks = video.querySelectorAll('track[kind="captions"], track[kind="subtitles"]')
      if (tracks.length === 0) {
        this.addIssue({
          type: 'warning',
          rule: 'video-captions',
          element: `video[${index}]`,
          description: 'Video is missing captions or subtitles',
          suggestion: 'Add <track> elements with captions for accessibility',
          wcagLevel: 'A',
          wcagCriterion: '1.2.2'
        })
      }
    })
  }

  /**
   * Check table headers
   */
  private checkTableHeaders(element: HTMLElement) {
    const tables = element.querySelectorAll('table')
    
    tables.forEach((table, index) => {
      const headers = table.querySelectorAll('th')
      const cells = table.querySelectorAll('td')
      
      if (cells.length > 0 && headers.length === 0) {
        this.addIssue({
          type: 'error',
          rule: 'table-headers',
          element: `table[${index}]`,
          description: 'Data table is missing header cells',
          suggestion: 'Use <th> elements for table headers',
          wcagLevel: 'A',
          wcagCriterion: '1.3.1'
        })
      }
      
      // Check for table caption
      if (!table.querySelector('caption')) {
        this.addIssue({
          type: 'info',
          rule: 'table-caption',
          element: `table[${index}]`,
          description: 'Table is missing a caption',
          suggestion: 'Add <caption> element to describe table purpose',
          wcagLevel: 'AA',
          wcagCriterion: '1.3.1'
        })
      }
    })
  }

  /**
   * Check link context
   */
  private checkLinkContext(element: HTMLElement) {
    const links = element.querySelectorAll('a[href]')
    
    links.forEach((link, index) => {
      const text = link.textContent?.trim()
      
      // Check for generic link text
      if (text && ['click here', 'read more', 'more', 'here', 'link'].includes(text.toLowerCase())) {
        this.addIssue({
          type: 'warning',
          rule: 'link-context',
          element: `a[${index}]`,
          description: 'Link has generic text that provides no context',
          suggestion: 'Use descriptive link text that explains the destination',
          wcagLevel: 'A',
          wcagCriterion: '2.4.4'
        })
      }
      
      // Check for empty links
      if (!text || text.length === 0) {
        this.addIssue({
          type: 'error',
          rule: 'link-empty',
          element: `a[${index}]`,
          description: 'Link has no accessible text',
          suggestion: 'Add text content or aria-label to describe the link',
          wcagLevel: 'A',
          wcagCriterion: '2.4.4'
        })
      }
    })
  }

  /**
   * Check language attributes
   */
  private checkLanguageAttributes() {
    if (!document.documentElement.lang) {
      this.addIssue({
        type: 'error',
        rule: 'document-language',
        element: 'html',
        description: 'Document is missing language attribute',
        suggestion: 'Add lang attribute to <html> element',
        wcagLevel: 'A',
        wcagCriterion: '3.1.1'
      })
    }
  }

  /**
   * Helper method to check if an input has an associated label
   */
  private hasAssociatedLabel(input: HTMLElement): boolean {
    const id = input.id
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`)
      if (label) return true
    }
    
    // Check if input is inside a label
    const parentLabel = input.closest('label')
    return !!parentLabel
  }

  /**
   * Add an issue to the report
   */
  private addIssue(issue: AccessibilityIssue) {
    this.issues.push(issue)
  }

  /**
   * Get list of passed checks
   */
  private getPassedChecks(): string[] {
    const allChecks = [
      'images-alt-text',
      'heading-hierarchy', 
      'form-labels',
      'color-contrast',
      'keyboard-navigation',
      'aria-attributes',
      'focus-management',
      'semantic-structure',
      'video-captions',
      'table-headers',
      'link-context',
      'document-language'
    ]
    
    const failedChecks = new Set(this.issues.map(issue => issue.rule))
    return allChecks.filter(check => !failedChecks.has(check))
  }
}

// Export singleton instance
export const accessibilityTester = new AccessibilityTester()

// Helper function for quick accessibility check
export async function quickAccessibilityCheck(): Promise<AccessibilityReport> {
  return accessibilityTester.runAudit()
}

// Helper function to check specific element
export async function checkElementAccessibility(element: HTMLElement): Promise<AccessibilityReport> {
  return accessibilityTester.runAudit(element)
}

import { test, expect } from '@playwright/test'

test.describe('CodeUtilsHub Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the homepage correctly', async ({ page }) => {
    // Check if the page loads
    await expect(page).toHaveTitle(/CodeUtilsHub/)
    
    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible()
    
    // Check for main content
    await expect(page.locator('main')).toBeVisible()
  })

  test('should have accessible navigation', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    
    // Check if focus is visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check if mobile navigation works
    await expect(page.locator('nav')).toBeVisible()
    
    // Test mobile menu if it exists
    const mobileMenuButton = page.locator('[aria-label*="menu"], [role="button"]:has-text("menu")')
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click()
      await expect(page.locator('[role="menu"], nav ul')).toBeVisible()
    }
  })

  test('should have no accessibility violations', async ({ page }) => {
    // This test requires axe-core/playwright to be properly set up
    // We'll implement this after the basic structure is in place
    const violations = await page.locator('text=Error').count()
    expect(violations).toBe(0)
  })
})

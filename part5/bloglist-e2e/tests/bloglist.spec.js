const { test, expect, beforeEach, describe } = require('@playwright/test')

const testUser = {
  name: 'Mr. Test',
  username: 'test123',
  password: 'chunter2'
}

describe('Bloglist app', () => {
  beforeEach(async ({ page, request }) => {
    //Delete everything, so we start from a fresh slate to test with
    await request.post('/api/testing/reset')
    //But add a test user so we can actually do things
    await request.post('/api/users', {
      data: testUser
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in')).toBeVisible()
    await expect(page.getByTestId('login-username')).toBeVisible()
    await expect(page.getByTestId('login-password')).toBeVisible()
    await expect(page.getByTestId('login-submit-btn')).toBeVisible()
  })

  test('Login is successful with correct credentials', async ({ page }) => {
    await page.getByTestId('login-username').fill(testUser.username)
    await page.getByTestId('login-password').fill(testUser.password)
    await page.getByTestId('login-submit-btn').click()
    await expect(page.getByTestId('welcome-msg')).toBeVisible()
  })

  test('Login fails with incorrect username', async ({ page }) => {
    await page.getByTestId('login-username').fill(testUser.username + '-wrong')
    await page.getByTestId('login-password').fill(testUser.password)
    await page.getByTestId('login-submit-btn').click()
    await expect(page.getByTestId('welcome-msg')).not.toBeVisible() //Note the weird way in which you have to negate this
    await expect(page.getByText('invalid username or password')).toBeVisible()
  })

  test('Login fails with incorrect password', async ({ page }) => {
    await page.getByTestId('login-username').fill(testUser.username)
    await page.getByTestId('login-password').fill(testUser.password + '-wrong')
    await page.getByTestId('login-submit-btn').click()
    await expect(page.getByTestId('welcome-msg')).not.toBeVisible()
    await expect(page.getByText('invalid username or password')).toBeVisible()
  })
})
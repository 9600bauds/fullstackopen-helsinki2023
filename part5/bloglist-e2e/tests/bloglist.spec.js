const { test, expect, beforeEach, describe } = require('@playwright/test')

const testUser = {
  name: 'Mr. Test',
  username: 'test123',
  password: 'chunter2'
}

const testBlog = {
  "title": `Deer licking salt`,
  "author": `Roberto`,
  "url": `www.salt.com`,
  "likes": 7,
  "user": {
    "username": `test123`,
    "name": `Mr. Test`,
    "id": `66ae6264c01f975e8e05ecee`
  }
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

  describe('Logging in', () => {
    test('is successful with correct credentials', async ({ page }) => {
      await page.getByTestId('login-username').fill(testUser.username)
      await page.getByTestId('login-password').fill(testUser.password)
      await page.getByTestId('login-submit-btn').click()
      await expect(page.getByTestId('welcome-msg')).toBeVisible()
    })

    test('fails with incorrect username', async ({ page }) => {
      await page.getByTestId('login-username').fill(testUser.username + '-wrong')
      await page.getByTestId('login-password').fill(testUser.password)
      await page.getByTestId('login-submit-btn').click()
      await expect(page.getByTestId('welcome-msg')).not.toBeVisible() //Note the weird way in which you have to negate this
      await expect(page.getByText('invalid username or password')).toBeVisible()
    })

    test('fails with incorrect password', async ({ page }) => {
      await page.getByTestId('login-username').fill(testUser.username)
      await page.getByTestId('login-password').fill(testUser.password + '-wrong')
      await page.getByTestId('login-submit-btn').click()
      await expect(page.getByTestId('welcome-msg')).not.toBeVisible()
      await expect(page.getByText('invalid username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await expect(page.getByText('Log in')).toBeVisible()
      await page.getByTestId('login-username').fill(testUser.username)
      await page.getByTestId('login-password').fill(testUser.password)
      await page.getByTestId('login-submit-btn').click()
      await expect(page.getByTestId('welcome-msg')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByText('Add New Blog').click()
      await page.locator('#title').fill(testBlog.title);
      await page.locator('#author').fill(testBlog.author);
      await page.locator('#url').fill(testBlog.url);

      await page.locator('button[type="submit"]').click();

      // This will pause the test and open the Playwright Inspector
      //await page.pause();

      await expect(page.getByText('Added a new blog')).toBeVisible()
      await expect(page.locator('.blogTitle')).toHaveText(testBlog.title);
    })
  })
})
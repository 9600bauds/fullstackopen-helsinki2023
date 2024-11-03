const { test, expect, beforeEach, describe } = require('@playwright/test')

//The user that will submit our test blogs, etc
const testUser = {
  username: 'e2e',
  name: 'End To End Tester',
  password: '123',
}

async function loginWithUser(page, user) {
  await expect(page.getByText('Log in')).toBeVisible()
  await page.getByTestId('login-username').fill(user.username)
  await page.getByTestId('login-password').fill(user.password)
  await page.getByTestId('login-submit-btn').click()
  page.pause()
  await expect(page.getByTestId('welcome-msg')).toBeVisible()
}

const testBlog = {
  title: "End to End Testing Blog",
  author: "liquidman",
  url: "https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12",
  likes: 1,
  __v: 0
}

describe('Bloglist app', () => {
  beforeEach(async ({ page, request }) => {
    //This endpoint wipes the database and starts over with a set of preloaded testing data
    await request.post('/api/testing/seed')
    //But add a test user with known credentials so we can actually do things on our end
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
      loginWithUser(page, testUser)
    })

    test('a blog can be liked', async ({ page }) => {
      const firstBlog = page.locator('.blogDiv').first();
      await firstBlog.locator('.toggleButton').click();

      const amtLikesBefore = firstBlog.locator('.likesAmount').innerText();
      await firstBlog.locator('.likeButton').click();
      const amtLikesAfter = firstBlog.locator('.likesAmount').innerText();
      expect(amtLikesAfter === amtLikesBefore + 1);
    })

    test('a new blog can be created', async ({ page }) => {
      if (!await page.locator('#title').isVisible()) {
        await page.getByText('Add New Blog').click();
      }
      await page.locator('#title').fill(testBlog.title);
      await page.locator('#author').fill(testBlog.author);
      await page.locator('#url').fill(testBlog.url);

      await page.locator('button[type="submit"]').click();

      await expect(page.getByText('Added a new blog')).toBeVisible()
      await expect(page.locator('.blogTitle', { hasText: testBlog.title })).toBeVisible();
    })
  })
})
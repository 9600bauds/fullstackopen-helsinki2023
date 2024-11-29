const { test, expect, beforeEach, describe } = require("@playwright/test");

//The user that will submit our test blogs, etc
//Note that they are not in the testing database and has not submitted anything by default.
const testUser = {
  username: "e2e",
  name: "End To End Tester",
  password: "123",
};

const testBlog = {
  title: "End to End Testing Blog",
  author: "liquidman",
  url: "https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12",
  likes: 1,
  __v: 0,
};

/**
 * Logs in to the application with the specified user credentials.
 * Waits for and confirms successful login via welcome message.
 */
async function loginWithUser(page, user) {
  await expect(page.getByText("Log in")).toBeVisible();
  await page.getByTestId("login-username").fill(user.username);
  await page.getByTestId("login-password").fill(user.password);
  await page.getByTestId("login-submit-btn").click();

  await expect(page.getByTestId("welcome-msg")).toBeVisible();
}

/**
 * Creates a new blog entry. If the new blog form is not visible, clicks to show it.
 * Assumes we are already logged in.
 * Waits for confirmation that the blog was added successfully.
 */
async function addBlog(page, blogData) {
  if (!(await page.locator("#title").isVisible())) {
    await page.getByText("Add New Blog").click();
    await expect(page.locator("#title")).toBeVisible();
  }

  await page.locator("#title").fill(blogData.title);
  await page.locator("#author").fill(blogData.author);
  await page.locator("#url").fill(blogData.url);

  await page.locator('button[type="submit"]').click();

  //This query tries to find the blog we submitted.
  const submittedBlog = page.locator(".blogDiv").filter({
    has: page.locator("span.blogTitle", { hasText: blogData.title }),
    has: page.locator("span.blogAuthor", { hasText: blogData.author }),
  });
  await expect(submittedBlog).toBeVisible();
  return submittedBlog; //Returns the locator, not the html or anything like that.
}

/**
 * Expands a blog entry if it's not already expanded.
 * Checks for 'expanded' class and clicks the toggle button if necessary.
 */
async function expandBlog(blogLocator) {
  //Checking if a locator has a class, as per ggorlen: https://stackoverflow.com/a/76038252
  const isBlogExpanded = await blogLocator.evaluate((blog) =>
    blog.classList.contains(/expanded/),
  );

  if (!isBlogExpanded) {
    await blogLocator.locator(".toggleButton").click();
    await expect(blogLocator).toHaveClass(/expanded/);
  }
}

describe("Bloglist app", () => {
  beforeEach(async ({ page, request }) => {
    //This endpoint wipes the database and starts over with a set of preloaded testing data
    await request.post("/api/testing/seed");
    //But add a test user with known credentials so we can actually do things on our end
    await request.post("/api/users", {
      data: testUser,
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Log in")).toBeVisible();
    await expect(page.getByTestId("login-username")).toBeVisible();
    await expect(page.getByTestId("login-password")).toBeVisible();
    await expect(page.getByTestId("login-submit-btn")).toBeVisible();
  });

  describe("Logging in", () => {
    test("is successful with correct credentials", async ({ page }) => {
      await page.getByTestId("login-username").fill(testUser.username);
      await page.getByTestId("login-password").fill(testUser.password);
      await page.getByTestId("login-submit-btn").click();
      await expect(page.getByTestId("welcome-msg")).toBeVisible();
    });

    test("fails with incorrect username", async ({ page }) => {
      await page
        .getByTestId("login-username")
        .fill(testUser.username + "-wrong");
      await page.getByTestId("login-password").fill(testUser.password);
      await page.getByTestId("login-submit-btn").click();
      await expect(page.getByTestId("welcome-msg")).not.toBeVisible(); //Note the weird way in which you have to negate this
      await expect(
        page.getByText("invalid username or password"),
      ).toBeVisible();
    });

    test("fails with incorrect password", async ({ page }) => {
      await page.getByTestId("login-username").fill(testUser.username);
      await page
        .getByTestId("login-password")
        .fill(testUser.password + "-wrong");
      await page.getByTestId("login-submit-btn").click();
      await expect(page.getByTestId("welcome-msg")).not.toBeVisible();
      await expect(
        page.getByText("invalid username or password"),
      ).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      loginWithUser(page, testUser);
    });

    test("a blog can be liked", async ({ page }) => {
      const firstBlog = page.locator(".blogDiv").first();
      expandBlog(firstBlog);

      const amtLikesBefore = firstBlog.locator(".likesAmount").innerText();
      await firstBlog.locator(".likeButton").click();
      const amtLikesAfter = firstBlog.locator(".likesAmount").innerText();
      expect(amtLikesAfter === amtLikesBefore + 1);
    });

    test("a new blog can be created", async ({ page }) => {
      const submittedBlogLocator = await addBlog(page, testBlog);

      await expect(submittedBlogLocator).toBeVisible(); //addBlog already checks this, but let's explicitly doublecheck anyways.
    });

    test("a user can delete their own blog", async ({ page }) => {
      const submittedBlogLocator = await addBlog(page, testBlog);
      expandBlog(submittedBlogLocator);

      const deleteButtonLocator =
        submittedBlogLocator.locator(".blogDeleteButton");
      await expect(deleteButtonLocator).toBeVisible();
      page.once("dialog", (dialog) => dialog.accept()); //Automatically accept the confirm dialog, but only 1 time
      await deleteButtonLocator.click();
      await expect(submittedBlogLocator).not.toBeVisible();
    });

    test("delete button does not appear for blogs not submitted by the user", async ({
      page,
    }) => {
      const firstBlog = page.locator(".blogDiv").first();
      expandBlog(firstBlog);
      //No blogs should have been submitted by the test user yet, but let's make sure
      await expect(firstBlog.locator(".submittedByName")).not.toHaveText(
        testUser.name,
      );

      await expect(firstBlog.locator(".blogDeleteButton")).not.toBeVisible();
    });

    test("blogs are sorted by order of likes", async ({ page }) => {
      //I am not entirely sure why this is needed. But without it, it seems the test finishes immediately and beforeEach() fails.
      //Apparently the blogs need time to finish loading? Or at least until DOM can see them?
      await page.waitForSelector(".blogDiv");

      const allBlogs = await page.locator(".blogDiv").all();

      let lastLikes = Number.MAX_SAFE_INTEGER;
      for (const blog of allBlogs) {
        //This one is tricky because likes are only shown while expanded.
        //We need to expand the blog to see the likes; even though that info is accessible to the react component, we live in the DOM
        await blog.locator(".toggleButton").click();
        const currLikes = parseInt(
          await blog.locator(".likesAmount").innerText(),
        );
        //console.log("Last likes:", lastLikes, " current likes:", currLikes) //This shows in NODE.JS's console, not in the browser's console!!
        expect(currLikes <= lastLikes);
        lastLikes = currLikes;
      }
    });
  });
});

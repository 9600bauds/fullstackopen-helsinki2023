import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

const blogObject = {
  "title": `Hello World`,
  "author": `Terry`,
  "url": `www.hmmm.com`,
  "likes": 20,
  "user": {
    "username": `doh04`,
    "name": `Humberto Velez`,
    "id": `66ae6264c01f975e8e05ece5`
  }
};
const userObject = {
  "username": `doh04`,
  "name": `Humberto Velez`
};

describe(`default un-expanded blog`, () => {
  beforeEach(async () => {
    render(<Blog blog={blogObject} user={userObject}/>);
  });
  
  test(`shows the blog's title`, () => {
    const element = screen.getByText(blogObject.title);
    expect(element).toBeDefined();
  });
  test(`shows the blog's author`, () => {
    const element = screen.getByText(blogObject.author);
    expect(element).toBeDefined();
  });
  test(`does not show the blog's URL`, () => {
    const element = screen.queryByText(blogObject.url);
    expect(element).toBeNull();
  });
  test(`does not show the blog's likes`, () => {
    const element = screen.queryByText(blogObject.likes);
    expect(element).toBeNull();
  });

});

describe(`expanded blog`, () => {
  beforeEach(async () => {
    render(<Blog blog={blogObject} user={userObject}/>);
    const user = userEvent.setup();
    const button = screen.getByText(`view`); //This text is liable to change in the future
    await user.click(button);
  });

  test(`shows the blog's URL`, () => {
    const element = screen.getByText(blogObject.url);
    expect(element).toBeDefined();
  });
  test(`shows the blog's likes`, () => {
    const element = screen.getByText(blogObject.likes);
    expect(element).toBeDefined();
  });

});

describe(`like function`, () => {
  test(`has 2 calls when clicked twice`, async () => {

    const mockHandler = vi.fn();
    render(<Blog blog={blogObject} user={userObject} addLike={mockHandler}/>);
    const user = userEvent.setup();
    const expandButton = screen.getByText(`view`); //This text is liable to change in the future
    await user.click(expandButton);

    const likeButton = screen.getByText(`like!`); //This text is liable to change in the future
    await user.click(likeButton);
    await user.click(likeButton);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
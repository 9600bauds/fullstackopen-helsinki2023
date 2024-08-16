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
    const element = screen.getByText(`Hello World`);
    expect(element).toBeDefined();
  });
  test(`shows the blog's author`, () => {
    const element = screen.getByText(`Terry`);
    expect(element).toBeDefined();
  });
  test(`does not show the blog's URL`, () => {
    const element = screen.queryByText(`www.hmmm.com`);
    expect(element).toBeNull();
  });
  test(`does not show the blog's likes`, () => {
    const element = screen.queryByText(`20`);
    expect(element).toBeNull();
  });

});

describe(`expanded blog`, () => {
  beforeEach(async () => {
    render(<Blog blog={blogObject} user={userObject}/>);
    const user = userEvent.setup();
    const button = screen.getByText(`view`);
    await user.click(button);
  });

  test(`shows the blog's URL`, () => {
    const element = screen.getByText(`www.hmmm.com`);
    expect(element).toBeDefined();
  });
  test(`shows the blog's likes`, () => {
    const element = screen.getByText(`20`);
    expect(element).toBeDefined();
  });

});
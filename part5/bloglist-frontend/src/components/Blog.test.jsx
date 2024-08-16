import { render, screen } from '@testing-library/react';
import Blog from './Blog';

const blogObject = {
  "title": `Hello World`,
  "author": `Terry`,
  "url": `www.hmmm.com`,
  "likes": 20
};
const userObject = {
  "username": `doh04`,
  "name": `Humberto Velez`
};

describe(`default un-expanded blog`, () => {

  test(`shows the blog's title`, () => {
    render(<Blog blog={blogObject}/>);
    const element = screen.getByText(`Hello World`);
    expect(element).toBeDefined();
  });
  test(`shows the blog's author`, () => {
    render(<Blog blog={blogObject}/>);
    const element = screen.getByText(`Terry`);
    expect(element).toBeDefined();
  });
  test(`does not show the blog's URL`, () => {
    render(<Blog blog={blogObject}/>);
    const element = screen.queryByText(`www.hmmm.com`);
    expect(element).toBeNull();
  });
  test(`does not show the blog's likes`, () => {
    render(<Blog blog={blogObject}/>);
    const element = screen.queryByText(`20`);
    expect(element).toBeNull();
  });

});
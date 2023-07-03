const _ = require('lodash');

const totalLikes = (blogs) => {
  const totalLikes = blogs.reduce((accumulator, blog) => {
    return accumulator + blog.likes;
  }, 0);
  return totalLikes;
};

/**
 * Function to find the blog with the most likes from an array of blogs.
 * @param {*} blogs A list of blogs, each of which should have a "likes" property.
 * @returns An object with the properties "title", "author" and "likes", corresponding to
 * the blog with the most likes.
 */
const favoriteBlog = (blogs) => {
  let maxLikes = Number.MIN_SAFE_INTEGER;
  let blogWithMostLikes = null;
  for (const blog of blogs) {
    const likes = blog.likes;
    if (likes > maxLikes) {
      maxLikes = likes;
      blogWithMostLikes = blog;
    }
  }
  const { title, author, likes } = blogWithMostLikes;
  const returnObject = { title, author, likes };
  return returnObject;
};

/**
 * Function to find the author with the most blogs from an array of blogs.
 * @param {*} blogs A list of blogs, each of which should have an "author" property.
 * @returns An object with properties 'author' (the author with the most blogs) and
 * 'blogs' (the number of blogs by that author).
 */
const mostProlificAuthor = (blogs) => {
  const blogsPerAuthor = _.countBy(blogs, 'author');
  let maxBlogs = Number.MIN_SAFE_INTEGER;
  let authorWithMostBlogs = null;
  for (let author in blogsPerAuthor) {
    let blogs = blogsPerAuthor[author];
    if (blogs > maxBlogs) {
      maxBlogs = blogs;
      authorWithMostBlogs = author;
    }
  }
  const returnObject = { author: authorWithMostBlogs, blogs: maxBlogs };
  return returnObject;
};

const mostLikes = (blogs) => {
  let likesPerAuthor = {};
  for (let blog of blogs) {
    const { author, likes } = blog;
    if (!likesPerAuthor[author]) {
      likesPerAuthor[author] = 0;
    }
    likesPerAuthor[author] += likes;
  }
  let maxLikes = Number.MIN_SAFE_INTEGER;
  let authorWithMostLikes = null;
  for (let author in likesPerAuthor) {
    let likes = likesPerAuthor[author];
    if (likes > maxLikes) {
      maxLikes = likes;
      authorWithMostLikes = author;
    }
  }
  const returnObject = { author: authorWithMostLikes, likes: maxLikes };
  return returnObject;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostProlificAuthor,
  mostLikes,
};

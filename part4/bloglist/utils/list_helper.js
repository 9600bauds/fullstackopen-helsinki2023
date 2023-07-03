const _ = require('lodash');
/**
 * Function to find the amount of likes between all blogs.
 * @param {*} blogs A list of blogs, each of which should have a "likes" property.
 * @returns The number of total likes.
 */
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
  const blogWithMostLikes = _.maxBy(blogs, (blog) => blog.likes);
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
  const blogsPerAuthor = _.countBy(blogs, (blog) => blog.author); //Key = author name, value = blogs for that author
  const allAuthors = Object.keys(blogsPerAuthor);
  const authorWithMostBlogs = _.maxBy(
    allAuthors,
    (author) => blogsPerAuthor[author]
  );
  const maxBlogs = blogsPerAuthor[authorWithMostBlogs];
  const returnObject = { author: authorWithMostBlogs, blogs: maxBlogs };
  return returnObject;
};

/**
 * Function to find the author with the most likes from an array of blogs.
 * @param {*} blogs A list of blogs, each of which should have an "author" property and a "likes" property.
 * @returns An object with properties 'author' (the author with the most likes between all blogs) and
 * 'likes' (the number of likes between all blogs).
 */
const mostLikes = (blogs) => {
  let likesPerAuthor = {}; //Key = author name, value = likes for that author
  for (let blog of blogs) {
    const { author, likes } = blog;
    if (!likesPerAuthor[author]) {
      likesPerAuthor[author] = 0;
    }
    likesPerAuthor[author] += likes;
  }
  const allAuthors = Object.keys(likesPerAuthor);
  const authorWithMostLikes = _.maxBy(
    allAuthors,
    (author) => likesPerAuthor[author]
  );
  const maxLikes = likesPerAuthor[authorWithMostLikes];
  const returnObject = { author: authorWithMostLikes, likes: maxLikes };
  return returnObject;
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostProlificAuthor,
  mostLikes,
};

const dummy = (blogs) => {  return 1;
};

const totalLikes = (blogs) => {
  const totalLikes = blogs.reduce((accumulator, blog) => {
    return accumulator + blog.likes;
  }, 0);
  return totalLikes;
};

const favoriteBlog = (blogs) => {
  let maxLikes = Number.MIN_SAFE_INTEGER;
  let blogWithMostLikes = null;
  for (let blog of blogs) {
    let likes = blog.likes;
    if (likes > maxLikes) {
      maxLikes = likes;
      blogWithMostLikes = blog;
    }
  }
  const { title, author, likes } = blogWithMostLikes;
  const returnObject = { title, author, likes };
  return returnObject;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};

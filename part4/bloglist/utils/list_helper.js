

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const summer = (sum, blog) => { //this const named during winter
    return sum + blog.likes
  }

  return blogs.reduce(summer, 0)
}

const favoriteBlog = (blogs) => {
  const maxxer = (max, blog) => { //chilling out maxxing relaxing all cool
    if (!max || blog.likes > max.likes) {
      return blog
    }
    return max
  }
  return blogs.reduce(maxxer, null)
}


const mostBlogs = (blogs) => {
  const functionThatSumsBlogsPerAuthor = (blogsPerAuthor, blog) => {
    const thisAuthor = blog.author;
    if (!blogsPerAuthor[thisAuthor]) {
      blogsPerAuthor[thisAuthor] = 0;
    }
    blogsPerAuthor[thisAuthor] = blogsPerAuthor[thisAuthor] + 1;
    return blogsPerAuthor;
  }
  const likesPerAuthorObj = blogs.reduce(functionThatSumsBlogsPerAuthor, []);
  // At this point, blogsPerAuthor is an object with one property per author.
  // Or an associative array. Apparently they're the same thing in JS.
  // Let's make it into an array instead.
  const likesPerAuthorArray = Object.entries(likesPerAuthorObj);
  let mostProlificAuthor = null;
  let max = null;
  for (const [author, amount] of likesPerAuthorArray) {
    if (!mostProlificAuthor || amount > max) {
      mostProlificAuthor = author;
      max = amount;
    }
  }
  return { author: mostProlificAuthor, blogs: max }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
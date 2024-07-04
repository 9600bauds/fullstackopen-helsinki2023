

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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
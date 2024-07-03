

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const summer = (sum, blog) => { //this const named during winter
    return sum + blog.likes
  }

  return blogs.reduce(summer, 0)
}

module.exports = {
  dummy,
  totalLikes
}
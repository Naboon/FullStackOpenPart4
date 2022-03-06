const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return Object.keys(blogs).length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (Object.keys(blogs).length === 0) {
    return {}
  }

  const reducer = (max, blog) => {
    return max.likes > blog.likes
      ? max
      : blog
  }

  let favoriteBlog = blogs.reduce(reducer)

  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
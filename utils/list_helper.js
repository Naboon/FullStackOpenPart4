// const dummy = (blogs) => {
//   return 1
// }

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

  let favoriteBlog = blogs.reduce(reducer, {})

  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if (Object.keys(blogs).length === 0) {
    return {}
  }

  const count = blogs
    .reduce((r, { author }) => {
      r[author] = r[author] || { author, blogs: 0 }
      r[author].blogs++
      return r
    }, {})

  const authors = Object
    .values(count)

  const reducer = (max, author) => {
    return max.blogs > author.blogs
      ? max
      : author
  }

  return authors.reduce(reducer, {})
}

module.exports = {
  //dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
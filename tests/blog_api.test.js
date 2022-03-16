const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there are initial blogs saved', () => {
  test('blogs are returned as json with a status code 200', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs have an identificator field called "id"', async () => {
    const response = await api.get('/api/blogs')

    const ids = response.body.map(r => r.id)

    expect(ids).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('succeeds with status code 201', async () => {
    const newBlog = {
      title: 'How to Create a Blog',
      author: 'Ricardo Gonzales',
      url: 'http://techtoday.com/guides/blog',
      likes: 1644
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
      'How to Create a Blog'
    )
  })

  test('without value for likes is assigned 0 likes', async () => {
    const newBlog = {
      title: 'A Lonely Person',
      author: 'Alfred Kwak',
      url: 'http://everydayproblems.com/blogs/loneliness',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toEqual(0)
  })

  test('fails with status code 400 if title is not assigned', async () => {
    const newBlog = {
      author: 'Fred Goodman',
      url: 'http://blogverse.com/blogs',
      likes: 254
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('fails with status code 400 if url is not assigned', async () => {
    const newBlog = {
      title: 'Travelling Madman',
      author: 'Saul Simpson',
      likes: 775
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogtoDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogtoDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogtoDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
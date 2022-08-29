const _ = require('lodash');

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

const dummy = (blogs) => {
  const isArray = Array.isArray(blogs);
  if (isArray) return 1;
};

const totalLikes = (blogs) => {
  let total = 0;
  if (blogs.length === 0) return 0;
  blogs.forEach((blog) => {
    total += blog.likes;
  });
  return total;
};

const favoriteBlog = (blogs) => {
  let mostLikes = 0;
  let blogIndex = 0;
  blogs.forEach((blog, index) => {
    if (blog.likes >= mostLikes) {
      mostLikes = blog.likes;
      blogIndex = index;
    }
  });
  const blogToReturn = blogs[blogIndex];
  delete blogToReturn._id;
  delete blogToReturn.__v;
  delete blogToReturn.url;

  return blogToReturn;
};

const mostBlogs = (blogs) => {
  const authorCount = _.countBy(blogs, 'author');

  const topAuthor = Object.keys(authorCount).reduce((prev, curr) => {
    return authorCount[prev] > authorCount[curr] ? prev : curr;
  });
  const result = {
    author: topAuthor,
    blogs: authorCount[topAuthor],
  };
  return result;
};

const mostLikes = (blogs) => {
  const likeCount = _(blogs)
    .groupBy('author')
    .map((author, index) => ({
      author: index,
      likes: _.sumBy(author, 'likes'),
    }))
    .value();
  const result = likeCount.reduce((prev, entry) => {
    return prev === undefined || prev.likes > entry.likes ? prev : entry;
  });
  return result;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };

require('dotenv').config();

const PORT = process.env.PORT || 3001;
const MONGO_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_TEST
    : process.env.MONGO_URI;
const SECRET = process.env.SECRET;

module.exports = {
  MONGO_URI,
  PORT,
  SECRET,
};

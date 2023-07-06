const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least 3 characters long'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    minlength: [2, 'Author name must be at least 2 characters long'],
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative'],
  },
});


module.exports = mongoose.model('Blog', blogSchema);

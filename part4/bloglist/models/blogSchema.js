const mongoose = require('mongoose');
//const User = require('./user');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [3, 'Title must be at least 3 characters long'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        returnedObject.author = returnedObject.author.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model('Blog', blogSchema);

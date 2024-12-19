import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';
import { v1 as uuid } from 'uuid';

import mongoose from 'mongoose';
import dotenv from 'dotenv';

import typeDefs from './typeDefs.js';

import Book from './models/Book.js';
import Author from './models/Author.js';

mongoose.set(`strictQuery`, false);
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log(`connecting to`, MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`connected to MongoDB`);
  })
  .catch((error) => {
    console.log(`error connection to MongoDB:`, error.message);
  });

let authors = [
  {
    name: `Robert Martin`,
    id: `afa51ab0-344d-11e9-a414-719c6709cf3e`,
    born: 1952,
  },
  {
    name: `Martin Fowler`,
    id: `afa5b6f0-344d-11e9-a414-719c6709cf3e`,
    born: 1963,
  },
  {
    name: `Fyodor Dostoevsky`,
    id: `afa5b6f1-344d-11e9-a414-719c6709cf3e`,
    born: 1821,
  },
  {
    name: `Joshua Kerievsky`, // birthyear not known
    id: `afa5b6f2-344d-11e9-a414-719c6709cf3e`,
  },
  {
    name: `Sandi Metz`, // birthyear not known
    id: `afa5b6f3-344d-11e9-a414-719c6709cf3e`,
  },
];

let books = [
  {
    title: `Clean Code`,
    published: 2008,
    author: `Robert Martin`,
    id: `afa5b6f4-344d-11e9-a414-719c6709cf3e`,
    genres: [`refactoring`],
  },
  {
    title: `Agile software development`,
    published: 2002,
    author: `Robert Martin`,
    id: `afa5b6f5-344d-11e9-a414-719c6709cf3e`,
    genres: [`agile`, `patterns`, `design`],
  },
  {
    title: `Refactoring, edition 2`,
    published: 2018,
    author: `Martin Fowler`,
    id: `afa5de00-344d-11e9-a414-719c6709cf3e`,
    genres: [`refactoring`],
  },
  {
    title: `Refactoring to patterns`,
    published: 2008,
    author: `Joshua Kerievsky`,
    id: `afa5de01-344d-11e9-a414-719c6709cf3e`,
    genres: [`refactoring`, `patterns`],
  },
  {
    title: `Practical Object-Oriented Design, An Agile Primer Using Ruby`,
    published: 2012,
    author: `Sandi Metz`,
    id: `afa5de02-344d-11e9-a414-719c6709cf3e`,
    genres: [`refactoring`, `design`],
  },
  {
    title: `Crime and punishment`,
    published: 1866,
    author: `Fyodor Dostoevsky`,
    id: `afa5de03-344d-11e9-a414-719c6709cf3e`,
    genres: [`classic`, `crime`],
  },
  {
    title: `Demons`,
    published: 1872,
    author: `Fyodor Dostoevsky`,
    id: `afa5de04-344d-11e9-a414-719c6709cf3e`,
    genres: [`classic`, `revolution`],
  },
];

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      let matchingBooks = [...books]; // Start with a clone
      if (args.author) {
        matchingBooks = matchingBooks.filter(
          (book) => book.author === args.author
        );
      }
      if (args.genre) {
        matchingBooks = matchingBooks.filter((book) =>
          book.genres.includes(args.genre)
        );
      }
      return matchingBooks;
    },
    allAuthors: () => authors,
  },

  Mutation: {
    addBook: async (root, args) => {
      console.log(`adding book with args`, args);
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });
        await author.save();
      }
      const book = new Book({ ...args, author: author._id });
      await book.save();
      return book.populate(`author`);
    },

    editAuthor: (root, args) => {
      const author = authors.find((author) => author.name === args.name);
      if (!author) {
        return null;
      }
      let updatedAuthor = { ...author }; // Spread operator clones the author
      if (args.setBornTo) {
        updatedAuthor.born = args.setBornTo;
      }
      authors = authors.map((author) =>
        author.name === args.name ? updatedAuthor : author
      ); // "clever" way that JS devs like to atomically update an array
      return updatedAuthor;
    },
  },

  Author: {
    bookCount: (root) => {
      let booksWritten = 0;
      for (let book of books) {
        if (book.author === root.name) {
          booksWritten++;
        }
      }
      return booksWritten;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

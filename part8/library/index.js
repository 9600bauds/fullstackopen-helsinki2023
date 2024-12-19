import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';

import mongoose from 'mongoose';
import dotenv from 'dotenv';

import typeDefs from './typeDefs.js';

import Book from './models/Book.js';
import Author from './models/Author.js';
import { resetDb } from './testingData.js';

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

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => Author.find({}),
    allBooks: async (root, args) => {
      const filters = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) {
          return [];
        }
        filters.author = author._id;
      }
      if (args.genre) {
        filters.genres = { $in: [args.genre] };
      }
      return Book.find(filters).populate(`author`);
    },
  },

  Mutation: {
    addBook: async (root, args) => {
      try {
        let author = await Author.findOne({ name: args.author });

        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }

        const book = new Book({ ...args, author: author._id });
        await book.save();
        return book.populate(`author`);
      } catch (error) {
        throw new GraphQLError(`Adding book failed!`, {
          extensions: {
            code: `BAD_USER_INPUT`,
            invalidArgs: args,
            error,
          },
        });
      }
    },

    editAuthor: async (root, args) => {
      try {
        const author = await Author.findOne({ name: args.name });
        if (!author) {
          return null;
        }

        author.born = args.setBornTo; // todo: in the future I guess other args might be here too

        const updatedAuthor = await author.save();
        return updatedAuthor;
      } catch (error) {
        throw new GraphQLError(`Editing author failed!`, {
          extensions: {
            code: `BAD_USER_INPUT`,
            invalidArgs: args,
            error,
          },
        });
      }
    },
  },

  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
}).then(async ({ url }) => {
  await resetDb();

  console.log(`Server ready at ${url}`);
});

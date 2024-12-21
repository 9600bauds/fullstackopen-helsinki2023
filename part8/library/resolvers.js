import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import Author from './models/Author.js';
import Book from './models/Book.js';
import User from './models/User.js';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser;
    },
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
    allGenres: async () => {
      const books = await Book.find({});
      const allGenres = books.reduce((genres, book) => {
        book.genres.forEach((genre) => {
          if (!genres.includes(genre)) {
            genres.push(genre);
          }
        });
        return genres;
      }, []);
      return allGenres;
    },
  },

  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError(`Creating the user failed`, {
          extensions: {
            code: `BAD_USER_INPUT`,
            invalidArgs: args.username,
            error,
          },
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== process.env.GLOBAL_PW) {
        throw new GraphQLError(`Wrong credentials`, {
          extensions: {
            code: `BAD_USER_INPUT`,
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.SECRET) };
    },

    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError(`not authenticated`, {
          extensions: {
            code: `BAD_USER_INPUT`,
          },
        });
      }

      try {
        let author = await Author.findOne({ name: args.author });

        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }

        const book = new Book({ ...args, author: author._id });
        await book.save();

        pubsub.publish(`BOOK_ADDED`, { bookAdded: book });

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

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError(`not authenticated`, {
          extensions: {
            code: `BAD_USER_INPUT`,
          },
        });
      }

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

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator(`BOOK_ADDED`),
    },
  },
};

export default resolvers;

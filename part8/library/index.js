const { ApolloServer } = require(`@apollo/server`);
const { startStandaloneServer } = require(`@apollo/server/standalone`);
const { GraphQLError } = require(`graphql`);
const { v1: uuid } = require(`uuid`);

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

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
 */

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

const typeDefs = `
  type Book {
    title: String!
    published: Int
    author: String!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int
    ) : Author
  }
`;

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
    addBook: (root, args) => {
      // It's possible for two books to have the same title, so we check for title AND author... which is also possible in real life, but, close enough.
      if (
        books.find((b) => b.title === args.title && b.author === args.author)
      ) {
        throw new GraphQLError(
          `There is already a book with that name and that author`,
          {
            extensions: {
              code: `BAD_USER_INPUT`, // No specific argument is wrong, the whole thing is wrong
            },
          }
        );
      }

      const book = { ...args, id: uuid() };
      books = books.concat(book);

      let authorFound = false;
      for (let author of authors) {
        if (author.name === book.author) {
          authorFound = true;
          break;
        }
      }
      if (!authorFound) {
        // Ideally we could have an addAuthor mutation and call that... right?
        const newAuthor = { name: book.author, id: uuid() };
        authors = authors.concat(newAuthor);
      }

      return book;
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
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

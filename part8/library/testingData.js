import Author from './models/Author.js';
import Book from './models/Book.js';

export const authors = [
  {
    name: `Robert Martin`,
    born: 1952,
  },
  {
    name: `Martin Fowler`,
    born: 1963,
  },
  {
    name: `Fyodor Dostoevsky`,
    born: 1821,
  },
  {
    name: `Joshua Kerievsky`,
  },
  {
    name: `Sandi Metz`,
  },
];

export const books = [
  {
    title: `Clean Code`,
    published: 2008,
    author: `Robert Martin`,
    genres: [`refactoring`],
  },
  {
    title: `Agile software development`,
    published: 2002,
    author: `Robert Martin`,
    genres: [`agile`, `patterns`, `design`],
  },
  {
    title: `Refactoring, edition 2`,
    published: 2018,
    author: `Martin Fowler`,
    genres: [`refactoring`],
  },
  {
    title: `Refactoring to patterns`,
    published: 2008,
    author: `Joshua Kerievsky`,
    genres: [`refactoring`, `patterns`],
  },
  {
    title: `Practical Object-Oriented Design, An Agile Primer Using Ruby`,
    published: 2012,
    author: `Sandi Metz`,
    genres: [`refactoring`, `design`],
  },
  {
    title: `Crime and punishment`,
    published: 1866,
    author: `Fyodor Dostoevsky`,
    genres: [`classic`, `crime`],
  },
  {
    title: `Demons`,
    published: 1872,
    author: `Fyodor Dostoevsky`,
    genres: [`classic`, `revolution`],
  },
];

export async function resetDb() {
  console.log(`Wiping database...`);
  await Book.deleteMany({});
  await Author.deleteMany({});
  console.log(`Database wiped.`);

  console.log(`Updating author bookCount...`);
  const authorsWithBookCount = authors.map((author) => {
    const thisAuthorBookCount = books.filter(
      (book) => book.author === author.name
    ).length;
    return { ...author, bookCount: thisAuthorBookCount };
  });

  console.log(`Seeding authors...`);
  await Author.insertMany(authorsWithBookCount);
  console.log(`Authors seeded.`);

  console.log(`Seeding books...`);
  const authorsFromDb = await Author.find({});

  const booksWithAuthorIds = books.map((book) => {
    const author = authorsFromDb.find((a) => a.name === book.author);
    return { ...book, author };
  });

  await Book.insertMany(booksWithAuthorIds);

  console.log(`Books seeded.`);
}

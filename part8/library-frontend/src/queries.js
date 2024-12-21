import { gql } from '@apollo/client';

// Fragments

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    name
    born
    bookCount
    id
  }
`;

const BOOK_DETAILS_SIMPLE = gql`
  fragment BookDetailsSimple on Book {
    title
    published
    author {
      name
    }
    id
  }
`;

const BOOK_DETAILS_WITH_AUTHOR = gql`
  fragment BookDetailsWithAuthor on Book {
    title
    published
    author {
      ...AuthorDetails
    }
    genres
    id
  }
  ${AUTHOR_DETAILS}
`;

const USER_DETAILS = gql`
  fragment UserDetails on User {
    username
    favoriteGenre
    id
  }
`;

// Queries

export const ALL_AUTHORS = gql`
  query GetAllAuthors {
    allAuthors {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`;

export const ALL_BOOKS_SANS_GENRES = gql`
  query GetAllBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      ...BookDetailsSimple
    }
  }
  ${BOOK_DETAILS_SIMPLE}
`;

export const ALL_GENRES = gql`
  query GetAllGenres {
    allGenres
  }
`;

export const LITERALLY_ME = gql`
  query Me {
    me {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`;

// Mutations

export const ADD_BOOK = gql`
  mutation AddNewBook(
    $title: String!
    $author: String!
    $published: Int
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      ...BookDetailsWithAuthor
    }
  }
  ${BOOK_DETAILS_WITH_AUTHOR}
`;

export const EDIT_AUTHOR_BORN = gql`
  mutation EditAuthorBirthYear($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`;

export const CREATE_USER = gql`
  mutation CreateNewUser($username: String!, $favoriteGenre: String!) {
    createUser(username: $username, favoriteGenre: $favoriteGenre) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`;

export const LOGIN = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

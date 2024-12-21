import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
  query GetAllAuthors {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;

export const ALL_BOOKS_SANS_GENRES = gql`
  query GetAllBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      title
      published
      author {
        name
      }
      id
    }
  }
`;

export const ALL_GENRES = gql`
  query GetAllGenres {
    allGenres
  }
`;

export const LITERALLY_ME = gql`
  query Me {
    me {
      username
      favoriteGenre
      id
    }
  }
`;

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
      title
      published
      author {
        name
        born
        bookCount
        id
      }
      genres
      id
    }
  }
`;

export const EDIT_AUTHOR_BORN = gql`
  mutation EditAuthorBirthYear($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
      bookCount
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateNewUser($username: String!, $favoriteGenre: String!) {
    createUser(username: $username, favoriteGenre: $favoriteGenre) {
      username
      favoriteGenre
      id
    }
  }
`;

export const LOGIN = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

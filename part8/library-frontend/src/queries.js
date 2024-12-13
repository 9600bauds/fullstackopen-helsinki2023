import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
  query GetAllAuthors {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`;

export const ALL_BOOKS_SANS_GENRES = gql`
  query GetAllBooks {
    allBooks {
      title
      published
      author
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
      author
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

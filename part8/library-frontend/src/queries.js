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

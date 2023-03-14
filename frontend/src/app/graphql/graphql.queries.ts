import { gql } from 'apollo-angular';

export const GET_NOTES = gql`
  {
    notes {
      id
      userId
      title
      description
      timestamp
    }
  }
`;

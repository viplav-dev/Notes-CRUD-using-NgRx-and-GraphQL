import { gql } from 'apollo-angular';

export const ADD_NOTE = gql`
  mutation addNote($title: String!, $description: String!, $userId: ID!) {
    addNote(title: $title, description: $description, userId: $userId) {
      id
      userId
      title
      description
      timestamp
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation updateNote($id: ID!, $title: String!, $description: String!) {
    updateNote(id: $id, title: $title, description: $description) {
      id
      userId
      title
      description
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation deleteNote($id: ID!) {
    deleteNote(id: $id) {
      id
    }
  }
`;

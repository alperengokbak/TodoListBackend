import gql from "graphql-tag";

const noteTypeDefs = gql`
  type Query {
    notes: [Note]
    note(id: ID!): Note
  }

  type Note {
    id: ID!
    content: String
    createdAt: String!
    updatedAt: String!
    list: List!
    user: User!
  }

  type Mutation {
    createNote(content: String!, listId: ID!, userId: ID!): Note!
    deleteNote(id: ID!): Note!
  }
`;
export default noteTypeDefs;

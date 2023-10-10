import gql from "graphql-tag";

const listTypeDefs = gql`
  type Query {
    lists: [List]
    list(id: ID!): List
  }

  type List {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    user: User!
    notes: [Note]
  }

  type Mutation {
    createList(name: String!, userId: ID!): List!
    deleteList(id: ID!): List!
  }
`;

export default listTypeDefs;

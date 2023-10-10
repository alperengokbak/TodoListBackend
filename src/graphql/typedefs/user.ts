import gql from "graphql-tag";

const userTypeDefs = gql`
  type Query {
    users: [User]
    user(id: ID!): User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    lists: [List]
    notes: [Note]
  }

  type Mutation {
    deleteUser(id: ID!): User!
  }
`;
export default userTypeDefs;

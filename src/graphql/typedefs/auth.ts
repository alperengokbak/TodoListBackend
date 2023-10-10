import gql from "graphql-tag";

const authTypeDefs = gql`
  type Query {
    me: User
  }

  type Auth {
    token: String
    user: User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
  }
`;
export default authTypeDefs;

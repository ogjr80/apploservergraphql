const { ApolloServer, gql } = require("apollo-server");
const crypto = require("crypto");

const db = {
  users: [
    {
      id: "1",
      name: "Gideon",
      email: "ogjr80@gmail.com",
      avatarUrl: "http://avatar.com/..."
    },
    {
      id: "2",
      name: "Rotimi",
      email: "romitif@gmail.com",
      avatarUrl: "http://avatar.com/..."
    }
  ],
  messages: [
    { id: "1", userId: "1", body: "Hello", createdAt: Date.now() },
    { id: "2", userId: "2", body: "Hi there", createdAt: Date.now() },
    { id: "3", userId: "3", body: "how are yo doing", createdAt: Date.now() }
  ]
};

const typeDefs = gql`
  type Query {
    users: [User!]!
    messages: [Message!]!
    user(id: ID!): User!
  }

  type User {
    id: ID!
    name: String!
    email: String
    avartarUrl: String
    messages: [Message!]
  }

  type Message {
    id: ID!
    body: String!
    createdAt: String!
  }

  type Mutation {
    addUser(email: String!, name: String!, avatarUrl: String): User!
  }
`;

const resolvers = {
  Query: {
    users: () => db.users,
    user: (root, { id }) => db.users.find(user => user.id === id),
    messages: () => db.messages
  },
  Mutation: {
    addUser: (root, { email, name, avatarUrl }) => {
      const user = {
        id: crypto.randomBytes(10).toString("hex"),
        email,
        name,
        avatarUrl
      };
      db.users.push(user);
      return user;
    }
  },
  User: {
    messages: user => {
      return db.messages.filter(message => message.userId === user.id);
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(url));

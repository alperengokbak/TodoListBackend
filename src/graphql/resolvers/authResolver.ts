import { MyContext } from "../../context";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { ApolloError, AuthenticationError } from "apollo-server-errors";
dotenv.config();

export const authResolver = {
  Query: {
    me: async (_, __, context: MyContext) => {
      if (!context.user) {
        throw new AuthenticationError("User not found!");
      }
      const loggedInUser = await context.prisma.user.findUnique({
        where: {
          id: context.user.id,
        },
      });
      return loggedInUser;
    },
  },
  Mutation: {
    login: async (_, { email, password }, context: MyContext) => {
      try {
        const user = await context.prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (!user) {
          throw Error("Incorrect email!");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw Error("Incorrect password!");
        }
        const token = jwt.sign({ id: user.id }, process.env.APP_SECRET, { expiresIn: "7d" });
        return {
          token,
          user,
        };
      } catch (error) {
        const err = error as Error;
        return new ApolloError(err.message);
      }
    },

    register: async (_, { name, email, password }, context: MyContext) => {
      try {
        const isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
        const existingUser = await context.prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (existingUser) {
          throw Error("User already exists!");
        }
        if (!isEmail) {
          throw Error("Your email has to include @ and .");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await context.prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });
        const user = await context.prisma.user.findUnique({
          where: {
            id: createdUser.id,
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
        const token = jwt.sign({ id: user?.id }, process.env.APP_SECRET, { expiresIn: "7d" });
        return { token, user };
      } catch (error) {
        const err = error as Error;
        return new ApolloError(err.message);
      }
    },
  },
};

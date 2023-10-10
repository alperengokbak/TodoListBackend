import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export type MyContext = {
  prisma: PrismaClient;
  user: User | null;
};

export const createContext = async ({ req }): Promise<MyContext> => {
  const auth = req.headers.authorization;
  let token = null;
  let user: User | null = null;
  if (auth) {
    token = auth.split(" ")[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.APP_SECRET);
      user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });
      return {
        prisma,
        user,
      };
    } catch (error) {
      console.error(error);
    }
  }
  return { prisma, user };
};

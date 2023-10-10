import { MyContext } from "../../context";

export const userResolver = {
  Query: {
    users: async (_, __, context: MyContext) => {
      try {
        const users = await context.prisma.user.findMany({
          include: {
            // JOIN
            lists: true,
            notes: true,
          },
        });
        return users;
      } catch (error) {
        console.error("Error fetching list:", error);
        throw error;
      }
    },
    user: async (_, { id }, context: MyContext) => {
      try {
        const userWithPostsAndNotes = await context.prisma.user.findUnique({
          where: {
            id,
          },
          include: {
            // JOIN
            notes: true,
            lists: true,
          },
        });
        return userWithPostsAndNotes;
      } catch (error) {
        console.error("Error fetching list:", error);
        throw error;
      }
    },
  },
  // Filed Resolvers
  /* User: {
    lists: (parent, _, context: MyContext) => {
      return context.prisma.user
        .findFirst({
          where: {
            id: parent.id,
          },
        })
        .lists();
    },
    notes: (parent, _, context: MyContext) => {
      return context.prisma.user
        .findFirst({
          where: {
            id: parent.id,
          },
        })
        .notes();
    },
  }, */
  Mutation: {
    deleteUser: async (_, { id }, context: MyContext) => {
      const user = await context.prisma.user.delete({
        where: {
          id: id,
        },
      });
      return user;
    },
  },
};

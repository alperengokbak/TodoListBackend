import { MyContext } from "../../context";

export const listResolver = {
  Query: {
    lists: async (_, __, context: MyContext) => {
      try {
        const list = await context.prisma.list.findMany({
          include: {
            // JOIN
            notes: true,
            user: true,
          },
        });
        return list;
      } catch (error) {
        console.error("Error fetching list:", error);
        throw error;
      }
    },
    list: async (_, { id }, context: MyContext) => {
      try {
        const list = await context.prisma.list.findFirst({
          where: {
            id: id,
          },
          include: {
            // JOIN
            notes: true,
            user: true,
          },
        });
        return list;
      } catch (error) {
        console.error("Error fetching list:", error);
        throw error;
      }
    },
  },

  /* List: {
    user: async (parent, _, context: MyContext) => {
      const user = await context.prisma.list
        .findFirst({
          where: {
            id: parent.id,
          },
        })
        .user();
      return user;
    },
    notes: async (parent, _, context: MyContext) => {
      const note = await context.prisma.list
        .findFirst({
          where: {
            id: parent.id,
          },
        })
        .notes();
      return note;
    },
  }, */

  Mutation: {
    createList: async (_, { name, userId }, context: MyContext) => {
      const list = await context.prisma.list.create({
        data: {
          name,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return list;
    },
    deleteList: async (_, { id }, context: MyContext) => {
      const list = await context.prisma.list.delete({
        where: {
          id,
        },
      });
      return list;
    },
  },
};

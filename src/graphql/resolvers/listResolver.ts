import { MyContext } from "../../context";

export const listResolver = {
  Query: {
    lists: async (_, __, context: MyContext) => {
      try {
        const lists = await context.prisma.list.findMany({
          include: {
            // JOIN
            notes: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
        return lists;
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
            notes: {
              select: {
                id: true,
                content: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
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
      const list = await context.prisma.list.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });

      if (!list) {
        throw new Error("List not found");
      }

      if (list.user.id !== context.user?.id) {
        throw new Error("You are not authorized to delete this list");
      }

      await context.prisma.note.deleteMany({
        where: {
          listId: id,
        },
      });

      const deletedList = await context.prisma.list.delete({
        where: {
          id,
        },
      });

      return deletedList;
    },
  },
};

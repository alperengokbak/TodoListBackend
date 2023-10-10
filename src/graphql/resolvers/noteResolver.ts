import { MyContext } from "../../context";

export const noteResolver = {
  Query: {
    notes: async (_, __, context: MyContext) => {
      try {
        const note = await context.prisma.note.findMany({
          include: {
            // JOIN
            user: true,
            list: true,
          },
        });
        return note;
      } catch (error) {
        console.error("Error fetching list:", error);
        throw error;
      }
    },
    note: (_, { id }, context: MyContext) => {
      const note = context.prisma.note.findFirst({
        where: {
          id: id,
        },
        include: {
          // JOIN
          user: true,
          list: true,
        },
      });
      return note;
    },
  },
  /* Note: {
    user: (parent, _, context: MyContext) => {
      return context.prisma.note
        .findFirst({
          where: {
            id: parent.id,
          },
        })
        .user();
    },
    list: (parent, _, context: MyContext) => {
      return context.prisma.note
        .findFirst({
          where: {
            id: parent.id,
          },
        })
        .list();
    },
  }, */
  Mutation: {
    createNote: async (_, { content, listId, userId }, context: MyContext) => {
      try {
        const note = await context.prisma.note.create({
          data: {
            content,
            list: {
              connect: {
                id: listId,
              },
            },
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });
        return note;
      } catch (error) {
        console.error("Error creating note:", error);
        throw error;
      }
    },
    deleteNote: async (_, { id }, context: MyContext) => {
      try {
        const note = await context.prisma.note.delete({
          where: {
            id,
          },
        });
        return note;
      } catch (error) {
        console.error("Error deleting note:", error);
        throw error;
      }
    },
  },
};

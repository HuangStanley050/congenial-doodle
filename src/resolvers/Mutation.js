import bcrypt from "bcryptjs";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });
    if (emailTaken) {
      throw new Error("Email taken");
    }
    if (args.data.password.length < 8) {
      throw new Error("Password must be greater than 8 characters");
    }
    const password = await bcrypt.hash(args.data.password, 10);
    return prisma.mutation.createUser(
      {
        data: {
          ...args.data,
          password
        }
      },
      info
    );
  },
  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });
    if (!userExists) {
      throw new Error("User doesn't exists");
    }
    return prisma.mutation.deleteUser(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async updateUser(parent, args, { prisma }, info) {
    return prisma.mutation.updateUser(
      { data: { ...args.data }, where: { id: args.id } },
      info
    );
  },
  async createPost(parent, args, { prisma, pubsub }, info) {
    const userExists = await prisma.exists.User({ id: args.data.author });
    if (!userExists) {
      throw new Error("User doesn't exists");
    }

    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: args.data.author
            }
          }
        }
      },
      info
    );
  },
  async deletePost(parent, args, { prisma, pubsub }, info) {
    const postExists = prisma.exists.Post({ id: args.id });
    if (!postExists) {
      throw new Error("Post doesn't exist");
    }
    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  updatePost(parent, args, { prisma, pubsub }, info) {
    return prisma.mutation.updatePost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published
        },
        where: { id: args.id }
      },
      info
    );
  },
  createComment(parent, args, { prisma, pubsub }, info) {
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: { id: args.data.author }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
        }
      },
      info
    );
  },
  updateComment(parent, args, { prisma, pubsub }, info) {
    return prisma.mutation.updateComment(
      { data: { text: args.data.text }, where: { id: args.id } },
      info
    );
  },
  deleteComment(parent, args, { prisma }, info) {
    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  }
};

export { Mutation as default };

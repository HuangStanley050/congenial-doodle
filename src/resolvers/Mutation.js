import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserId } from "../utils/getUserId";

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({ where: { email: args.data.email } });
    if (!user) {
      throw new Error("User doesn't exists");
    }
    const passwordResult = await bcrypt.compare(
      args.data.password,
      user.password
    );
    if (!passwordResult) {
      throw new Error("Password doesn't match");
    }

    return {
      user,
      token: jwt.sign({ userId: user.id }, "secret")
    };
  },
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });
    if (emailTaken) {
      throw new Error("Email taken");
    }
    if (args.data.password.length < 8) {
      throw new Error("Password must be greater than 8 characters");
    }
    const password = await bcrypt.hash(args.data.password, 10);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });
    return {
      user,
      token: jwt.sign({ userId: user.id }, "secret")
    };
  },
  async deleteUser(parent, args, { prisma, req }, info) {
    const userId = getUserId(req);
    const userExists = await prisma.exists.User({ id: userId });
    if (!userExists) {
      throw new Error("User doesn't exists");
    }
    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId
        }
      },
      info
    );
  },
  async updateUser(parent, args, { prisma, req }, info) {
    const userId = getUserId(req);
    return prisma.mutation.updateUser(
      { data: { ...args.data }, where: { id: userId } },
      info
    );
  },
  async createPost(parent, args, { prisma, req }, info) {
    const userId = getUserId(req);

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
              id: userId
            }
          }
        }
      },
      info
    );
  },
  async deletePost(parent, args, { prisma, req }, info) {
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!postExists) {
      throw new Error("Unable to delete Post");
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

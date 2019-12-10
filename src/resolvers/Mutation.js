import bcrypt from "bcryptjs";
//import jwt from "jsonwebtoken";
import { getUserId } from "../utils/getUserId";
import { generateToken } from "../utils/generateToken";
import { hashPassword } from "../utils/hashPassword";

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
      token: generateToken(user.id)
    };
  },
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });
    if (emailTaken) {
      throw new Error("Email taken");
    }

    const password = await hashPassword(args.data.password);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });
    return {
      user,
      token: generateToken(user.id)
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
    if (typeof args.data.password === "string") {
      args.data.password = await hashPassword(args.data.password);
    }
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
  async updatePost(parent, args, { prisma, req }, info) {
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });
    if (!postExists) {
      throw new Error("Unable to update Post");
    }

    const postPublished = await prisma.exits.Post({
      id: args.id,
      published: true
    });
    if (postPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: args.id
          }
        }
      });
    }

    return prisma.mutation.updatePost(
      {
        data: args.data,
        where: { id: args.id }
      },
      info
    );
  },
  async createComment(parent, args, { prisma, req }, info) {
    const userId = getUserId(req);
    const postPublished = await prisma.exists.Post({ id: args.data.post });
    if (!postPublished) {
      throw new Error("Post has not been published yet");
    }
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: { id: userId }
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
  async updateComment(parent, args, { prisma, req }, info) {
    const userId = getUserId(req);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });
    if (!commentExists) {
      throw new Error("Unable to update comment");
    }
    return prisma.mutation.updateComment(
      { data: { text: args.data.text }, where: { id: args.id } },
      info
    );
  },
  async deleteComment(parent, args, { prisma, req }, info) {
    const userId = getUserId(req);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });
    if (!commentExists) {
      throw new Error("Unable to update comment");
    }
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

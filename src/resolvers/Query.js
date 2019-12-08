import { getUserId } from "../utils/getUserId";
const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          },
          {
            email_contains: args.query
          }
        ]
      };
    }

    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [{ title_contains: args.query }, { body_contains: args.query }]
      };
    }

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },
  async me(parent, args, { prisma, req }, info) {
    const userId = getUserId(req);
    return prisma.query.user({ where: { id: userId } }, info);
  },
  async post(parent, args, { prisma, req }, info) {
    const userId = getUserId(req, false);
    const posts = await prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [{ published: true }, { author: { id: userId } }]
        }
      },
      info
    );
    if (posts.length === 0) {
      throw new Error("No post found");
    }
    return posts[0];
  }
};

export { Query as default };

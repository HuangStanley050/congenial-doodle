import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: ""
});

prisma.query
  .users(null, "{name email id posts {id title body}}")
  .then(users => {
    console.log(JSON.stringify(users, undefined, 2));
  });

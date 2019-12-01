import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: ""
});
const updatePostForUser = async (postId, data) => {
  const updatedPost = await prisma.mutation.updatePost(
    {
      data: {
        ...data
      },
      where: {
        id: postId
      }
    },
    "{author {id name email}}"
  );
  const user = await prisma.query.user(
    {
      where: {
        id: updatedPost.author.id
      }
    },
    "{id name email posts {id title body published}}"
  );
  return user;
};
updatePostForUser("ck3mre3uw00fa0738jhebe59q", {
  title: "updated tekken",
  published: false,
  body: "I am retired"
}).then(user => console.log(JSON.stringify(user, undefined, 2)));
// const createPostForUser = async (authorId, data) => {
//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId
//           }
//         }
//       }
//     },
//     "{id title body published}"
//   );
//   const user = await prisma.query.user(
//     {
//       where: {
//         id: authorId
//       }
//     },
//     "{id name email posts {id title body published}}"
//   );
//   return user;
// };
//
// createPostForUser("ck3mbz84x00110709w1c4rpx3", {
//   title: "I am tekken",
//   body: "Ho ho plus more ho",
//   published: true
// }).then(user => console.log(JSON.stringify(user, undefined, 2)));
// prisma.query
//   .users(null, "{name email id posts {id title body}}")
//   .then(users => {
//     console.log(JSON.stringify(users, undefined, 2));
//   });
//
// prisma.query
//   .comments(null, "{text author {id name}}")
//   .then(comments => console.log(JSON.stringify(comments, undefined, 2)));
//

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "Booooaaaa",
//         body: "Mery xmas",
//         published: true,
//         author: {
//           connect: {
//             email: "test3@test.com"
//           }
//         }
//       }
//     },
//     "{id title body published}"
//   )
//   .then(post => {
//     console.log(JSON.stringify(post, undefined, 2));
//     return prisma.query.users(null, "{id name email posts { id title body }}");
//   })
//   .then(users => console.log(JSON.stringify(users, undefined, 2)));

// prisma.mutation
//   .updatePost(
//     {
//       data: {
//         published: false,
//         title: "This is another challenge",
//         body: "I am going to bed",
//         author: {
//           connect: {
//             email: "test3@test.com"
//           }
//         }
//       },
//       where: {
//         id: "ck3mq9n6p00520738ooco2ab7"
//       }
//     },
//     "{id title body published author {id name email}}"
//   )
//   .then(post => {
//     console.log(JSON.stringify(post, undefined, 2));
//     return prisma.query.posts(
//       null,
//       "{id title body published author {id name email}}"
//     );
//   })
//   .then(posts => console.log(JSON.stringify(posts, undefined, 2)));

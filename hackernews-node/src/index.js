const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require('./generated/prisma-client')

const resolvers = {
    Query: {
        info: () => `This is the API of Hackernews Clone`,
        feed: (_root, _args, context) => {
            return context.prisma.links();
        }
    },
    Mutation: {
        postLink: (_parent, args, context) => {
            return context.prisma.createLink({
                description: args.description,
                url: args.url
            });
        },
        updateLink: (_parent, args, context) => {
            return context.prisma.updateLink(
                {
                    description: args.description,
                    url: args.url
                }, {
                    id: args.id
                });
        },
        deleteLink: (_parent, args, context) => {
            return context.prisma.deleteLink({ id: args.id });
        }
    }
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { prisma }
});
server.start(() => console.log(`Server started on http://localhost:4000`));
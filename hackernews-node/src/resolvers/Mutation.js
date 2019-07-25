const { APP_SECRET, getUserId } = require('../utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function signup(_parent, args, context) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.createUser({ ...args, password })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

async function login(_parent, args, context) {
    const user = await context.prisma.user({ email: args.email })
    if (!user) {
        throw new Error('No such user found')
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

function postLink(_parent, args, context) {
    const userId = getUserId(context);
    return context.prisma.createLink({
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } }
    });
}

function updateLink(_parent, args, context) {
    const userId = getUserId(context);
    return context.prisma.updateLink(
        {
            description: args.description,
            url: args.url,
            postedBy: { connect: { id: userId } }
        }, {
            id: args.id
        });
}

function deleteLink(_parent, args, context) {
    getUserId(context);
    return context.prisma.deleteLink({ id: args.id });
}

module.exports = {
    signup,
    login,
    postLink,
    updateLink,
    deleteLink
}
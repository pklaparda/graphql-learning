function feed (_root, _args, context) {
    return context.prisma.links();
}

module.exports = {
    feed
}
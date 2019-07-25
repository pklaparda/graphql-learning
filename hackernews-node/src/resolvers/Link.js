function postedBy(parent, _args, context) {
    return context.prisma.link({ id: parent.id }).postedBy()
  }
  
  module.exports = {
    postedBy
  }
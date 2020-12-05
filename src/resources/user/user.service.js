const userSchema = require('./user.entity');

const userService = {
  getUserById: async (userId) => {
    return await userSchema.find({ id: userId });
  },

  addUser: async (user) => {
    await userSchema.create(user);
  },
};

module.exports = userService;

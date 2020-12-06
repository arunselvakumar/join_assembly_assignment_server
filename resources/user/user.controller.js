const userService = require('./user.service');
const httpStatusCodes = require('http-status-codes');

const userController = {
  getUserById: async (req, res) => {
    try {
      const userId = req.params['userId'];
      if (!userId) {
        res.status(httpStatusCodes.BAD_REQUEST);
      }

      const userEntity = await userService.getUserById(userId);
      res.status(httpStatusCodes.OK).json(userEntity);
    } catch {
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};

module.exports = userController;

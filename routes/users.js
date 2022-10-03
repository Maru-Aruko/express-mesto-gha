const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexURL } = require('../utils/utils');
const {
  getUsers, getUserById, updateProfile, updateAvatar, getInfoAboutMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getInfoAboutMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(regexURL),
  }),
}), updateAvatar);

module.exports = router;

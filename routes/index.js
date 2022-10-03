const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const routerUsers = require('./users');
const routerCards = require('./cards');
const NotFoundError = require('../Errors/NotFoundError');
const { regexURL } = require('../utils/utils');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(regexURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

router.use('/users', auth, routerUsers);
router.use('/cards', auth, routerCards);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страницы не существует'));
});

module.exports = router;

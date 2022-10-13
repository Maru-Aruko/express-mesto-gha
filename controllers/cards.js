const Card = require('../models/card');
const NotFoundError = require('../Errors/NotFoundError');
const ValidError = require('../Errors/ValidError');
const ForbiddenError = require('../Errors/ForbiddenError');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['likes', 'owner']).sort('-createdAt');
    res.send(cards);
  } catch (error) {
    next(error);
  }
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(' Карточка с указанным _id не найдена.');
      } else if (String(card.owner) !== req.user._id) {
        throw new ForbiddenError('Доступ ограничен');
      }
      card.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidError(' Введен некорректный _id карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError(' Передан несуществующий _id карточки.');
      }
      return res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidError(' Переданы некорректные данные для постановки лайка.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError(' Передан несуществующий _id карточки.');
      }
      return res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidError(' Переданы некорректные данные для снятия лайка.'));
      } else {
        next(err);
      }
    });
};

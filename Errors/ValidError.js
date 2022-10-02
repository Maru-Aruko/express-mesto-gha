class ValidError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidError';
    this.statusCode = 400;
  }
}

module.exports = ValidError;

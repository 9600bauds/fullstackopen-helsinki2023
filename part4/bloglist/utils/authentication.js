const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.slice('bearer '.length);
  }
  return null;
};

module.exports = { getTokenFrom };

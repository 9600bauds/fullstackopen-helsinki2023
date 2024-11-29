const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7); // Remove 'Bearer ' or 'bearer ' or any other combination of
  }
  return null;
};

module.exports = { getTokenFrom };

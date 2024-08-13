import PropTypes from 'prop-types';

export const BlogPropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
    // No token here!
  }).isRequired,
  id: PropTypes.string.isRequired
});
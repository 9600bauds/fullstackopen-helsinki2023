import PropTypes from 'prop-types';

export const UserPropType = PropTypes.shape({
  token: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

function NavLink({ to, children, isActive, isMobile, onClick }) {
  return (
    <Link
      to={to}
      className={clsx(
        isMobile ? 'block px-3 py-2' : 'px-3 py-2',
        'rounded-md text-sm font-medium',
        isActive
          ? 'bg-blue-500 text-white'
          : 'text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white'
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  isMobile: PropTypes.bool,
  onClick: PropTypes.func,
};

NavLink.defaultProps = {
  isActive: false,
  isMobile: false,
  onClick: () => {},
};

export default NavLink;
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style.module.scss';

export default function Text(props) {
  const {
    opacity,
    children,
    className,
    extraSmallLight,
    extraSmallWhite,
    smallLight,
    smallWhite,
    smallRed,
    mediumLight,
  } = props;

  const styleClass = classNames(`${className}`, {
    [styles.extraSmallLight]: extraSmallLight,
    [styles.extraSmallWhite]: extraSmallWhite,
    [styles.smallLight]: smallLight,
    [styles.smallWhite]: smallWhite,
    [styles.smallRed]: smallRed,
    [styles.mediumLight]: mediumLight,
    [`opacity-${opacity}`]: opacity,
    [styles.mediumWhite]:
      !extraSmallLight &&
      !extraSmallWhite &&
      !smallLight &&
      !smallWhite &&
      !smallRed &&
      !mediumLight,
  });
  return <p className={styleClass}>{children}</p>;
};

Text.propTypes = {
  className: PropTypes.string,
  extraSmallLight: PropTypes.bool,
  extraSmallWhite: PropTypes.bool,
  smallLight: PropTypes.bool,
  smallWhite: PropTypes.bool,
  smallRed: PropTypes.bool,
  mediumLight: PropTypes.bool,
  children: PropTypes.node.isRequired,
  opacity: PropTypes.oneOf(['25', '50', '75', '100']),
};
Text.defaultProps = {
  className: '',
  extraSmallLight: false,
  extraSmallWhite: false,
  smallLight: false,
  smallWhite: false,
  smallRed: false,
  mediumLight: false,
  opacity: null,
};

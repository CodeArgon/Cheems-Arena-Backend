import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from "./style.module.scss";

export default function Button(props) {
  const { className, onHandleClick, children, variant, color, type, size, shape, ...rest } = props;

  const styleClass = classNames(
    `btn ${styles.btnDesign}`,
    variant ? `btn-${variant}-${color}` : `btn-${color}`,
    { [`btn-${size}`]: size },
    shape,
    className,
  );

  return (
    <button className={styleClass} type={type} onClick={onHandleClick} {...rest}>
      {children}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  onHandleClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  shape: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['outline', 'ghost']),
};
Button.defaultProps = {
  className: '',
  variant: null,
  size: null,
  onHandleClick: () => { },
  color: 'primary',
  type: 'button',
  shape: 'rounded-1',
};

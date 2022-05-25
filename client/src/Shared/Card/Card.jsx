import React from "react";
import PropTypes from "prop-types";
import styles from "./style.module.scss";

export default function Card(props) {
  const { children, className, onCardClick } = props;

  return (
    <div
      className={`card ${styles.cardDesign} ${className}`}
      onClick={onCardClick}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onCardClick: PropTypes.func,
};
Card.defaultProps = {
  className: "",
  onCardClick: () => { },
};

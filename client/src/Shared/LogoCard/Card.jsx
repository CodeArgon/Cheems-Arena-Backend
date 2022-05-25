import React from "react";
import PropTypes from "prop-types";
import styles from "./style.module.scss";
import Images from "./../../Constants/ImgConstants";
import logo from "../../Assets/Images/cheems-arena-logo.png";
export default function LogoCard(props) {
  const { children, className, onCardClick } = props;

  return (
    <div
      className={`card ${styles.cardDesign} ${className}`}
      onClick={onCardClick}
    >
      <div className={`${styles.cheemsImage} position-absolute w-100`}>
        <img alt="logo" src={logo} className={styles.cheemslogo}></img>
      </div>
      <div className={styles.cheemsCardContent}>
      {children}
      </div>
    </div>
  );
}

LogoCard.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onCardClick: PropTypes.func,
};
LogoCard.defaultProps = {
  className: "",
  onCardClick: () => {},
};

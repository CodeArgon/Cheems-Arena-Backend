import React from "react";
import PropTypes from "prop-types";
import Text from "../Text";
import styles from "./style.module.scss";
import image from "./../../Assets/Images/btn_login.png";
export default function InputField(props) {
  const {
    placeholder,
    type,
    onHandleChange,
    value,
    name,
    className,
    error,
    disabled,
    helpertext,
    inputFormDiv,
  } = props;

  return (
    <div className={`${styles.inputFormDiv} ${inputFormDiv} input-group`}>
      <div class="input-group-addon">@</div>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        className={`w-100 ${styles.inputDesign} ${className}`}
        disabled={disabled}
        onChange={onHandleChange}
        value={value}
      />
      {error ? <Text className={styles.errorMessage}>{helpertext}</Text> : null}
    </div>
  );
}

InputField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string,
  inputFormDiv: PropTypes.string,
  disabled: PropTypes.bool,
  helpertext: PropTypes.string,
  error: PropTypes.bool,
  onHandleChange: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string,
};

InputField.defaultProps = {
  placeholder: "",
  type: "",
  value: "",
  name: "",
  inputFormDiv: "",
  onHandleChange: () => {},
  className: null,
  disabled: null,
  helpertext: null,
  error: true,
};

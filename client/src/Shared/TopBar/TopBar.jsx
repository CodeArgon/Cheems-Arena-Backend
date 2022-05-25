import React from "react";
import Images from "../../Constants/ImgConstants";
import "./style.scss";

export default function TopBar(props) {
  return (
    <nav className="navBarDesign navbar navbar-expand-lg navbar-light bg-light">
      <div className="innerNavBody">
        <img className="userTopImg" src={Images.DEFAULT_USER_IMG} alt={""} />
      </div>
    </nav>
  );
}

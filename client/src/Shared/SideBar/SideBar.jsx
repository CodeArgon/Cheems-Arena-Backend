import React from 'react';
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import Text from "../Text"
import { CLIENT_SIDEBAR } from './constant';
import Images from "../../Constants/ImgConstants";
import "./style.scss"

export default function SideBar(props) {
  return (
    <ProSidebar collapsed={false} breakPoint="sm">
      <img src={Images.LOGO_IMG} alt={""} className="logoStyle" />
      <Menu iconShape="square">
        {CLIENT_SIDEBAR.map((value) => {
          return (
            <MenuItem
              key={value.label}
              onClick={() => {
                value.handleChange(value);
              }}
              icon={value.img}
            // className={`${activeLink === value.action ? "active" : ""
            //   }`}
            >
              <Text mediumLight>{value.label}</Text>
            </MenuItem>
          );
        })}
      </Menu>
    </ProSidebar>
  );
}
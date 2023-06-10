import React from "react";
import { strTitle } from "../../common/constants";

const Header = () => {
  return (
    <div className="ts-app-topbar">
      <div className="start">
        <div className="item is-text">{strTitle}</div>
      </div>
    </div>
  );
};

export default Header;

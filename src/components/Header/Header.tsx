import React from "react";
import SettingsModal from "./SettingsModal";
import { strTitle } from "../../common/constants";
import "./Header.css";

type Props = {
  reloadCheckList: () => void;
};

const Header = (props: Props) => {
  return (
    <div className="ts-app-topbar">
      <div className="start">
        <div className="item is-text">{strTitle}</div>
      </div>
      <div className="end">
        <div
          id="settings-btn"
          data-toggle="settings-modal:is-visible"
          className="item"
        >
          <span className="ts-icon is-gear-icon"></span>
        </div>
        <SettingsModal reloadCheckList={props.reloadCheckList} />
      </div>
    </div>
  );
};

export default Header;

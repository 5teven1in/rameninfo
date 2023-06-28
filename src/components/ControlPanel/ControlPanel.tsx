import React, { useEffect, useRef, useState } from "react";
import { CheckBox, Eaten, Opening, ControlOption } from "../../common/types";
import {
  eatenOption,
  openingOption,
  ramenInfoItemPrefix,
  strClose,
  strConfirm,
  strLucky,
  strResetData,
  strSearch,
  strSearchPlaceholder,
} from "../../common/constants";
import "./ControlPanel.css";

type Props = {
  checkList: Array<CheckBox>;
  updateControlOption: (controlOption: ControlOption) => void;
  resetCheckList: () => void;
};

function ControlPanel(props: Props) {
  const searchRef = useRef<HTMLInputElement>(null);
  const openingRef = useRef<HTMLSelectElement>(null);
  const eatenRef = useRef<HTMLSelectElement>(null);
  const [isEmptyResult, setIsEmptyResult] = useState<boolean>(false);

  const controlOption: ControlOption = {
    search: searchRef.current?.value || "",
    opening: openingRef.current?.value as Opening,
    eaten: eatenRef.current?.value as Eaten,
  };

  useEffect(() => {
    setIsEmptyResult(!props.checkList.some((checkBox) => !checkBox.isHidden));
  }, [props.checkList]);

  const gotoLucky = () => {
    const visibleCheckList = props.checkList.filter(
      (checkBox) => !checkBox.isHidden
    );

    if (visibleCheckList.length === 0) {
      return;
    }

    const luckyID =
      "#" +
      ramenInfoItemPrefix +
      visibleCheckList[Math.floor(Math.random() * visibleCheckList.length)].id;
    document.querySelector(luckyID)?.classList.add("is-indicated");
    window.location.hash = luckyID;
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    controlOption.search = e.target.value;
    props.updateControlOption(controlOption);
  };
  const handleOpeningChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    controlOption.opening = e.target.value as Opening;
    props.updateControlOption(controlOption);
  };
  const handleEatenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    controlOption.eaten = e.target.value as Eaten;
    props.updateControlOption(controlOption);
  };
  const handleClick = () => {
    localStorage.removeItem("checkList");
    props.resetCheckList();
  };

  return (
    <div>
      <div id="search-area" className="ts-row">
        <div className="column is-fluid">
          <div className="ts-input is-fluid">
            <input
              ref={searchRef}
              type="text"
              className="input"
              placeholder={strSearchPlaceholder}
              onChange={(e) => {
                handleSearchChange(e);
              }}
            />
          </div>
        </div>
        <div className="column">
          <button className="ts-button is-icon" data-tooltip={strSearch}>
            <span className="ts-icon is-magnifying-glass-icon"></span>
          </button>
        </div>
        <div className="column">
          <button
            onClick={gotoLucky}
            className={
              "ts-button is-icon" + (isEmptyResult ? " is-disabled" : "")
            }
            data-tooltip={strLucky}
            disabled={isEmptyResult}
          >
            <span className="ts-icon is-shuffle-icon"></span>
          </button>
        </div>
      </div>
      <div
        id="filter-area"
        className="ts-wrap is-center-aligned is-middle-aligned"
      >
        <div className="ts-select is-solid">
          <select ref={openingRef} onChange={(e) => handleOpeningChange(e)}>
            {openingOption.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        </div>
        <div className="ts-select is-solid">
          <select ref={eatenRef} onChange={(e) => handleEatenChange(e)}>
            {eatenOption.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        </div>
        <button
          className="ts-button is-icon is-negative is-outlined"
          data-toggle="modal:is-visible"
        >
          <span className="ts-icon is-trash-icon"></span>
        </button>
        <div className="ts-modal" data-name="modal">
          <div className="content">
            <div className="ts-content is-padded">
              <p>{strResetData}</p>
              <p>{strResetData}</p>
              <p>{strResetData}</p>
            </div>
            <div className="ts-divider"></div>
            <div className="ts-content is-tertiary is-horizontally-padded is-end-aligned">
              <button
                className="ts-button is-negative is-outlined"
                data-toggle="modal:is-visible"
                onClick={handleClick}
              >
                {strConfirm}
              </button>
              <button className="ts-button" data-toggle="modal:is-visible">
                {strClose}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;

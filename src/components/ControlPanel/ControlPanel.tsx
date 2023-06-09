import React, { useRef } from "react";
import "./ControlPanel.css";
import { CheckBox, Eaten, Opening, ControlOption } from "../../common/types";

type Props = {
  checkList: Array<CheckBox>;
  updateControlOption: (controlOption: ControlOption) => void;
};

function ControlPanel(props: Props) {
  const openingOption = [
    { value: Opening.Default, text: Opening.Default },
    { value: Opening.Today, text: Opening.Today },
    { value: Opening.Now, text: Opening.Now },
  ];
  const eatenOption = [
    { value: Eaten.Default, text: Eaten.Default },
    { value: Eaten.Yes, text: Eaten.Yes },
    { value: Eaten.No, text: Eaten.No },
  ];

  const searchRef = useRef<HTMLInputElement>(null);
  const openingRef = useRef<HTMLSelectElement>(null);
  const eatenRef = useRef<HTMLSelectElement>(null);

  const controlOption: ControlOption = {
    search: searchRef.current?.value || "",
    opening: openingRef.current?.value as Opening,
    eaten: eatenRef.current?.value as Eaten,
  };

  const gotoLucky = () => {
    const visibleCheckList = props.checkList.filter(
      (checkBox) => !checkBox.isHidden
    );
    const luckyID =
      "#ramen-info-item-" +
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
              placeholder="豚骨 / 雞白 / 沾麵 / 名店 / ..."
              onChange={(e) => {
                handleSearchChange(e);
              }}
            />
          </div>
        </div>
        <div className="column">
          <button className="ts-button is-icon" data-tooltip="搜尋">
            <span className="ts-icon is-magnifying-glass-icon"></span>
          </button>
        </div>
        <div className="column">
          <button
            onClick={gotoLucky}
            className="ts-button is-icon"
            data-tooltip="好手氣"
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
              <p>你確定要清除所有資料嗎？</p>
              <p>你確定要清除所有資料嗎？</p>
              <p>你確定要清除所有資料嗎？</p>
            </div>
            <div className="ts-divider"></div>
            <div className="ts-content is-tertiary is-horizontally-padded is-end-aligned">
              <button
                className="ts-button is-negative is-outlined"
                data-toggle="modal:is-visible"
                onClick={handleClick}
              >
                確定
              </button>
              <button className="ts-button" data-toggle="modal:is-visible">
                關閉
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;

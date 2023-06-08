import React from "react";
import "./ControlPanel.css";

type Props = {
  total: number;
  callback: (showEatOption: string) => void;
};

function ControlPanel(props: Props) {
  const options = [
    { value: "顯示所有", text: "顯示所有" },
    { value: "已經吃過", text: "已經吃過" },
    { value: "還沒吃過", text: "還沒吃過" },
  ];

  const gotoLucky = () => {
    const luckyID =
      "ramen-info-item-" + Math.floor(Math.random() * props.total);
    // FIXME: pass the state to the other components
    // document.getElementById(luckyID).classList.add("is-indicated");
    window.location.hash = "#" + luckyID;
  };
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.callback(e.target.value);
  };
  return (
    <div>
      <div id="search-area" className="ts-row">
        <div className="column is-fluid">
          <div className="ts-input is-fluid">
            <input
              type="text"
              className="input"
              placeholder="豚骨 / 雞白 / 沾麵 / 名店 / ..."
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
          <select>
            <option>不限時間</option>
            <option>今日營業</option>
            <option>現在營業</option>
          </select>
        </div>
        <div className="ts-select is-solid">
          <select id="show-eat-option" onChange={(e) => handleChange(e)}>
            {options.map((option) => (
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

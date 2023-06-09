import React, { useCallback, useEffect, useState } from "react";
import { CheckBox, RamenStore, Eaten, ControlOption } from "../../common/types";
import ramenStores from "../../assets/awesome.json";

type Props = {
  updateCheckList: (checkList: Array<CheckBox>) => void;
  controlOption: ControlOption;
};

function DataPanel(props: Props) {
  const [checkedLength, setCheckedLength] = useState(0);
  const [checkList, setCheckList] = useState(
    Array<boolean>(ramenStores.length).fill(false)
  );
  const [isHidden, setIsHidden] = useState(
    Array<boolean>(ramenStores.length).fill(false)
  );

  const updateCheckList = useCallback(() => {
    props.updateCheckList(
      checkList.map((val, idx) => {
        const checkBox: CheckBox = {
          id: idx,
          value: val,
          isHidden: isHidden[idx],
        };
        return checkBox;
      })
    );
  }, [checkList, isHidden]);
  useEffect(updateCheckList, [updateCheckList]);

  const hiddenLogic = useCallback(
    (controOption: ControlOption) => {
      return checkList
        .map((val) => {
          switch (controOption.eaten) {
            case Eaten.Default:
              return false;
            case Eaten.Yes:
              return !val;
            case Eaten.No:
              return val;
            default:
              return false;
          }
        })
        .map((val, idx) => {
          if (val) return val;
          return !Object.values(ramenStores[idx])
            .join()
            .includes(controOption.search);
        });
    },
    [checkList]
  );
  useEffect(() => {
    setIsHidden(() => hiddenLogic(props.controlOption));
  }, [props.controlOption, hiddenLogic]);

  useEffect(() => {
    document.querySelector("#skeleton")?.classList.add("u-hidden");
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const newCheckList = [...checkList];
    newCheckList[idx] = event.target.checked;
    setCheckList(newCheckList);
    setCheckedLength(
      () => checkedLength + Number(event.target.checked) * 2 - 1
    );
  };

  return (
    <div className="ts-box">
      <table className="ts-table is-celled is-striped">
        <thead>
          <tr>
            <th className="is-collapsed"></th>
            <th className="is-collapsed mobile:u-hidden">營業時間</th>
            <th>名稱</th>
            <th>預約</th>
            <th>排隊登記</th>
            <th className="mobile:u-hidden">標籤</th>
          </tr>
        </thead>
        <tbody id="ramen-info-list">
          {ramenStores.map((ramenStore: RamenStore, idx: number) => {
            return (
              <tr
                id={"ramen-info-item-" + idx}
                className={isHidden[idx] ? "u-hidden" : ""}
                key={idx}
              >
                <td>
                  <label className="ts-checkbox">
                    <input
                      type="checkbox"
                      id={"item-" + idx + "-checked"}
                      onChange={(e) => handleChange(e, idx)}
                    />
                  </label>
                </td>
                <td className="mobile:u-hidden">
                  <span className="ts-icon is-battery-full-icon"></span>
                </td>
                <td>
                  <a
                    href="https://google.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {ramenStore.name}
                  </a>
                </td>
                <td>{ramenStore.reservation || "N/A"}</td>
                <td>{ramenStore.waiting || "N/A"}</td>
                <td className="mobile:u-hidden">{ramenStore.tags || "N/A"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="ts-wrap is-center-aligned">
        <div id="skeleton" className="ts-loading"></div>
      </div>
    </div>
  );
}

export default DataPanel;

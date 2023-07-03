import React, { useCallback, useEffect, useState } from "react";
import OpeningTimeAccordion from "./OpeningTimeAccordion";
import {
  CheckBox,
  ControlOption,
  Eaten,
  Opening,
  RamenStore,
} from "../../common/types";
import ramenStores from "../../assets/awesome.json";
import {
  ramenInfoItemPrefix,
  strEmptyResult,
  strName,
  strOpening,
  strReservation,
  strTags,
  strWaiting,
} from "../../common/constants";
import { getOpeningStatus } from "../../common/openingTime";
import "./DataPanel.css";

type Props = {
  updateCheckList: (checkList: Array<CheckBox>) => void;
  updateReloadCheckList: (reloadCheckList: () => void) => void;
  controlOption: ControlOption;
};

function DataPanel(props: Props) {
  const emptyCheckList = () => {
    return Array.from({ length: ramenStores.length }, (_, idx) => {
      return { id: idx, value: false, isHidden: false } as CheckBox;
    }) as Array<CheckBox>;
  };

  const loadCheckList = () => {
    const savedCheckList = JSON.parse(
      window.localStorage.getItem("checkList") || "[]"
    );
    for (const item of savedCheckList) {
      item["isHidden"] = false;
    }
    if (savedCheckList.length === ramenStores.length) {
      return savedCheckList;
    }
    return emptyCheckList();
  };

  const reloadCheckList = () => {
    setCheckList(() => {
      return loadCheckList();
    });
  };

  const [checkList, setCheckList] = useState<Array<CheckBox>>(() => {
    return loadCheckList();
  });

  const updateVisible = useCallback(() => {
    const controlOption = props.controlOption;
    return checkList
      .map((checkBox: CheckBox) => {
        const checked = checkBox.value;
        switch (controlOption.eaten) {
          case Eaten.Default:
            return false;
          case Eaten.Yes:
            return !checked;
          case Eaten.No:
            return checked;
        }
      })
      .map((isHidden: boolean, idx: number) => {
        if (isHidden) return true;
        return !Object.values(ramenStores[idx])
          .join()
          .toLowerCase()
          .includes(controlOption.search.toLowerCase());
      })
      .map((isHidden: boolean, idx: number) => {
        if (isHidden) return true;

        const daysTimes = ramenStores[idx].openingTime.days;
        switch (controlOption.opening) {
          case Opening.Default:
            return false;
          case Opening.Today:
            return (
              daysTimes === null || !getOpeningStatus(daysTimes).hasOpeningTime
            );
          case Opening.Now:
            return daysTimes === null || !getOpeningStatus(daysTimes).isOpen;
        }
      });
  }, [props.controlOption, checkList]);

  useEffect(() => {
    const savedCheckList = checkList.map((checkBox: CheckBox) => {
      return {
        id: checkBox.id,
        value: checkBox.value,
      };
    });
    window.localStorage.setItem("checkList", JSON.stringify(savedCheckList));
    const isHidden = updateVisible();
    const newCheckList = [...checkList].map(
      (checkBox: CheckBox, idx: number) => {
        checkBox.isHidden = isHidden[idx];
        return checkBox;
      }
    );
    props.updateCheckList(newCheckList);
  }, [updateVisible]);

  useEffect(() => {
    props.updateReloadCheckList(reloadCheckList);
    document.querySelector("#skeleton")?.classList.add("u-hidden");
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    setCheckList((checkList) => {
      const newCheckList = [...checkList];
      newCheckList[idx].value = event.target.checked;
      return newCheckList;
    });
  };

  return (
    <div className="ts-box">
      <table className="ts-table is-celled is-striped">
        <thead>
          <tr>
            <th className="is-collapsed"></th>
            <th
              id="data-panel-th-opening-time"
              className="is-collapsed mobile:u-hidden"
            >
              {strOpening}
            </th>
            <th>{strName}</th>
            <th>{strReservation}</th>
            <th>{strWaiting}</th>
            <th className="mobile:u-hidden">{strTags}</th>
          </tr>
        </thead>
        <tbody id="ramen-info-list">
          {checkList.some((element) => !element.isHidden)
            ? ramenStores.map((ramenStore: RamenStore, idx: number) => {
                const siteLinks = [];
                if (ramenStore.fb !== null) {
                  siteLinks.push({ url: ramenStore.fb, iconName: "facebook" });
                }

                if (ramenStore.instagram !== null) {
                  siteLinks.push({
                    url: ramenStore.instagram,
                    iconName: "instagram",
                  });
                }

                return (
                  <tr
                    id={ramenInfoItemPrefix + idx}
                    className={
                      (checkList[idx].isHidden ? "u-hidden" : "") +
                      " is-middle-aligned"
                    }
                    key={idx}
                  >
                    <td>
                      <label className="ts-checkbox">
                        <input
                          type="checkbox"
                          checked={checkList[idx].value}
                          onChange={(e) => {
                            handleChange(e, idx);
                          }}
                        />
                      </label>
                    </td>
                    <td className="mobile:u-hidden">
                      <OpeningTimeAccordion
                        openingTime={ramenStore.openingTime}
                      />
                      <div className="ts-wrap">
                        {siteLinks.map(
                          (
                            {
                              url,
                              iconName,
                            }: { url: string; iconName: string },
                            idx: number
                          ) => {
                            return (
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer noopener"
                                key={idx}
                              >
                                <span
                                  className={`ts-icon is-square-${iconName}-icon is-huge`}
                                ></span>
                              </a>
                            );
                          }
                        )}
                      </div>
                    </td>
                    <td>
                      <a
                        href={ramenStore.googleMap}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {ramenStore.name}
                      </a>
                    </td>
                    <td>{ramenStore.reservation || "N/A"}</td>
                    <td>{ramenStore.waiting || "N/A"}</td>
                    <td className="mobile:u-hidden">
                      {ramenStore.tags || "N/A"}
                    </td>
                  </tr>
                );
              })
            : (() => {
                return (
                  <tr>
                    <td colSpan={6} className="is-center-aligned">
                      {strEmptyResult}
                    </td>
                  </tr>
                );
              })()}
        </tbody>
      </table>
      <div className="ts-wrap is-center-aligned">
        <div id="skeleton" className="ts-loading"></div>
      </div>
    </div>
  );
}

export default DataPanel;

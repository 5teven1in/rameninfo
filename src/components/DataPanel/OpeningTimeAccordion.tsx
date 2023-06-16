import React from "react";
import {
  strColon,
  strDotOperator,
  strOtherInfo,
  strStoreClosed,
  strStoreClosedTime,
  strStoreOpen,
  strStoreOpen24Hours,
  strStoreNextOpenTime,
  strStoreStartToOpenTime,
} from "../../common/constants";
import { dayOfWeekToText } from "../../common/datetime";
import { getOpeningStatus } from "../../common/openingTime";
import { OpeningTime } from "../../common/types";
import "./OpeningTimeAccordion.css";

type Props = {
  openingTime: OpeningTime;
};

function openingStatus(daysTimes: Array<Array<string>>) {
  const openingStatus_ = getOpeningStatus(daysTimes);

  if (openingStatus_.isOpen24Hour) {
    return (
      <div>
        <span className="ts-text store-open">{strStoreOpen}</span>
        &nbsp;
        {strDotOperator}
        &nbsp;
        {strStoreOpen24Hours}
      </div>
    );
  } else if (openingStatus_.isOpen) {
    return (
      <div>
        <span className="ts-text store-open">{strStoreOpen}</span>
        &nbsp;
        {strDotOperator}
        &nbsp;
        {strStoreClosedTime}
        {strColon}
        {openingStatus_.closedTime}
        &nbsp;
        {strDotOperator}
        &nbsp;
        {strStoreNextOpenTime}
        {strColon}
        {openingStatus_.nextOpenTime}
      </div>
    );
  } else {
    return (
      <div>
        <span className="ts-text is-negative">{strStoreClosed}</span>
        &nbsp;
        {strDotOperator}
        &nbsp;
        {strStoreStartToOpenTime}
        {strColon}
        {openingStatus_.nextOpenTime}
      </div>
    );
  }
}

function OpeningTimeAccordion(props: Props) {
  const otherInfo = props.openingTime.note
    ? strOtherInfo + strColon + props.openingTime.note
    : "";

  if (props.openingTime.closedMessage !== null) {
    return (
      <div>
        <div className="ts-text is-secondary">
          {props.openingTime.closedMessage}
        </div>
        <div>{otherInfo}</div>
      </div>
    );
  }

  if (props.openingTime.days === null) {
    return (
      <div>
        <div>N/A</div>
        <div>{otherInfo}</div>
      </div>
    );
  }

  const dayOfWeeks = [];
  const curDayOfWeek = new Date().getDay();
  for (let i = 0; i < 7; ++i) {
    dayOfWeeks.push((i + curDayOfWeek) % 7);
  }

  return (
    <div>
      <details className="ts-accordion">
        <summary>{openingStatus(props.openingTime.days)}</summary>
        <table id="opening-time-accordion-table" className="ts-table is-dense">
          <tbody>
            {dayOfWeeks.map((dayOfWeek: number, idx: number) => {
              const dayTimes = props.openingTime.days
                ? props.openingTime.days[dayOfWeek]
                : [];

              return (
                <tr key={idx} className={{ 0: "ts-text is-bold" }[idx]}>
                  <td>{dayOfWeekToText(dayOfWeek)}</td>
                  <td>
                    {dayTimes.map((dayTime: string, idx: number) => {
                      return <div key={idx}>{dayTime}</div>;
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </details>
      <div>{otherInfo}</div>
    </div>
  );
}

export default OpeningTimeAccordion;

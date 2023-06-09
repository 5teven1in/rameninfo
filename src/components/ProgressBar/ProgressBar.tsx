import React, { CSSProperties } from "react";
import { CheckBox } from "../../common/types";

type Props = {
  checkList: Array<CheckBox>;
};

interface CSSPropertiesWithVars extends CSSProperties {
  "--value": string;
}

const ProgressBar = (props: Props) => {
  const checked = props.checkList.filter(
      (checkBox: CheckBox) => checkBox.value
    ).length,
    len = props.checkList.length;
  const progress_ratio = len === 0 ? 0 : Math.round((checked / len) * 100);
  return (
    <div className="ts-progress is-processing">
      <div
        id="progress-bar"
        style={
          {
            "--value": progress_ratio,
          } as CSSProperties as CSSPropertiesWithVars
        }
        className="bar"
      >
        <div className="text">{progress_ratio}%</div>
      </div>
    </div>
  );
};

export default ProgressBar;

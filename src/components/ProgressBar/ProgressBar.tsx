import React, { CSSProperties } from "react";

type Props = {
  checked: number;
  total: number;
};

interface CSSPropertiesWithVars extends CSSProperties {
  "--value": string;
}

const ProgressBar = (props: Props) => {
  const progress_ratio = Math.round((props.checked / props.total) * 100);
  return (
    <div className="ts-progress is-processing">
      <div
        id="progress-bar"
        style={
          { "--value": progress_ratio } as unknown as CSSPropertiesWithVars
        }
        className="bar"
      >
        <div className="text">{progress_ratio}%</div>
      </div>
    </div>
  );
};

export default ProgressBar;

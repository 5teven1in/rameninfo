import React from 'react';
import './ProgressBar.css';

const ProgressBar = () => {
  return (
    <div className="ts-progress is-processing">
      <div id="progress-bar" className="bar">
        <div className="text">0%</div>
      </div>
    </div>
  );
}

export default ProgressBar;

import React, { useRef, useState } from "react";
import ProgressBar from "./components/ProgressBar";
import ControlPanel from "./components/ControlPanel";
import DataPanel from "./components/DataPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CheckBox, ControlOption } from "./common/types";
import { defaultControlOption } from "./common/constants";
import "./App.css";

function App() {
  const [checkList, setCheckList] = useState(Array<CheckBox>);
  const [controlOption, setControlOption] = useState(defaultControlOption);
  const resetCheckList = useRef(() => {
    return;
  });

  const updateCheckList = (checkList: Array<CheckBox>) => {
    setCheckList(() => checkList);
  };
  const updateControlOption = (controlOption: ControlOption) => {
    setControlOption(() => controlOption);
  };
  const updateResetCheckList = (callback: () => void) => {
    resetCheckList.current = callback;
  };

  return (
    <div>
      <Header />
      <div id="main-blk" className="ts-content is-vertically-padded">
        <ProgressBar checkList={checkList} />
        <ControlPanel
          checkList={checkList}
          updateControlOption={updateControlOption}
          resetCheckList={resetCheckList.current}
        />
        <DataPanel
          controlOption={controlOption}
          updateCheckList={updateCheckList}
          updateResetCheckList={updateResetCheckList}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;

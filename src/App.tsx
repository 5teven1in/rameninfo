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
  const reloadCheckList = useRef(() => {
    return;
  });

  const updateCheckList = (checkList: Array<CheckBox>) => {
    setCheckList(() => checkList);
  };
  const updateControlOption = (controlOption: ControlOption) => {
    setControlOption(() => controlOption);
  };
  const updateReloadCheckList = (callback: () => void) => {
    reloadCheckList.current = callback;
  };

  return (
    <div>
      <Header reloadCheckList={reloadCheckList.current} />
      <div id="main-blk" className="ts-content is-vertically-padded">
        <ProgressBar checkList={checkList} />
        <ControlPanel
          checkList={checkList}
          updateControlOption={updateControlOption}
        />
        <DataPanel
          controlOption={controlOption}
          updateCheckList={updateCheckList}
          updateReloadCheckList={updateReloadCheckList}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;

import React, { useState } from "react";
import ProgressBar from "./components/ProgressBar";
import ControlPanel from "./components/ControlPanel";
import DataPanel from "./components/DataPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CheckBox } from "./common/types";
import "tocas/dist/tocas.min.css";
import "./App.css";

function App() {
  const [checkList, setCheckList] = useState(Array<CheckBox>);
  const [showEatOption, setShowEatOption] = useState("顯示所有");

  const updateCheckList = (checkList: Array<CheckBox>) => {
    setCheckList(() => checkList);
  };
  const getOption = (_showEatOption: string) => {
    setShowEatOption((showEatOption) => _showEatOption);
  };

  return (
    <div>
      <Header />
      <div id="main-blk" className="ts-content is-vertically-padded">
        <ProgressBar checkList={checkList} />
        <ControlPanel checkList={checkList} callback={getOption} />
        <DataPanel
          updateCheckList={updateCheckList}
          showEatOption={showEatOption}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;

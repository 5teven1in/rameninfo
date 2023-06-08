import React, { useEffect, useState } from "react";
import ProgressBar from "./components/ProgressBar";
import ControlPanel from "./components/ControlPanel";
import DataPanel from "./components/DataPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "tocas/dist/tocas.min.css";
import "./App.css";

function App() {
  const [isPageTop, setIsPageTop] = useState(true);
  const [checkedLength, setCheckedLength] = useState(0);
  const [totalLength, setTotalLength] = useState(1);
  const [showEatOption, setShowEatOption] = useState("顯示所有");

  useEffect(() => {
    window.addEventListener("scroll", () =>
      setIsPageTop(window.pageYOffset === 0)
    );
  }, []);

  const goPageTop = () => window.scrollTo(0, 0);
  const getLength = (checked: number, total: number) => {
    setCheckedLength((checkedLength) => checked);
    setTotalLength((totalLength) => total);
  };
  const getOption = (_showEatOption: string) => {
    setShowEatOption((showEatOption) => _showEatOption);
  };

  return (
    <div>
      <Header />
      <div id="main-blk" className="ts-content is-vertically-padded">
        <ProgressBar checked={checkedLength} total={totalLength} />
        <ControlPanel total={totalLength} callback={getOption} />
        <DataPanel callback={getLength} showEatOption={showEatOption} />
      </div>
      <Footer isPageTop={isPageTop} goPageTop={goPageTop} />
    </div>
  );
}

export default App;

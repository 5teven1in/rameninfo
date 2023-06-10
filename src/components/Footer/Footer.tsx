import React, { useEffect, useState } from "react";
import { strGoPageTop } from "../../common/constants";
import "./Footer.css";

function Footer() {
  const [isPageTop, setIsPageTop] = useState(true);

  useEffect(() => {
    window.addEventListener("scroll", () => setIsPageTop(window.scrollY === 0));
  }, []);

  const goPageTop = () => window.scrollTo(0, 0);

  return (
    <div id="go-page-top-btn" className={isPageTop ? "u-hidden" : ""}>
      <button
        onClick={goPageTop}
        className="ts-button is-icon"
        data-tooltip={strGoPageTop}
      >
        <span className="ts-icon is-arrow-up-icon"></span>
      </button>
    </div>
  );
}

export default Footer;

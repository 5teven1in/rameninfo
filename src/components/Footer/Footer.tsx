import React from "react";

type Props = {
  isPageTop: boolean;
  goPageTop: () => void;
};

function Footer(props: Props) {
  return (
    <div id="go-page-top-btn" className={props.isPageTop ? "u-hidden" : ""}>
      <button
        onClick={props.goPageTop}
        className="ts-button is-icon"
        data-tooltip="回頂端"
      >
        <span className="ts-icon is-arrow-up-icon"></span>
      </button>
    </div>
  );
}

export default Footer;

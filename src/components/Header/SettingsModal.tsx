import React from "react";
import {
  strClose,
  strConfirm,
  strErrorFileInvalidFormat,
  strErrorFileNoInput,
  strErrorSystem,
  strRecordDelete,
  strRecordDeleteSuccess,
  strRecordExport,
  strRecordExportSuccess,
  strRecordImport,
  strRecordImportSuccess,
  strResetData,
  strSettings,
} from "../../common/constants";

type Props = {
  reloadCheckList: () => void;
};

const SettingsModal = (props: Props) => {
  const deleteRecord = () => {
    localStorage.removeItem("checkList");
    props.reloadCheckList();
    showNotice(strRecordDeleteSuccess);
  };

  const exportRecord = () => {
    const checkList = window.localStorage.getItem("checkList") || "[]";
    const link = document.createElement("a");

    link.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(checkList)
    );
    const now = new Date();
    const filename = [
      "rameninfo-",
      now.getFullYear(),
      "-",
      now.toLocaleString("en", { month: "2-digit" }),
      "-",
      now.toLocaleString("en", { day: "2-digit" }),
      "_",
      now.toLocaleString("en", { hour: "2-digit", hourCycle: "h23" }),
      "-",
      now.toLocaleString("en", { minute: "2-digit" }),
      "-",
      now.toLocaleString("en", { second: "2-digit" }),
      ".json",
    ].join("");
    link.setAttribute("download", filename);
    link.classList.add("u-hidden");

    const settingsModal = document.querySelector("#settings-modal");
    if (settingsModal === null) {
      showNotice(strErrorSystem, true);
      console.error("#settings-modal is not found");
      return;
    }

    settingsModal.appendChild(link);
    link.click();
    settingsModal.removeChild(link);

    showNotice(strRecordExportSuccess);
  };

  const importRecord = () => {
    const files = (
      document.querySelector("#settings-upload-file") as HTMLInputElement
    )?.files;
    if (files === null || files.length === 0) {
      showNotice(strErrorFileNoInput, true);
      return;
    }

    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      const result = fileReader.result;
      if (typeof result !== "string") {
        console.error("should use readAsText to read");
        return;
      }

      try {
        const checkList = JSON.parse(result);
        if (!Array.isArray(checkList)) {
          throw SyntaxError();
        }

        checkList.forEach((store) => {
          if (typeof store["id"] !== "number") {
            throw SyntaxError();
          }

          if (typeof store["value"] !== "boolean") {
            throw SyntaxError();
          }
        });

        window.localStorage.setItem("checkList", result);
        props.reloadCheckList();
        showNotice(strRecordImportSuccess);
      } catch (e) {
        showNotice(strErrorFileInvalidFormat, true);
      }
    });

    fileReader.readAsText(files[0]);
  };

  const resetModal = () => {
    document
      .querySelector("#settings-modal-notice-content")
      ?.parentElement?.classList.add("u-hidden");
    const uploadFile = document.querySelector(
      "#settings-upload-file"
    ) as HTMLInputElement;
    if (uploadFile !== null) {
      uploadFile.value = "";
    }
  };

  const showNotice = (message: string, isError = false) => {
    const noticeContent = document.querySelector(
      "#settings-modal-notice-content"
    );
    if (noticeContent === null) {
      console.error("#settings-modal-notice-content is not found");
      return;
    }

    noticeContent.innerHTML = message;
    const noticeContentParent = noticeContent.parentElement;
    if (noticeContentParent === null) {
      return;
    }

    noticeContentParent.classList.remove("u-hidden");
    if (isError) {
      noticeContentParent.classList.add("is-negative");
    } else {
      noticeContentParent.classList.remove("is-negative");
    }
  };

  return (
    <div id="settings-modal" className="ts-modal" data-name="settings-modal">
      <div className="content">
        <div className="ts-content">
          <div className="ts-grid is-middle-aligned">
            <div className="column is-fluid">
              <div className="ts-header">{strSettings}</div>
            </div>
            <div className="column">
              <button
                className="ts-close"
                onClick={resetModal}
                data-toggle="settings-modal:is-visible"
              ></button>
            </div>
          </div>
        </div>
        <div className="ts-divider"></div>
        <div className="ts-content">
          <div className="ts-notice u-hidden">
            <div id="settings-modal-notice-content" className="content"></div>
          </div>
          <div className="ts-wrap is-vertical">
            <div className="ts-grid is-middle-aligned">
              <div className="column is-4-wide">{strRecordExport}</div>
              <div className="column is-12-wide">
                <button
                  onClick={exportRecord}
                  className="ts-button is-icon is-outlined"
                >
                  <span className="ts-icon is-file-export-icon"></span>
                </button>
              </div>
            </div>
            <div className="ts-grid is-middle-aligned">
              <div className="column is-4-wide">{strRecordImport}</div>
              <div className="column is-12-wide">
                <div id="record-import" className="ts-file">
                  <input id="settings-upload-file" type="file" />
                  <button
                    onClick={importRecord}
                    className="ts-button is-icon is-outlined"
                  >
                    <span className="ts-icon is-file-import-icon"></span>
                  </button>
                </div>
              </div>
            </div>
            <div className="ts-grid is-middle-aligned">
              <div className="column is-4-wide">{strRecordDelete}</div>
              <div className="column is-12-wide">
                <button
                  className="ts-button is-icon is-negative is-outlined"
                  data-toggle="settings-delete-record-modal:is-visible"
                >
                  <span className="ts-icon is-trash-icon"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ts-modal" data-name="settings-delete-record-modal">
        <div className="content">
          <div className="ts-content is-padded">
            <p>{strResetData}</p>
            <p>{strResetData}</p>
            <p>{strResetData}</p>
          </div>
          <div className="ts-divider"></div>
          <div className="ts-content is-tertiary is-horizontally-padded is-end-aligned">
            <button
              className="ts-button is-negative is-outlined"
              data-toggle="settings-delete-record-modal:is-visible"
              onClick={deleteRecord}
            >
              {strConfirm}
            </button>
            <button
              className="ts-button"
              data-toggle="settings-delete-record-modal:is-visible"
            >
              {strClose}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

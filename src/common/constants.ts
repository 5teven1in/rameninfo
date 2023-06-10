import { ControlOption, Eaten, Opening } from "./types";

export const defaultControlOption: ControlOption = {
  search: "",
  opening: Opening.Default,
  eaten: Eaten.Default,
  reset: false,
};

export const openingOption = [
  { value: Opening.Default, text: Opening.Default },
  { value: Opening.Today, text: Opening.Today },
  { value: Opening.Now, text: Opening.Now },
];

export const eatenOption = [
  { value: Eaten.Default, text: Eaten.Default },
  { value: Eaten.Yes, text: Eaten.Yes },
  { value: Eaten.No, text: Eaten.No },
];

export const strTitle = "拉麵資訊.台灣";
export const strGoPageTop = "回頂端";
export const strSearchPlaceholder = "豚骨 / 雞白 / 沾麵 / 名店 / ...";
export const strSearch = "搜尋";
export const strLucky = "好手氣";
export const strResetData = "你確定要清除所有資料嗎？";
export const strConfirm = "確定";
export const strClose = "關閉";
export const strOpening = "營業時間";
export const strName = "名稱";
export const strReservation = "預約";
export const strWaiting = "排隊登記";
export const strTags = "標籤";

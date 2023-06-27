import { ControlOption, Eaten, Opening } from "./types";

export const defaultControlOption: ControlOption = {
  search: "",
  opening: Opening.Default,
  eaten: Eaten.Default,
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

export const ramenInfoItemPrefix = "r";

export const strClose = "關閉";
export const strConfirm = "確定";
export const strEmptyResult = "無資料";
export const strGoPageTop = "回頂端";
export const strLucky = "好手氣";
export const strName = "名稱";
export const strOpening = "營業時間";
export const strOtherInfo = "其它資訊";
export const strReservation = "預約";
export const strResetData = "你確定要清除所有資料嗎？";
export const strSearch = "搜尋";
export const strSearchPlaceholder = "豚骨 / 雞白 / 沾麵 / 名店 / ...";
export const strTags = "標籤";
export const strTitle = "拉麵資訊.台灣";
export const strWaiting = "排隊登記";

export const strOpeningTimeRest = "休息";

export const strStoreClosed = "已打烊";
export const strStoreClosedTime = "結束營業時間";
export const strStoreNextOpenTime = "下次營業時間";
export const strStoreOpen = "營業中";
export const strStoreOpen24Hours = "24 小時營業";
export const strStoreStartToOpenTime = "開始營業時間";

export const strColon = "：";
export const strDash = "–";
export const strDotOperator = "⋅";

export enum Opening {
  Default = "不限時間",
  Today = "今日營業",
  Now = "現在營業",
}

export enum Eaten {
  Default = "顯示所有",
  Yes = "已經吃過",
  No = "還沒吃過",
}

export type CheckBox = {
  id: number;
  value: boolean;
  isHidden: boolean;
};

export type RamenStore = {
  name: string;
  reservation: string;
  waiting: string;
  tags: string;
};

export type ControlOption = {
  search: string;
  opening: Opening;
  eaten: Eaten;
};

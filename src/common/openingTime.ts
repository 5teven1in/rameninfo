import { strDash, strOpeningTimeRest } from "./constants";
import { dayOfWeekToText } from "./datetime";

type OpeningTimeRange = {
  beg: string;
  end: string;
};

type OpeningTimeRangesDaysOfWeek = Array<Array<OpeningTimeRange>>;

export function getOpeningStatus(daysTimes: Array<Array<string>>): {
  isOpen: boolean;
  isOpen24Hour: boolean;
  closedTime: string;
  nextOpenTime: string;
  hasOpeningTime: boolean;
} {
  const now = new Date();
  const daysTimesFormatted = formatOpeningDaysTimes(daysTimes);

  return {
    isOpen: isOpenAtTime(daysTimesFormatted, now),
    isOpen24Hour: isOpen24HoursAtTime(daysTimesFormatted, now),
    closedTime: getClosedTime(daysTimesFormatted, now),
    nextOpenTime: getNextOpenTime(daysTimesFormatted, now),
    hasOpeningTime: hasOpeningTimeOnDayOfWeek(daysTimesFormatted, now.getDay()),
  };
}

function formatOpeningDaysTimes(
  daysTimes: Array<Array<string>>
): OpeningTimeRangesDaysOfWeek {
  return daysTimes.map((dayTimes: Array<string>) => {
    return dayTimes
      .filter((timeRange: string) => {
        return timeRange !== strOpeningTimeRest;
      })
      .map((timeRange: string) => {
        const [beg, end] = timeRange.split(strDash);
        return {
          beg: beg,
          end: end,
        };
      });
  });
}

function getClosedTime(
  openingTimeRangesDaysOfWeek: OpeningTimeRangesDaysOfWeek,
  time: Date
): string {
  const dayOfWeek = time.getDay();
  const timeStr = getTimeStr(time);

  for (const timeRange of openingTimeRangesDaysOfWeek[dayOfWeek]) {
    if (isInTimeRange(timeStr, timeRange)) {
      return timeRange.end;
    }
  }

  return "";
}

function getNextOpenTime(
  openingTimeRangesDaysOfWeek: OpeningTimeRangesDaysOfWeek,
  time: Date
): string {
  const dayOfWeek = time.getDay();
  const timeStr = getTimeStr(time);

  for (const timeRange of openingTimeRangesDaysOfWeek[dayOfWeek]) {
    if (timeStr < timeRange.beg) {
      return timeRange.beg;
    }
  }

  for (let i = 1; i <= 7; ++i) {
    const anotherDayOfWeek = (dayOfWeek + i) % 7;

    const timeRanges = openingTimeRangesDaysOfWeek[anotherDayOfWeek];
    if (timeRanges.length > 0) {
      return dayOfWeekToText(anotherDayOfWeek, false) + timeRanges[0].beg;
    }
  }

  return "";
}

function getTimeStr(time: Date): string {
  return time.toLocaleString("default", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

function hasOpeningTimeOnDayOfWeek(
  openingTimeRangesDaysOfWeek: OpeningTimeRangesDaysOfWeek,
  dayOfWeek: number
): boolean {
  return openingTimeRangesDaysOfWeek[dayOfWeek].length > 0;
}

function isInTimeRange(time: string, timeRange: OpeningTimeRange): boolean {
  if (timeRange.beg > timeRange.end) {
    return (
      (timeRange.beg <= time && time <= "24:00") ||
      ("00:00" <= time && time <= timeRange.end)
    );
  }

  return timeRange.beg <= time && time <= timeRange.end;
}

function isOpen24HoursAtTime(
  openingTimeRangesDaysOfWeek: OpeningTimeRangesDaysOfWeek,
  time: Date
): boolean {
  const dayOfWeek = time.getDay();

  for (const timeRange of openingTimeRangesDaysOfWeek[dayOfWeek]) {
    if (timeRange.beg === "00:00" && timeRange.end === "24:00") {
      return true;
    }
  }

  return false;
}

function isOpenAtTime(
  openingTimeRangesDaysOfWeek: OpeningTimeRangesDaysOfWeek,
  time: Date
): boolean {
  const dayOfWeek = time.getDay();
  const timeStr = getTimeStr(time);

  for (const timeRange of openingTimeRangesDaysOfWeek[dayOfWeek]) {
    if (isInTimeRange(timeStr, timeRange)) {
      return true;
    }
  }

  return false;
}

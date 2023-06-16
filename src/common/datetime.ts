export function dayOfWeekToText(dayOfWeek: number, isLong = true): string {
  const baseSunday = new Date(1970, 1, 1);

  baseSunday.setDate(baseSunday.getDate() + dayOfWeek);

  return baseSunday.toLocaleString("default", {
    weekday: isLong ? "long" : "short",
  });
}

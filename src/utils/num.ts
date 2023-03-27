export enum NumAbbrLocale {
  Zh = "zh-CN",
  En = "en-Us"
}
type Unit = [number, string];
const Units: { [local: string]: Unit[] } = {
  [NumAbbrLocale.Zh]: [[1e6, "M"]],
  [NumAbbrLocale.En]: [[1e9, "B"], [1e6, "M"]]
};

export const abbrNum = (num, locale = NumAbbrLocale.Zh, floor = 0.01) =>
  (Units[locale].find(
    (unit, i, array) => num / unit[0] > floor || i === array.length - 1
  ) as Unit)
    .map((n, i) =>
      i === 0
        ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(
            num / Number(n)
          )
        : n
    )
    .join("");

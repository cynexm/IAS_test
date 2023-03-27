import storage, { Storage } from "../core/Storage";

export const getTimestamp = (datetime: string) => {
  return new Date(datetime).getTime();
};

export const getYyyyMmDd = (now: number = Date.now()) => {
  const zerofill = (n: number) => {
    return n < 10 ? `0${n}` : n;
  };

  const date: Date = new Date(now);
  const yyyy = date.getFullYear();
  const MM = date.getMonth() + 1;
  const DD = date.getDate();
  return `${yyyy}-${zerofill(MM)}-${zerofill(DD)}`;
};

export const showHandle = (key: "LoginShowFlag" | "RefreshShowFlag") => {
  let temp: any = storage.get(Storage.Keys[key]);
  if (temp) {
    temp = JSON.parse(temp);
    const now = getYyyyMmDd();
    temp.showDialog = temp.lastTime !== now;
    temp.lastTime = now;
    storage.set(Storage.Keys[key], temp);
  } else {
    storage.set(Storage.Keys[key], {
      lastTime: getYyyyMmDd(),
      showDialog: true
    });
  }
};

export const isShow = (key: "LoginShowFlag" | "RefreshShowFlag"): boolean => {
  let temp: any = storage.get(Storage.Keys[key]);
  if (temp) {
    temp = JSON.parse(temp);
    return temp.showDialog;
  } else {
    return false;
  }
};

export const modifyShow = (
  key: "LoginShowFlag" | "RefreshShowFlag",
  val: boolean
) => {
  let temp: any = storage.get(Storage.Keys[key]);
  if (temp) {
    temp = JSON.parse(temp);
    temp.showDialog = val;
    storage.set(Storage.Keys[key], temp);
  }
};

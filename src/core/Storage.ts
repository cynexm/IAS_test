type Key = string | number;
export class Storage {
  static Keys = {
    AuthToken: "#$ISA_AUTH_TOKEN",
    AuthUser: "#$ISA_AUTH_USER",
    AuthPriv: "#$ISA_AUTH_PRIVILEDGES",
    LoginShowFlag: "#$ISA_LOGIN_SHOW_FLAG",
    RefreshShowFlag: "#$ISA_REFRESH_SHOW_FLAG",
    ReduceStockList: "#$ISA_REDUCE_STOCK_LIST"
  };
  set(key: Key, value: any) {
    localStorage.setItem(
      key.toString(),
      ["string", "number"].includes(typeof value)
        ? value
        : JSON.stringify(value)
    );
  }
  getJson<V = any>(key: Key) {
    let value = localStorage.getItem(key.toString());
    if (value) {
      return JSON.parse(value) as V;
    }
    return (value as unknown) as V;
  }
  get(key: Key) {
    return localStorage.getItem(key.toString());
  }
  remove(key: Key) {
    return localStorage.removeItem(key.toString());
  }
}

export const storage = new Storage();
export default storage;

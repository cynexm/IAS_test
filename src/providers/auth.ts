import {
  AUTH_CHECK,
  AUTH_ERROR,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_GET_PERMISSIONS
} from "react-admin";
import storage, { Storage } from "../core/Storage";
import { login } from "./api";
import { Isa_Role } from "../environment";
import {showHandle} from "../utils/common-utils";

const authProvider = async (type, params) => {
  // called when the user attempts to log in
  if (type === AUTH_LOGIN) {
    const { username, password } = params;

    return login(username, password).then(auth => {

      console.info("Login success: ", params);
      showHandle('LoginShowFlag')

      storage.set(Storage.Keys.AuthToken, auth.token);
      storage.set(Storage.Keys.AuthUser, username);
      storage.set(Storage.Keys.AuthPriv, auth.is_staff ? Isa_Role.Apm : Isa_Role.Vpm);
    });
  }
  if (type === AUTH_GET_PERMISSIONS) {
    const role = storage.get(Storage.Keys.AuthPriv);
    return role ? Promise.resolve(role) : Promise.reject();
  }
  // called when the user clicks on the logout button
  if (type === AUTH_LOGOUT) {
    storage.remove(Storage.Keys.AuthUser);
    storage.remove(Storage.Keys.AuthToken);
    storage.remove(Storage.Keys.AuthPriv);

    return Promise.resolve();
  }
  // called when the API returns an error
  if (type === AUTH_ERROR) {
    const { status } = params;
    if (status === 401 || status === 403) {
      storage.remove(Storage.Keys.AuthUser);
      storage.remove(Storage.Keys.AuthToken);
      storage.remove(Storage.Keys.AuthPriv);
      return Promise.reject();
    }
    return Promise.resolve();
  }
  // called when the user navigates to a new location
  if (type === AUTH_CHECK) {
    return storage.get(Storage.Keys.AuthToken)
      ? Promise.resolve()
      : Promise.reject();
  }
  return Promise.reject("Unknown method");
};

export default authProvider;

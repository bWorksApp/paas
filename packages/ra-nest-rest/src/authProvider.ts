import { stringify } from "query-string";
import { fetchUtils, AuthProvider } from "ra-core";
import jwt_decode from "jwt-decode";
import { localStorageManager } from "./utils";

/**
 * Check access token for every query to backend
 *
 * Rredirect to login if token is invalid
 *
 * Auto renew access token
 **/

const authProvider = (loginUrl, renewTokenUrl, logoutUrl): AuthProvider => ({
  login: ({ username, password }) => {
    return fetchUtils
      .fetchJson(loginUrl, {
        method: "POST",
        body: JSON.stringify({ username: username, password: password }),
      })
      .then(({ json }) => {
        localStorageManager.setItems(
          json.username,
          json.accessToken,
          json.refreshToken,
          json.fullName
        );
      })
      .catch((err) => err);
  },
  logout: async () => {
    const accessToken = localStorageManager.getItem("accessToken");
    localStorageManager.removeItems();

    let decodedAccessToken, isExpiredAccessToken;
    try {
      decodedAccessToken = jwt_decode(accessToken) as any;
      isExpiredAccessToken = Date.now() >= decodedAccessToken.exp * 1000;
    } catch (err) {
      return Promise.resolve();
    }

    if (!accessToken || isExpiredAccessToken) {
      return Promise.resolve();
    }

    const options = {
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
      }),
    };

    try {
      //remove user refreshToken
      const data = await fetchUtils.fetchJson(logoutUrl, options);
    } catch (error) {
      console.log(error);
    }
    return Promise.resolve();
  },
  checkError: (error) => {
    //access token expire after standBy then require login
    if (error.status === 401 || error.status === 403) {
      localStorageManager.removeItems();
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: async () => {
    const { accessToken, refreshToken } = await localStorageManager.getItems();
    if (!accessToken || !refreshToken) {
      return Promise.reject();
    }

    //before expire 1 mins then refresh token during fetch activities
    const decodedAccessToken = jwt_decode(accessToken) as any;
    const isExpiredAccessToken =
      Date.now() >= decodedAccessToken.exp * 1000 - 600000;

    const decodedJwtRefresh = jwt_decode(refreshToken) as any;
    const isExpiredJwtRefresh =
      Date.now() >= decodedJwtRefresh.exp * 1000 - 60000;

    if (isExpiredJwtRefresh) {
      return Promise.reject();
    }

    if (isExpiredAccessToken) {
      const options = {
        headers: new Headers({
          Authorization: `Bearer ${refreshToken}`,
        }),
      };

      try {
        const data = await fetchUtils.fetchJson(renewTokenUrl, options);

        if (!data) return Promise.reject();

        localStorageManager.setItem("accessToken", data.json.accessToken);
        localStorageManager.setItem("refreshToken", data.json.refreshToken);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject();
      }
    }
  },
  getPermissions: () => Promise.reject("Unknown method"),
  getIdentity: () =>
    Promise.resolve({
      id: "user",
      fullName: localStorageManager.getItem("fullName"),
    }),
});

export default authProvider;

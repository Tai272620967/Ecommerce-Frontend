import CookiesStorage from "./cookie";
import { COOKIE_KEY } from "@/utils/constant/constant";

const authenticated = () => {
  const accessToken = CookiesStorage.get(COOKIE_KEY.ACCESS_TOKEN);
  return accessToken !== undefined;
};

const setAccessToken = (token: string, expired?: string) => {
  CookiesStorage.set(COOKIE_KEY.ACCESS_TOKEN, token, expired ? new Date(expired) : undefined);
};

const getAccessToken = () => {
  return CookiesStorage.get(COOKIE_KEY.ACCESS_TOKEN);
};

const setRefreshToken = (token: string, expired?: string) => {
  CookiesStorage.set(COOKIE_KEY.REFRESH_TOKEN, token, expired ? new Date(expired) : undefined);
};

const getRefreshToken = () => {
  return CookiesStorage.get(COOKIE_KEY.REFRESH_TOKEN);
};

const setIsLoggedIn = () => {
  CookiesStorage.set(COOKIE_KEY.IS_LOGGED_IN, 'true');
};

const getIsLoggedIn = () => {
  return CookiesStorage.get(COOKIE_KEY.IS_LOGGED_IN);
};

const clearAuthCookieData = () => {
  CookiesStorage.clearCookieData(COOKIE_KEY.ACCESS_TOKEN);
  CookiesStorage.clearCookieData(COOKIE_KEY.REFRESH_TOKEN);
  CookiesStorage.clearCookieData(COOKIE_KEY.IS_LOGGED_IN);
};

const authStorage = {
  authenticated,
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearAuthCookieData,
  setIsLoggedIn,
  getIsLoggedIn,
};

export default authStorage;

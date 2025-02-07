import { addDays } from 'date-fns';
import Cookies from 'universal-cookie';

import { getCurrentHostname } from "@/utils/index";

const cookiesInstance = new Cookies();

const defaultExpires = (days: number): Date => {
  const currentTime = new Date();

  return addDays(currentTime, days);
};

const set = (key: string, value: string, expires: Date = defaultExpires(1)) => {
  const hostname = getCurrentHostname();
  cookiesInstance.set(key, value, {
    domain: hostname,
    path: '/',
    expires,
  });
};

const get = (key: string) => {
  return cookiesInstance.get(key);
};

const remove = (key: string) => {
  return cookiesInstance.remove(key);
};

const clearCookieData = (key: string) => {
  const hostname = getCurrentHostname();
  cookiesInstance.remove(key, { domain: hostname, path: '/' });
};

const Cookie = {
  set,
  get,
  remove,
  clearCookieData,
};

export default Cookie;

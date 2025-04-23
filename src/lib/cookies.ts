import Cookies from 'js-cookie';

export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'access-token',
  USER_ID: 'user_id',
  USER_ROLE: 'user_role',
} as const;

export const getAuthCookies = () => {
  return {
    accessToken: Cookies.get(COOKIE_KEYS.ACCESS_TOKEN),
    userId: Cookies.get(COOKIE_KEYS.USER_ID),
    userRole: Cookies.get(COOKIE_KEYS.USER_ROLE),
  };
};

export const setAuthCookies = ({
  userId,
  userRole,
  token,
}: {
  userId: string;
  userRole: string;
  token: string;
}) => {
  Cookies.set(COOKIE_KEYS.USER_ID, userId, { expires: 30 });
  Cookies.set(COOKIE_KEYS.USER_ROLE, userRole, { expires: 30 });
  Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, token, { expires: 30 });
};

export const clearAuthCookies = () => {
  Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN);
  Cookies.remove(COOKIE_KEYS.USER_ID);
  Cookies.remove(COOKIE_KEYS.USER_ROLE);
};

import { parseCookies, setCookie, destroyCookie } from 'nookies';

export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'access-token',
  USER_ID: 'id',
  USER_ROLE: 'role_id',
} as const;

export const getAuthCookies = () => {
  const cookies = parseCookies();
  return {
    accessToken: cookies[COOKIE_KEYS.ACCESS_TOKEN],
    userId: cookies[COOKIE_KEYS.USER_ID],
    userRole: cookies[COOKIE_KEYS.USER_ROLE],
  };
};

export const setAuthCookies = ({ userId, userRole }: { userId: string; userRole: string }) => {
  setCookie(null, COOKIE_KEYS.USER_ID, userId, {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
  setCookie(null, COOKIE_KEYS.USER_ROLE, userRole, {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
};

export const clearAuthCookies = () => {
  destroyCookie(null, COOKIE_KEYS.ACCESS_TOKEN, { path: '/' });
  destroyCookie(null, COOKIE_KEYS.USER_ID, { path: '/' });
  destroyCookie(null, COOKIE_KEYS.USER_ROLE, { path: '/' });
}; 
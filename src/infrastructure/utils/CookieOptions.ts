import { CookieOptions } from "express";

export const getCookieOptions = (maxAge?: number): CookieOptions => {
    const isProduction = process.env.NODE_ENV?.toLowerCase() === 'production';

    const options: CookieOptions = {
        httpOnly: true,
        path: '/',
        maxAge: maxAge,
    };

    if (isProduction && process.env.COOKIE_DOMAIN) {
        options.domain = process.env.COOKIE_DOMAIN;
        options.secure = true;
        options.sameSite = 'none';
    } else {
  
        options.secure = false;
        options.sameSite = 'lax';
    }

    return options;
};

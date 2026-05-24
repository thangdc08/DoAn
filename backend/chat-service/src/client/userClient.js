import httpClient, { setAuthToken } from './axios.js';
import { getBearerToken } from '../middleware/authMiddleWare.js';
import AppError from '../common/Exception/app-error.js';

const unwrap = (payload) => payload?.data ?? payload?.result ?? payload;

const tryGet = async (paths) => {
    let lastError = null;
    for (const path of paths) {
        try {
            return await httpClient.get(path);
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError || new AppError("USER_SERVICE_UNAVAILABLE", 503);
};

export const getProfileById = async (id, req) => {
    const wsToken = req.token;
    if (wsToken) {
        setAuthToken(wsToken);
    } else {
        const token = getBearerToken(req);
        setAuthToken(token);
    }
    const payload = await tryGet([
        `/identity/api/v1/users/${id}`,
        `/api/v1/users/${id}`,
        `/user/${id}`,
    ]);
    return unwrap(payload);
}

export const getProfileByAccId = async (id, req, wsToken) => {
    let token;
    if (wsToken) {
        token = wsToken;
    } else {
        token = getBearerToken(req);
    }
    setAuthToken(token);
    const payload = await tryGet([
        `/identity/api/v1/users/username/${encodeURIComponent(id)}`,
        `/api/v1/users/username/${encodeURIComponent(id)}`,
        `/user/acc/${encodeURIComponent(id)}`,
    ]);
    return unwrap(payload);
}

export const getUserLogin = (req, token = null) => {
    const { sub } = req.user;
    if (!sub) {
        throw new AppError("USER_NOT_FOUND", 400);
    }

    return getProfileByAccId(sub, req, token);
};

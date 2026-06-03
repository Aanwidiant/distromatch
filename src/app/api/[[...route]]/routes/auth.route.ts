import { Hono } from 'hono';
import {
    changePassword,
    deleteAccount,
    forgotPassword,
    loginByGoogle,
    loginBySystem,
    logout,
    refreshToken,
    register,
    requestChangeEmail,
    resendVerification,
    resetPassword,
    verifyChangeEmail,
    verifyEmail,
} from '../handlers';
import { protect, rateLimit } from '../middlewares';

const auth = new Hono();

auth.post(
    '/register',
    rateLimit({
        keyPrefix: 'register',
        max: 3,
        windowSec: 60 * 60,
    }),
    register
);

auth.post(
    '/login',
    rateLimit({
        keyPrefix: 'login',
        max: 5,
        windowSec: 60 * 5,
    }),
    loginBySystem
);
auth.post(
    '/login/google',
    rateLimit({
        keyPrefix: 'login-google',
        max: 10,
        windowSec: 60 * 10,
    }),
    loginByGoogle
);

auth.post('/email/resend-verification', resendVerification);
auth.get('/email/verify', verifyEmail);

auth.post(
    '/password/forgot',
    rateLimit({
        keyPrefix: 'forgot-password',
        max: 3,
        windowSec: 60 * 60,
    }),
    forgotPassword
);
auth.post('/password/reset', resetPassword);
auth.post('/password/change', protect, changePassword);

auth.post('/email/change', protect, requestChangeEmail);
auth.get('/email/change/verify', verifyChangeEmail);

auth.post('/token/refresh', refreshToken);
auth.delete('/logout', protect, logout);

auth.delete('/account', protect, deleteAccount);

export default auth;

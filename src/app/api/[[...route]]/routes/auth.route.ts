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
import { protect } from '../middlewares';

const auth = new Hono();

auth.post('/register', register);
auth.post('/login', loginBySystem);
auth.post('/login/google', loginByGoogle);

auth.post('/email/resend-verification', resendVerification);
auth.get('/email/verify', verifyEmail);

auth.post('/password/forgot', forgotPassword);
auth.post('/password/reset', resetPassword);
auth.post('/password/change', protect, changePassword);

auth.post('/email/change', protect, requestChangeEmail);
auth.get('/email/change/verify', verifyChangeEmail);

auth.post('/token/refresh', refreshToken);
auth.delete('/logout', protect, logout);

auth.delete('/account', protect, deleteAccount);

export default auth;

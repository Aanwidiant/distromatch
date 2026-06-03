import { Hono } from 'hono';
import { getDashboardData, sendContactMessage } from '../handlers';
import { admin, protect, rateLimit } from '../middlewares';

const general = new Hono();

general.get('/dashboard', protect, admin, getDashboardData);
general.post(
    '/message',
    rateLimit({
        keyPrefix: 'contact',
        max: 5,
        windowSec: 60 * 10,
    }),
    sendContactMessage
);

export default general;

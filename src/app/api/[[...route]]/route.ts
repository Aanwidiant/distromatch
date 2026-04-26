import { Hono } from 'hono';
import { auth, distros, system, users } from './routes';

const app = new Hono().basePath('/api');

app.get('/', (c) => {
    return c.json({ message: 'Welcome to Distromatch API' });
});

app.get('/healthcheck', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.route('/users', users);
app.route('/auth', auth);
app.route('/distros', distros);
app.route('/system', system);

export async function GET(request: Request) {
    return app.fetch(request);
}

export async function POST(request: Request) {
    return app.fetch(request);
}

export async function PATCH(request: Request) {
    return app.fetch(request);
}

export async function DELETE(request: Request) {
    return app.fetch(request);
}

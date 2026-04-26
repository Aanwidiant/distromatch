import { Hono } from 'hono';
import { createDistro, deleteDistro, getDistroBySlug, getDistros, updateDistro } from '../handlers';
import { admin, protect } from '../middlewares';

const distros = new Hono();

distros.post('/', protect, admin, createDistro);
distros.get('/list', getDistros);
distros.get('/:slug', getDistroBySlug);
distros.patch('/:id', protect, admin, updateDistro);
distros.delete('/:id', protect, admin, deleteDistro);

export default distros;

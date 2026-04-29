import { Hono } from 'hono';
import {
    changeDistroLogo,
    createDistro,
    createDistrosBulk,
    deleteDistro,
    getDistroBySlug,
    getDistros,
    removeDistroLogo,
    updateDistro,
} from '../handlers';
import { admin, protect } from '../middlewares';

const distros = new Hono();

distros.post('/', protect, admin, createDistro);
distros.post('/bulk', protect, admin, createDistrosBulk);
distros.get('/list', getDistros);
distros.get('/:slug', getDistroBySlug);
distros.patch('/:id', protect, admin, updateDistro);
distros.delete('/:id', protect, admin, deleteDistro);
distros.post('/logo/:id', protect, admin, changeDistroLogo);
distros.delete('/logo/:id', protect, admin, removeDistroLogo);

export default distros;

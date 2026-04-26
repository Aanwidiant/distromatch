import { Hono } from 'hono';
import {
    createSystemSetting,
    deleteSystemSetting,
    getSystemSettingById,
    getSystemSettings,
    updateSystemSetting,
} from '../handlers';
import { admin, protect } from '../middlewares';

const system = new Hono();

system.post('/', protect, admin, createSystemSetting);
system.get('/list', protect, admin, getSystemSettings);
system.get('/:id', protect, admin, getSystemSettingById);
system.patch('/:id', protect, admin, updateSystemSetting);
system.delete('/:id', protect, admin, deleteSystemSetting);

export default system;

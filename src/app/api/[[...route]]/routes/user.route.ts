import { Hono } from 'hono';
import {
    adminUpdateUser,
    changeProfilePhoto,
    createUserByAdmin,
    getMe,
    getUsers,
    removeProfilePhoto,
    updateProfile,
} from '../handlers';
import { admin, protect } from '../middlewares';

const users = new Hono();

users.get('/', protect, getMe);
users.patch('/', protect, updateProfile);
users.put('/', protect, changeProfilePhoto);
users.delete('/', protect, removeProfilePhoto);

users.get('/list', protect, admin, getUsers);
users.post('/', protect, admin, createUserByAdmin);
users.patch('/:id', protect, admin, adminUpdateUser);

export default users;

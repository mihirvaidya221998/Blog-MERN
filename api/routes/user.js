import express from 'express';

import {test, updateUser, deleteUser, signout, getUsers} from '../controllers/user.js';
import { verifyToken } from '../utils/verifyUtils.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
//Get all the users and show it to an Admin
router.get('/get-users', verifyToken, getUsers);

export default router;
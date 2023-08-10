import express from "express";
import { register, login, refreshToken, checkEmail } from '../controllers/AuthController.js';

var router = express.Router();

router.post('/register', register); //auth/register
router.post('/login', login); //auth/login
router.post('/refresh-token', refreshToken); //auth/login
router.post('/check-email', checkEmail);


export default router;

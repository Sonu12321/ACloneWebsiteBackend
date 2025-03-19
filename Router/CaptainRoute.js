import express from 'express'
import { LoginCaptain, RegisterCaptain, ShowUserProfileCaptain } from '../Controller/CaptainController.js'
import authCaptain from '../Middleware/captainmiddleware.js'

const router = express.Router()

router.post('/captainRegister',RegisterCaptain)
router.post('/captainLogin',LoginCaptain)
router.get('/captainProfile',authCaptain,ShowUserProfileCaptain)
export default router
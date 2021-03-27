import { Router } from 'express'
import * as authCtrl from './auth.ctrl'

const auth = new Router({ mergeParams: true })

auth.get('/mailAuth', authCtrl.mailAuth)
auth.post('/login', authCtrl.login)
auth.post('/join', authCtrl.join)
auth.post('/findpass', authCtrl.mailToFindPass)
auth.patch('/findpass', authCtrl.findPass)
auth.post('/snsLogin', authCtrl.snsLogin)

export default auth

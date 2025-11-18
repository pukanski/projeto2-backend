const express = require('express');
const router = express.Router();
const controllerLogin = require('../controllers/controllerLogin');

router.post("/login", controllerLogin.postLogin);
router.post("/esqueciSenha", controllerLogin.postEsqueciSenha);
router.post("/resetarSenha", controllerLogin.postResetarSenha);

module.exports = router;
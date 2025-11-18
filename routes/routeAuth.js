const express = require('express');
const router = express.Router();
const controllerLogin = require('../controllers/controllerLogin');

// login
router.post("/login", controllerLogin.postLogin);

// esqueci senha
router.post("/esqueciSenha", controllerLogin.postEsqueciSenha);

// reset senha
router.post("/resetarSenha", controllerLogin.postResetarSenha);

module.exports = router;
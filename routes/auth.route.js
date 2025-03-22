const express = require('express');
const { signUp, signIn, signInWithGoogle, signOut } = require('../controllers/auth.controllers');
const router= express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/google', signInWithGoogle);
router.get('/sign-out', signOut);



module.exports = router;
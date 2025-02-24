const router = require('express').Router();
const {signupValidation, loginValidation} = require('../middlewares/authValidation');
const authController = require('../controllers/authControllers');
const ensureUserAuthenticated = require('../middlewares/userAuthentication');
const User = require('../models/User')

router.post('/signup', signupValidation, authController.signup)
router.post('/login', loginValidation, authController.login);
router.post('/verifyotp', authController.verifyOtp);
router.post('/resetpasswordotp', authController.resetPasswordOtp);
router.post('/resetpassword', authController.resetPassword);
router.put('/add-to-favourites', ensureUserAuthenticated, authController.addFavourites);
router.delete('/remove-favourites',ensureUserAuthenticated , authController.removeFavourites);
router.get('/favourites/:userid', authController.showFavourites);
router.delete('/remove/user', authController.removeUser);
router.put('/block/user', authController.blockUser);
router.put('/unblock/user', authController.unblockUser);

router.get('/admin/users', ensureUserAuthenticated, async(req, res) => {
    try{
        const users = await User.find();
        res.status(200).json({users});
    }
    catch(error){
        res.status(401).json({error:'No user available'})
    }
})

router.get('/admin-details/:adminid', ensureUserAuthenticated, async(req, res) => {
    
})

module.exports = router;
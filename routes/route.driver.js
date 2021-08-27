const router = require('express').Router();
const {
    GET_ALL_USER, 
    FIND_ONE_USER, 
    CREATE_NEW_USER, 
    LOGIN_USER,
    UPDATE_USER_DATA,
    VALIDATE_ACCOUNT,
    RESEND_OTP,
    FIND_USER_BY_EMAIL,
    RESET_PASSWORD,
    UPLOAD_PROFILE
    } = require('../controller/controller.driver');

const VERIFY = require('../middlewares/authMiddleware');
const HANDLE_UPLOAD = require('../utility/utility.uploadProfile');


router.get('/', GET_ALL_USER);
router.get('/:driverId', FIND_ONE_USER);
router.put('/update/:driverId', UPDATE_USER_DATA);
router.post('/register', CREATE_NEW_USER);
router.post('/login', LOGIN_USER);
router.post('/validate/:driverId', VALIDATE_ACCOUNT);
router.put('/resend/:driverId', RESEND_OTP);
router.put('/reset/:driverId', RESET_PASSWORD);
router.post('/forgot-password', FIND_USER_BY_EMAIL);
router.post('/upload', VERIFY, HANDLE_UPLOAD ,UPLOAD_PROFILE)

module.exports = router;
const router = require('express').Router();
const {
    GET_ALL_USER, 
    FIND_ONE_USER, 
    CREATE_NEW_USER, 
    LOGIN_USER,
    UPDATE_USER_DATA,
    VALIDATE_ACCOUNT,
    RESEND_OTP,
    FIND_USER_BY_EMAIL
    } = require('../controller/controller.driver')

//  
router.get('/', GET_ALL_USER);
router.get('/:driverId', FIND_ONE_USER);
router.put('/update/:driverId', UPDATE_USER_DATA);
router.post('/register', CREATE_NEW_USER);
router.post('/login', LOGIN_USER);
router.post('/validate/:driverId', VALIDATE_ACCOUNT);
router.put('/resend/:driverId', RESEND_OTP);
router.post('/forgot-password/:driverId', FIND_USER_BY_EMAIL);

module.exports = router;
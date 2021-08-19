const router = require('express').Router();
const {
    GET_ALL_USER, 
    FIND_ONE_USER, 
    CREATE_NEW_USER, 
    LOGIN_USER,
    UPDATE_USER_DATA,
    VALIDATE_ACCOUNT
    } = require('../controller/controller.driver')

//  
router.get('/', GET_ALL_USER);
router.get('/:driverId', FIND_ONE_USER);
router.put('/update/:driverId', UPDATE_USER_DATA);
router.post('/register', CREATE_NEW_USER);
router.post('/login', LOGIN_USER);
router.post('/validate/:driverId', VALIDATE_ACCOUNT);

module.exports = router;
const router = require('express').Router();
const {
    GET_ALL_USER, 
    FIND_ONE_USER, 
    CREATE_NEW_USER, 
    LOGIN_USER,
    UPDATE_USER_DATA,
    VALIDATE_ACCOUNT
    } = require('../controller/controller.authentication')

//  
router.get('/', GET_ALL_USER);
router.get('/:userId', FIND_ONE_USER);
router.put('/update/:userId', UPDATE_USER_DATA);
router.post('/register', CREATE_NEW_USER);
router.post('/login', LOGIN_USER);
router.post('/validate/:userId', VALIDATE_ACCOUNT);

module.exports = router;
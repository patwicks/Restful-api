const router = require('express').Router();
const {
    GET_ALL_STORE,
    FIND_ONE_STORE,
    CREATE_NEW_STORE,
    LOGIN_STORE,
    UPDATE_STORE_DATA,
    VALIDATE_ACCOUNT,
    RESEND_OTP
    } = require('../controller/controller.store')

//  
router.get('/', GET_ALL_STORE);
router.get('/:storeId', FIND_ONE_STORE);
router.put('/update/:storeId', UPDATE_STORE_DATA);
router.post('/register', CREATE_NEW_STORE);
router.post('/login', LOGIN_STORE);
router.post('/validate/:storeId', VALIDATE_ACCOUNT);
router.post('/resend/:storeId', RESEND_OTP);

module.exports = router;
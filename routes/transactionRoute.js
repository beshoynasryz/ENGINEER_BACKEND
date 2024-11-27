const router = require('express').Router()
const {  getTransaction ,getTransactions ,getIncome} = require('../controllers/transactionController');

const {Auth , AuthorizeRole} = require('../middlewares/AuthMiddleware')


router.get('/transaction/:id' ,Auth, getTransaction);
router.get('/transaction' ,Auth, getTransactions );
router.get('/income' ,Auth, getIncome );

module.exports = router; 

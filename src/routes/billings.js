const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { verifyToken, authorize } = require('../middleware/auth');

router.post('/', verifyToken, authorize(['admin', 'billing']), billingController.createBilling);
router.post('/gerar', verifyToken, authorize(['admin', 'billing']), billingController.generateMonthlyBilling);
router.get('/', verifyToken, billingController.getAllBillings);
router.get('/:id', verifyToken, billingController.getBillingById);
router.get('/cliente/:clienteId', verifyToken, billingController.getBillingsByClient);
router.put('/:id', verifyToken, authorize(['admin', 'billing']), billingController.updateBilling);

module.exports = router;

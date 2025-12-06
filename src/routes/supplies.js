const express = require('express');
const router = express.Router();
const supplyController = require('../controllers/supplyController');
const { verifyToken, authorize } = require('../middleware/auth');

// Peças
router.post('/', verifyToken, authorize(['admin', 'supply']), supplyController.createSupply);
router.get('/', verifyToken, supplyController.getAllSupplies);
router.get('/:id', verifyToken, supplyController.getSupplyById);
router.put('/:id', verifyToken, authorize(['admin', 'supply']), supplyController.updateSupply);
router.delete('/:id', verifyToken, authorize(['admin']), supplyController.deleteSupply);

// Solicitações de peças
router.post('/request', verifyToken, authorize(['technician']), supplyController.requestSupply);
router.get('/orders', verifyToken, supplyController.getSupplyOrders);
router.put('/order/:id', verifyToken, authorize(['admin', 'supply']), supplyController.updateSupplyOrder);

module.exports = router;

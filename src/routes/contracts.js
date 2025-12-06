const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const { verifyToken, authorize } = require('../middleware/auth');

router.post('/', verifyToken, authorize(['admin', 'counter']), contractController.createContract);
router.get('/', verifyToken, contractController.getAllContracts);
router.get('/:id', verifyToken, contractController.getContractById);
router.get('/cliente/:clienteId', verifyToken, contractController.getContractsByClient);
router.put('/:id', verifyToken, authorize(['admin', 'counter']), contractController.updateContract);
router.delete('/:id', verifyToken, authorize(['admin']), contractController.deleteContract);

module.exports = router;

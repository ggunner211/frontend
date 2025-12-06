const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');
const { verifyToken, authorize } = require('../middleware/auth');

router.post('/', verifyToken, authorize(['admin', 'counter']), machineController.createMachine);
router.get('/', verifyToken, machineController.getAllMachines);
router.get('/:id', verifyToken, machineController.getMachineById);
router.get('/cliente/:clienteId', verifyToken, machineController.getMachinesByClient);
router.put('/:id', verifyToken, authorize(['admin', 'counter']), machineController.updateMachine);
router.delete('/:id', verifyToken, authorize(['admin']), machineController.deleteMachine);

module.exports = router;

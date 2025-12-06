const express = require('express');
const router = express.Router();
const counterController = require('../controllers/counterController');
const { verifyToken, authorize } = require('../middleware/auth');

router.post('/', verifyToken, authorize(['admin', 'counter']), counterController.createCounter);
router.get('/', verifyToken, counterController.getAllCounters);
router.get('/maquina/:machineId', verifyToken, counterController.getCountersByMachine);
router.post('/fetch/:machineId', verifyToken, authorize(['admin', 'counter']), counterController.fetchCountersFromAPI);
router.get('/relatorio/:clienteId/:mes', verifyToken, counterController.generateMonthlyReport);

module.exports = router;

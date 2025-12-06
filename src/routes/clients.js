const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { verifyToken, authorize } = require('../middleware/auth');

router.post('/', verifyToken, authorize(['admin', 'counter']), clientController.createClient);
router.get('/', verifyToken, clientController.getAllClients);
router.get('/:id', verifyToken, clientController.getClientById);
router.put('/:id', verifyToken, authorize(['admin', 'counter']), clientController.updateClient);
router.delete('/:id', verifyToken, authorize(['admin']), clientController.deleteClient);

module.exports = router;

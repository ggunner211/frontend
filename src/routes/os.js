const express = require('express');
const router = express.Router();
const osController = require('../controllers/osController');
const { verifyToken, authorize } = require('../middleware/auth');

router.post('/', verifyToken, authorize(['admin', 'support']), osController.createOS);
router.get('/', verifyToken, osController.getAllOS);
router.get('/:id', verifyToken, osController.getOSById);
router.get('/cidade/:city', verifyToken, osController.getPendingOSByCity);
router.put('/:id', verifyToken, authorize(['admin', 'support', 'technician']), osController.updateOS);
router.put('/:id/atribuir', verifyToken, authorize(['admin', 'support']), osController.assignTechnician);
router.put('/:id/finalizar', verifyToken, authorize(['technician']), osController.finishOS);
router.delete('/:id', verifyToken, authorize(['admin', 'support']), osController.deleteOS);

module.exports = router;

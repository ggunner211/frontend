const express = require('express');
const auth = require('../middleware/auth');
const deliveryNoteController = require('../controllers/deliveryNoteController');

const router = express.Router();

// Middlewares
router.use(auth.verifyToken);

// CRUD
router.post('/', auth.authorize(['supply', 'admin']), deliveryNoteController.createDeliveryNote);
router.get('/', auth.authorize(['supply', 'admin']), deliveryNoteController.getAllDeliveryNotes);
router.get('/numero/:numeroNota', auth.authorize(['supply', 'admin']), deliveryNoteController.getDeliveryNoteByNumber);
router.get('/stats', auth.authorize(['supply', 'admin']), deliveryNoteController.getDeliveryNoteStats);
router.get('/:id', auth.authorize(['supply', 'admin']), deliveryNoteController.getDeliveryNoteById);
router.put('/:id', auth.authorize(['supply', 'admin']), deliveryNoteController.updateDeliveryNote);

// Ações
router.put('/:id/enviar', auth.authorize(['supply', 'admin']), deliveryNoteController.sendDeliveryNote);
router.put('/:id/entregar', auth.authorize(['supply', 'admin']), deliveryNoteController.markAsDelivered);
router.put('/:id/confirmar', auth.authorize(['supply', 'admin']), deliveryNoteController.confirmDeliveryNote);
router.put('/:id/cancelar', auth.authorize(['supply', 'admin']), deliveryNoteController.cancelDeliveryNote);
router.delete('/:id', auth.authorize(['supply', 'admin']), deliveryNoteController.deleteDeliveryNote);

module.exports = router;

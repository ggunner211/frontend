const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const User = require('../models/User');

// GET todos os usuários (apenas admin)
router.get('/', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao carregar usuários', error: error.message });
  }
});

// GET usuário por ID (apenas admin)
router.get('/:id', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao carregar usuário', error: error.message });
  }
});

// POST criar novo usuário (apenas admin)
router.post('/', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validações
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Nome, email, senha e função são obrigatórios' });
    }

    // Verificar se email já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Validar role
    const validRoles = ['admin', 'support', 'technician', 'supply', 'counter', 'billing'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Função inválida' });
    }

    // Criar novo usuário
    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
});

// PUT atualizar usuário (apenas admin)
router.put('/:id', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) {
      const validRoles = ['admin', 'support', 'technician', 'supply', 'counter', 'billing'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Função inválida' });
      }
      updateData.role = role;
    }
    if (password) updateData.password = password;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      message: 'Usuário atualizado com sucesso',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
  }
});

// DELETE remover usuário (apenas admin)
router.delete('/:id', verifyToken, authorize('admin'), async (req, res) => {
  try {
    // Não permitir deletar o próprio usuário
    if (req.userId === req.params.id) {
      return res.status(400).json({ message: 'Você não pode deletar sua própria conta' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover usuário', error: error.message });
  }
});

module.exports = router;

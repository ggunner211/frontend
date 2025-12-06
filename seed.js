/**
 * Seed - Dados iniciais para teste
 * Execute: node seed.js (na pasta backend)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Client = require('./src/models/Client');
const Machine = require('./src/models/Machine');
const Contract = require('./src/models/Contract');

async function seed() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aura');
    console.log('✓ Conectado ao MongoDB');

    // Limpar dados existentes
    await User.deleteMany({});
    await Client.deleteMany({});
    await Machine.deleteMany({});
    await Contract.deleteMany({});
    console.log('✓ Dados antigos removidos');

    // Criar usuários
    const users = await User.create([
      {
        name: 'Administrador',
        email: 'admin@aura.com',
        password: 'admin123',
        role: 'admin',
        phone: '11999999999',
      },
      {
        name: 'João Silva - Suporte',
        email: 'joao@aura.com',
        password: 'joao123',
        role: 'support',
        phone: '11988888888',
        city: 'São Paulo',
      },
      {
        name: 'Maria Santos - Suprimentos',
        email: 'maria@aura.com',
        password: 'maria123',
        role: 'supply',
        phone: '11987654321',
      },
      {
        name: 'Pedro Costa - Contadores',
        email: 'pedro@aura.com',
        password: 'pedro123',
        role: 'counter',
        phone: '11986543210',
      },
      {
        name: 'Ana Oliveira - Faturamento',
        email: 'ana@aura.com',
        password: 'ana123',
        role: 'billing',
        phone: '11985432109',
      },
      {
        name: 'Carlos Técnico',
        email: 'carlos@aura.com',
        password: 'carlos123',
        role: 'technician',
        phone: '11984321098',
        city: 'São Paulo',
      },
    ]);
    console.log('✓ Usuários criados:', users.length);

    // Criar clientes
    const clients = await Client.create([
      {
        nome: 'Empresa XYZ LTDA',
        cnpj: '12.345.678/0001-90',
        email: 'contato@xyz.com',
        telefone: '11999999999',
        endereco: 'Av. Paulista, 1000',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01311-100',
        contato: 'João Silva',
      },
      {
        nome: 'Consultoria ABC',
        cnpj: '98.765.432/0001-01',
        email: 'info@abc.com',
        telefone: '11988888888',
        endereco: 'Rua Augusta, 500',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01305-100',
        contato: 'Maria Santos',
      },
      {
        nome: 'Indústria DEF',
        cnpj: '11.222.333/0001-44',
        email: 'contato@def.com.br',
        telefone: '11987654321',
        endereco: 'Via Anchieta, 2000',
        cidade: 'São Bernardo do Campo',
        estado: 'SP',
        cep: '09830-000',
        contato: 'Pedro Oliveira',
      },
    ]);
    console.log('✓ Clientes criados:', clients.length);

    // Criar máquinas
    const machines = await Machine.create([
      {
        patrimonio: 'PAT001',
        numeroSerie: 'F1J758714',
        modelo: 'M375',
        marca: 'Sharp',
        cliente: clients[0]._id,
        chaveCliente: '53-57-54-2C-46-50-50-2C-36-34',
        contadorAtual: 15000,
        localizacao: 'Av. Paulista, 1000 - SP',
        departamento: 'TI',
        statusMaquina: 'ativa',
      },
      {
        patrimonio: 'PAT002',
        numeroSerie: 'F1J758715',
        modelo: 'M375',
        marca: 'Sharp',
        cliente: clients[0]._id,
        chaveCliente: '53-57-54-2C-46-50-50-2C-36-34',
        contadorAtual: 22000,
        localizacao: 'Av. Paulista, 1000 - SP',
        departamento: 'Administrativo',
        statusMaquina: 'ativa',
      },
      {
        patrimonio: 'PAT003',
        numeroSerie: 'F1J758716',
        modelo: 'C4080',
        marca: 'Xerox',
        cliente: clients[1]._id,
        chaveCliente: '53-57-54-2C-46-50-50-2C-36-34',
        contadorAtual: 31000,
        localizacao: 'Rua Augusta, 500 - SP',
        departamento: 'Produção',
        statusMaquina: 'ativa',
      },
    ]);
    console.log('✓ Máquinas criadas:', machines.length);

    // Criar contratos
    const contracts = await Contract.create([
      {
        numeroContrato: 'CT-001',
        cliente: clients[0]._id,
        maquinas: [machines[0]._id, machines[1]._id],
        dataInicio: new Date('2025-01-01'),
        dataFim: new Date('2025-12-31'),
        valorMensal: 1500.00,
        excedentes: 0.15,
        departamentos: ['TI', 'Administrativo'],
        ativo: true,
      },
      {
        numeroContrato: 'CT-002',
        cliente: clients[1]._id,
        maquinas: [machines[2]._id],
        dataInicio: new Date('2025-02-01'),
        dataFim: new Date('2025-12-31'),
        valorMensal: 2000.00,
        excedentes: 0.20,
        departamentos: ['Produção'],
        ativo: true,
      },
    ]);
    console.log('✓ Contratos criados:', contracts.length);

    console.log('\n✅ Seed executado com sucesso!');
    console.log('\nCredenciais de teste:');
    console.log('Admin: admin@aura.com / admin123');
    console.log('Suporte: joao@aura.com / joao123');
    console.log('Técnico: carlos@aura.com / carlos123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

seed();

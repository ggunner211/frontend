/**
 * Mock Database - Dados em memória para testes
 * Quando MongoDB estiver disponível, remova este arquivo e use o banco real
 */

const mockUsers = [
  {
    _id: '1',
    name: 'Administrador',
    email: 'admin@aura.com',
    password: 'admin123', // Em produção seria hash
    role: 'admin',
    phone: '11999999999',
    createdAt: new Date(),
  },
  {
    _id: '2',
    name: 'João Silva - Suporte',
    email: 'joao@aura.com',
    password: 'joao123',
    role: 'support',
    phone: '11988888888',
    city: 'São Paulo',
    createdAt: new Date(),
  },
  {
    _id: '3',
    name: 'Maria Santos - Suprimentos',
    email: 'maria@aura.com',
    password: 'maria123',
    role: 'supply',
    phone: '11987654321',
    createdAt: new Date(),
  },
];

const mockClients = [
  {
    _id: '101',
    name: 'Empresa A',
    cnpj: '12.345.678/0001-90',
    email: 'contato@empresaa.com',
    phone: '11912345678',
    address: 'Rua A, 123',
    city: 'São Paulo',
  },
  {
    _id: '102',
    name: 'Empresa B',
    cnpj: '98.765.432/0001-01',
    email: 'contato@empresab.com',
    phone: '11987654321',
    address: 'Avenida B, 456',
    city: 'Rio de Janeiro',
  },
];

const mockMachines = [
  {
    _id: '201',
    model: 'Xerox VersaLink C8000',
    type: 'color',
    status: 'active',
    acquisitionDate: new Date('2022-01-15'),
  },
  {
    _id: '202',
    model: 'Canon imagePRESS',
    type: 'bw',
    status: 'active',
    acquisitionDate: new Date('2021-06-10'),
  },
];

const mockDeliveryNotes = [];

class MockDatabase {
  constructor() {
    this.users = JSON.parse(JSON.stringify(mockUsers));
    this.clients = JSON.parse(JSON.stringify(mockClients));
    this.machines = JSON.parse(JSON.stringify(mockMachines));
    this.deliveryNotes = JSON.parse(JSON.stringify(mockDeliveryNotes));
  }

  // Users
  findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  findUserById(id) {
    return this.users.find(u => u._id === id);
  }

  getAllUsers() {
    return this.users.map(u => ({ ...u, password: undefined }));
  }

  // Clients
  getAllClients() {
    return this.clients;
  }

  getClientById(id) {
    return this.clients.find(c => c._id === id);
  }

  createClient(data) {
    const newClient = { _id: String(Date.now()), ...data };
    this.clients.push(newClient);
    return newClient;
  }

  // Machines
  getAllMachines() {
    return this.machines;
  }

  getMachineById(id) {
    return this.machines.find(m => m._id === id);
  }

  // Delivery Notes
  getAllDeliveryNotes() {
    return this.deliveryNotes;
  }

  createDeliveryNote(data) {
    const noteNumber = String(this.deliveryNotes.length + 1).padStart(5, '0');
    const year = new Date().getFullYear();
    const newNote = {
      _id: String(Date.now()),
      noteNumber: `${noteNumber}/${year}`,
      ...data,
      createdAt: new Date(),
    };
    this.deliveryNotes.push(newNote);
    return newNote;
  }

  updateDeliveryNote(id, data) {
    const index = this.deliveryNotes.findIndex(n => n._id === id);
    if (index !== -1) {
      this.deliveryNotes[index] = { ...this.deliveryNotes[index], ...data };
      return this.deliveryNotes[index];
    }
    return null;
  }
}

module.exports = new MockDatabase();

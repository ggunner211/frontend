const axios = require('axios');

const API_URL = 'https://backend-production-571fe.up.railway.app/api';

async function testLogin() {
  try {
    console.log('🔐 Testando login...');
    console.log(`📍 API URL: ${API_URL}`);
    
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@aura.com',
      password: 'admin123'
    });

    console.log('✅ Login bem-sucedido!');
    console.log('📄 Resposta:');
    console.log({
      success: response.data.success,
      user: response.data.user,
      tokenLength: response.data.token?.length || 0,
      tokenPreview: response.data.token?.substring(0, 20) + '...'
    });

    return true;
  } catch (error) {
    console.error('❌ Erro no login:');
    console.error('Status:', error.response?.status);
    console.error('Mensagem:', error.response?.data?.message);
    console.error('Erro completo:', error.message);
    return false;
  }
}

testLogin().then(success => {
  process.exit(success ? 0 : 1);
});

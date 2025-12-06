const axios = require('axios');

const DOCMPS_CONFIG = {
  host: process.env.DOCMPS_HOST || 'https://mps.doc360.com.br',
  parceiro: process.env.DOCMPS_PARCEIRO || 'guararapespaineis',
  user: process.env.DOCMPS_USER || 'testedoc',
  pass: process.env.DOCMPS_PASS || 'teste123',
};

let cachedHash = null;
let hashExpireTime = null;

/**
 * Gera hash de autenticação na API DOCMPS
 */
const getDocmpsHash = async () => {
  try {
    // Verifica se hash em cache ainda é válido (1 hora)
    if (cachedHash && hashExpireTime && Date.now() < hashExpireTime) {
      return cachedHash;
    }

    const response = await axios.post(
      `${DOCMPS_CONFIG.host}/apiCont/request/login.php`,
      {},
      {
        params: {
          parceiro: DOCMPS_CONFIG.parceiro,
          user: DOCMPS_CONFIG.user,
          pass: DOCMPS_CONFIG.pass,
        },
      }
    );

    if (response.data.status === 'sucess') {
      cachedHash = response.data.dados.api_hash;
      hashExpireTime = Date.now() + 3600000; // 1 hora
      return cachedHash;
    }
    throw new Error('Falha ao autenticar na API DOCMPS');
  } catch (error) {
    console.error('Erro ao obter hash DOCMPS:', error.message);
    throw error;
  }
};

/**
 * Busca contadores de uma máquina
 */
const getContadorEquipamento = async (numeroSerie, chaveCliente) => {
  try {
    const hash = await getDocmpsHash();
    const response = await axios.get(
      `${DOCMPS_CONFIG.host}/apiCont/request/contadorEqui.php`,
      {
        params: {
          parceiro: DOCMPS_CONFIG.parceiro,
          ns: numeroSerie,
          hash: hash,
          chave_cliente: chaveCliente,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar contador:', error.message);
    throw error;
  }
};

/**
 * Busca contadores de múltiplos equipamentos por cliente
 */
const getContadoresCliente = async (dataInicial, dataFinal, chaveCliente) => {
  try {
    const hash = await getDocmpsHash();
    const response = await axios.get(
      `${DOCMPS_CONFIG.host}/apiCont/request/contadorMultEquiPorCliente.php`,
      {
        params: {
          data_inicial: dataInicial,
          data_final: dataFinal,
          hash: hash,
          chave_cliente: chaveCliente,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar contadores do cliente:', error.message);
    throw error;
  }
};

/**
 * Busca contadores de dia específico
 */
const getContadorDiaEspecifico = async (dataInicial, dataFinal, numeroSerie) => {
  try {
    const hash = await getDocmpsHash();
    const response = await axios.get(
      `${DOCMPS_CONFIG.host}/apiCont/request/contadorDiaEspecifico.php`,
      {
        params: {
          data_inicial: dataInicial,
          data_final: dataFinal,
          hash: hash,
          parceiro: DOCMPS_CONFIG.parceiro,
          numero_serie: numeroSerie,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar contador do dia:', error.message);
    throw error;
  }
};

module.exports = {
  getDocmpsHash,
  getContadorEquipamento,
  getContadoresCliente,
  getContadorDiaEspecifico,
};

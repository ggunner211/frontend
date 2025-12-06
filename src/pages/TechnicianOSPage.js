import React, { useState, useEffect } from 'react';
import { osService } from '../services/services';
import { useAuth } from '../context/AuthContext';
import SignatureCanvas from 'react-signature-canvas';
import { FiMapPin, FiCheckCircle } from 'react-icons/fi';

export const TechnicianOSPage = () => {
  const { user } = useAuth();
  const [osData, setOSData] = useState([]);
  const [selectedOS, setSelectedOS] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignature, setShowSignature] = useState(false);
  const signatureRef = React.useRef();

  useEffect(() => {
    if (user?.city) {
      loadPendingOS();
    }
  }, [user?.city]);

  const loadPendingOS = async () => {
    try {
      setLoading(true);
      const res = await osService.getPendingByCity(user.city);
      setOSData(res.data);
    } catch (error) {
      console.error('Erro ao carregar OS:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOS = async (osId) => {
    try {
      await osService.assignTechnician(osId, user.id);
      alert('OS aceita com sucesso!');
      loadPendingOS();
    } catch (error) {
      console.error('Erro ao aceitar OS:', error);
    }
  };

  const handleOpenMaps = (location) => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleFinishOS = async () => {
    if (!signatureRef.current.isEmpty()) {
      try {
        const signature = signatureRef.current.toDataURL();
        await osService.finishOS(selectedOS._id, { assinatura: signature });
        alert('OS finalizada com sucesso!');
        setShowSignature(false);
        setSelectedOS(null);
        loadPendingOS();
      } catch (error) {
        console.error('Erro ao finalizar OS:', error);
      }
    } else {
      alert('Por favor, assine antes de finalizar');
    }
  };

  const clearSignature = () => {
    signatureRef.current.clear();
  };

  if (loading) return <div className="p-6">Carregando...</div>;

  if (selectedOS && showSignature) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Finalizar OS</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{selectedOS.numeroOS}</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">Cliente</p>
              <p className="font-semibold">{selectedOS.cliente?.nome}</p>
            </div>
            <div>
              <p className="text-gray-600">Máquina</p>
              <p className="font-semibold">{selectedOS.maquina?.patrimonio}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-4">Assinatura do Cliente</label>
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
              <SignatureCanvas
                ref={signatureRef}
                penColor="black"
                canvasProps={{ className: 'w-full h-40 rounded' }}
              />
            </div>
            <button
              onClick={clearSignature}
              className="mt-2 text-red-600 hover:text-red-800"
            >
              Limpar Assinatura
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleFinishOS}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              <FiCheckCircle /> Finalizar e Assinar
            </button>
            <button
              onClick={() => setShowSignature(false)}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Minhas Ordens de Serviço</h1>

      {selectedOS ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4 flex justify-between">
            <h2 className="text-2xl font-bold">{selectedOS.numeroOS}</h2>
            <button
              onClick={() => setSelectedOS(null)}
              className="text-gray-600 hover:text-gray-800 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-600">Cliente</p>
              <p className="font-semibold text-lg">{selectedOS.cliente?.nome}</p>
            </div>
            <div>
              <p className="text-gray-600">Máquina</p>
              <p className="font-semibold text-lg">{selectedOS.maquina?.patrimonio}</p>
            </div>
            <div>
              <p className="text-gray-600">Série</p>
              <p className="font-semibold">{selectedOS.maquina?.numeroSerie}</p>
            </div>
            <div>
              <p className="text-gray-600">Localização</p>
              <p className="font-semibold">{selectedOS.maquina?.localizacao}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">Problema</p>
            <p className="text-lg border-l-4 border-blue-600 pl-4">{selectedOS.descricaoProblema}</p>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => handleOpenMaps(selectedOS.maquina?.localizacao)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              <FiMapPin /> Abrir Google Maps
            </button>
            {selectedOS.status === 'aceita' && (
              <button
                onClick={() => setShowSignature(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                <FiCheckCircle /> Finalizar OS
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {osData.map(os => (
            <div key={os._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-bold mb-2">{os.numeroOS}</h3>
              <p className="text-gray-600 mb-2">{os.cliente?.nome}</p>
              <p className="text-sm text-gray-500 mb-4">{os.maquina?.patrimonio}</p>
              <p className="text-gray-700 mb-4">
                <strong>Problema:</strong> {os.descricaoProblema.substring(0, 60)}...
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedOS(os)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Ver Detalhes
                </button>
                {os.status === 'aberta' && (
                  <button
                    onClick={() => handleAcceptOS(os._id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Aceitar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { counterService, machineService } from '../services/services';
import { FiRefreshCw, FiDownload } from 'react-icons/fi';

export const CountersPage = () => {
  const [machines, setMachines] = useState([]);
  const [counters, setCounters] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      const res = await machineService.getAll();
      setMachines(res.data);
    } catch (error) {
      console.error('Erro ao carregar máquinas:', error);
    }
  };

  const handleFetchCounters = async (machineId) => {
    try {
      setLoading(true);
      await counterService.fetchFromAPI(machineId);
      const res = await counterService.getByMachine(machineId);
      setCounters(res.data);
      setSelectedMachine(machineId);
      alert('Contadores atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar contadores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCounters = async (machineId) => {
    try {
      const res = await counterService.getByMachine(machineId);
      setCounters(res.data);
      setSelectedMachine(machineId);
    } catch (error) {
      console.error('Erro ao carregar contadores:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Coleta de Contadores</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {machines.map(machine => (
          <div key={machine._id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-bold mb-2">{machine.patrimonio}</h3>
            <p className="text-sm text-gray-600 mb-4">Série: {machine.numeroSerie}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleFetchCounters(machine._id)}
                disabled={loading}
                className="flex items-center gap-2 flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                <FiRefreshCw /> Atualizar
              </button>
              <button
                onClick={() => handleLoadCounters(machine._id)}
                className="flex items-center gap-2 flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              >
                <FiDownload /> Histórico
              </button>
            </div>
          </div>
        ))}
      </div>

      {counters.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Histórico de Contadores</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-left">Life</th>
                  <th className="px-4 py-2 text-left">Total Mono</th>
                  <th className="px-4 py-2 text-left">Total Color</th>
                  <th className="px-4 py-2 text-left">Scan</th>
                  <th className="px-4 py-2 text-left">Copy</th>
                  <th className="px-4 py-2 text-left">Print</th>
                  <th className="px-4 py-2 text-left">A3</th>
                  <th className="px-4 py-2 text-left">A4</th>
                </tr>
              </thead>
              <tbody>
                {counters.map((counter, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{new Date(counter.data).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-2">{counter.contadores?.life || '-'}</td>
                    <td className="px-4 py-2">{counter.contadores?.total_mono || '-'}</td>
                    <td className="px-4 py-2">{counter.contadores?.total_color || '-'}</td>
                    <td className="px-4 py-2">{counter.contadores?.scan || '-'}</td>
                    <td className="px-4 py-2">{counter.contadores?.copy || '-'}</td>
                    <td className="px-4 py-2">{counter.contadores?.print || '-'}</td>
                    <td className="px-4 py-2">{counter.contadores?.a3 || '-'}</td>
                    <td className="px-4 py-2">{counter.contadores?.a4 || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

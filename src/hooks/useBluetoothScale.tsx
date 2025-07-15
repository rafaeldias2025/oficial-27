
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { BluetoothScaleDevice, WeightMeasurement } from '@/types/weight';

export const useBluetoothScale = () => {
  const [device, setDevice] = useState<BluetoothScaleDevice | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const { toast } = useToast();

  const startScanning = useCallback(async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['weight_scale'] },
          { namePrefix: 'MI' },
          { namePrefix: 'MIBFS' }
        ],
        optionalServices: ['weight_scale']
      });

      setDevice({
        id: crypto.randomUUID(),
        name: device.name || 'Unknown Device',
        deviceId: device.id,
        connected: false,
        manufacturer: 'Xiaomi'
      });

      return device;
    } catch (error) {
      console.error('Erro ao escanear dispositivos:', error);
      toast({
        title: 'Erro ao escanear',
        description: 'Não foi possível encontrar a balança. Verifique se o Bluetooth está ativado.',
        variant: 'destructive'
      });
      return null;
    }
  }, [toast]);

  const connectToDevice = useCallback(async (bluetoothDevice: BluetoothScaleDevice) => {
    if (!bluetoothDevice) return null;
    
    setIsConnecting(true);
    try {
      const server = await bluetoothDevice.gatt?.connect();
      const service = await server?.getPrimaryService('weight_scale');
      const characteristic = await service?.getCharacteristic('weight_measurement');
      
      setDevice(prev => prev ? {
        ...prev,
        connected: true,
        lastConnection: new Date().toISOString(),
        serviceUUID: service?.uuid,
        characteristicUUID: characteristic?.uuid
      } : null);

      return characteristic;
    } catch (error) {
      console.error('Erro ao conectar:', error);
      toast({
        title: 'Erro na conexão',
        description: 'Não foi possível conectar à balança. Tente novamente.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const startReading = useCallback(async (): Promise<WeightMeasurement | null> => {
    if (!device) return null;
    
    setIsReading(true);
    try {
      // Simulando leitura para exemplo
      const weight = Math.random() * 30 + 50; // 50-80kg
      const bodyFat = Math.random() * 20 + 10; // 10-30%
      const muscleMass = Math.random() * 20 + 30; // 30-50%
      const waterPercentage = Math.random() * 20 + 40; // 40-60%
      const visceralFat = Math.floor(Math.random() * 10 + 5); // 5-15
      const bodyAge = Math.floor(Math.random() * 20 + 20); // 20-40
      
      const measurement: WeightMeasurement = {
        id: crypto.randomUUID(),
        userId: 'current-user-id', // Substituir pelo ID real do usuário
        date: new Date().toISOString(),
        weight: Number(weight.toFixed(2)),
        bodyFat: Number(bodyFat.toFixed(2)),
        muscleMass: Number(muscleMass.toFixed(2)),
        waterPercentage: Number(waterPercentage.toFixed(2)),
        visceralFat,
        bodyAge,
        bmi: Number((weight / Math.pow(1.70, 2)).toFixed(2)), // Exemplo com altura fixa 1.70m
      };

      return measurement;
    } catch (error) {
      console.error('Erro na leitura:', error);
      toast({
        title: 'Erro na leitura',
        description: 'Não foi possível ler os dados da balança. Tente novamente.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsReading(false);
    }
  }, [device, toast]);

  return {
    device,
    isConnecting,
    isReading,
    startScanning,
    connectToDevice,
    startReading
  };
};

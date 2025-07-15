import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { BluetoothDevice, BluetoothRemoteGATTCharacteristic, ScaleReading } from '@/types/bluetooth';

interface MiScalePairingButtonProps {
  onDeviceFound?: (device: BluetoothDevice) => void;
  onConnected?: (characteristic: BluetoothRemoteGATTCharacteristic) => void;
  onDataReceived?: (reading: ScaleReading) => void;
}

export function MiScalePairingButton({ 
  onDeviceFound, 
  onConnected, 
  onDataReceived 
}: MiScalePairingButtonProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const startScanning = async () => {
    if (!navigator.bluetooth) {
      toast({
        title: 'Bluetooth não suportado',
        description: 'Seu navegador não suporta Bluetooth. Use Chrome ou Edge.',
        variant: 'destructive'
      });
      return;
    }

    setIsScanning(true);
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'MI' },
          { namePrefix: 'MIBFS' }
        ],
        optionalServices: ['weight_scale']
      }) as BluetoothDevice;

      onDeviceFound?.(device);
      await connectToDevice(device);
    } catch (error) {
      console.error('Erro ao escanear:', error);
      toast({
        title: 'Erro ao escanear',
        description: 'Não foi possível encontrar a balança.',
        variant: 'destructive'
      });
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    setIsConnecting(true);
    try {
      const server = await device.gatt?.connect();
      if (!server) throw new Error('Não foi possível conectar ao servidor GATT');

      const service = await server.getPrimaryService('weight_scale');
      const characteristic = await service.getCharacteristic('weight_measurement');

      if (characteristic) {
        onConnected?.(characteristic);

        characteristic.addEventListener('characteristicvaluechanged', (event) => {
          const target = event.target as BluetoothRemoteGATTCharacteristic;
          if (target.value) {
            const reading: ScaleReading = {
              weight: target.value.getFloat32(1, true),
              unit: 'kg',
              timestamp: new Date(),
              raw: target.value
            };
            onDataReceived?.(reading);
          }
        });

        await characteristic.startNotifications();
      }
    } catch (error) {
      console.error('Erro ao conectar:', error);
      toast({
        title: 'Erro na conexão',
        description: 'Não foi possível conectar à balança.',
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button 
      onClick={startScanning}
      disabled={isScanning || isConnecting}
    >
      {isScanning ? 'Procurando...' : isConnecting ? 'Conectando...' : 'Conectar Balança'}
    </Button>
  );
}
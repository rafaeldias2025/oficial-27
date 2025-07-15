export interface BluetoothDevice extends EventTarget {
  id: string;
  name: string | null;
  gatt?: BluetoothRemoteGATTServer | null;
  watchAdvertisements(): Promise<void>;
  unwatchAdvertisements(): void;
  readonly watchingAdvertisements: boolean;
}

export interface BluetoothRemoteGATTServer {
  device: BluetoothDevice;
  connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(service: string | number): Promise<BluetoothRemoteGATTService>;
  getPrimaryServices(service?: string | number): Promise<BluetoothRemoteGATTService[]>;
}

export interface BluetoothRemoteGATTService {
  device: BluetoothDevice;
  uuid: string;
  isPrimary: boolean;
  getCharacteristic(characteristic: string | number): Promise<BluetoothRemoteGATTCharacteristic>;
  getCharacteristics(characteristic?: string | number): Promise<BluetoothRemoteGATTCharacteristic[]>;
  getIncludedService(service: string | number): Promise<BluetoothRemoteGATTService>;
  getIncludedServices(service?: string | number): Promise<BluetoothRemoteGATTService[]>;
}

export interface BluetoothRemoteGATTCharacteristic extends EventTarget {
  service: BluetoothRemoteGATTService;
  uuid: string;
  properties: BluetoothCharacteristicProperties;
  value?: DataView;
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  readValue(): Promise<DataView>;
  writeValue(value: BufferSource): Promise<void>;
  writeValueWithResponse(value: BufferSource): Promise<void>;
  writeValueWithoutResponse(value: BufferSource): Promise<void>;
}

export interface BluetoothCharacteristicProperties {
  broadcast: boolean;
  read: boolean;
  writeWithoutResponse: boolean;
  write: boolean;
  notify: boolean;
  indicate: boolean;
  authenticatedSignedWrites: boolean;
  reliableWrite: boolean;
  writableAuxiliaries: boolean;
}

export interface BluetoothServiceUUIDs {
  WEIGHT_SCALE: string;
  BODY_COMPOSITION: string;
  BATTERY: string;
  DEVICE_INFORMATION: string;
}

export interface BluetoothCharacteristicUUIDs {
  WEIGHT_MEASUREMENT: string;
  BODY_COMPOSITION_MEASUREMENT: string;
  BATTERY_LEVEL: string;
  MANUFACTURER_NAME: string;
  MODEL_NUMBER: string;
}

export interface ScaleReading {
  weight: number;
  unit: 'kg' | 'lbs';
  timestamp: Date;
  impedance?: number;
  bodyFat?: number;
  muscleMass?: number;
  boneMass?: number;
  waterPercentage?: number;
  visceralFat?: number;
  basalMetabolism?: number;
  bodyAge?: number;
  bodyType?: string;
  raw?: DataView;
} 
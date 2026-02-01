
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface IFarmSettings {
  language: 'BN' | 'EN';
  theme: 'light' | 'dark';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY';
  weightUnit: 'KG' | 'TON';
  tempUnit: '°C' | '°F';
  enableAnimations: boolean;
  compactMode: boolean;
  notifications: {
    expiry: boolean;
    sensor: boolean;
    transport: boolean;
    booking: boolean;
    payment: boolean;
  };
  storageConfig: {
    rentRate: number;
    specialRates: Record<string, number>;
    expiryRules: Record<string, number>;
    alertDays: number;
  };
}

const DEFAULT_SETTINGS: IFarmSettings = {
  language: 'BN',
  theme: 'light',
  dateFormat: 'DD/MM/YYYY',
  weightUnit: 'KG',
  tempUnit: '°C',
  enableAnimations: true,
  compactMode: false,
  notifications: {
    expiry: true,
    sensor: true,
    transport: true,
    booking: true,
    payment: false,
  },
  storageConfig: {
    rentRate: 2.5,
    specialRates: { Potato: 2.0, Onion: 3.5, Tomato: 5.0 },
    expiryRules: { Potato: 150, Onion: 60, Tomato: 15 },
    alertDays: 7,
  },
};

interface SettingsContextType {
  settings: IFarmSettings;
  updateSetting: (key: string, value: any) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<IFarmSettings>(() => {
    const saved = localStorage.getItem('ifarm-app-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('ifarm-app-settings', JSON.stringify(settings));
    // Sync theme with HTML class
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => {
      const keys = key.split('.');
      if (keys.length === 1) {
        return { ...prev, [key]: value };
      }
      // Handle nested updates like 'notifications.expiry'
      const newSettings = { ...prev } as any;
      let current = newSettings;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const resetSettings = () => setSettings(DEFAULT_SETTINGS);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

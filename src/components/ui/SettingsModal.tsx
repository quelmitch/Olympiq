import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAppContext } from '../../context/AppContext';
import { clearStorage } from '../../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey } = useAppContext();
  const [inputKey, setInputKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiKey(inputKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all data? This will remove your API key, favorites, history, and notifications.')) {
      clearStorage();
      window.location.reload();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-6">
        <div>
          <label htmlFor="api-key" className="block text-sm font-medium text-zinc-300 mb-2">
            Gemini 1.5 Flash API Key
          </label>
          <input
            id="api-key"
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="AIzaSy..."
          />
          <p className="text-xs text-zinc-500 mt-2">
            Your key is stored locally in your browser and never sent to our servers.
          </p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
          <button
            onClick={handleReset}
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
          >
            Reset App Data
          </button>

          <div className="flex items-center space-x-3">
            {saved && <span className="text-green-400 text-sm">Saved!</span>}
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

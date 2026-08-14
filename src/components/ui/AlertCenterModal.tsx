import React from 'react';
import { Modal } from './Modal';
import { useAppContext } from '../../context/AppContext';
import { markNotificationAsRead, requestNotificationPermission } from '../../services/notifications';
import { Bell, Check, BellRing } from 'lucide-react';

interface AlertCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertCenterModal: React.FC<AlertCenterModalProps> = ({ isOpen, onClose }) => {
  const { notifications, refreshNotifications } = useAppContext();

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    refreshNotifications();
  };

  const handleEnablePermissions = async () => {
    await requestNotificationPermission();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Alert Center">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {(!('Notification' in window) || Notification.permission !== 'granted') && (
          <div className="bg-zinc-800 p-3 rounded-lg flex items-start space-x-3 mb-4">
            <BellRing className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-zinc-200">System notifications are off.</p>
              <button
                onClick={handleEnablePermissions}
                className="text-xs text-blue-400 hover:text-blue-300 mt-1"
              >
                Enable for background alerts
              </button>
            </div>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No alerts yet.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-lg border ${notif.read ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-900 border-zinc-700'} flex justify-between items-start`}
            >
              <div>
                <h4 className={`text-sm font-medium ${notif.read ? 'text-zinc-400' : 'text-zinc-100'}`}>
                  {notif.title}
                </h4>
                <p className={`text-xs mt-1 ${notif.read ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {notif.body}
                </p>
                <p className="text-[10px] text-zinc-600 mt-2">
                  {new Date(notif.timestamp).toLocaleString()}
                </p>
              </div>
              {!notif.read && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="text-zinc-500 hover:text-green-400 transition-colors"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

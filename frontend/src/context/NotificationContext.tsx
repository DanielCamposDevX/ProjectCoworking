// src/context/NotificationsContext.js
import { logsType } from '@/types/logs-type';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface NotificationsContextType {
  notifications: logsType[];
  handleNotificationChange: (notifications: logsType[]) => void;
  setNotifications: (notifications: logsType[]) => void;
  newNotification: boolean;
  setNewNotification: (newNotification: boolean) => void;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notifications, setNotifications] = useState<logsType[]>([]);
  const [newNotification, setNewNotification] = useState(false);

  const handleNotificationChange = (newNotifications: logsType[]) => {
    setNotifications(prevNotifications => [
      ...prevNotifications,
      ...newNotifications,
    ]);
    setNewNotification(true);

    const updatedNotifications = [...notifications, ...newNotifications];
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  useEffect(() => {
    localStorage.getItem('notifications') &&
      setNotifications(
        JSON.parse(localStorage.getItem('notifications') || '[]'),
      );
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        handleNotificationChange,
        setNotifications,
        newNotification,
        setNewNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationsProvider',
    );
  }
  return context;
};

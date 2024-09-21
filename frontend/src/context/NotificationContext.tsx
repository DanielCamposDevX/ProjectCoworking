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
  handleNotificationChange: (
    notifications: logsType[],
    newNotificationCount: number,
  ) => void;
  newNotificationCount: number;
  setNotifications: (notifications: logsType[]) => void;
  cleanNotificationsCounter: () => void;
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
  const [newNotificationCount, setNewNotificationCount] = useState(0);

  const handleNotificationChange = (
    notifications: logsType[],
    newNotificationCount: number,
  ) => {
    setNotifications(notifications);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setNewNotificationCount(newNotificationCount);
    localStorage.setItem(
      'newNotificationCount',
      JSON.stringify(newNotificationCount),
    );
  };

  const cleanNotificationsCounter = () => {
    localStorage.setItem('newNotificationCount', JSON.stringify(0));
    setNewNotificationCount(0);
  };

  useEffect(() => {
    localStorage.getItem('notifications') &&
      setNotifications(
        JSON.parse(localStorage.getItem('notifications') || '[]'),
      );
    localStorage.getItem('newNotificationCount') &&
      setNewNotificationCount(
        JSON.parse(localStorage.getItem('newNotificationCount') || '0'),
      );
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        handleNotificationChange,
        newNotificationCount,
        setNotifications,
        cleanNotificationsCounter,
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

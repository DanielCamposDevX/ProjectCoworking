import api from '@/api';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { logsType } from '@/types/logs-type';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import moment from 'moment';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from './ui/dialog';

const socket = io(process.env.NEXT_PUBLIC_API_URL, {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

export default function Notifications() {
  const { userId } = useAuth();
  const {
    setNotifications,
    handleNotificationChange,
    notifications,
    newNotification,
    setNewNotification,
  } = useNotifications();
  const isMounted = useRef(false);
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    api.get('/api/notifications?limit=5').then(res => {
      setNotifications(res.data);
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      notificationSound.current = new Audio('/sounds/notifications.wav');
    }

    isMounted.current = true;

    socket.connect();
    socket.emit('joinRoom', userId?.toString());

    socket.on('log', (log: logsType) => {
      const prev = [...notifications];
      prev.push(log);
      handleNotificationChange(prev);
      if (notificationSound.current) {
        notificationSound.current.play().catch(err => console.error(err));
      }
    });

    return () => {
      socket.off('log');
      socket.disconnect();
    };
  }, [userId]);

  if (!isMounted.current) return null;

  return (
    <Dialog onOpenChange={() => setNewNotification(false)}>
      <DialogTrigger>
        <Button variant={'ghost'} className="relative p-2 rounded-full">
          <Bell className="h-5 w-5" />
          {newNotification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-2 right-2 bg-blue-600 text-white rounded-full h-2 w-2 flex items-center justify-center text-xs"
            ></motion.div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-white p-10 max-h-[70vh] overflow-y-scroll">
        <DialogHeader>
          <h2 className="text-xl font-semibold flex items-center gap-3 mt-20 mb-6">
            <Bell className="h-6 w-6 text-blue-600" />
            Notificações:
          </h2>
        </DialogHeader>
        {notifications && notifications.length > 0 ? (
          notifications
            .sort(
              (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
            )
            .map(log => (
              <div
                key={log.id}
                className="flex flex-col gap-2 py-4 px-3 border rounded-lg mb-4 shadow-md "
              >
                <span className="text-base font-medium">{log.acao}</span>
                <div className="flex gap-2 items-center justify-end w-full">
                  <span className="text-xs text-gray-500 font-semibold">
                    {moment(log.data).format('HH:mm')}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">
                    {moment(log.data).format('DD/MM/YY')}
                  </span>
                </div>
              </div>
            ))
        ) : (
          <span>Não há notificações</span>
        )}
      </DialogContent>
    </Dialog>
  );
}

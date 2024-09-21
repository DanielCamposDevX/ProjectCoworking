'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Poppins } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from '@/context/AuthContext';
import { NotificationsProvider } from '@/context/NotificationContext';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={'A project manager site'} />
        <title>Project Manager</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={poppins.className}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NotificationsProvider>
              {children} <ToastContainer />
            </NotificationsProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

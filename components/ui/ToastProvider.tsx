'use client';

import { ToastContainer } from 'react-toastify';

export function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastStyle={{
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: '13.5px',
        borderRadius: '10px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      }}
    />
  );
}

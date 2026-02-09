'use client';

import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

type AlertOptions = {
  message: string;
  severity?: AlertSeverity;
  autoHideMs?: number;
};

type AlertContextValue = {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
};

const AlertContext = React.createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState<string>('');
  const [severity, setSeverity] = React.useState<AlertSeverity>('error');
  const [autoHideMs, setAutoHideMs] = React.useState<number | null>(4000);

  const showAlert = React.useCallback(({ message, severity, autoHideMs }: AlertOptions) => {
    setMessage(message);
    setSeverity(severity ?? 'error');
    setAutoHideMs(typeof autoHideMs === 'number' ? autoHideMs : 4000);
    setOpen(true);
  }, []);

  const hideAlert = React.useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={autoHideMs ?? undefined}
        onClose={hideAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={severity} onClose={hideAlert} sx={{ minWidth: 320 }}>
          {message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
}

export function useAppAlert(): AlertContextValue {
  const ctx = React.useContext(AlertContext);
  if (!ctx) {
    throw new Error('useAppAlert must be used within AlertProvider');
  }
  return ctx;
}

'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from '@/base/redux/store';
import { store } from '@/base/redux/store';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <Provider store={store}>
        {children}
    </Provider>
  );
};

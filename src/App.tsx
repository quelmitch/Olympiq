import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainApp } from './components/MainApp';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

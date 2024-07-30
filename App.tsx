import React from 'react';
import { useCameraPermission } from 'react-native-vision-camera';
import Route from './src/routes';

const App = () => {
  const { hasPermission, requestPermission } = useCameraPermission()

  return <Route />;
};

export default App;

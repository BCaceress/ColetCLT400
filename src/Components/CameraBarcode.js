import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';

const CameraBarcode = ({ visible }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  useEffect(() => {
    // Verifica se a permissão já foi concedida
    if (!hasPermission) {
      requestPermission(); // Solicita a permissão de câmera
    }
  }, []);

  //if (!hasPermission) return <PermissionsPage />;
  if (device == null) return (<View><Text>Device not found</Text></View>);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes[0].value} codes!`)
    }
  })
  return (
    <Modal>
      <View style={styles.modalContainer}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
});
export default CameraBarcode;

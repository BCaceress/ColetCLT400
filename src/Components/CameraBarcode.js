import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';

const CameraBarcode = ({ onClose, onScanComplete }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [scannedCode, setScannedCode] = useState(null);
  const [flashlightOn, setFlashlightOn] = useState(false);

  const handleToggleFlashlight = () => {
    if (device.hasTorch) {
      setFlashlightOn(!flashlightOn);
    } else {
      alert('Este dispositivo não possui lanterna.');
    }
  };

  useEffect(() => {
    const checkCameraPermission = async () => {
      if (!hasPermission) {
        const permissionStatus = await requestPermission();
        if (permissionStatus === 'denied') {
          console.log('Permissão de câmera negada.');
        }
      }
    };
    checkCameraPermission();
  }, [hasPermission]);

  const handleCodeScanned = (codes) => {
    console.log(`Scanned ${codes[0].value} codes!`);
    setScannedCode(codes[0].value);
  };

  const handleGetItemPress = () => {
    if (onScanComplete) {
      onScanComplete(scannedCode);
    }
    onClose();
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Dispositivo de câmera não encontrado.</Text>
      </View>
    );
  }

  const codeScanner = useCodeScanner({
    codeTypes: ['code-39'],
    onCodeScanned: handleCodeScanned,
  });

  return (
    <Modal>
      <View style={styles.container}>
        <Camera
          device={device}
          style={StyleSheet.absoluteFill}
          isActive={true}
          codeScanner={codeScanner}
          torch={flashlightOn ? 'on' : 'off'}
        />
        <BarcodeMask
          lineAnimationDuration={2000}
          showAnimatedLine={true}
          width={450}
          height={250}
          outerMaskOpacity={0.8}
          backgroundColor="#aaa"
          edgeColor="red"
          edgeBorderWidth={5}
          edgeHeight={25}
          edgeWidth={25}
          edgeRadius={5}
          animatedLineColor="red"
          animatedLineThickness={4}
          animatedLineOrientation="horizontal"
        />

        <View style={styles.bottomView}>
          <View style={styles.sup}>
            <TouchableOpacity onPress={handleToggleFlashlight} style={styles.roundButton}>
              <MaterialCommunityIcons
                name={flashlightOn ? 'flashlight-off' : 'flashlight'}
                color="#000"
                size={25}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.roundButton}>
              <MaterialCommunityIcons name="close-thick" color="#000" size={25} />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="barcode-scan" color="#000" size={35} />
            <TextInput
              style={styles.input}
              showSoftInputOnFocus={false}
              editable={false}
              selectTextOnFocus={false}
              value={scannedCode}
              placeholder="O código de barra lido irá exibir aqui!"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, !scannedCode && styles.disabledButton]}
            onPress={handleGetItemPress}
            disabled={!scannedCode}
          >
            <Text style={styles.buttonText}>Pesquisar OF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: "#09A08D"
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
  },
  scannedText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 30,
  },
  sup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 27
  },
  roundButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    color: '#333',
    fontSize: 15,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#09A08D',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    width: '100%',
    marginTop: 12
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
  },
});

export default CameraBarcode;

import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Pdf from 'react-native-pdf';

export default function OFVirtual() {
  const source = { uri: 'http://10.0.0.197/pdfs/10252A.pdf', cache: true };

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [fileExists, setFileExists] = useState(true);
  const pdfRef = React.useRef();

  const throttleOnSliderValueChange = React.useCallback(
    _.throttle(value => {
      pdfRef.current && pdfRef.current.setPage(Math.floor(value));
    }, 200),
    [],
  );

  const onSlidingComplete = value => {
    pdfRef.current && pdfRef.current.setPage(Math.floor(value));
  };

  const CustomThumb = ({ value }) => {
    return (
      <View style={styles.thumbContainer}>
        <View style={styles.thumbTextContainer}>
          <Text style={styles.thumbText}>{Math.floor(value)}</Text>
        </View>
      </View>
    );
  };

  // Função para verificar se o arquivo existe
  const checkFileExists = async () => {
    try {
      const response = await fetch(source.uri);
      if (!response.ok) {
        setFileExists(false);
      }
    } catch (error) {
      setFileExists(false);
    }
  };

  useEffect(() => {
    checkFileExists();
  }, []);

  return (
    <View style={styles.container}>
      {fileExists ? (
        <Pdf
          trustAllCerts={false}
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            setTotalPages(numberOfPages);
          }}
          onPageChanged={(page, numberOfPages) => {
            setCurrentPage(page);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      ) : (

        <Text style={styles.notFoundText}>Arquivo não encontrado.</Text>

      )}
      {/* 
      <View style={styles.verticalSliderContainer}>
        <Slider
          value={currentPage}
          minimumValue={1}
          maximumValue={totalPages}
          step={0}
          minimumTrackTintColor="white"
          maximumTrackTintColor="#09A08D"
          vertical={true}
          slideOnTap={true}
          onValueChange={throttleOnSliderValueChange}
          onSlidingComplete={onSlidingComplete}
          CustomThumb={CustomThumb}
        />
      </View>
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: '100%',
  },
  verticalSliderContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 30,
    marginRight: 0,
  },
  thumbContainer: {
    backgroundColor: 'darkcyan',
    padding: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbTextContainer: {
    width: 20,
    height: 20,
  },
  thumbText: {
    color: 'white',
    fontWeight: 'bold',
  },
  notFoundContainer: {

  },
  notFoundText: {
    color: "#000"
  }
});

import React, {useState} from 'react';
import {StyleSheet, Dimensions, Text, View} from 'react-native';
import Pdf from 'react-native-pdf';
import {Slider} from '@react-native-assets/slider';
import _ from 'lodash';

export default function OFVirtual() {
  const source = require('../../../assets/thereactnativebook-sample.pdf');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
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

  const CustomThumb = ({value}) => {
    return (
      <View style={styles.thumbContainer}>
        <View style={styles.thumbTextContainer}>
          <Text style={styles.thumbText}>{Math.floor(value)}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
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
      <View style={styles.verticalSliderContainer}>
        <Slider
          value={currentPage}
          minimumValue={1}
          maximumValue={totalPages}
          step={0}
          minimumTrackTintColor="white"
          maximumTrackTintColor="white"
          vertical={true}
          slideOnTap={true}
          onValueChange={throttleOnSliderValueChange}
          onSlidingComplete={onSlidingComplete}
          CustomThumb={CustomThumb}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 55,
  },

  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
});

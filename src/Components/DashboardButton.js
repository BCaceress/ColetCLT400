import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

const DashboardButton = ({ onPress, title, imageSource, backgroundColor = '#a0a0a0', reverse = false }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.button, { backgroundColor }]}
    >
        {reverse ? (
            <>
                <Text style={[styles.buttonText, styles.textCard]}>{title}</Text>
                <Image source={imageSource} style={styles.buttonImage} />
            </>
        ) : (
            <>
                <Image source={imageSource} style={styles.buttonImage} />
                <Text style={[styles.buttonText, styles.textCard]}>{title}</Text>
            </>
        )}
    </TouchableOpacity>
);

DashboardButton.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    imageSource: PropTypes.number,
    backgroundColor: PropTypes.string,
    reverse: PropTypes.bool,
};

export default memo(DashboardButton);

const styles = StyleSheet.create({
    button: {
        height: 200,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '96%',
    },
    buttonImage: {
        width: 200,
        height: 200,
        flex: 4,
    },
    buttonText: {
        color: 'white',
        marginHorizontal: 8,
        fontWeight: 'bold',
        fontSize: 20,
        flex: 6,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    textCard: {
        textAlign: 'center'
    },

});

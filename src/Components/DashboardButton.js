import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const DashboardButton = ({ onPress, title, imageSource, backgroundColor = ['#09A08D', '#00B5A6'], reverse = false }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <LinearGradient
            colors={backgroundColor}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
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
        </LinearGradient>
    </TouchableOpacity>
);

DashboardButton.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    imageSource: PropTypes.number,
    backgroundColor: PropTypes.arrayOf(PropTypes.string),
    reverse: PropTypes.bool,
};

export default memo(DashboardButton);

const styles = StyleSheet.create({
    buttonContainer: {
        marginBottom: 10,
        width: '96%',
        alignItems: 'center',
    },
    button: {
        height: 200,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
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
        textAlign: 'center',
    },
});

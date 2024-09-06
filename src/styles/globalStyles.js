import { StyleSheet } from 'react-native';

const colors = {
    primary: '#09A08D',
    white: '#FFFFFF',
    grey: '#F5F5F5',
    dark: '#333',
    medium: '#666',
    light: '#888',
    blue: '#3f51b5',
    red: '#FF0000',
};

const globalStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.grey,
    },
    container: {
        flex: 1,
        padding: 18,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.dark,
    },
});

export { colors, globalStyles };


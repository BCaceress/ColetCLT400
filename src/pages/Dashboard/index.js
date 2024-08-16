import React from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardButton from '../../components/DashboardButton';
import permissaoUsuarios from '../../hooks/permissaoUsuarios';

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation, route }) => {
    const permissao = permissaoUsuarios();

    const handlePress = (screen) => {
        if (permissao === 'A' && screen !== 'FiltroOrdensFab') {
            Alert.alert('Sem Permissão', 'Você não tem permissão para acessar esta funcionalidade.');
        } else if (permissao === 'C' || permissao === 'CA' || screen === 'FiltroOrdensFab') {
            navigation.navigate(screen);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerBackground} />
            <View style={[styles.card, { width: width * 0.9 }]}>
                <View style={styles.headerContainer}>
                    <MaterialCommunityIcons name="account-circle-outline" color="#09A08D" size={35} style={styles.icon} />
                    <View style={styles.userInfo}>
                        <Text style={styles.title}>{route.params?.usuario}</Text>
                        <Text style={styles.number}>ID: 1234</Text>
                    </View>
                </View>
                <Text style={styles.description}>
                    Bem-vindo ao Colet Sistemas! Aqui você pode acompanhar suas ordens, gerenciar tarefas e acessar relatórios!
                </Text>
            </View>
            <View style={styles.containerButton}>
                <DashboardButton
                    onPress={() => handlePress('FiltroOrdensFab')}
                    title="Ordens de Fabricação e Apontamentos"
                    imageSource={require('../../assets/ordemFab.png')}
                    backgroundColor="#09A08D"
                />
                <DashboardButton
                    onPress={() => handlePress('#')}
                    title="Produtos e Materiais"
                    imageSource={require('../../assets/prodMateriais.png')}
                    backgroundColor="#ccc"
                    reverse
                />
                <DashboardButton
                    onPress={() => handlePress('#')}
                    title="Pedidos"
                    imageSource={require('../../assets/pedidos.png')}
                    backgroundColor="#09A08D"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    headerBackground: {
        backgroundColor: '#09A08D',
        width: '100%',
        height: '13%',
        position: 'absolute',
        top: 0,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        marginTop: 25,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    number: {
        fontSize: 14,
        color: '#666',
    },
    description: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
        textAlign: 'justify',
    },
    containerButton: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
    },
});

export default Dashboard;

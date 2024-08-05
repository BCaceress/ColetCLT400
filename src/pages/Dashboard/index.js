import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardButton from '../../components/DashboardButton'; // Ajuste o caminho conforme necessário

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation, route }) => {
    return (
        <View style={styles.container}>
            <View style={styles.greenBackground} />
            <View style={[styles.card, { width: width * 0.9 }]}>
                <View style={styles.headerContainer}>
                    <MaterialCommunityIcons name="account-circle-outline" color="#000" size={35} style={styles.icon} />
                    <Text style={styles.title}>{route.params?.usuario}</Text>
                    <Text style={styles.number}>1234</Text>
                </View>
                <Text style={styles.description}>
                    Bem-vindo ao Colet Sistemas! Aqui você pode acompanhar suas ordens, gerenciar tarefas e acessar relatórios. Explore e mantenha-se atualizado!
                </Text>
            </View>
            <View style={styles.containerButton}>
                <DashboardButton
                    onPress={() => navigation.navigate('TelasOrdensFab')}
                    title="Ordens de Fabricação e Apontamentos"
                    imageSource={require('../../assets/ordemFab.png')}
                />
                <DashboardButton
                    title="Produtos e Materiais"
                    imageSource={require('../../assets/prodMateriais.png')}
                    backgroundColor="#09A08D"
                    reverse
                />
                <DashboardButton
                    title="Pedidos"
                    imageSource={require('../../assets/pedidos.png')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    greenBackground: {
        backgroundColor: '#09A08D',
        width: '100%',
        height: '10%',
    },
    card: {
        position: 'absolute',
        top: '2%',
        backgroundColor: 'white',
        height: '15%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    icon: {
        margin: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
    },
    number: {
        fontSize: 18,
        margin: 12,
        fontWeight: 'bold',
        color: '#000',
    },
    description: {
        marginLeft: 12,
        alignSelf: 'flex-start',
        fontSize: 15,
        color: '#000',
        paddingHorizontal: 20,
    },
    containerButton: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 20
    },
});

export default Dashboard;
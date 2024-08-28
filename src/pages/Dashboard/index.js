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
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <View style={styles.headerContainer}>
                        <MaterialCommunityIcons name="account-circle-outline" color="#09A08D" size={35} style={styles.icon} />
                        <View style={styles.userInfo}>
                            <View style={styles.userInfoContainer}>
                                <Text style={styles.title}>{route.params?.usuario}</Text>
                                {permissao && <Text style={styles.permission}>({permissao})</Text>}
                            </View>
                            <Text style={styles.number}>ID: 1234</Text>
                        </View>
                    </View>
                    <Text style={styles.description}>
                        Bem-vindo ao Colet Sistemas! Aqui você pode acompanhar suas ordens, gerenciar tarefas e acessar relatórios!
                    </Text>
                </View>
            </View>
            <View style={styles.containerButton}>
                <DashboardButton
                    onPress={() => handlePress('FiltroOrdensFab')}
                    title="Ordens de Fabricação e Apontamentos"
                    imageSource={require('../../assets/ordemFab.png')}
                    backgroundColor={['#09A08D', '#0e6c60']}
                />
                <DashboardButton
                    onPress={() => handlePress('#')}
                    title="Produtos e Materiais"
                    imageSource={require('../../assets/prodMateriais.png')}
                    backgroundColor={['#525252', '#a0a0a0']}
                    reverse
                />
                <DashboardButton
                    onPress={() => handlePress('#')}
                    title="Pedidos"
                    imageSource={require('../../assets/pedidos.png')}
                    backgroundColor={['#09A08D', '#0e6c60']}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
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
    cardContainer: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: '4%',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: width * 0.9,
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
    userInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    permission: {
        fontSize: 16,
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
    },
});

export default Dashboard;

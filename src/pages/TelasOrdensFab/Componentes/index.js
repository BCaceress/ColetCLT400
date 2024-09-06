import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useDados } from '../../../contexts/DadosContext';
import { colors, globalStyles } from "../../../styles/globalStyles";
const { width } = Dimensions.get('window');

const renderComponenteItem = ({ item, index }) => (
    <View style={styles.componenteContainer}>
        <View style={styles.infoContainer}>
            <View style={styles.unitContainer}>
                <Text style={styles.unitText}>{(index + 1).toString().padStart(2, '0')}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.componenteName}>{item.referencia} - {item.nome} </Text>
                <Text style={styles.componenteDetails}>Qtde: {item.quantidade} {item.unidade} |  Qtde Separada: {item.quantidade_separada} {item.unidade} |  Qtde Estoque: {item.quantidade_estoque} {item.unidade}</Text>
            </View>
        </View>
    </View>
);

const ComponentesContent = () => {
    const { dados, isLoading } = useDados();

    if (isLoading) {
        return (
            <View style={globalStyles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (dados.error) {
        return <Text style={styles.errorText}>{dados.error}</Text>;
    }

    if (!dados?.ordem?.componentes || dados.ordem.componentes.length === 0) {
        return (<View style={styles.noDataTextContainer}>
            <Text style={styles.noDataText}>Nenhum componente disponível.</Text>
        </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerTitle}>Componentes</Text>
            </View>
            <FlatList
                data={dados.ordem.componentes}
                renderItem={renderComponenteItem}
                keyExtractor={(item) => item.referencia.toString()}
            />
        </View>
    );
};

const Componentes = () => {
    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <ComponentesContent />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    componenteContainer: {
        flexDirection: 'column',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: colors.white,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    componenteName: {
        fontSize: 14,
        color: colors.dark,
        fontWeight: 'bold',
    },
    componenteDetails: {
        fontSize: 13,
        color: colors.dark,
        marginTop: 5,
    },
    unitContainer: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: colors.white,
        borderColor: '#ddd',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unitText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 16,
        color: colors.dark,
        textAlign: 'center',
        marginTop: 20,
    },
    errorText: {
        fontSize: 16,
        color: colors.red,
        textAlign: 'center',
        marginTop: 20,
    },
    noDataText: {
        fontSize: 18,
        color: colors.dark,
    },
    noDataTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Componentes;

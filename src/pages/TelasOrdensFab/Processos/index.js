import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import PagerView from 'react-native-pager-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ModalNaoIniciado, ModalProduzindo } from '../../../components/ModaisProcessos';
import { useDados } from '../../../contexts/DadosContext';
import { colors, globalStyles } from "../../../styles/globalStyles";

const { width } = Dimensions.get('window');

const TabContent = ({ title, items = [], itemRenderer }) => (
    <View style={styles.tabContent}>
        <Text style={styles.tabTitle}>{title}</Text>
        {items.length > 0 ? (
            items.map(itemRenderer)
        ) : (
            <Text style={styles.tabText}>Nenhum item disponível</Text>
        )}
    </View>
);

const AccessoriesTab = ({ item }) => (
    <TabContent
        title="Acessórios"
        items={item.acessorios || []}
        itemRenderer={(acessorio, index) => (
            <Text key={index} style={styles.tabText}>{acessorio.nome} (Ref: {acessorio.referencia})</Text>
        )}
    />
);

const DetailsTab = ({ item }) => {
    const detalhes = item.detalhes;
    return (
        <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Detalhes</Text>
            {detalhes ? (
                <>
                    <Text style={styles.tabText}>Recurso: {detalhes.tipo_recurso}</Text>
                    <Text style={styles.tabText}>Setor: {detalhes.setor}</Text>
                    <Text style={styles.tabText}>Complemento: {detalhes.complemento}</Text>
                    <Text style={styles.tabText}>Tempo de Processo: {detalhes.tempo_processo}</Text>
                    <Text style={styles.tabText}>Descrição: {detalhes.descricao_detalhada}</Text>
                </>
            ) : (
                <Text style={styles.tabText}>Nenhum detalhe disponível</Text>
            )}
        </View>
    );
};

const ComponentsTab = ({ item }) => (
    <TabContent
        title="Componentes"
        items={item.componentes || []}
        itemRenderer={(componente, index) => (
            <Text key={index} style={styles.tabText}>{componente.nome} (Ref: {componente.referencia})</Text>
        )}
    />
);

const PageIndicator = ({ index, length }) => {
    const indicators = Array.from({ length }, (_, i) => (
        <View
            key={i}
            style={[styles.dot, { backgroundColor: i === index ? colors.primary : colors.grey }]}
        />
    ));
    return <View style={styles.dotContainer}>{indicators}</View>;
};

const getUniqueStatuses = (processos) => {
    const statuses = processos.map(processo => processo.status);
    return [...new Set(statuses)];
};

const ExpandedContent = React.memo(({ item, currentPage, setCurrentPage }) => {
    const pages = useMemo(() => {
        const pages = [];
        if (item.detalhes) {
            pages.push(<View key="details" style={styles.pagerPage}><DetailsTab item={item} /></View>);
        }
        if (item.acessorios?.length > 0) {
            pages.push(<View key="accessories" style={styles.pagerPage}><AccessoriesTab item={item} /></View>);
        }
        if (item.componentes?.length > 0) {
            pages.push(<View key="components" style={styles.pagerPage}><ComponentsTab item={item} /></View>);
        }
        return pages;
    }, [item]);

    return (
        <>
            <PagerView
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                {pages}
            </PagerView>
            <PageIndicator index={currentPage} length={pages.length} />
        </>
    );
});

const statusConfigFilter = {
    'Todos': { color: '#666', icon: 'view-list', text: 'Todos os Processos' },
    'Não Iniciado': { color: '#FFB300', icon: 'play-circle-outline', text: 'Não Iniciado' },
    'Produzindo': { color: '#1E90FF', icon: 'cog-play', text: 'Produzindo' },
    'Processo Concluido': { color: '#09A08D', icon: 'check-circle-outline', text: 'Concluído' },
    'Interrompido': { color: '#FF0000', icon: 'stop-circle-outline', text: 'Interrompido' },
    'S/Apontamento': { color: '#666', icon: 'stop-circle-outline', text: 'S/Apontamento' },
};

const FilterButtons = ({ availableStatuses, selectedFilter, onFilterChange }) => (
    <View style={styles.filterContainer}>
        {availableStatuses.map((status) => {
            const { color, icon, text } = statusConfigFilter[status] || { color: colors.grey, icon: 'filter', text: 'Filtro' };
            const isActive = selectedFilter === status;
            const textColor = isActive ? colors.white : color;

            return (
                <Pressable
                    key={status}
                    style={[
                        styles.filterButton,
                        isActive && styles.filterButtonActive
                    ]}
                    onPress={() => onFilterChange(status)}
                >
                    <MaterialCommunityIcons
                        name={icon}
                        size={20}
                        color={textColor}
                    />
                    <Text
                        style={[
                            styles.filterButtonText,
                            { color: textColor }
                        ]}
                    >
                        {text}
                    </Text>
                </Pressable>
            );
        })}
    </View>
);


const ProcessosContent = () => {
    const { dados, isLoading } = useDados();
    const processosLista = dados?.ordem?.processos || [];
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [currentPage, setCurrentPage] = useState({});
    const [modalVisible, setModalVisible] = useState(null);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('Todos');

    const statusToModalMap = {
        'Não Iniciado': 'NaoIniciado',
        'Produzindo': 'Produzindo',
        'Processo Concluido': null,
        'S/Apontamento': null,
        'Interrompido': null
    };

    const openModal = (modalType, process) => {
        setModalVisible(modalType);
        setSelectedProcess(process);
    };

    const processoAtual = processosLista.find(processo =>
        statusToModalMap[processo.status] === modalVisible
    );

    const closeModal = () => {
        setModalVisible(null);
        setSelectedProcess(null);
    };

    const handleFilterChange = (status) => {
        setSelectedFilter(status);
    };



    const availableStatuses = useMemo(() => {
        const statuses = getUniqueStatuses(processosLista);
        return ['Todos', ...statuses];
    }, [processosLista]);

    const filteredProcessos = processosLista.filter((processo) => {
        if (selectedFilter === 'Todos') {
            return true;
        }
        return processo.status === selectedFilter;
    });

    const renderItem = useCallback(({ item }) => {
        if (!(item.detalhes || item.acessorios?.length > 0 || item.componentes?.length > 0)) {
            return null;
        }

        const isExpanded = item.processo === expandedItemId;
        const page = currentPage[item.processo] || 0;

        const statusConfig = {
            'Processo Concluido': {
                icon: 'check-circle-outline',
                text: 'Concluído',
                color: '#09A08D',
                modalType: null,
            },
            'Não Iniciado': {
                icon: 'play-circle-outline',
                text: 'Não Iniciado',
                color: '#FFB300',
                modalType: 'NaoIniciado',
            },
            'Produzindo': {
                icon: 'cog-play',
                text: 'Produzindo',
                color: '#1E90FF',
                modalType: 'Produzindo',
            },
            'Interrompido': {
                icon: 'stop-circle-outline',
                text: 'Interrompido',
                color: '#FF0000',
                modalType: null,
            },
            'S/Apontamento': {
                icon: 'stop-circle-outline',
                text: 'S/Apontamento',
                color: '#666',
                modalType: null,
            },

        };
        const { icon, text, color, modalType } = statusConfig[item.status] || {};

        return (
            <View style={styles.itemContainer}>
                <Pressable
                    onPress={() => setExpandedItemId(isExpanded ? null : item.processo)}
                    style={styles.itemHeader}
                >
                    <Text style={styles.itemProcess}>{item.processo}</Text>
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemAction}>{item.acao}</Text>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemText}>Prod: {item.quantidade}  Queb: {item.quebras}</Text>
                        </View>
                    </View>
                    <View style={styles.itemTags}>
                        {item.detalhes && (
                            <Text style={[styles.itemTag, styles.detailTag]}>Detalhes</Text>
                        )}
                        {item.acessorios && item.acessorios.length > 0 && (
                            <Text style={[styles.itemTag, styles.accessoryTag]}>Acessórios</Text>
                        )}
                        {item.componentes && item.componentes.length > 0 && (
                            <Text style={[styles.itemTag, styles.componentTag]}>Componentes</Text>
                        )}
                    </View>
                    <View style={styles.actionButtons}>
                        <Pressable style={[styles.statusButton, { borderColor: color }]}
                            onPress={() => modalType && openModal(modalType, item)}>
                            {icon && (
                                <MaterialCommunityIcons name={icon} size={24} color={color} />
                            )}
                            <Text style={[styles.statusButtonText, { color }]}>
                                {text}
                            </Text>
                        </Pressable>
                    </View>
                </Pressable>
                {isExpanded && (
                    <ExpandedContent
                        item={item}
                        currentPage={page}
                        setCurrentPage={(position) => setCurrentPage(prev => ({
                            ...prev,
                            [item.processo]: position
                        }))}
                    />
                )}
            </View>
        );
    }, [expandedItemId, currentPage, selectedFilter]);

    if (isLoading) {
        return (
            <View style={globalStyles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!filteredProcessos.length) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Nenhum processo disponível</Text>
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerTitle}>Processos</Text>
            </View>
            <FilterButtons
                availableStatuses={availableStatuses}
                selectedFilter={selectedFilter}
                onFilterChange={handleFilterChange}
            />
            {filteredProcessos.length > 0 ? (
                <FlatList
                    data={filteredProcessos}
                    keyExtractor={(item) => item.processo.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Nenhum processo disponível</Text>
                </View>
            )}
            {modalVisible === 'NaoIniciado' && (
                <ModalNaoIniciado
                    visible={modalVisible === 'NaoIniciado'}
                    onClose={closeModal}
                    postos={processoAtual ? processoAtual.postos_possiveis : []}
                    acao={processoAtual ? processoAtual.acao : ''}
                />
            )}
            {modalVisible === 'Produzindo' && (
                <ModalProduzindo
                    visible={modalVisible === 'Produzindo'}
                    onClose={closeModal}
                    postos={processoAtual ? processoAtual.postos_possiveis : []}
                    acao={processoAtual ? processoAtual.acao : ''}
                />
            )}
        </View>
    );
};

const Processos = () => {
    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <ProcessosContent />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        marginBottom: 12,
        backgroundColor: colors.white,
        borderRadius: 8,
        overflow: 'hidden',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
    },
    itemProcess: {
        fontWeight: 'bold',
        color: colors.primary,
        fontSize: 18,
        marginRight: 2,
    },
    itemDetails: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    itemInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    itemText: {
        color: '#333',
        fontSize: 14,
    },
    itemAction: {
        color: '#666',
        fontSize: 16,
        fontWeight: 'bold'
    },
    actionButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    statusButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderRadius: 8,
        justifyContent: 'center',
    },
    statusButtonText: {
        color: colors.white,
        marginLeft: 8,
    },
    pagerView: {
        minHeight: 150,
        width: width,
        flexGrow: 1,
    },
    pagerPage: {
        flex: 1,
        width: '96%',
    },
    tabContent: {
        padding: 10,
        backgroundColor: colors.white,
    },
    tabTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 8,
    },
    tabText: {
        color: colors.medium,
        fontSize: 16,
        marginBottom: 4,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 12,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 6,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: colors.dark,
    },
    itemTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 5,
    },
    itemTag: {
        backgroundColor: '#F0F0F0',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginRight: 5,
        fontSize: 13,
        color: '#333',
    },
    detailTag: {
        backgroundColor: '#e0f7fa',
    },
    accessoryTag: {
        backgroundColor: '#f1f8e9',
    },
    componentTag: {
        backgroundColor: '#fce4ec',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 15,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: colors.grey,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginHorizontal: 5,
        transition: 'background-color 0.3s ease',
    },
    filterButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    filterButtonText: {
        fontSize: 14,
        marginLeft: 8,
    },
});

export default Processos;
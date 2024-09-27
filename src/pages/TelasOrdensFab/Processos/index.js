import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import PagerView from 'react-native-pager-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ModalNaoIniciado, ModalProduzindo } from '../../../components/ModaisProcessos';
import { useDados } from '../../../contexts/DadosContext';
import permissaoUsuarios from '../../../hooks/permissaoUsuarios';
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
const PostosTab = ({ item }) => (
    <TabContent
        title="Postos"
        items={item.postos_possiveis || []}
        itemRenderer={(posto_possivel, index) => (
            <Text key={index} style={styles.tabText}>{posto_possivel.descricao}  ({posto_possivel.codigo_posto})</Text>
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
                    <Text style={styles.tabText}>{detalhes.tempo_processo}</Text>
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
        if (item.postos_possiveis?.length > 0) {
            pages.push(<View key="postos" style={styles.pagerPage}><PostosTab item={item} /></View>);
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


const ProcessosContent = () => {
    const permission = permissaoUsuarios();
    const { dados, isLoading } = useDados();
    const processosLista = dados?.ordem?.processos || [];
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [currentPage, setCurrentPage] = useState({});
    const [modalVisible, setModalVisible] = useState(null);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [selectedStatuses, setSelectedStatuses] = useState([
        'Não Iniciado',
        'Produzindo',
        'Processo Concluido',
        'Interrompido'
    ]);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [modalValues, setModalValues] = useState({
        numeroOrdem: null,
        lote: null,
        processo: null,
    });


    const availableStatuses = useMemo(() => {
        const statuses = getUniqueStatuses(processosLista);
        if (permission === 'A') {
            return statuses.filter(status => status !== 'S/Apontamento');
        }
        return statuses;
    }, [processosLista, permission]);

    const toggleStatus = (status) => {
        if (permission === 'A' && status === 'S/Apontamento') {
            return;
        }
        setSelectedStatuses(prevSelected => {
            if (prevSelected.includes(status)) {
                return prevSelected.filter(s => s !== status);
            } else {
                return [...prevSelected, status];
            }
        });
    };

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
        setModalValues({
            numeroOrdem: dados.ordem.numero_ordem,
            lote: dados.ordem.lote,
            processo: process.processo,
        });
    };

    const processoAtual = processosLista.find(processo =>
        statusToModalMap[processo.status] === modalVisible
    );

    const closeModal = () => {
        setModalVisible(null);
        setSelectedProcess(null);
    };

    const filteredProcessos = processosLista.filter(processo => {
        return selectedStatuses.includes(processo.status);
    });

    const renderItem = useCallback(({ item }) => {
        if (!(item.detalhes || item.acessorios?.length > 0 || item.componentes?.length > 0)) {
            return null;
        }

        if (permission === 'A' && item.status === 'S/Apontamento') {
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
                        <Text style={[styles.itemTag, styles.detailTag]}>Ver mais</Text>
                    </View>
                    <View style={styles.actionButtons}>
                        <Pressable
                            style={[styles.statusButton, { borderColor: color }]}
                            onPress={() => {
                                if (modalType) {
                                    openModal(modalType, item);
                                }
                            }}
                        >
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
    }, [expandedItemId, currentPage, modalVisible, selectedStatuses, permission]);

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
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setIsFilterVisible(true)}
                >
                    <MaterialCommunityIcons name="filter-outline" size={24} color={colors.white} />
                    <Text style={styles.filterButtonText}>Filtrar</Text>
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={isFilterVisible}
                onRequestClose={() => setIsFilterVisible(false)}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filtrar por Status</Text>
                            <Pressable
                                style={styles.closeButton}
                                onPress={() => setIsFilterVisible(false)}
                            >
                                <MaterialCommunityIcons name="close" size={28} color={colors.dark} />
                            </Pressable>
                        </View>
                        {availableStatuses.map(status => (
                            <Pressable
                                key={status}
                                style={styles.checkboxWrapper}
                                onPress={() => toggleStatus(status)}
                            >
                                <View style={[
                                    styles.checkbox,
                                    selectedStatuses.includes(status) && styles.checkboxChecked
                                ]}>
                                    {selectedStatuses.includes(status) && (
                                        <MaterialCommunityIcons
                                            name="check"
                                            size={16}
                                            color={colors.white}
                                            style={styles.checkboxIcon}
                                        />
                                    )}
                                </View>
                                <Text style={styles.checkboxLabel}>
                                    {statusConfigFilter[status]?.text || status}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </Modal>

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
            {modalVisible === 'NaoIniciado' && selectedProcess && (
                <ModalNaoIniciado
                    visible={modalVisible === 'NaoIniciado'}
                    onClose={closeModal}
                    postos={selectedProcess.postos_possiveis || []}
                    acao={selectedProcess.acao || ''}
                    numeroOrdem={modalValues.numeroOrdem}
                    lote={modalValues.lote}
                    processo={modalValues.processo}

                />
            )}
            {modalVisible === 'Produzindo' && selectedProcess && (
                <ModalProduzindo
                    visible={modalVisible === 'Produzindo'}
                    onClose={closeModal}
                    postos={selectedProcess.postos_possiveis || []}
                    acao={selectedProcess.acao || ''}
                    numeroOrdem={modalValues.numeroOrdem}
                    lote={modalValues.lote}
                    processo={modalValues.processo}
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
    filterTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
    },
    filterContainer: {
        position: 'relative',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        marginLeft: 10,
    },
    filterButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: colors.white,
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 20,
        width: '70%',
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
    },
    closeButton: {
        padding: 5,
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12, // Ajustado o espaçamento vertical entre as opções
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 5,
        borderWidth: 2, // Adicionando largura na borda
        borderColor: colors.grey, // Cor da borda padrão
        backgroundColor: colors.white,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.primary,
        borderColor: colors.primary, // Cor da borda quando selecionado
    },
    checkboxIcon: {
        position: 'absolute',
    },
    checkboxLabel: {
        fontSize: 16,
        color: colors.dark,
    },
    applyButton: {
        marginTop: 20,
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    applyButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});


export default Processos;
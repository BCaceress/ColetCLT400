import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const ModalNaoIniciado = ({ visible, onClose, postos, acao, onConfirm }) => {
    const [selectedPosto, setSelectedPosto] = useState('');

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Início de Produção</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialCommunityIcons name="close-thick" size={30} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.modalText}>Ação: {acao}</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedPosto}
                            onValueChange={(itemValue) => setSelectedPosto(itemValue)}
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                        >
                            {postos && postos.length > 0 ? (
                                postos.map(posto => (
                                    <Picker.Item
                                        key={posto.codigo_posto}
                                        label={posto.descricao}
                                        value={posto.codigo_posto}
                                    />
                                ))
                            ) : (
                                <Picker.Item label="Nenhum posto disponível" value="" />
                            )}
                        </Picker>
                    </View>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => onConfirm(selectedPosto)}
                    >
                        <Text style={styles.buttonText}>Confirmar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export const ModalProduzindo = ({ visible, onClose, postos, acao, onConfirm }) => {
    const [selectedPosto, setSelectedPosto] = useState('');
    const [operadorCodigo, setOperadorCodigo] = useState('');
    const [quantidadeProduzida, setQuantidadeProduzida] = useState('');
    const [showQuebraInput, setShowQuebraInput] = useState(false);
    const [motivoQuebra, setMotivoQuebra] = useState('');
    const [quantidadeQuebra, setQuantidadeQuebra] = useState('');
    const [selectedAction, setSelectedAction] = useState(null);

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Produzindo</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialCommunityIcons name="close-thick" size={30} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.modalText}>Ação: {acao}</Text>
                    <View style={styles.actionContainer}>
                        <ActionButton
                            title="Pause"
                            icon="pause"
                            isSelected={selectedAction === 'Pause'}
                            onPress={() => setSelectedAction('Pause')}
                        />
                        <ActionButton
                            title="Stop"
                            icon="stop"
                            isSelected={selectedAction === 'Stop'}
                            onPress={() => setSelectedAction('Stop')}
                        />
                    </View>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedPosto}
                            onValueChange={(itemValue) => setSelectedPosto(itemValue)}
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                        >
                            {postos && postos.length > 0 ? (
                                postos.map(posto => (
                                    <Picker.Item
                                        key={posto.codigo_posto}
                                        label={posto.descricao}
                                        value={posto.codigo_posto}
                                    />
                                ))
                            ) : (
                                <Picker.Item label="Nenhum posto disponível" value="" />
                            )}
                        </Picker>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Código do Operador"
                        value={operadorCodigo}
                        onChangeText={setOperadorCodigo}
                        placeholderTextColor="#666"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Quantidade Produzida"
                        value={quantidadeProduzida}
                        onChangeText={setQuantidadeProduzida}
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                    />
                    {showQuebraInput && (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Motivo da Quebra"
                                value={motivoQuebra}
                                onChangeText={setMotivoQuebra}
                                placeholderTextColor="#666"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Quantidade de Quebra"
                                value={quantidadeQuebra}
                                onChangeText={setQuantidadeQuebra}
                                placeholderTextColor="#666"
                                keyboardType="numeric"
                            />
                        </>
                    )}

                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => {
                            if (!selectedAction) {
                                alert('Você deve selecionar uma ação!');
                                return;
                            }
                            onConfirm(selectedPosto, operadorCodigo, quantidadeProduzida, motivoQuebra, quantidadeQuebra, selectedAction);
                        }}
                    >
                        <Text style={styles.buttonText}>Confirmar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const ActionButton = ({ title, icon, isSelected, onPress }) => (
    <TouchableOpacity
        style={[styles.actionButton, isSelected && styles.actionButtonSelected]}
        onPress={onPress}
    >
        <MaterialCommunityIcons name={icon} size={32} color={isSelected ? '#09A08D' : '#666'} />
        <Text style={[styles.actionText, isSelected && styles.actionTextSelected]}>
            {title}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        maxWidth: 500,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 10,
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    modalText: {
        color: '#666',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 12,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 16,
        color: '#333',
        fontSize: 16,
    },
    pickerContainer: {
        width: '100%',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 16,
    },
    picker: {
        width: '100%',
        height: 50,
        color: '#333',
    },
    pickerItem: {
        color: '#333',
    },
    buttonContainer: {
        marginTop: 20,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 12,
        width: '45%',
        height: 100,
        backgroundColor: '#fff',
    },
    actionButtonSelected: {
        borderColor: '#09A08D',
        backgroundColor: '#E8F6F3',
    },
    actionText: {
        marginTop: 8,
        color: '#666',
        fontSize: 16,
    },
    actionTextSelected: {
        color: '#09A08D',
    },
    cancelButton: {
        backgroundColor: '#FF0000',
        padding: 10,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#09A08D',
        padding: 10,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

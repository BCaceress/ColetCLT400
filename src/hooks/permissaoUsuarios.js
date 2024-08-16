import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const permissaoUsuarios = () => {
    const [permission, setPermission] = useState(null);

    useEffect(() => {
        const fetchPermission = async () => {
            const storedPermission = await AsyncStorage.getItem('@MyApp:permissao');
            setPermission(storedPermission);
        };

        fetchPermission();
    }, []);

    return permission;
};

export default permissaoUsuarios;

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Configuracao from './pages/Configuracao';
import Login from './pages/Login';
import Opcoes from './pages/Opcoes';
import TelasOrdensFab from './pages/TelasOrdensFab';
import Componentes from './pages/TelasOrdensFab/Componentes';
import DadosGerais from './pages/TelasOrdensFab/DadosGerais';
import OFVirtual from './pages/TelasOrdensFab/OFVirtual';
import Processos from './pages/TelasOrdensFab/Processos';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabRoutes() {
  return (
    <Tab.Navigator tabBarOptions={{
      tabBarStyle: [{ display: 'flex', fontSize: 16 }, null],
    }}>
      <Tab.Screen name="DadosGerais" component={DadosGerais} options={{
        tabBarIcon: () => (
          <Icon
            name="file-lines"
            size={24}
            color="#000"
          />
        ),
      }}
      />
      <Tab.Screen name="Processos" component={Processos} options={{
        tabBarIcon: () => (
          <Icon
            name="list-check"
            size={24}
            color="#000"
          />
        ),
      }}
      />
      <Tab.Screen name="OFVirtual" component={OFVirtual} options={{
        tabBarIcon: () => (
          <Icon
            name="file-pdf"
            size={24}
            color="#000"
          />
        ),
      }}
      />
      <Tab.Screen name="Componentes" component={Componentes} options={{
        tabBarIcon: () => (
          <Icon
            name="screwdriver-wrench"
            size={24}
            color="#000"
          />
        ),
      }}
      />
    </Tab.Navigator>
  )
}
export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#09A08D',
          },
          headerTintColor: '#fff',
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerTitle: '',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Configuracao"
          component={Configuracao}
          options={{
            headerTitle: 'Configurações',
          }}
        />
        <Stack.Screen
          name="Opcoes"
          component={Opcoes}
          options={{
            headerTitle: 'Opções',
          }}
        />
        <Stack.Screen
          name="TelasOrdensFab"
          component={TelasOrdensFab}
          options={{
            headerTitle: 'Ordens de Fabricação e Apontamentos',
          }}
        />
        <Stack.Screen name="Tab" component={TabRoutes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

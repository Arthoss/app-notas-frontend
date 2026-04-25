import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1565C0',
        tabBarInactiveTintColor: '#90A4AE',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E3F2FD',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: '#1565C0' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Consulta',
          headerTitle: '🔍 Consulta de Notas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-circle-outline" size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="registro-estudiante"
        options={{
          title: 'Reg. Estud.',
          headerTitle: '👤 Registro Estudiante',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="registro-nota"
        options={{
          title: 'Reg. Nota',
          headerTitle: '📝 Registro de Nota',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="create-outline" size={size + 2} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

import { Stack } from 'expo-router';
import { NotasProvider } from '../context/NotasContext';

export default function Layout() {
  return (
    <NotasProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </NotasProvider>
  );
}
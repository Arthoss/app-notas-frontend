import { useState } from 'react';
import {
  ActivityIndicator, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';

const API_URL = 'https://app-notas-backend-jeh6.onrender.com';

const CAMPOS = [
  { key: 'cedula',  label: 'Cédula',   placeholder: 'Número de cédula',   keyboard: 'numeric',        autoCap: 'none'   },
  { key: 'nombre',  label: 'Nombre',   placeholder: 'Nombre completo',    keyboard: 'default',        autoCap: 'words'  },
  { key: 'correo',  label: 'Correo',   placeholder: 'correo@ejemplo.com', keyboard: 'email-address',  autoCap: 'none'   },
  { key: 'celular', label: 'Celular',  placeholder: '300 000 0000',       keyboard: 'phone-pad',      autoCap: 'none'   },
  { key: 'materia', label: 'Materia',  placeholder: 'Nombre de la materia',keyboard: 'default',       autoCap: 'words'  },
] as const;

type FormKey = 'cedula' | 'nombre' | 'correo' | 'celular' | 'materia';
type Form = Record<FormKey, string>;

const VACIO: Form = { cedula: '', nombre: '', correo: '', celular: '', materia: '' };

export default function RegistroEstudianteScreen() {
  const [form, setForm]       = useState<Form>(VACIO);
  const [loading, setLoading] = useState(false);
  const [exito, setExito]     = useState(false);

  const set = (key: FormKey, val: string) => {
    setExito(false);
    setForm(f => ({ ...f, [key]: val }));
  };

  const registrar = async () => {
    if (!form.cedula.trim() || !form.nombre.trim()) {
      alert('Cédula y nombre son obligatorios');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/registro-estudiante`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error');
      setExito(true);
      setForm(VACIO);
    } catch (e: any) {
      alert(e.message || 'Error al registrar el estudiante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Datos del Estudiante</Text>

        {CAMPOS.map(({ key, label, placeholder, keyboard, autoCap }) => (
          <View key={key} style={styles.campo}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              value={form[key]}
              onChangeText={v => set(key, v)}
              placeholder={placeholder}
              placeholderTextColor="#B0BEC5"
              keyboardType={keyboard as any}
              autoCapitalize={autoCap as any}
            />
          </View>
        ))}

        {exito && (
          <View style={styles.exitoBox}>
            <Text style={styles.exitoTexto}>✅ Estudiante registrado exitosamente</Text>
          </View>
        )}

        <TouchableOpacity style={styles.boton} onPress={registrar} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.botonTexto}>Registrar Estudiante</Text>
          }
        </TouchableOpacity>
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#EEF4FF', padding: 16 },
  card:       { backgroundColor: '#fff', borderRadius: 14, padding: 16, elevation: 2 },
  cardTitle:  { fontSize: 16, fontWeight: '700', color: '#1565C0', marginBottom: 16 },
  campo:      { marginBottom: 14 },
  label:      { fontSize: 13, fontWeight: '600', color: '#546E7A', marginBottom: 4 },
  input:      { borderWidth: 1.5, borderColor: '#BBDEFB', borderRadius: 10, padding: 12, backgroundColor: '#F8FBFF', fontSize: 15, color: '#1A237E' },
  exitoBox:   { backgroundColor: '#E8F5E9', borderRadius: 10, padding: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#2E7D32' },
  exitoTexto: { color: '#2E7D32', fontWeight: '600', fontSize: 14 },
  boton:      { backgroundColor: '#2E7D32', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 4 },
  botonTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

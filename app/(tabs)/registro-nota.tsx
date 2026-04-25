import { useState } from 'react';
import {
  ActivityIndicator, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';

const API_URL = 'https://app-notas-backend-jeh6.onrender.com';

type Form = { cedula: string; materia: string; nota1: string; nota2: string; nota3: string; nota4: string; };
const VACIO: Form = { cedula: '', materia: '', nota1: '', nota2: '', nota3: '', nota4: '' };

export default function RegistroNotaScreen() {
  const [form, setForm]           = useState<Form>(VACIO);
  const [definitiva, setDefinitiva] = useState('');
  const [loading, setLoading]     = useState(false);
  const [exito, setExito]         = useState(false);

  const set = (key: keyof Form, val: string) => {
    setExito(false);
    const nuevo = { ...form, [key]: val };
    setForm(nuevo);
    const ns = [nuevo.nota1, nuevo.nota2, nuevo.nota3, nuevo.nota4].map(Number);
    if (ns.every(n => !isNaN(n) && String(nuevo[('nota' + (ns.indexOf(n) + 1)) as keyof Form]).trim() !== '')) {
      setDefinitiva(((ns[0] + ns[1] + ns[2] + ns[3]) / 4).toFixed(2));
    } else {
      setDefinitiva('');
    }
  };

  const recalcular = (nuevo: Form) => {
    const ns = [nuevo.nota1, nuevo.nota2, nuevo.nota3, nuevo.nota4].map(v => parseFloat(v));
    if (ns.every(n => !isNaN(n) && n >= 0)) {
      setDefinitiva(((ns[0] + ns[1] + ns[2] + ns[3]) / 4).toFixed(2));
    } else {
      setDefinitiva('');
    }
  };

  const setField = (key: keyof Form, val: string) => {
    setExito(false);
    const nuevo = { ...form, [key]: val };
    setForm(nuevo);
    recalcular(nuevo);
  };

  const registrar = async () => {
    if (!form.cedula.trim() || !form.materia.trim()) {
      alert('Cédula y materia son obligatorios');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/registro-nota`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, definitiva }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error');
      setExito(true);
      setForm(VACIO);
      setDefinitiva('');
    } catch (e: any) {
      alert(e.message || 'Error al registrar las notas');
    } finally {
      setLoading(false);
    }
  };

  const notaColorDef = () => {
    const n = parseFloat(definitiva);
    if (isNaN(n)) return '#90A4AE';
    if (n >= 4.0) return '#2E7D32';
    if (n >= 3.0) return '#F57F17';
    return '#C62828';
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Identificación</Text>
        <View style={styles.campo}>
          <Text style={styles.label}>Cédula del Estudiante</Text>
          <TextInput
            style={styles.input}
            value={form.cedula}
            onChangeText={v => setField('cedula', v)}
            placeholder="Ej: 123456789"
            placeholderTextColor="#B0BEC5"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.campo}>
          <Text style={styles.label}>Materia</Text>
          <TextInput
            style={styles.input}
            value={form.materia}
            onChangeText={v => setField('materia', v)}
            placeholder="Nombre de la materia"
            placeholderTextColor="#B0BEC5"
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notas</Text>
        <View style={styles.notasGrid}>
          {(['nota1','nota2','nota3','nota4'] as const).map((k, i) => (
            <View key={k} style={styles.notaCampo}>
              <Text style={styles.label}>Nota {i + 1}</Text>
              <TextInput
                style={[styles.input, styles.inputNota]}
                value={form[k]}
                onChangeText={v => setField(k, v)}
                placeholder="0.0"
                placeholderTextColor="#B0BEC5"
                keyboardType="decimal-pad"
                textAlign="center"
              />
            </View>
          ))}
        </View>

        {/* Definitiva calculada */}
        <View style={[styles.definitivaBox, { borderColor: notaColorDef() }]}>
          <Text style={styles.definitivaLabel}>Definitiva</Text>
          <Text style={[styles.definitivaValor, { color: notaColorDef() }]}>
            {definitiva || '—'}
          </Text>
        </View>
      </View>

      {exito && (
        <View style={styles.exitoBox}>
          <Text style={styles.exitoTexto}>✅ Notas registradas exitosamente</Text>
        </View>
      )}

      <TouchableOpacity style={styles.boton} onPress={registrar} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botonTexto}>Guardar Notas</Text>
        }
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#EEF4FF', padding: 16 },
  card:             { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, elevation: 2 },
  cardTitle:        { fontSize: 16, fontWeight: '700', color: '#1565C0', marginBottom: 12 },
  campo:            { marginBottom: 14 },
  label:            { fontSize: 13, fontWeight: '600', color: '#546E7A', marginBottom: 4 },
  input:            { borderWidth: 1.5, borderColor: '#BBDEFB', borderRadius: 10, padding: 12, backgroundColor: '#F8FBFF', fontSize: 15, color: '#1A237E' },
  notasGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  notaCampo:        { width: '47%' },
  inputNota:        { fontSize: 20, fontWeight: 'bold', paddingVertical: 14 },
  definitivaBox:    { borderWidth: 2, borderRadius: 12, padding: 16, alignItems: 'center' },
  definitivaLabel:  { fontSize: 13, fontWeight: '600', color: '#546E7A', marginBottom: 4 },
  definitivaValor:  { fontSize: 36, fontWeight: 'bold' },
  exitoBox:         { backgroundColor: '#E8F5E9', borderRadius: 10, padding: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#2E7D32' },
  exitoTexto:       { color: '#2E7D32', fontWeight: '600', fontSize: 14 },
  boton:            { backgroundColor: '#1565C0', borderRadius: 10, padding: 14, alignItems: 'center' },
  botonTexto:       { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

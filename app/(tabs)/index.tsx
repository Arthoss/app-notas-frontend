import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNotas } from '../../context/NotasContext';

const API_URL = 'https://app-notas-backend-jeh6.onrender.com';

export default function ConsultaScreen() {
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);
  const { resultado, setResultado } = useNotas();

  const consultar = async () => {
    if (!cedula.trim()) { alert('Ingresa una cédula'); return; }
    setLoading(true);
    setResultado(null);
    try {
      const res = await fetch(`${API_URL}/api/consulta?cedula=${cedula.trim()}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setResultado(json.data);
    } catch {
      alert('Estudiante no encontrado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Buscar Estudiante</Text>
        <Text style={styles.label}>Cédula</Text>
        <TextInput
          style={styles.input}
          value={cedula}
          onChangeText={setCedula}
          placeholder="Ej: 123456789"
          keyboardType="numeric"
          onSubmitEditing={consultar}
        />
        <TouchableOpacity style={styles.botonPrimario} onPress={consultar} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.botonTexto}>Consultar</Text>}
        </TouchableOpacity>
      </View>

      {resultado && (
        <>
          <View style={styles.card}>
            <View style={styles.badgeHeader}>
              <Text style={styles.badgeTexto}>Estudiante</Text>
            </View>
            <Text style={styles.nombreGrande}>{resultado.estudiante.nombre}</Text>
            <View style={styles.infoGrid}>
              {[
                { label: 'Cédula',   valor: resultado.estudiante.cedula },
                { label: 'Celular',  valor: resultado.estudiante.celular || '—' },
                { label: 'Correo',   valor: resultado.estudiante.correo  || '—' },
                { label: 'Materia',  valor: resultado.estudiante.materia || '—' },
              ].map(({ label, valor }) => (
                <View key={label} style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{label}</Text>
                  <Text style={styles.infoValor}>{valor}</Text>
                </View>
              ))}
            </View>
          </View>

          {resultado.notas.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.sinNotas}>No hay notas registradas</Text>
            </View>
          ) : resultado.notas.map((n, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.notaHeader}>
                <Text style={styles.notaMateria}>{n.materia}</Text>
                <View style={[styles.definitvaBadge, { backgroundColor: notaColor(n.definitiva) }]}>
                  <Text style={styles.definitivaTexto}>{Number(n.definitiva).toFixed(1)}</Text>
                </View>
              </View>
              <View style={styles.notasGrid}>
                {[['Nota 1', n.nota1],['Nota 2', n.nota2],['Nota 3', n.nota3],['Nota 4', n.nota4]].map(([lbl, val]) => (
                  <View key={String(lbl)} style={styles.notaCelda}>
                    <Text style={styles.notaCeldaLabel}>{lbl}</Text>
                    <Text style={styles.notaCeldaValor}>{Number(val).toFixed(1)}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.separador} />
              <View style={styles.definitivaFila}>
                <Text style={styles.definitivaLabel}>Definitiva</Text>
                <Text style={[styles.definitivaGrande, { color: notaColor(n.definitiva) }]}>
                  {Number(n.definitiva).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </>
      )}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function notaColor(nota: number): string {
  if (nota >= 4.0) return '#2E7D32';
  if (nota >= 3.0) return '#F57F17';
  return '#C62828';
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#EEF4FF', padding: 16 },
  card:            { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, elevation: 2 },
  cardTitle:       { fontSize: 16, fontWeight: '700', color: '#1565C0', marginBottom: 12 },
  label:           { fontSize: 13, fontWeight: '600', color: '#546E7A', marginBottom: 4 },
  input:           { borderWidth: 1.5, borderColor: '#BBDEFB', borderRadius: 10, padding: 12, backgroundColor: '#F8FBFF', fontSize: 15, color: '#1A237E', marginBottom: 4 },
  botonPrimario:   { backgroundColor: '#1565C0', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 12 },
  botonTexto:      { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  badgeHeader:     { backgroundColor: '#E3F2FD', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 8 },
  badgeTexto:      { color: '#1565C0', fontWeight: '700', fontSize: 12 },
  nombreGrande:    { fontSize: 20, fontWeight: 'bold', color: '#1A237E', marginBottom: 12 },
  infoGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoItem:        { width: '47%', backgroundColor: '#F8FBFF', borderRadius: 8, padding: 10 },
  infoLabel:       { fontSize: 11, color: '#90A4AE', fontWeight: '600', marginBottom: 2 },
  infoValor:       { fontSize: 14, color: '#263238', fontWeight: '600' },
  notaHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  notaMateria:     { fontSize: 16, fontWeight: 'bold', color: '#1A237E', flex: 1 },
  definitvaBadge:  { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  definitivaTexto: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  notasGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  notaCelda:       { width: '47%', backgroundColor: '#F8FBFF', borderRadius: 8, padding: 10, alignItems: 'center' },
  notaCeldaLabel:  { fontSize: 11, color: '#90A4AE', fontWeight: '600' },
  notaCeldaValor:  { fontSize: 18, fontWeight: 'bold', color: '#37474F', marginTop: 2 },
  separador:       { height: 1, backgroundColor: '#EEF4FF', marginVertical: 12 },
  definitivaFila:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  definitivaLabel: { fontSize: 15, fontWeight: '600', color: '#546E7A' },
  definitivaGrande:{ fontSize: 26, fontWeight: 'bold' },
  sinNotas:        { textAlign: 'center', color: '#90A4AE', fontSize: 15, paddingVertical: 10 },
});

import { useContext } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { PokemonContext } from '../../context/PokemonContext';

export default function DetailScreen() {
  const { pokemon } = useContext(PokemonContext);

  if (!pokemon) return <Text>No hay un Pokémon seleccionado</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: pokemon.sprites.back_default }} style={styles.image} />
      <Text>Imagen espalda</Text>

      
      <Text>brillo Pokemon</Text>
      <Image source={{ uri: pokemon.sprites.front_shiny }} style={styles.image} />

      <Text>Peso: {pokemon.weight}</Text>

      <Text>Tipo de pokemon </Text>
      {pokemon.types.map((t, index) => (
        <Text key={index}>- {t.type.name}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  image: {
    width: 120,
    height: 120,
    alignSelf: 'center'
  }
});
import { useContext, useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { PokemonContext } from '../../context/PokemonContext';

export default function HomeScreen() {
  const [name, setName] = useState('');
  const { pokemon, setPokemon } = useContext(PokemonContext);

  const buscarPokemon = async () => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      const data = await res.json();
      setPokemon(data);
    } catch (error) {
      alert('Pokémon no encontrado');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Digite nombre de Pokémon</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Digite nombre"
      />

      <Button title="Consultar" onPress={buscarPokemon} />

      {pokemon && (
        <>
          <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
          <Text>Altura: {pokemon.height}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    marginVertical: 10,
    padding: 8
  },
  image: {
    width: 120,
    height: 120,
    alignSelf: 'center'
  }
});
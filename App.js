import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import axios from 'axios';

export default function App() {

  const [nomeDoDrink, setNomeDoDrink] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [mensagemDeErro, setMensagemDeErro] = useState('');

  async function buscar() {
    try {
      const resposta = await axios.get(`http://10.136.63.240:1234/drink.json`);
      const drinks = resposta.data.drinks;

      if (drinks && Array.isArray(drinks)) {
        const drink = drinks.find(item => item.strDrink.toLowerCase() === nomeDoDrink.toLowerCase());

        if (drink) {
          const ingredientesDoDrink = [];
          for (let i = 1; i <= 15; i++) {
            const ingrediente = drink[`strIngredient${i}`];
            const medida = drink[`strMeasure${i}`];
            if (ingrediente && ingrediente.trim() !== '') {
              ingredientesDoDrink.push({ ingrediente, medida });
            }
          }
          setIngredientes(ingredientesDoDrink);
          setMensagemDeErro('');
        } else {
          setIngredientes([]);
          setMensagemDeErro('Drink não encontrado');
        }
      } else {
        setIngredientes([]);
        setMensagemDeErro('Resposta inválida do servidor');
      }
    } catch (error) {
      console.log("Error" + error);
      setMensagemDeErro('Erro ao buscar o drink. Por favor, tente novamente mais tarde.');
    }
  }

  return (
    <View style={styles.container}>
      <Text>Informe o nome do Drink:</Text>
      <TextInput
        style={styles.inputBox}
        placeholder='Nome do Drink'
        value={nomeDoDrink}
        onChangeText={text => setNomeDoDrink(text)}
      />
      <Button
        title='Buscar'
        onPress={buscar}
      />

      {mensagemDeErro ? <Text style={styles.mensagemDeErro}>{mensagemDeErro}</Text> : null}

      <Text style={styles.tituloSeção}>Ingredientes:</Text>
      <FlatList
        data={ingredientes}
        renderItem={({ item }) => (
          <Text>{`${item.ingrediente} - ${item.medida}`}</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  inputBox: {
    backgroundColor: '#D1D19E',
    height: 40,
    width: 200,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  tituloSeção: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  mensagemDeErro: {
    color: 'red',
    marginTop: 10,
  },
});

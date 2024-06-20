import { useState } from 'react';
import {
  StyleSheet, Text, View, StatusBar, TextInput, Platform, Pressable, ScrollView,
  ActivityIndicator, Alert, Keyboard
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const statusBarHeight = StatusBar.currentHeight;
const KEY_GPT = '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';

export default function App() {

  const [genre, setGenre] = useState("");
  const [numBooks, setNumBooks] = useState(3); // Estado para controlar a quantidade de livros
  const [loading, setLoading] = useState(false);
  const [bookRecommendation, setBookRecommendation] = useState("");

  async function handleGenerate() {
    if (genre === "") {
      Alert.alert("Atenção", "Selecione um gênero literário!")
      return;
    }

    setBookRecommendation("")
    setLoading(true);
    Keyboard.dismiss();

    const prompt = `Recomende ${numBooks.toFixed(0)} livros do gênero ${genre}, com uma breve sinopse para cada.`

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY_GPT}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.20,
        max_tokens: 500,
        top_p: 1,
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data.choices[0].message.content);
        setBookRecommendation(data.choices[0].message.content)
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      })

  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
      <Text style={styles.heading}>Book Recs</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Gênero literário</Text>
        <TextInput
          placeholder="Ex: Romance, Ficção Científica, Mistério"
          style={styles.input}
          value={genre}
          onChangeText={(text) => setGenre(text)}
        />

        <Text style={styles.label}>Quantidade de livros: <Text style={styles.days}> {numBooks.toFixed(0)} </Text></Text>
        <Slider
          minimumValue={1}
          maximumValue={10}
          minimumTrackTintColor="#009688"
          maximumTrackTintColor="#000000"
          value={numBooks}
          onValueChange={(value) => setNumBooks(value)}
        />
      </View>

      <Pressable style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Recomendar Livros</Text>
        <MaterialIcons name="book" size={24} color="#FFF" />
      </Pressable>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4 }} style={styles.containerScroll} showsVerticalScrollIndicator={false} >
        {loading && (
          <View style={styles.content}>
            <Text style={styles.title}>Buscando recomendação...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {bookRecommendation && (
          <View style={styles.content}>
            <Text style={styles.title}>Recomendação de Livros:</Text>
            <Text style={{ lineHeight: 24 }}>{bookRecommendation}</Text>
          </View>
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 54
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4287f5', // Alterado para azul
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginRight: 8,
  },
  content: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  },
});

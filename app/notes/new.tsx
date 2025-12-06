import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNotes } from '../lib/NotesContext';

export default function NewNote() {
  const { addNote } = useNotes();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | undefined>();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Brak uprawnień do galerii');
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
    if (!res.canceled && res.assets?.[0]?.uri) setImageUri(res.assets[0].uri);
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Brak uprawnień do lokalizacji');
    const pos = await Location.getCurrentPositionAsync({});
    setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
  };

  const onSave = () => {
    if (!title.trim()) return Alert.alert('Tytuł jest wymagany');
    const note = addNote({ title: title.trim(), body: body.trim(), imageUri, location });
    router.replace(`/notes/${note.id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tytuł</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Tytuł" />

      <Text style={styles.label}>Opis</Text>
      <TextInput style={[styles.input, styles.multiline]} value={body} onChangeText={setBody} placeholder="Opis" multiline />

      {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}
      <View style={styles.row}>
        <Button title="Wybierz zdjęcie" onPress={pickImage} />
        <Button title="Pobierz lokalizację" onPress={getLocation} />
      </View>

      <View style={{ marginTop: 16 }}>
        <Button title="Zapisz" onPress={onSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  label: { marginTop: 8, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginTop: 6 },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  preview: { width: '100%', height: 220, marginTop: 10, borderRadius: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 8 },
});
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import { useNotes } from '../lib/NotesContext';

export default function NoteDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNote, deleteNote } = useNotes();
  const router = useRouter();

  const note = id ? getNote(id) : undefined;

  if (!note) return <View style={styles.center}><Text>Notatka nie znaleziona</Text></View>;

  const onDelete = () => {
    Alert.alert('Usuń notatkę', 'Na pewno usunąć?', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () => {
          deleteNote(note.id);
          router.replace('/notes');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.date}>{new Date(note.createdAt).toLocaleString()}</Text>

      {note.imageUri ? <Image source={{ uri: note.imageUri }} style={styles.image} /> : null}

      {note.location ? (
        <Text style={styles.location}>📍 {note.location.latitude.toFixed(5)}, {note.location.longitude.toFixed(5)}</Text>
      ) : null}

      <Text style={styles.body}>{note.body}</Text>

      <View style={styles.actions}>
        <Button title="Edytuj" onPress={() => router.push(`/notes/${note.id}/edit`)} />
        <Button title="Usuń" onPress={onDelete} color="#b00020" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  date: { color: '#666', marginBottom: 12 },
  image: { width: '100%', height: 240, borderRadius: 8, marginBottom: 12 },
  location: { marginBottom: 12, fontSize: 14 },
  body: { fontSize: 16, lineHeight: 22 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});
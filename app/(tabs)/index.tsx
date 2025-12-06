import { useRouter } from 'expo-router';
import React from 'react';
import { Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNotes } from '../lib/NotesContext';

export default function NotesListScreen() {
  const { notes } = useNotes();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista notatek</Text>
        <Button title="Nowa" onPress={() => router.push('/notes/new')} />
      </View>

      <FlatList
        data={notes}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => router.push(`/notes/${item.id}`)}>
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} style={styles.thumb} />
            ) : item.location ? (
              <Text style={styles.locationPin}>📍</Text>
            ) : (
              <View style={styles.thumbPlaceholder} />
            )}
            <View style={styles.info}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 8, borderBottomWidth: 1, borderColor: '#eee' },
  thumb: { width: 64, height: 64, borderRadius: 6 },
  thumbPlaceholder: { width: 64, height: 64, borderRadius: 6, backgroundColor: '#ddd' },
  locationPin: { fontSize: 32, width: 64, textAlign: 'center' },
  info: { marginLeft: 12, flex: 1 },
  titleText: { fontSize: 16, fontWeight: '500' },
  dateText: { color: '#666', marginTop: 4 },
});
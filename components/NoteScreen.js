import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const NoteScreen = ({ note, onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{note.date}</Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={{ color: '#007BFF', fontSize: 16 }}>Close</Text>
        </Pressable>
      </View>
      <Text style={styles.text}>{note.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  date: {
    fontSize: 18,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
  closeButton: {
    padding: 10,
  },
});

export default NoteScreen;

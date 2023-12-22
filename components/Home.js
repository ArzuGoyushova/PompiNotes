import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput, ScrollView, TouchableOpacity, Modal, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import NoteScreen from './NoteScreen';

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputHeight, setInputHeight] = useState(40);
    const maxInputHeight = 120;
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        loadNotes();
    }, []);

    const saveNotes = async () => {
        try {
            await AsyncStorage.setItem('notes', JSON.stringify(notes));
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    };

    const loadNotes = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem('notes');
            if (storedNotes) {
                setNotes(JSON.parse(storedNotes));
            }
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    };

    const addNote = () => {
        if (newNote.trim() !== '') {
            const currentDate = new Date().toLocaleString();
            const newNoteObject = { text: newNote, date: currentDate };
            setNotes([newNoteObject, ...notes]);
            setNewNote('');
            saveNotes();
            Keyboard.dismiss();
        }
    };

    const deleteNote = (index) => {
        const updatedNotes = [...notes];
        updatedNotes.splice(index, 1);
        setNotes(updatedNotes);
        saveNotes();
    };

    const openNote = (index) => {
        setSelectedNote(notes[index]);
        setModalVisible(true);
    };

    const handleContentSizeChange = (contentWidth, contentHeight) => {
        setInputHeight(Math.min(contentHeight, maxInputHeight));
    };

    const closeNoteScreen = () => {
        setModalVisible(false);
    };

    const filterNotesBySearch = (note) => {
        if (searchText) {
            const lowerCasedSearchText = searchText.toLowerCase();
            return note.text.toLowerCase().includes(lowerCasedSearchText);
        }
        return true;
    };

    const filteredNotes = notes.filter((note) => filterNotesBySearch(note));

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: '#15202B' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <TextInput
                    placeholder="Search notes"
                    placeholderTextColor='white'
                    onChangeText={(text) => setSearchText(text)}
                    value={searchText}
                    style={{ flex: 1, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#22303C', color: 'white' }}
                />
                <Button title="Clear Search" style={{ borderRadius: 8, borderWidth: 2, borderColor: '#27ae60' }}
                    color="#8e44ad" onPress={() => setSearchText('')} />
            </View>

            <ScrollView>
                {filteredNotes.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => openNote(index)}>
                        <View style={{ marginBottom: 8, padding: 12, backgroundColor: '#FFFFFF', borderRadius: 8 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <Text style={{ flex: 1, fontSize: 14, color: '#555555' }}>{item.date}</Text>
                                <TouchableOpacity onPress={() => deleteNote(index)}>
                                    <Icon name="x" size={20} color="#15202B" />
                                </TouchableOpacity>
                            </View>
                            <Text numberOfLines={2} ellipsizeMode="tail">{item.text}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <NoteScreen note={selectedNote} onClose={closeNoteScreen} />
            </Modal>

            <TextInput
                style={{
                    borderColor: 'gray',
                    borderWidth: 1,
                    marginBottom: 8,
                    padding: 8,
                    backgroundColor: '#22303C',
                    color: 'white',
                    height: inputHeight,
                }}
                placeholder="Enter a note"
                placeholderTextColor="#CCCCCC"
                onChangeText={(text) => setNewNote(text)}
                value={newNote}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                onContentSizeChange={(e) => handleContentSizeChange(e.nativeEvent.contentSize.width, e.nativeEvent.contentSize.height)}
            />

            <View style={{ marginBottom: 8 }}>
                <Button
                    title="Add a Note"
                    onPress={addNote}
                    color="#8e44ad"
                    style={{ borderRadius: 10, borderWidth: 2, borderColor: '#27ae60', /* Additional styles */ }}
                />

            </View>
        </View>
    );
};

export default Home;

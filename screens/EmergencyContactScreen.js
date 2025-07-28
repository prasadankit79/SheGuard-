import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, StatusBar, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, appId } from '../firebaseConfig';

const EmergencyContactScreen = ({ goBack, userId }) => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const contactsDocRef = doc(db, `artifacts/${appId}/users/${userId}/emergency_contacts`, 'contacts');

  useEffect(() => {
    const unsubscribe = onSnapshot(contactsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setContacts(docSnap.data().list || []);
      }
    });
    return () => unsubscribe();
  }, [userId]);

  const handleAddContact = async () => {
    if (name.trim() && phone.trim() && contacts.length < 4) {
      const newContact = { id: Date.now().toString(), name, phone };
      const updatedContacts = [...contacts, newContact];
      await setDoc(contactsDocRef, { list: updatedContacts }, { merge: true });
      setName('');
      setPhone('');
    } else {
        Alert.alert("Error", "Please fill in both fields. You can add a maximum of 4 contacts.");
    }
  };

  const handleDeleteContact = (contactId) => {
      Alert.alert(
          "Delete Contact",
          "Are you sure you want to delete this contact?",
          [
              { text: "Cancel", style: "cancel" },
              { 
                  text: "Delete", 
                  style: "destructive", 
                  onPress: async () => {
                    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
                    await setDoc(contactsDocRef, { list: updatedContacts });
                  }
              }
          ]
      );
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
        <View style={{width: 24}} />
      </View>
      <ScrollView style={styles.formContainer}>
        <Text style={styles.formLabel}>Add up to 4 contacts. These people will be alerted in an emergency.</Text>
        
        {contacts.map(contact => (
          <View key={contact.id} style={styles.contactItem}>
            <Feather name="user" size={24} color="#333" />
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteContact(contact.id)}>
                <Feather name="trash-2" size={24} color="#E91E63" />
            </TouchableOpacity>
          </View>
        ))}

        {contacts.length < 4 && (
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Contact Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.button} onPress={handleAddContact}>
              <Text style={styles.buttonText}>Add Contact</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default EmergencyContactScreen;

const styles = StyleSheet.create({
    screenContainer: { flex: 1, backgroundColor: '#F4F4F9' },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 16,
        backgroundColor: '#6A1B9A', 
        borderBottomLeftRadius: 20, 
        borderBottomRightRadius: 20 
    },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    formContainer: { padding: 20 },
    formLabel: { fontSize: 16, color: '#666', marginBottom: 15, textAlign: 'center' },
    inputGroup: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginTop: 10 },
    input: { backgroundColor: '#F4F4F9', padding: 15, borderRadius: 10, fontSize: 16, marginBottom: 15, color: '#333' },
    button: { backgroundColor: '#8E44AD', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    contactItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10 },
    contactName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    contactPhone: { fontSize: 14, color: '#666' },
});
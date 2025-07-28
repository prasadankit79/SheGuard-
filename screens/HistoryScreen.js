import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Platform, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db, appId } from '../firebaseConfig';

const HistoryScreen = ({ goBack, userId }) => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }
        
        const historyQuery = query(
            collection(db, `artifacts/${appId}/users/${userId}/sos_history`),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(historyQuery, (querySnapshot) => {
            const historyList = [];
            querySnapshot.forEach((doc) => {
                historyList.push({ id: doc.id, ...doc.data() });
            });
            setHistory(historyList);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const handleDelete = (historyId) => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to delete this SOS history entry?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const docRef = doc(db, `artifacts/${appId}/users/${userId}/sos_history`, historyId);
                        await deleteDoc(docRef);
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.historyItem}>
            <Feather name="alert-triangle" size={24} color="#E91E63" />
            <View style={styles.historyDetails}>
                <Text style={styles.historyDate}>
                    {item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString() : 'No date'}
                </Text>
                <Text style={styles.historyLocation} selectable>{item.location}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Feather name="trash-2" size={24} color="#aaa" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SOS History</Text>
                <View style={{width: 24}} />
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" color="#8E44AD" style={{ flex: 1 }} />
            ) : history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No SOS history found.</Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};
export default HistoryScreen;
const styles = StyleSheet.create({
    screenContainer: { flex: 1, backgroundColor: '#F4F4F9' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 16, backgroundColor: '#6A1B9A', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    listContainer: { padding: 20 },
    historyItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, alignItems: 'center', },
    historyDetails: { flex: 1, marginLeft: 15, },
    historyDate: { fontSize: 16, fontWeight: 'bold', color: '#333', },
    historyLocation: { fontSize: 14, color: '#0645AD', marginTop: 5, },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', },
    emptyText: { fontSize: 18, color: '#666', }
});
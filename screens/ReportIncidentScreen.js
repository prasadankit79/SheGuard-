import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, appId } from '../firebaseConfig';

const ReportIncidentScreen = ({ goBack, userId }) => {
    const [category, setCategory] = React.useState('Harassment');
    const [details, setDetails] = React.useState('');
    const [isAnonymous, setIsAnonymous] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async () => {
        if (!details.trim() || !userId) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, `artifacts/${appId}/public/data/incidents`), {
                category,
                details,
                isAnonymous,
                reportedBy: isAnonymous ? 'anonymous' : userId,
                reportedAt: serverTimestamp(),
                status: 'reported'
            });
            setDetails('');
            console.log("Incident reported successfully!");
            goBack();
        } catch (error) {
            console.error("Error reporting incident: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report an Incident</Text>
                <View style={{width: 24}} />
            </View>
            <ScrollView style={styles.formContainer}>
                <Text style={styles.formLabel}>Category</Text>
                <View style={{flexDirection: 'row', marginBottom: 16, justifyContent: 'center'}}>
                    {['Harassment', 'Stalking', 'Other'].map(cat => (
                        <TouchableOpacity key={cat} onPress={() => setCategory(cat)} style={[styles.categoryChip, category === cat && styles.categoryChipSelected]}>
                            <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextSelected]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.formLabel}>Please provide details</Text>
                <TextInput
                    style={[styles.input, { height: 150, textAlignVertical: 'top' }]}
                    placeholder="Describe what happened..."
                    value={details}
                    onChangeText={setDetails}
                    multiline
                    placeholderTextColor="#888"
                />

                <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={() => setIsAnonymous(!isAnonymous)} style={styles.checkbox}>
                        {isAnonymous && <Feather name="check" size={18} color="#fff" />}
                    </TouchableOpacity>
                    <Text style={styles.checkboxLabel}>Report Anonymously</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
                    <Text style={styles.buttonText}>{isSubmitting ? 'Submitting...' : 'Submit Report'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default ReportIncidentScreen;

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
    formLabel: { fontSize: 16, color: '#666', marginBottom: 10, textAlign: 'center' },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, fontSize: 16, marginBottom: 15, color: '#333' },
    button: { backgroundColor: '#8E44AD', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    categoryChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#eee', marginHorizontal: 5 },
    categoryChipSelected: { backgroundColor: '#8E44AD' },
    categoryChipText: { color: '#333', fontWeight: '600' },
    categoryChipTextSelected: { color: '#fff' },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: 'center' },
    checkbox: { width: 24, height: 24, borderRadius: 5, borderWidth: 2, borderColor: '#8E44AD', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    checkboxLabel: { fontSize: 16, color: '#333' },
});
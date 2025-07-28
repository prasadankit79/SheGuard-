import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, StatusBar, Image, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// Import the API key securely from the .env file
import { GEMINI_API_KEY } from '@env';

const MarkdownRenderer = ({ text }) => {
    if (!text) return null;
    const parts = text.split('*');
    return (
        <Text style={styles.responseText}>
            {parts.map((part, index) => {
                if (index % 2 === 1) {
                    return <Text key={index} style={{ fontWeight: 'bold' }}>{part}</Text>;
                }
                return part;
            })}
        </Text>
    );
};

const GeminiHelpScreen = ({ goBack }) => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [recording, setRecording] = useState();
    const [isRecording, setIsRecording] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    async function startRecording() {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Required", "Microphone access is needed to record your voice.");
                return;
            }
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            setRecording(recording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        getHelpFromGemini(uri, 'audio');
        setRecording(undefined);
    }
    
    const getHelpFromGemini = async (mediaUri = null, mediaType = 'image') => {
        if (!prompt.trim() && !image && !mediaUri) return;
        setIsLoading(true);
        setResponse('');

        let parts = [{ text: `You are an empathetic assistant for a women's safety app called SheGuard+. A user is asking for help. Provide a supportive, concise, and actionable response in about 3-4 sentences. User's query: "${prompt}"` }];

        if (image || mediaUri) {
            const uriToProcess = image || mediaUri;
            const mimeType = mediaType === 'image' ? 'image/jpeg' : 'audio/m4a';
            try {
                const base64Data = await FileSystem.readAsStringAsync(uriToProcess, { encoding: FileSystem.EncodingType.Base64 });
                parts.push({
                    inline_data: {
                        mime_type: mimeType,
                        data: base64Data
                    }
                });
            } catch (e) {
                console.error("Couldn't read file:", e);
                setResponse("Sorry, there was an error processing the file.");
                setIsLoading(false);
                return;
            }
        }
        
        const payload = { contents: [{ parts }] };
        
        // Use the imported API key
        const apiKey = GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const result = await res.json();
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts[0].text) {
                setResponse(result.candidates[0].content.parts[0].text);
            } else {
                setResponse("Sorry, I couldn't get a response. Please try again.");
            }
        } catch (error) {
            console.error("Gemini API error:", error);
            setResponse("There was an error connecting. Please check your internet connection.");
        } finally {
            setIsLoading(false);
            setImage(null);
            setPrompt('');
        }
    };

    return (
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}><Feather name="arrow-left" size={24} color="#fff" /></TouchableOpacity>
                <Text style={styles.headerTitle}>SheGuard+ Help</Text>
                <View style={{width: 24}} />
            </View>
            <ScrollView contentContainerStyle={styles.formContainer}>
                <Text style={styles.formLabel}>Ask a question, or send a photo for instant help.</Text>
                {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your question here..."
                        value={prompt}
                        onChangeText={setPrompt}
                        multiline
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
                        <Feather name="paperclip" size={24} color="#8E44AD" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={isRecording ? stopRecording : startRecording} style={styles.iconButton}>
                        <Feather name="mic" size={24} color={isRecording ? "#E91E63" : "#8E44AD"} />
                    </TouchableOpacity>
                </View>
                {isRecording && <Text style={styles.recordingText}>Recording... Tap mic to stop.</Text>}

                <TouchableOpacity style={styles.button} onPress={() => getHelpFromGemini()} disabled={isLoading}>
                    <Text style={styles.buttonText}>{isLoading ? 'Getting help...' : 'Ask for Guidance'}</Text>
                </TouchableOpacity>
                
                {response && (
                    <View style={styles.responseContainer}>
                        <Text style={styles.responseTitle}>SheGuard+ Guidance:</Text>
                        <MarkdownRenderer text={response} />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};
export default GeminiHelpScreen;

const styles = StyleSheet.create({
    screenContainer: { flex: 1, backgroundColor: '#F4F4F9' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 16, backgroundColor: '#6A1B9A', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    formContainer: { padding: 20 },
    formLabel: { fontSize: 16, color: '#666', marginBottom: 15, textAlign: 'center' },
    inputContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, paddingLeft: 15, alignItems: 'center', marginBottom: 15 },
    input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#333', minHeight: 60, maxHeight: 120, },
    iconButton: { padding: 10 },
    imagePreview: { width: 100, height: 100, borderRadius: 10, marginBottom: 15, alignSelf: 'center' },
    recordingText: { textAlign: 'center', color: '#E91E63', marginBottom: 10, fontWeight: 'bold' },
    button: { backgroundColor: '#8E44AD', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    responseContainer: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginTop: 20 },
    responseTitle: { fontSize: 16, fontWeight: 'bold', color: '#8E44AD', marginBottom: 10 },
    responseText: { fontSize: 16, color: '#333', lineHeight: 24 }
});
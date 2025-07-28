import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const { width, height } = Dimensions.get('window');


const WelcomeTile = () => (
    <View style={styles.tile}>
        <Image source={{ uri: 'https://storage.googleapis.com/gemini-generations/workspace/2d90d794-c793-4e33-911d-2227d81c3c97.png' }} style={styles.logo} />
        <Text style={styles.title}>Welcome to SheGuard+</Text>
        <Text style={styles.subtitle}>Your personal safety companion, designed to protect and empower.</Text>
    </View>
);


const FeaturesTile = () => (
    <View style={styles.tile}>
        <Text style={styles.title}>One-Tap SOS</Text>
        <Text style={styles.subtitle}>In an emergency, press the SOS button to instantly alert your trusted contacts with your live location.</Text>
         <Text style={styles.title}>Resource Hub</Text>
        <Text style={styles.subtitle}>Access helpful articles, safety tips, and legal information right from the app.</Text>
    </View>
);


const PrivacyTile = () => (
    <View style={styles.tile}>
        <Text style={styles.title}>Your Privacy Matters</Text>
        <Text style={styles.subtitle}>Your data, including location and contacts, is kept private and is only used when you trigger an SOS alert. Your safety and privacy are our top priorities.</Text>
    </View>
);


const AuthTile = ({ onAuthComplete }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAuthentication = async () => {
        setIsLoading(true);
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            
            onAuthComplete();
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.tile}>
            <Text style={styles.title}>{isLogin ? 'Login' : 'Create an Account'}</Text>
            <Text style={styles.subtitle}>Create an account to save your contacts and SOS history securely.</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#888"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleAuthentication} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.toggleText}>
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};


const OnboardingScreen = ({ onOnboardingComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const tiles = [
        { id: '1', component: <WelcomeTile /> },
        { id: '2', component: <FeaturesTile /> },
        { id: '3', component: <PrivacyTile /> },
        { id: '4', component: <AuthTile onAuthComplete={onOnboardingComplete} /> },
    ];
    
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={tiles}
                renderItem={({ item }) => item.component}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            />
            <View style={styles.pagination}>
                {tiles.map((_, index) => (
                    <View key={index} style={[styles.dot, index === currentIndex ? styles.dotActive : {}]} />
                ))}
            </View>
        </View>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#6A1B9A' },
    tile: {
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 18,
        color: '#eee',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    pagination: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.4)',
        margin: 5,
    },
    dotActive: {
        backgroundColor: '#fff',
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 15,
        color: '#333',
    },
    button: {
        width: '100%',
        backgroundColor: '#E91E63',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    toggleText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 20,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#FFCDD2',
        textAlign: 'center',
        marginBottom: 10,
    }
});
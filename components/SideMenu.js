import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SideMenu = ({ user, onNavigate, onLogout, onClose }) => {
    const slideAnim = useRef(new Animated.Value(-width * 0.8)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: -width * 0.8,
            duration: 300,
            useNativeDriver: true,
        }).start(() => onClose());
    };

    return (
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={handleClose}>
            <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
                {/* Main Menu Items */}
                <View style={{flex: 1}}>
                    <Text style={styles.menuTitle}>SheGuard+</Text>
                    {user && !user.isAnonymous && <Text style={styles.menuEmail}>{user.email}</Text>}
                    
                    <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('History')}>
                        <Feather name="clock" size={20} color="#333" />
                        <Text style={styles.menuItemText}>SOS History</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('Contacts')}>
                        <Feather name="users" size={20} color="#333" />
                        <Text style={styles.menuItemText}>Emergency Contacts</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('Instructions')}>
                        <Feather name="book-open" size={20} color="#333" />
                        <Text style={styles.menuItemText}>Instructions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Open Share dialog")}>
                        <Feather name="share-2" size={20} color="#333" />
                        <Text style={styles.menuItemText}>Share the App</Text>
                    </TouchableOpacity>
                </View>

                {/* Auth Buttons at the bottom */}
                <View>
                    {user && !user.isAnonymous ? (
                        <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
                            <Feather name="log-out" size={20} color="#E91E63" />
                            <Text style={[styles.menuItemText, {color: '#E91E63'}]}>Logout</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('Login')}>
                            <Feather name="log-in" size={20} color="#4CAF50" />
                            <Text style={[styles.menuItemText, {color: '#4CAF50'}]}>Login / Sign Up</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 5,
  },
  menuEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
    fontWeight: '500',
  },
});

export default SideMenu;
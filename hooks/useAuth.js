import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
       
        if (!auth) {
            setIsAuthReady(true);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
               
                try {
                    const userCredential = await signInAnonymously(auth);
                    setUser(userCredential.user);
                } catch (error) {
                    console.error("Anonymous sign-in failed:", error);
                    setUser(null);
                }
            }
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
        
    };

    return { user, isAuthReady, logout };
};
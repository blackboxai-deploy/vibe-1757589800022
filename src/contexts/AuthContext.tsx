'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, createUserProfile, getUserProfile, updateUserProfile } from '@/lib/firebase';
import { User, UserPreferences } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserData: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const profile = await getUserProfile(result.user.uid);
      
      if (profile) {
        await updateUserProfile(result.user.uid, {
          lastLoginAt: new Date().toISOString()
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const register = async (email: string, password: string, displayName: string): Promise<void> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase Auth profile
      await updateProfile(result.user, {
        displayName: displayName
      });

      // Create user profile in database
      await createUserProfile(result.user.uid, {
        uid: result.user.uid,
        email: result.user.email,
        displayName: displayName,
        photoURL: result.user.photoURL,
      });

      // Send email verification
      await sendEmailVerification(result.user);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, if not create it
      let profile = await getUserProfile(result.user.uid);
      
      if (!profile) {
        await createUserProfile(result.user.uid, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        });
      } else {
        // Update last login time
        await updateUserProfile(result.user.uid, {
          lastLoginAt: new Date().toISOString(),
          photoURL: result.user.photoURL, // Update photo URL if changed
        });
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error('Failed to log out. Please try again.');
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const updateUserData = async (updates: Partial<User>): Promise<void> => {
    if (!currentUser) throw new Error('No user logged in');
    
    try {
      // Update Firebase Auth profile if displayName or photoURL changed
      if (updates.displayName !== undefined || updates.photoURL !== undefined) {
        await updateProfile(auth.currentUser!, {
          displayName: updates.displayName ?? auth.currentUser!.displayName,
          photoURL: updates.photoURL ?? auth.currentUser!.photoURL,
        });
      }

      // Update user profile in database
      await updateUserProfile(currentUser.uid, updates);
      
      // Update local state
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error: any) {
      console.error('Update user data error:', error);
      throw new Error('Failed to update profile. Please try again.');
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>): Promise<void> => {
    if (!currentUser) throw new Error('No user logged in');
    
    try {
      const updatedPreferences = { ...currentUser.preferences, ...preferences };
      
      await updateUserProfile(currentUser.uid, {
        preferences: updatedPreferences
      });
      
      setCurrentUser(prev => prev ? {
        ...prev,
        preferences: updatedPreferences
      } : null);
    } catch (error: any) {
      console.error('Update preferences error:', error);
      throw new Error('Failed to update preferences. Please try again.');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // Get user profile from database
          const profile = await getUserProfile(firebaseUser.uid);
          
          if (profile) {
            const user: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              createdAt: new Date(profile.createdAt),
              lastLoginAt: new Date(profile.lastLoginAt || profile.createdAt),
              preferences: profile.preferences || {
                theme: 'system',
                language: 'en',
                notifications: true,
                soundEffects: true,
                preferredSubjects: []
              }
            };
            setCurrentUser(user);
          } else {
            // User exists in Firebase Auth but not in database - create profile
            await createUserProfile(firebaseUser.uid, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            });
            
            const newProfile = await getUserProfile(firebaseUser.uid);
            if (newProfile) {
              const user: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                createdAt: new Date(newProfile.createdAt),
                lastLoginAt: new Date(newProfile.lastLoginAt),
                preferences: newProfile.preferences
              };
              setCurrentUser(user);
            }
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    resetPassword,
    updateUserData,
    updatePreferences,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Helper function to get user-friendly error messages
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups and try again.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
}
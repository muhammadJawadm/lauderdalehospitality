import React, { useContext, useState, useEffect, createContext } from "react";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  type User,
  type UserCredential,
} from "firebase/auth";
import { doc, getDoc, type DocumentData } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import LoaderAnimation from "../components/LoaderAnimation";

interface AuthContextValue {
  currentUser: User | null | undefined;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  users: DocumentData | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<DocumentData | null>(null);

  const signup = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  async function login(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateEmail(email: string) {
    return firebaseUpdateEmail(auth.currentUser!, email);
  }

  function updatePassword(password: string) {
    return firebaseUpdatePassword(auth.currentUser!, password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await getDoc(userDocRef).then((userDocSnapshot) => {
          if (userDocSnapshot.exists()) {
            setUsers(userDocSnapshot.data());
          } else {
            console.error("User document does not exist in Firestore.");
          }
        });
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextValue = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    isLoading,
    setIsLoading,
    users,
  };

  return <AuthContext.Provider value={value}>{loading ? <LoaderAnimation /> : children}</AuthContext.Provider>;
}

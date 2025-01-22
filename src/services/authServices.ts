import { ath, db } from "../firebase/clientApp";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
  role: string;
};

//Login dengan Firebase
export const login = async ({ email, password }: LoginData): Promise<any> => {
  try {
    const userCredential = await signInWithEmailAndPassword(ath, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message || "An error occurred during authentication");
  }  
};

//Register dengan Firebase dan menyimpannya di Firestore
export const register = async ({ email, password, role }: RegisterData): Promise<any> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(ath, email, password);
    const user = userCredential.user;

    // Menyimpan data pengguna ke Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: role
    });

    return user;
  } catch (error: any) {
    throw new Error(error.message || "An error occurred during authentication");
  }
};

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
ath.languageCode = 'en';
provider.setCustomParameters({
  'login_hint': 'user@example.com'
});

export const GoogleLogin = async () => {
  try {
    const result = await signInWithPopup(ath, provider);
    const user = result.user;

    // Periksa apakah pengguna sudah ada di Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Tambahkan data pengguna baru tanpa role
      await setDoc(userRef, {
        email: user.email
      });
      console.log("User added to Firestore:", user.email);
    }

    // Periksa apakah pengguna sudah memiliki role
    const userData = userDoc.data();
    if (!userData?.role) {
      return true; // Pengguna belum memiliki role
    }
    return false; // Pengguna sudah memiliki role
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during Google Login:", error.message);
    } else {
      console.error("An unknown error occurred during Google Login:", error);
    }
    throw error;
  }
};

export function emergencyLogout (){
  ath.signOut();
}
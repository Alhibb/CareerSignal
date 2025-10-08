import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    GoogleAuthProvider, 
    signInWithPopup      
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDLIr-nDcdFtpvXO0c7NTeS0ghZ4KhEhI0",
    authDomain: "careersignal-680c5.firebaseapp.com",
    projectId: "careersignal-680c5",
    storageBucket: "careersignal-680c5.firebasestorage.app",
    messagingSenderId: "187741139925",
    appId: "1:187741139925:web:187a97113f1416c955835c",
    measurementId: "G-Z73VK80MYQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(); 

function showFeedback(element, message, isError = true) {
    element.textContent = message;
    element.style.color = isError ? '#EF4444' : '#22C55E';
    element.style.display = 'block';
}

async function handleGoogleSignIn() {
    const feedback = document.getElementById('feedback');
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        let message = "An error occurred during Google Sign-In.";
        if (error.code === 'auth/popup-closed-by-user') {
            message = 'Sign-in process was cancelled.';
        }
        showFeedback(feedback, message);
    }
}

function handleRegistration() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = registerForm.email.value.trim();
        const password = registerForm.password.value.trim();
        const feedback = document.getElementById('feedback');
        
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Registration Error:", error);
            let message;
            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = 'This email is already registered. Please login.';
                    break;
                case 'auth/weak-password':
                    message = 'Password should be at least 6 characters.';
                    break;
                case 'auth/invalid-email':
                    message = 'Please enter a valid email address.';
                    break;
                case 'auth/operation-not-allowed':
                    message = 'Email/Password sign-in is not enabled in Firebase.';
                    break;
                default:
                    message = `Registration failed. Please check console for details.`;
            }
            showFeedback(feedback, message);
        }
    });
}

function handleLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.email.value.trim();
        const password = loginForm.password.value.trim();
        const feedback = document.getElementById('feedback');

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Login Error:", error);
            let message;
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    message = 'Invalid email or password.';
                    break;
                case 'auth/invalid-email':
                    message = 'Please enter a valid email address.';
                    break;
                default:
                    message = `Login failed. Please check console for details.`;
            }
            showFeedback(feedback, message);
        }
    });
}

function monitorAuthState() {
    onAuthStateChanged(auth, user => {
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath.endsWith('login.html') || currentPath.endsWith('register.html');
        const isDashboard = currentPath.endsWith('dashboard.html');

        if (user) {
            if (isAuthPage) {
                window.location.replace('dashboard.html');
            }
        } else {
            if (isDashboard) {
                window.location.replace('login.html');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    handleRegistration();
    handleLogin();
    monitorAuthState();

    const googleSignInButton = document.getElementById('googleSignInBtn');
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', handleGoogleSignIn);
    }
});
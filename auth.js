const SUPABASE_URL = "https://bpyppmqrltzbiicmntwe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweXBwbXFybHR6YmlpY21udHdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMDk2NzgsImV4cCI6MjA5NjY4NTY3OH0.2llOoI0TimB7w0zS3Bh90uUlyhun1Mn6aQkBv4lW2CY";

// Standard Supabase initialization check
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

document.addEventListener('DOMContentLoaded', () => {
    initRealAuth();
    initRealSignUp();
    
    const googleBtn = document.getElementById('google-signin-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', signInWithGoogle);
    }
});

async function initRealAuth() {
    const signInForm = document.getElementById('signin-form');
    if (!signInForm) return;

    signInForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!supabase) {
            alert("Supabase library failed to load. Check your network or script tags.");
            return;
        }

        const emailElement = document.getElementById('email');
        const passwordElement = document.getElementById('password');

        if (!emailElement || !passwordElement) {
            alert("Error: Form elements could not be found by the script.");
            return;
        }

        const email = emailElement.value;
        const password = passwordElement.value;

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            alert(`Authentication Error: ${error.message}`);
        } else {
            alert(`Success! Logged in as ${data.user.email}`);
            window.location.href = "index.html";
        }
    });
}

async function initRealSignUp() {
    const signUpForm = document.getElementById('signup-form');
    if (!signUpForm || !supabase) return;

    signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            alert(`Sign Up Error: ${error.message}`);
        } else {
            alert('Account created! Try signing in now.');
            window.location.href = "signin.html";
        }
    });
}

async function signInWithGoogle() {
    if (!supabase) return;
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + window.location.pathname.replace('signin.html', 'index.html')
        }
    });
    if (error) alert(`Google Auth Error: ${error.message}`);
}
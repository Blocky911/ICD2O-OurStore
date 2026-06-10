const SUPABASE_URL = "https://bpyppmqrltzbiicmntwe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweXBwbXFybHR6YmlpY21udHdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMDk2NzgsImV4cCI6MjA5NjY4NTY3OH0.2llOoI0TimB7w0zS3Bh90uUlyhun1Mn6aQkBv4lW2CY";

const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

document.addEventListener('DOMContentLoaded', () => {
    initRealAuth();
    initRealSignUp();
});

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
            alert('Account created! Logging you in...');
            window.location.href = "signin.html";
        }
    });
}

async function initRealAuth() {
    const signInForm = document.getElementById('signin-form');
    if (!signInForm || !supabase) return;

    signInForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            alert(`Authentication Error: ${error.message}`);
        } else {
            alert(`Success! Logged in.`);
            window.location.href = "index.html";
        }
    });
}
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../Firebase/firebase";
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn } from "lucide-react";

const getPostLoginRoute = async (user) => {
  const userSnapshot = await getDoc(doc(db, "users", user.uid));
  if (userSnapshot.exists()) {
    const data = userSnapshot.data();
    if (data?.analysis || data?.dashboard) return "/dashboard";
    if (data?.profile) return "/profile";
  }
  return "/profile";
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const redirectAfterLogin = async (user) => {
    const route = await getPostLoginRoute(user);
    window.location.assign(route);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await redirectAfterLogin(credential.user);
    } catch (error) {
      console.error(error);
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Incorrect email or password."); break;
        case "auth/too-many-requests":
          setError("Too many attempts. Try again later."); break;
        case "auth/invalid-email":
          setError("Please enter a valid email address."); break;
        case "permission-denied":
          setError("Unable to load your saved profile. Please try again."); break;
        default:
          setError("Something went wrong. Please try again.");
      }
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setError(""); setMessage(""); setLoading(true);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      await redirectAfterLogin(credential.user);
    } catch (error) {
      console.error(error);
      if (error.code !== "auth/popup-closed-by-user") setError("Google sign-in failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email first, then click Forgot password.");
      return;
    }
    try {
      setError(""); setMessage(""); setResetting(true);
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("Password reset email sent. Check your inbox.");
    } catch (error) {
      console.error(error);
      setError(error.code === "auth/user-not-found" ? "No account exists with this email." : "Unable to send the reset email. Please try again.");
    } finally { setResetting(false); }
  };

  return (
    <div className="login-card">
      <div className="login-brand"><div className="login-logo">Skill<span>Forge</span></div><p>Your personalized learning journey.</p></div>
      <div className="login-heading"><h1>Welcome back</h1><p>Sign in to continue your learning journey.</p></div>
      <button className="google-button" onClick={handleGoogleLogin} disabled={loading || resetting}><LogIn size={18} />Continue with Google</button>
      <div className="login-divider"><span>or continue with email</span></div>
      <form onSubmit={handleLogin}>
        <div className="input-group"><label>Email</label><div className="input-wrapper"><Mail size={17} /><input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div></div>
        <div className="input-group">
          <div className="password-label"><label>Password</label><button type="button" className="forgot-password" onClick={handleForgotPassword} disabled={resetting}>{resetting ? "Sending..." : "Forgot password?"}</button></div>
          <div className="input-wrapper"><Lock size={17} /><input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        </div>
        {error && <div className="login-error">{error}</div>}
        {message && <div className="login-success">{message}</div>}
        <button type="submit" className="login-button" disabled={loading || resetting}>{loading ? "Signing in..." : "Sign in"}{!loading && <ArrowRight size={17} />}</button>
      </form>
      <p className="signup-text">Don't have an account? <a href="/signup">Create one</a></p>
    </div>
  );
};

export default Login;

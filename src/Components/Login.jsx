import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import {
  auth,
  db,
  googleProvider,
} from "../Firebase/firebase";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  LogIn,
} from "lucide-react";

const getPostLoginRoute = async (user) => {
  const userSnapshot = await getDoc(doc(db, "users", user.uid));

  // A user who has already completed their SkillForge profile/analysis
  // should go straight to their saved dashboard.
  if (userSnapshot.exists()) {
    const data = userSnapshot.data();

    if (data?.profile || data?.analysis || data?.dashboard) {
      return "/dashboard";
    }
  }

  // New users, or users who have not completed their profile yet.
  return "/profile";
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectAfterLogin = async (user) => {
    const route = await getPostLoginRoute(user);
    window.location.assign(route);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await redirectAfterLogin(credential.user);
    } catch (error) {
      console.error(error);

      if (error.code === "permission-denied") {
        setError("Unable to check your saved profile. Please try again.");
      } else {
        switch (error.code) {
          case "auth/invalid-credential":
            setError("Incorrect email or password.");
            break;
          case "auth/user-not-found":
            setError("No account exists with this email.");
            break;
          case "auth/wrong-password":
            setError("Incorrect password.");
            break;
          case "auth/too-many-requests":
            setError("Too many attempts. Try again later.");
            break;
          case "auth/invalid-email":
            setError("Please enter a valid email address.");
            break;
          default:
            setError("Something went wrong. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      await redirectAfterLogin(credential.user);
    } catch (error) {
      console.error(error);

      if (error.code === "auth/popup-closed-by-user") {
        setError("");
      } else if (error.code === "permission-denied") {
        setError("Unable to check your saved profile. Please try again.");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <div className="login-brand">
        <div className="login-logo">
          Skill<span>Forge</span>
        </div>
        <p>Your personalized learning journey.</p>
      </div>

      <div className="login-heading">
        <h1>Welcome back</h1>
        <p>Sign in to continue your learning journey.</p>
      </div>

      <button
        className="google-button"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        <LogIn size={18} />
        Continue with Google
      </button>

      <div className="login-divider">
        <span>or continue with email</span>
      </div>

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email</label>
          <div className="input-wrapper">
            <Mail size={17} />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <div className="password-label">
            <label>Password</label>
            <button type="button" className="forgot-password">
              Forgot password?
            </button>
          </div>

          <div className="input-wrapper">
            <Lock size={17} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <ArrowRight size={17} />}
        </button>
      </form>

      <p className="signup-text">
        Don't have an account? <a href="/signup">Create one</a>
      </p>
    </div>
  );
};

export default Login;

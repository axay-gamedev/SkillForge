import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ArrowRight, Lock, Mail, UserPlus } from "lucide-react";
import { auth } from "../Firebase/firebase";
import "../Styles/login.css";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/profile", { replace: true });
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("An account already exists with this email. Try signing in.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          setError("Choose a stronger password.");
          break;
        default:
          setError("Unable to create your account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-glow glow-one" />
      <div className="login-glow glow-two" />
      <div className="login-grid" />

      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">Skill<span>Forge</span></div>
          <p>Your personalized learning journey.</p>
        </div>
        <div className="login-heading">
          <h1>Create your account</h1>
          <p>Start building your personalized career roadmap.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail size={17} />
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={17} />
              <input type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <div className="input-group">
            <label>Confirm password</label>
            <div className="input-wrapper">
              <Lock size={17} />
              <input type="password" placeholder="Repeat your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
            {!loading && <ArrowRight size={17} />}
          </button>
        </form>

        <p className="signup-text">Already have an account? <Link to="/login"><UserPlus size={13} /> Sign in</Link></p>
      </div>
    </main>
  );
};

export default Signup;

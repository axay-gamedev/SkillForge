import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ReviewStep = ({ profile, onBack }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Analysis failed");
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          profile,
          analysis: data,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      window.location.assign("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to analyze your profile. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <section className="profile-form-card">
      <div className="profile-heading">
        <span>Step 6</span>
        <h1>Review your profile</h1>
        <p>Make sure everything looks correct before we analyze your profile.</p>
      </div>

      <div className="review-section">
        <div className="review-block">
          <h3>Personal Information</h3>
          <p><strong>Name:</strong> {profile.name || "Not provided"}</p>
          <p><strong>Age:</strong> {profile.age || "Not provided"}</p>
        </div>

        <div className="review-block">
          <h3>Career</h3>
          <p><strong>Target Role:</strong> {profile.targetRole || "Not provided"}</p>
          <p><strong>Goal:</strong> {profile.careerGoal || "Not provided"}</p>
        </div>

        <div className="review-block">
          <h3>Education</h3>
          <p><strong>Level:</strong> {profile.education?.level || "Not provided"}</p>
          <p><strong>Institution:</strong> {profile.education?.institution || "Not provided"}</p>
          <p><strong>Year:</strong> {profile.education?.year || "Not provided"}</p>
          <p><strong>Degree:</strong> {profile.education?.degree || "Not provided"}</p>
          <p><strong>Branch:</strong> {profile.education?.branch || "Not provided"}</p>
          <p><strong>Grade:</strong> {profile.education?.grade || "Not provided"}</p>
        </div>

        <div className="review-block">
          <h3>Skills</h3>
          <div className="review-skills">
            {profile.skills?.length ? profile.skills.map((skill) => (
              <span key={skill} className="review-skill">{skill}</span>
            )) : <p>No skills added.</p>}
          </div>
        </div>

        <div className="review-block">
          <h3>Experience</h3>
          <p>{profile.experience || "No experience provided."}</p>
        </div>
      </div>

      {error && <div className="review-error">{error}</div>}

      <div className="form-actions">
        <button className="secondary-button" onClick={onBack} disabled={analyzing}>
          <ArrowLeft size={17} /> Back
        </button>
        <button className="primary-button analyze-button" onClick={handleAnalyze} disabled={analyzing}>
          {analyzing ? (
            <><Loader2 size={17} className="spin" /> Analyzing...</>
          ) : (
            <><CheckCircle size={17} /> Analyze my profile <ArrowRight size={17} /></>
          )}
        </button>
      </div>
    </section>
  );
};

export default ReviewStep;

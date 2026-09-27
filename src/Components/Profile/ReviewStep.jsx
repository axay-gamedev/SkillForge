import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
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

      const userRef = doc(db, "users", user.uid);

      // Save the profile first so it is not lost if the AI request fails.
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email || null,
          profile,
          status: "analyzing",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Analysis failed");
      }

      // Store the AI result as both analysis and dashboard data.
      // Keeping dashboard data in Firestore means the dashboard survives
      // refreshes, logout/login, and browser restarts.
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email || null,
          profile,
          analysis: data,
          dashboard: {
            careerReadiness: data.careerReadiness,
            summary: data.summary,
            strengths: data.strengths || [],
            skillGaps: data.skillGaps || [],
            skillAnalysis: data.skillAnalysis || [],
            estimatedWeeks: data.estimatedWeeks || 0,
            roadmap: data.roadmap || [],
          },
          status: "ready",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      window.location.assign("/dashboard");
    } catch (err) {
      console.error("Profile save/analyze error:", err);

      try {
        if (auth.currentUser) {
          await setDoc(
            doc(db, "users", auth.currentUser.uid),
            {
              status: "analysis_failed",
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
      } catch (saveError) {
        console.error("Failed to update analysis status:", saveError);
      }

      setError(
        err.message ||
          "Unable to analyze your profile. Please try again."
      );
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

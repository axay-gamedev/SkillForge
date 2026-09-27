import { useEffect, useState } from "react";
import { Edit3, LogOut, Save, X } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

import ProfileSidebar from "../Components/Profile/ProfileSidebar";
import ProfileStep from "../Components/Profile/ProfileStep";
import TargetRoleStep from "../Components/Profile/TargetRoleStep";
import EducationStep from "../Components/Profile/EducationStep";
import SkillsStep from "../Components/Profile/SkillsStep";
import ProjectsStep from "../Components/Profile/ProjectsStep";
import ReviewStep from "../Components/Profile/ReviewStep";
import Navbar from "../Components/Navbar";
import { auth, db } from "../Firebase/firebase";
import "../Styles/profile.css";
import "../Styles/saved-profile.css";

const emptyProfile = {
  name: "",
  age: "",
  targetRole: "",
  careerGoal: "",
  education: { level: "", institution: "", year: "", degree: "", branch: "", grade: "" },
  skills: [],
  projects: [],
  internships: [],
  courses: [],
  experience: "",
  achievements: "",
};

const SavedProfile = ({ user, initialProfile }) => {
  const [profile, setProfile] = useState(initialProfile || emptyProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialProfile || emptyProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateDraft = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const updateEducation = (key, value) =>
    setDraft((prev) => ({ ...prev, education: { ...prev.education, [key]: value } }));

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");
      await updateDoc(doc(db, "users", user.uid), { profile: draft });
      setProfile(draft);
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Unable to save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setDraft(profile);
    setEditing(false);
    setError("");
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.replace("/");
  };

  const projects = Array.isArray(profile.projects) ? profile.projects : [];
  const skills = Array.isArray(profile.skills) ? profile.skills : [];

  return (
    <div className="saved-profile-page">
      <Navbar />
      <main className="saved-profile-container">
        <header className="saved-profile-header">
          <div>
            <p className="saved-profile-eyebrow">Your profile</p>
            <h1>{profile.name || user.displayName || "Your Profile"}</h1>
            <p className="saved-profile-subtitle">
              Your education, skills, experience and career information in one place.
            </p>
          </div>

          <div className="saved-profile-actions">
            {!editing ? (
              <button className="saved-profile-button primary" onClick={() => { setDraft(profile); setEditing(true); setMessage(""); }}>
                <Edit3 size={15} /> Edit profile
              </button>
            ) : (
              <>
                <button className="saved-profile-button" onClick={cancelEdit} disabled={saving}>
                  <X size={15} /> Cancel
                </button>
                <button className="saved-profile-button primary" onClick={handleSave} disabled={saving}>
                  <Save size={15} /> {saving ? "Saving..." : "Save changes"}
                </button>
              </>
            )}
            <button className="saved-profile-button danger" onClick={handleLogout}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </header>

        {message && <p className="saved-profile-message">{message}</p>}
        {error && <p className="saved-profile-error">{error}</p>}

        {editing ? (
          <section className="saved-profile-card full saved-profile-editor">
            <div className="saved-profile-editor-row">
              <div className="saved-profile-input"><label>Name</label><input value={draft.name || ""} onChange={(e) => updateDraft("name", e.target.value)} /></div>
              <div className="saved-profile-input"><label>Age</label><input value={draft.age || ""} onChange={(e) => updateDraft("age", e.target.value)} /></div>
            </div>
            <div className="saved-profile-editor-row">
              <div className="saved-profile-input"><label>Target role</label><input value={draft.targetRole || ""} onChange={(e) => updateDraft("targetRole", e.target.value)} /></div>
              <div className="saved-profile-input"><label>Career goal</label><input value={draft.careerGoal || ""} onChange={(e) => updateDraft("careerGoal", e.target.value)} /></div>
            </div>
            <div className="saved-profile-editor-row">
              <div className="saved-profile-input"><label>Institution</label><input value={draft.education?.institution || ""} onChange={(e) => updateEducation("institution", e.target.value)} /></div>
              <div className="saved-profile-input"><label>Degree</label><input value={draft.education?.degree || ""} onChange={(e) => updateEducation("degree", e.target.value)} /></div>
            </div>
            <div className="saved-profile-editor-row">
              <div className="saved-profile-input"><label>Branch</label><input value={draft.education?.branch || ""} onChange={(e) => updateEducation("branch", e.target.value)} /></div>
              <div className="saved-profile-input"><label>Year</label><input value={draft.education?.year || ""} onChange={(e) => updateEducation("year", e.target.value)} /></div>
            </div>
            <div className="saved-profile-input"><label>Experience</label><textarea value={draft.experience || ""} onChange={(e) => updateDraft("experience", e.target.value)} /></div>
          </section>
        ) : (
          <div className="saved-profile-grid">
            <section className="saved-profile-card">
              <h2>About <span>Personal information</span></h2>
              <div className="saved-profile-info">
                <div className="saved-profile-field"><label>Name</label><p>{profile.name || "Not provided"}</p></div>
                <div className="saved-profile-field"><label>Age</label><p>{profile.age || "Not provided"}</p></div>
                <div className="saved-profile-field"><label>Email</label><p>{user.email || "Not provided"}</p></div>
                <div className="saved-profile-field"><label>Target role</label><p>{profile.targetRole || "Not provided"}</p></div>
              </div>
            </section>

            <section className="saved-profile-card">
              <h2>Education <span>Academic background</span></h2>
              <div className="saved-profile-info">
                <div className="saved-profile-field"><label>Institution</label><p>{profile.education?.institution || "Not provided"}</p></div>
                <div className="saved-profile-field"><label>Degree</label><p>{profile.education?.degree || "Not provided"}</p></div>
                <div className="saved-profile-field"><label>Branch</label><p>{profile.education?.branch || "Not provided"}</p></div>
                <div className="saved-profile-field"><label>Year / Grade</label><p>{profile.education?.year || "—"} / {profile.education?.grade || "—"}</p></div>
              </div>
            </section>

            <section className="saved-profile-card full">
              <h2>Skills <span>What you currently know</span></h2>
              {skills.length ? <div className="saved-profile-tags">{skills.map((skill, i) => <span className="saved-profile-tag" key={`${skill}-${i}`}>{skill}</span>)}</div> : <p className="saved-profile-empty">No skills added.</p>}
            </section>

            <section className="saved-profile-card">
              <h2>Career goal <span>Where you're heading</span></h2>
              <p className="saved-profile-field"><label>Goal</label><p>{profile.careerGoal || "Not provided"}</p></p>
            </section>

            <section className="saved-profile-card">
              <h2>Experience <span>Projects and experience</span></h2>
              {profile.experience ? <p className="saved-profile-field"><label>Experience</label><p>{profile.experience}</p></p> : null}
              {projects.length ? <div className="saved-profile-list">{projects.map((project, i) => <div className="saved-profile-item" key={i}><strong>{project.name || project.title || `Project ${i + 1}`}</strong><p>{project.description || project.details || "Project added to your profile."}</p></div>)}</div> : !profile.experience && <p className="saved-profile-empty">No projects or experience added.</p>}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [savedProfile, setSavedProfile] = useState(null);
  const [checking, setChecking] = useState(true);
  const [step, setStep] = useState(1);

  const [profile, setProfile] = useState(emptyProfile);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!mounted) return;
      setUser(currentUser);

      if (!currentUser) {
        setChecking(false);
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, "users", currentUser.uid));
        const data = snapshot.exists() ? snapshot.data() : null;
        const existingProfile = data?.profile;

        if (existingProfile) {
          setSavedProfile(existingProfile);
        }
      } catch (err) {
        console.error("Unable to load profile:", err);
      } finally {
        if (mounted) setChecking(false);
      }
    });

    return () => { mounted = false; unsubscribe(); };
  }, []);

  if (checking) {
    return <div className="saved-profile-page"><Navbar /><div className="saved-profile-loading"><span className="saved-profile-spinner" />Loading profile...</div></div>;
  }

  if (user && savedProfile) {
    return <SavedProfile user={user} initialProfile={savedProfile} />;
  }

  const updateProfile = (updates) => setProfile((prev) => ({ ...prev, ...updates }));
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
  const previousStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-layout">
        <ProfileSidebar currentStep={step} setStep={setStep} />
        <main className="profile-content">
          {step === 1 && <ProfileStep profile={profile} updateProfile={updateProfile} onNext={nextStep} />}
          {step === 2 && <TargetRoleStep profile={profile} updateProfile={updateProfile} onNext={nextStep} onBack={previousStep} />}
          {step === 3 && <EducationStep profile={profile} updateProfile={updateProfile} onNext={nextStep} onBack={previousStep} />}
          {step === 4 && <SkillsStep profile={profile} updateProfile={updateProfile} onNext={nextStep} onBack={previousStep} />}
          {step === 5 && <ProjectsStep profile={profile} updateProfile={updateProfile} onNext={nextStep} onBack={previousStep} />}
          {step === 6 && <ReviewStep profile={profile} onBack={previousStep} />}
        </main>
      </div>
    </div>
  );
};

export default Profile;

import { useState } from "react";

import ProfileSidebar from "../Components/Profile/ProfileSidebar";
import ProfileStep from "../Components/Profile/ProfileStep";
import TargetRoleStep from "../Components/Profile/TargetRoleStep";
import EducationStep from "../Components/Profile/EducationStep";
import SkillsStep from "../Components/Profile/SkillsStep";
import ProjectsStep from "../Components/Profile/ProjectsStep";
import ReviewStep from "../Components/Profile/ReviewStep";

import "../Styles/profile.css";
import Navbar from "../Components/Navbar";

const Profile = () => {
  const [step, setStep] = useState(1);

  const [profile, setProfile] = useState({
    name: "",
    age: "",

    targetRole: "",
    careerGoal: "",

    education: {
      level: "",
      institution: "",
      year: "",
      degree: "",
      branch: "",
      grade: "",
    },

    skills: [],

    projects: [],
    internships: [],
    courses: [],
    experience: "",
    achievements: "",
  });

  const updateProfile = (updates) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const previousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="profile-page">
      <Navbar/>
      <div className="profile-layout">

        <ProfileSidebar
          currentStep={step}
          setStep={setStep}
        />

        <main className="profile-content">

          {/* STEP 1 */}
          {step === 1 && (
            <ProfileStep
              profile={profile}
              updateProfile={updateProfile}
              onNext={nextStep}
            />
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <TargetRoleStep
              profile={profile}
              updateProfile={updateProfile}
              onNext={nextStep}
              onBack={previousStep}
            />
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <EducationStep
              profile={profile}
              updateProfile={updateProfile}
              onNext={nextStep}
              onBack={previousStep}
            />
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <SkillsStep
              profile={profile}
              updateProfile={updateProfile}
              onNext={nextStep}
              onBack={previousStep}
            />
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <ProjectsStep
              profile={profile}
              updateProfile={updateProfile}
              onNext={nextStep}
              onBack={previousStep}
            />
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <ReviewStep
              profile={profile}
              onBack={previousStep}
            />
          )}

        </main>

      </div>

    </div>
  );
};

export default Profile;
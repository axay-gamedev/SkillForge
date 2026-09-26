const steps = [
  {
    number: 1,
    title: "Profile",
    subtitle: "Tell us about yourself",
  },
  {
    number: 2,
    title: "Target Role",
    subtitle: "Your career goal",
  },
  {
    number: 3,
    title: "Education",
    subtitle: "Where you are studying",
  },
  {
    number: 4,
    title: "Skills",
    subtitle: "Your current skills",
  },
  {
    number: 5,
    title: "Projects",
    subtitle: "Your experience",
  },
  {
    number: 6,
    title: "Review",
    subtitle: "Ready to analyze",
  },
];

const ProfileSidebar = ({
  currentStep,
  setStep,
}) => {
  return (
    <aside className="profile-sidebar">

      {steps.map((step) => (
        <button
          key={step.number}
          className={`profile-step ${
            currentStep === step.number
              ? "active"
              : ""
          } ${
            currentStep > step.number
              ? "completed"
              : ""
          }`}
          onClick={() => {
            if (step.number <= currentStep) {
              setStep(step.number);
            }
          }}
        >

          <div className="step-number">
            {step.number}
          </div>

          <div className="step-info">
            <strong>
              {step.title}
            </strong>

            <span>
              {step.subtitle}
            </span>
          </div>

        </button>
      ))}

    </aside>
  );
};

export default ProfileSidebar;
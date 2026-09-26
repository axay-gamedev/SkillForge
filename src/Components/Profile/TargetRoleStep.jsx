import { ArrowLeft, ArrowRight } from "lucide-react";

const TargetRoleStep = ({
  profile,
  updateProfile,
  onNext,
  onBack,
}) => {
  return (
    <section className="profile-form-card">

      <div className="profile-heading">
        <span>Step 2</span>

        <h1>
          Where do you want to go?
        </h1>

        <p>
          Tell us what career you're aiming for.
        </p>
      </div>

      <div className="form-field">
        <label>Target role</label>

        <input
          value={profile.targetRole}
          placeholder="e.g. Machine Learning Engineer"
          onChange={(e) =>
            updateProfile({
              targetRole: e.target.value,
            })
          }
        />
      </div>

      <div className="form-field">
        <label>Career goal</label>

        <textarea
          value={profile.careerGoal}
          placeholder="What do you want to achieve?"
          onChange={(e) =>
            updateProfile({
              careerGoal: e.target.value,
            })
          }
        />
      </div>

      <div className="form-actions">

        <button
          className="secondary-button"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <button
          className="primary-button"
          onClick={onNext}
        >
          Continue
          <ArrowRight size={17} />
        </button>

      </div>

    </section>
  );
};

export default TargetRoleStep;
import { ArrowRight } from "lucide-react";

const ProfileStep = ({
  profile,
  updateProfile,
  onNext,
}) => {
  return (
    <section className="profile-form-card">

      <div className="profile-heading">
        <span>Step 1</span>

        <h1>
          Build your profile
        </h1>

        <p>
          Tell us a little about yourself.
        </p>
      </div>

      <div className="form-grid">

        <div className="form-field">
          <label>Your name</label>

          <input
            value={profile.name}
            placeholder="Enter your name"
            onChange={(e) =>
              updateProfile({
                name: e.target.value,
              })
            }
          />
        </div>

        <div className="form-field">
          <label>Age</label>

          <input
            type="number"
            value={profile.age}
            placeholder="18"
            onChange={(e) =>
              updateProfile({
                age: e.target.value,
              })
            }
          />
        </div>

      </div>

      <div className="form-actions">

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

export default ProfileStep;
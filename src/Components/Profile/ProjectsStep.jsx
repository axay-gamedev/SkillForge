import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const ProjectsStep = ({
  profile,
  updateProfile,
  onNext,
  onBack,
}) => {
  return (
    <section className="profile-form-card">

      <div className="profile-heading">
        <span>Step 5</span>

        <h1>
          Tell us about your experience
        </h1>

        <p>
          Projects, internships, courses and
          anything else you've worked on.
        </p>
      </div>

      <div className="form-field">
        <label>Projects</label>

        <textarea
          value={profile.projects.join("\n")}
          placeholder={`Weather App
MERN E-commerce Application
Machine Learning Image Classifier`}
          onChange={(e) =>
            updateProfile({
              projects:
                e.target.value
                  .split("\n")
                  .filter(Boolean),
            })
          }
        />
      </div>

      <div className="form-field">
        <label>Internships / experience</label>

        <textarea
          value={profile.experience}
          placeholder="Describe your experience..."
          onChange={(e) =>
            updateProfile({
              experience:
                e.target.value,
            })
          }
        />
      </div>

      <div className="form-field">
        <label>Courses / achievements</label>

        <textarea
          value={profile.achievements}
          placeholder="Courses, hackathons, certifications..."
          onChange={(e) =>
            updateProfile({
              achievements:
                e.target.value,
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
          Review
          <ArrowRight size={17} />
        </button>

      </div>

    </section>
  );
};

export default ProjectsStep;
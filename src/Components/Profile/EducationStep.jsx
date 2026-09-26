import { ArrowLeft, ArrowRight } from "lucide-react";

const EducationStep = ({
  profile,
  updateProfile,
  onNext,
  onBack,
}) => {
  const education = profile.education;

  const updateEducation = (updates) => {
    updateProfile({
      education: {
        ...education,
        ...updates,
      },
    });
  };

  return (
    <section className="profile-form-card">

      <div className="profile-heading">
        <span>Step 3</span>

        <h1>
          Your education
        </h1>

        <p>
          This helps us understand your current level.
        </p>
      </div>

      <div className="form-grid">

        <div className="form-field">
          <label>Education level</label>

          <select
            value={education.level}
            onChange={(e) =>
              updateEducation({
                level: e.target.value,
              })
            }
          >
            <option value="">
              Select
            </option>

            <option value="school">
              School
            </option>

            <option value="college">
              College
            </option>

            <option value="graduate">
              Graduate
            </option>
          </select>
        </div>

        <div className="form-field">
          <label>
            School / College
          </label>

          <input
            value={education.institution}
            placeholder="Institution name"
            onChange={(e) =>
              updateEducation({
                institution:
                  e.target.value,
              })
            }
          />
        </div>

      </div>

      {education.level === "school" && (
        <div className="form-grid">

          <div className="form-field">
            <label>Class</label>

            <select
              value={education.year}
              onChange={(e) =>
                updateEducation({
                  year: e.target.value,
                })
              }
            >
              <option value="">
                Select class
              </option>

              {[
                "9",
                "10",
                "11",
                "12",
              ].map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  Class {year}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>
              Percentage / Grade
            </label>

            <input
              value={education.grade}
              placeholder="e.g. 91%"
              onChange={(e) =>
                updateEducation({
                  grade: e.target.value,
                })
              }
            />
          </div>

        </div>
      )}

      {education.level === "college" && (
        <>
          <div className="form-grid">

            <div className="form-field">
              <label>Year</label>

              <select
                value={education.year}
                onChange={(e) =>
                  updateEducation({
                    year: e.target.value,
                  })
                }
              >
                <option value="">
                  Select year
                </option>

                <option value="1">
                  1st Year
                </option>

                <option value="2">
                  2nd Year
                </option>

                <option value="3">
                  3rd Year
                </option>

                <option value="4">
                  4th Year
                </option>
              </select>
            </div>

            <div className="form-field">
              <label>Degree</label>

              <input
                value={education.degree}
                placeholder="B.Tech"
                onChange={(e) =>
                  updateEducation({
                    degree:
                      e.target.value,
                  })
                }
              />
            </div>

          </div>

          <div className="form-grid">

            <div className="form-field">
              <label>Branch</label>

              <input
                value={education.branch}
                placeholder="Computer Science"
                onChange={(e) =>
                  updateEducation({
                    branch:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="form-field">
              <label>CGPA / Percentage</label>

              <input
                value={education.grade}
                placeholder="8.5 CGPA"
                onChange={(e) =>
                  updateEducation({
                    grade:
                      e.target.value,
                  })
                }
              />
            </div>

          </div>
        </>
      )}

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

export default EducationStep;
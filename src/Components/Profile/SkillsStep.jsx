import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";

const SkillsStep = ({
  profile,
  updateProfile,
  onNext,
  onBack,
}) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] =
    useState([]);

  useEffect(() => {
    const timer = setTimeout(
      async () => {
        if (input.trim().length < 2) {
          setSuggestions([]);
          return;
        }

        try {
          const response =
            await fetch(
              `http://localhost:5000/api/skills?q=${encodeURIComponent(
                input
              )}`
            );

          const data =
            await response.json();

          setSuggestions(data);
        } catch (error) {
          console.error(error);
        }
      },
      300
    );

    return () => clearTimeout(timer);
  }, [input]);

  const addSkill = (skill) => {
    const cleanSkill = skill.trim();

    if (!cleanSkill) return;

    const alreadyExists =
      profile.skills.some(
        (item) =>
          item.toLowerCase() ===
          cleanSkill.toLowerCase()
      );

    if (!alreadyExists) {
      updateProfile({
        skills: [
          ...profile.skills,
          cleanSkill,
        ],
      });
    }

    setInput("");
    setSuggestions([]);
  };

  const removeSkill = (skill) => {
    updateProfile({
      skills: profile.skills.filter(
        (item) => item !== skill
      ),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(input);
    }
  };

  return (
    <section className="profile-form-card">

      <div className="profile-heading">
        <span>Step 4</span>

        <h1>
          What can you do?
        </h1>

        <p>
          Add your current skills. You can enter
          anything.
        </p>
      </div>

      <div className="skill-input-wrapper">

        <input
          value={input}
          placeholder="Search or enter a skill..."
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          onClick={() => addSkill(input)}
        >
          <Plus size={16} />
          Add
        </button>

      </div>

      {suggestions.length > 0 && (
        <div className="skill-suggestions">

          {suggestions.map((skill) => (
            <button
              key={skill.uri}
              onClick={() =>
                addSkill(skill.name)
              }
            >
              {skill.name}
            </button>
          ))}

        </div>
      )}

      <div className="skill-tags">

        {profile.skills.map((skill) => (
          <div
            className="skill-tag"
            key={skill}
          >
            <span>{skill}</span>

            <button
              onClick={() =>
                removeSkill(skill)
              }
            >
              <X size={13} />
            </button>
          </div>
        ))}

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

export default SkillsStep;
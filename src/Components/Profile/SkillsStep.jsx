import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SkillsStep = ({ profile, updateProfile, onNext, onBack }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = input.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/api/skills?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Failed to fetch skills");
        const data = await response.json();
        if (Array.isArray(data)) setSuggestions(data);
      } catch (error) {
        if (error.name !== "AbortError") console.error(error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [input]);

  const addSkill = (skill) => {
    const cleanSkill = skill.trim();
    if (!cleanSkill) return;

    const alreadyExists = profile.skills.some(
      (item) => item.toLowerCase() === cleanSkill.toLowerCase()
    );

    if (!alreadyExists) {
      updateProfile({ skills: [...profile.skills, cleanSkill] });
    }
    setInput("");
    setSuggestions([]);
  };

  const removeSkill = (skill) => {
    updateProfile({ skills: profile.skills.filter((item) => item !== skill) });
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
        <h1>What can you do?</h1>
        <p>Add your current skills. You can enter anything.</p>
      </div>

      <div className="skill-input-wrapper">
        <input
          value={input}
          placeholder="Search or enter a skill..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" onClick={() => addSkill(input)}>
          <Plus size={16} /> Add
        </button>
      </div>

      {loading && <div className="skill-suggestions">Searching...</div>}

      {!loading && suggestions.length > 0 && (
        <div className="skill-suggestions">
          {suggestions.map((skill) => (
            <button key={skill.uri || skill.name} type="button" onClick={() => addSkill(skill.name)}>
              {skill.name}
            </button>
          ))}
        </div>
      )}

      <div className="skill-tags">
        {profile.skills.map((skill) => (
          <div className="skill-tag" key={skill}>
            <span>{skill}</span>
            <button type="button" aria-label={`Remove ${skill}`} onClick={() => removeSkill(skill)}>
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button className="secondary-button" onClick={onBack}>
          <ArrowLeft size={17} /> Back
        </button>
        <button className="primary-button" onClick={onNext}>
          Continue <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
};

export default SkillsStep;

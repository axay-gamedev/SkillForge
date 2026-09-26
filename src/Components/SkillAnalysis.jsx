import { skills } from "../Data/profileData";

const SkillAnalysis = () => {
  return (
    <section className="panel skill-panel">
      <div className="panel-header">
        <h2>Skill Analysis</h2>
      </div>

      <div className="skills-list">
        {skills.map((skill) => (
          <div className="skill-row" key={skill.name}>
            <div className="skill-name">
              {skill.name}
            </div>

            <div className="skill-bar-container">
              <div
                className="skill-bar"
                style={{
                  width: `${skill.level}%`,
                }}
              />
            </div>

            <div className="skill-percentage">
              {skill.level}%
            </div>

            <span
              className={`skill-status ${skill.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {skill.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillAnalysis;
import { roadmap } from "../data/profileData";

const LearningRoadmap = () => {
  return (
    <section className="panel roadmap-panel">
      <div className="panel-header roadmap-header">
        <h2>Learning Roadmap</h2>

        <span className="weeks-badge">
          12 weeks
        </span>
      </div>

      <div className="roadmap">
        {roadmap.map((item, index) => (
          <div className="roadmap-item" key={item.week}>
            <div className="timeline">
              <div
                className={`timeline-dot ${
                  index === 0 ? "current-dot" : ""
                }`}
              />

              {index !== roadmap.length - 1 && (
                <div className="timeline-line" />
              )}
            </div>

            <div className="roadmap-content">
              <div className="roadmap-top">
                <span className="week">
                  {item.week}
                </span>

                <span
                  className={`roadmap-status ${item.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {item.status}
                </span>
              </div>

              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LearningRoadmap;
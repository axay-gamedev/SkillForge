
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Layers3,
  Loader2,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import Navbar from "../Components/Navbar";
import StatCard from "../Components/StatCard";
import "../Styles/dashboard.css";
import { auth, db } from "../Firebase/firebase";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        window.location.replace("/login");
        return;
      }

      if (!mounted) return;

      setUser(currentUser);

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
          window.location.replace("/profile");
          return;
        }

        const data = snapshot.data();

        if (!data.analysis) {
          window.location.replace("/profile");
          return;
        }

        if (!mounted) return;

        setProfile(data.profile || {});
        setAnalysis(data.analysis);
      } catch (err) {
        console.error("Dashboard error:", err);

        if (mounted) {
          setError(
            "Unable to load your dashboard. Please refresh and try again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />

        <main className="profile-container">
          <div className="dashboard-loading">
            <Loader2 className="spin" size={28} />
            <span>Loading your dashboard...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <Navbar />

        <main className="profile-container">
          <div className="dashboard-error">
            <AlertTriangle size={24} />
            <p>{error}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="profile-page">
        <Navbar />

        <main className="profile-container">
          <div className="dashboard-error">
            <AlertTriangle size={24} />
            <p>No career analysis found.</p>

            <button
              onClick={() => window.location.replace("/profile")}
              className="primary-button"
            >
              Complete Profile
            </button>
          </div>
        </main>
      </div>
    );
  }

  const currentHour = new Date().getHours();

  let greeting;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const skillAnalysis = Array.isArray(analysis.skillAnalysis)
    ? analysis.skillAnalysis
    : [];

  const skillGaps = Array.isArray(analysis.skillGaps)
    ? analysis.skillGaps
    : [];

  const roadmap = Array.isArray(analysis.roadmap)
    ? analysis.roadmap
    : [];

  const careerReadiness = Number(analysis.careerReadiness) || 0;

  const estimatedWeeks =
    Number(analysis.estimatedWeeks) || roadmap.length || 0;

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-container">

        {/* HERO */}

        <section className="profile-hero">
          <div>
            <h1>
              {greeting},{" "}
              {profile?.name ||
                user?.displayName ||
                "there"}
            </h1>

            <p>
              {analysis.summary ||
                "Here's your personalized learning roadmap."}
            </p>
          </div>

          <div className="target-role">
            <div className="target-icon">
              ✦
            </div>

            <div>
              <span>Target Role</span>

              <strong>
                {profile?.targetRole ||
                  "Not specified"}
              </strong>
            </div>
          </div>
        </section>

        {/* STATISTICS */}

        <section className="stats-grid">

          <StatCard
            title="Career Readiness"
            value={`${careerReadiness}%`}
            type="readiness"
            progress={careerReadiness}
          />

          <StatCard
            title="Total Skills"
            value={skillAnalysis.length}
            icon={<Layers3 size={23} />}
            type="skills"
          />

          <StatCard
            title="Skill Gaps"
            value={skillGaps.length}
            icon={<AlertTriangle size={23} />}
            type="warning"
          />

          <StatCard
            title="Estimated Time"
            value={`${estimatedWeeks} weeks`}
            icon={<CalendarDays size={23} />}
            type="calendar"
          />

        </section>

        {/* MAIN CONTENT */}

        <section className="dashboard-grid">

          {/* SKILL ANALYSIS */}

          <section className="panel skill-panel">

            <div className="panel-header">
              <h2>Skill Analysis</h2>
            </div>

            <div className="skills-list">

              {skillAnalysis.length === 0 ? (
                <p>No skill analysis available.</p>
              ) : (
                skillAnalysis.map((skill, index) => {

                  const level = Math.max(
                    0,
                    Math.min(
                      100,
                      Number(skill.level) || 0
                    )
                  );

                  const status =
                    skill.status || "Developing";

                  return (
                    <div
                      className="skill-row"
                      key={`${skill.name}-${index}`}
                    >

                      <div className="skill-name">
                        {skill.name}
                      </div>

                      <div className="skill-bar-container">

                        <div
                          className="skill-bar"
                          style={{
                            width: `${level}%`,
                          }}
                        />

                      </div>

                      <div className="skill-percentage">
                        {level}%
                      </div>

                      <span
                        className={`skill-status ${status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {status}
                      </span>

                    </div>
                  );
                })
              )}

            </div>

          </section>

          {/* LEARNING ROADMAP */}

          <section className="panel roadmap-panel">

            <div className="panel-header roadmap-header">

              <h2>
                Learning Roadmap
              </h2>

              <span className="weeks-badge">
                {estimatedWeeks} weeks
              </span>

            </div>

            <div className="roadmap">

              {roadmap.length === 0 ? (
                <p>No roadmap available.</p>
              ) : (
                roadmap.map((item, index) => {

                  const status =
                    item.status || "Upcoming";

                  return (
                    <div
                      className="roadmap-item"
                      key={`${item.week}-${item.title}-${index}`}
                    >

                      <div className="timeline">

                        <div
                          className={`timeline-dot ${
                            index === 0
                              ? "current-dot"
                              : ""
                          }`}
                        />

                        {index !== roadmap.length - 1 && (
                          <div className="timeline-line" />
                        )}

                      </div>

                      <div className="roadmap-content">

                        <div className="roadmap-top">

                          <span className="week">
                            Week {item.week}
                          </span>

                          <span
                            className={`roadmap-status ${status
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {status}
                          </span>

                        </div>

                        <h3>
                          {item.title}
                        </h3>

                        <p>
                          {item.description}
                        </p>

                      </div>

                    </div>
                  );
                })
              )}

            </div>

          </section>

        </section>

        {/* SKILL GAPS */}

        {skillGaps.length > 0 && (
          <section className="panel skill-gaps-panel">

            <div className="panel-header">
              <h2>Skill Gaps</h2>
            </div>

            <div className="skill-gaps-list">

              {skillGaps.map((gap, index) => (
                <div
                  className="skill-gap"
                  key={`${gap}-${index}`}
                >
                  <AlertTriangle size={17} />
                  <span>{gap}</span>
                </div>
              ))}

            </div>

          </section>
        )}

      </main>
    </div>
  );
};

export default Dashboard;

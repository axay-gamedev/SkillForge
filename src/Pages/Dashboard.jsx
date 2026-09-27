import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  Layers3,
  Loader2,
} from "lucide-react";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import Navbar from "../Components/Navbar";
import StatCard from "../Components/StatCard";
import "../Styles/dashboard.css";

import { auth, db } from "../Firebase/firebase";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const [completedRoadmap, setCompletedRoadmap] = useState([]);
  const [savingCompletion, setSavingCompletion] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD USER + DASHBOARD
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          window.location.replace("/login");
          return;
        }

        if (!mounted) return;

        setUser(currentUser);

        try {
          const userRef = doc(
            db,
            "users",
            currentUser.uid
          );

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

          // Load saved roadmap completion
          setCompletedRoadmap(
            Array.isArray(
              data.dashboard?.completedRoadmap
            )
              ? data.dashboard.completedRoadmap
              : []
          );
        } catch (err) {
          console.error(
            "Dashboard error:",
            err
          );

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
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // --------------------------------------------------
  // TOGGLE ROADMAP COMPLETION
  // --------------------------------------------------

  const toggleRoadmapItem = async (
    roadmapKey
  ) => {
    if (
      !user ||
      savingCompletion === roadmapKey
    ) {
      return;
    }

    const wasCompleted =
      completedRoadmap.includes(roadmapKey);

    const nextCompleted = wasCompleted
      ? completedRoadmap.filter(
          (key) => key !== roadmapKey
        )
      : [
          ...completedRoadmap,
          roadmapKey,
        ];

    // Update UI immediately
    setCompletedRoadmap(nextCompleted);

    setSavingCompletion(roadmapKey);

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          dashboard: {
            completedRoadmap:
              nextCompleted,
          },

          updatedAt:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );
    } catch (err) {
      console.error(
        "Failed to save roadmap progress:",
        err
      );

      // Revert UI if Firestore fails
      setCompletedRoadmap(
        completedRoadmap
      );
    } finally {
      setSavingCompletion(null);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />

        <main className="profile-container">
          <div className="dashboard-loading">
            <Loader2
              className="spin"
              size={28}
            />

            <span>
              Loading your dashboard...
            </span>
          </div>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

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

  // --------------------------------------------------
  // NO ANALYSIS
  // --------------------------------------------------

  if (!analysis) {
    return (
      <div className="profile-page">
        <Navbar />

        <main className="profile-container">
          <div className="dashboard-error">
            <AlertTriangle size={24} />

            <p>
              No career analysis found.
            </p>

            <button
              onClick={() =>
                window.location.replace(
                  "/profile"
                )
              }
              className="primary-button"
            >
              Complete Profile
            </button>
          </div>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

  const currentHour =
    new Date().getHours();

  let greeting;

  if (
    currentHour >= 5 &&
    currentHour < 12
  ) {
    greeting = "Good Morning";
  } else if (
    currentHour >= 12 &&
    currentHour < 17
  ) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const skillAnalysis =
    Array.isArray(
      analysis.skillAnalysis
    )
      ? analysis.skillAnalysis
      : [];

  const skillGaps =
    Array.isArray(
      analysis.skillGaps
    )
      ? analysis.skillGaps
      : [];

  const roadmap =
    Array.isArray(analysis.roadmap)
      ? analysis.roadmap
      : [];

  const careerReadiness =
    Number(
      analysis.careerReadiness
    ) || 0;

  const estimatedWeeks =
    Number(
      analysis.estimatedWeeks
    ) ||
    roadmap.length ||
    0;

  // --------------------------------------------------
  // ROADMAP PROGRESS
  // --------------------------------------------------

  const completedCount =
    roadmap.filter(
      (item, index) => {
        const key = `${item.week}-${item.title}-${index}`;

        return completedRoadmap.includes(
          key
        );
      }
    ).length;

  const completionPercentage =
    roadmap.length > 0
      ? Math.round(
          (completedCount /
            roadmap.length) *
            100
        )
      : 0;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

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
              <span>
                Target Role
              </span>

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
            progress={
              careerReadiness
            }
          />

          <StatCard
            title="Total Skills"
            value={
              skillAnalysis.length
            }
            icon={
              <Layers3 size={23} />
            }
            type="skills"
          />

          <StatCard
            title="Skill Gaps"
            value={
              skillGaps.length
            }
            icon={
              <AlertTriangle
                size={23}
              />
            }
            type="warning"
          />

          <StatCard
            title="Estimated Time"
            value={`${estimatedWeeks} weeks`}
            icon={
              <CalendarDays
                size={23}
              />
            }
            type="calendar"
          />

        </section>

        {/* MAIN CONTENT */}

        <section className="dashboard-grid">

          {/* SKILLS */}

          <section className="panel skill-panel">

            <div className="panel-header">
              <h2>
                Skill Analysis
              </h2>
            </div>

            <div className="skills-list">

              {skillAnalysis.length ===
              0 ? (
                <p>
                  No skill analysis
                  available.
                </p>
              ) : (
                skillAnalysis.map(
                  (
                    skill,
                    index
                  ) => {

                    const level =
                      Math.max(
                        0,
                        Math.min(
                          100,
                          Number(
                            skill.level
                          ) || 0
                        )
                      );

                    const status =
                      skill.status ||
                      "Developing";

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
                            .replace(
                              /\s+/g,
                              "-"
                            )}`}
                        >
                          {status}
                        </span>

                      </div>
                    );
                  }
                )
              )}

            </div>
          </section>

          {/* ROADMAP */}

          <section className="panel roadmap-panel">

            <div className="panel-header roadmap-header">

              <div className="roadmap-heading-wrap">

                <h2>
                  Learning Roadmap
                </h2>

                <div className="roadmap-progress-wrap">

                  <div className="roadmap-progress-track">
                    <div
                      className="roadmap-progress-fill"
                      style={{
                        width: `${completionPercentage}%`,
                      }}
                    />
                  </div>

                  <span>
                    {completedCount}/
                    {roadmap.length}{" "}
                    completed
                  </span>

                </div>

              </div>

              <span className="weeks-badge">
                {estimatedWeeks} weeks
              </span>

            </div>

            <div className="roadmap">

              {roadmap.length ===
              0 ? (
                <p>
                  No roadmap available.
                </p>
              ) : (
                roadmap.map(
                  (
                    item,
                    index
                  ) => {

                    const roadmapKey =
                      `${item.week}-${item.title}-${index}`;

                    const isCompleted =
                      completedRoadmap.includes(
                        roadmapKey
                      );

                    const status =
                      isCompleted
                        ? "Completed"
                        : item.status ||
                          "Upcoming";

                    return (
                      <div
                        className={`roadmap-item ${
                          isCompleted
                            ? "roadmap-item-completed"
                            : ""
                        }`}
                        key={
                          roadmapKey
                        }
                      >

                        {/* TIMELINE */}

                        <div className="timeline">

                          <label
                            className={`roadmap-checkbox ${
                              isCompleted
                                ? "checked"
                                : ""
                            }`}
                            title={
                              isCompleted
                                ? "Mark as incomplete"
                                : "Mark as completed"
                            }
                          >

                            <input
                              type="checkbox"
                              checked={
                                isCompleted
                              }
                              disabled={
                                savingCompletion ===
                                roadmapKey
                              }
                              onChange={() =>
                                toggleRoadmapItem(
                                  roadmapKey
                                )
                              }
                              aria-label={`Mark ${item.title} as completed`}
                            />

                            {isCompleted && (
                              <Check
                                size={11}
                                strokeWidth={
                                  3
                                }
                              />
                            )}

                          </label>

                          {index !==
                            roadmap.length -
                              1 && (
                            <div className="timeline-line" />
                          )}

                        </div>

                        {/* CONTENT */}

                        <div className="roadmap-content">

                          <div className="roadmap-top">

                            <span className="week">
                              Week{" "}
                              {item.week}
                            </span>

                            <span
                              className={`roadmap-status ${
                                isCompleted
                                  ? "completed"
                                  : status
                                      .toLowerCase()
                                      .replace(
                                        /\s+/g,
                                        "-"
                                      )
                              }`}
                            >
                              {status}
                            </span>

                          </div>

                          <h3>
                            {item.title}
                          </h3>

                          <p>
                            {
                              item.description
                            }
                          </p>

                        </div>

                      </div>
                    );
                  }
                )
              )}

            </div>

          </section>

        </section>

        {/* SKILL GAPS */}

        {skillGaps.length >
          0 && (
          <section className="panel skill-gaps-panel">

            <div className="panel-header">
              <h2>
                Skill Gaps
              </h2>
            </div>

            <div className="skill-gaps-list">

              {skillGaps.map(
                (gap, index) => (
                  <div
                    className="skill-gap"
                    key={`${gap}-${index}`}
                  >
                    <AlertTriangle
                      size={17}
                    />

                    <span>
                      {gap}
                    </span>
                  </div>
                )
              )}

            </div>

          </section>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
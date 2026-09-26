import {
  Layers3,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";

import Navbar from "../Components/Navbar";
import StatCard from "../Components/StatCard";
import SkillAnalysis from "../Components/SkillAnalysis";
import LearningRoadmap from "../Components/LearningRoadmap";

import "../Styles/dashboard.css";

const Dashboard = () => {

    const currentHour = new Date().getHours();

    let greeting = "";

    if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning";
    } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
    } else {
    greeting = "Good Evening";
    }

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-container">

        {/* Hero */}
        <section className="profile-hero">
          <div>
            <h1>
              {greeting}, Akshay
            </h1>

            <p>
              Here's your personalized learning roadmap.
            </p>
          </div>

          <div className="target-role">
            <div className="target-icon">
              ✦
            </div>

            <div>
              <span>Target Role</span>
              <strong>
                Machine Learning Engineer
              </strong>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="stats-grid">

          <StatCard
            title="Career Readiness"
            value="58%"
            type="readiness"
            progress={58}
          />

          <StatCard
            title="Total Skills"
            value="12"
            icon={<Layers3 size={23} />}
            type="skills"
          />

          <StatCard
            title="Skill Gaps"
            value="8"
            icon={<AlertTriangle size={23} />}
            type="warning"
          />

          <StatCard
            title="Estimated Time"
            value="12 weeks"
            icon={<CalendarDays size={23} />}
            type="calendar"
          />

        </section>

        {/* Main Content */}
        <section className="dashboard-grid">
          <SkillAnalysis />
          <LearningRoadmap />
        </section>

      </main>
    </div>
  );
};

export default Dashboard;
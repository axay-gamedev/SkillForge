import { ArrowRight, BrainCircuit, Github, Route, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import "../Styles/home.css";

const Home = () => {
  return (
    <div className="home-page">
      {/* Landing page navigation */}
      <header className="home-navbar">
        <Link to="/" className="home-logo">
          Skill<span>Forge</span>
        </Link>

        <nav className="home-nav-links" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <Link to="/login">Login</Link>
        </nav>

        <Link to="/profile" className="home-nav-cta">
          Get started
          <ArrowRight size={15} />
        </Link>
      </header>

      <main>
        {/* Hero */}
        <section className="home-hero">
          <div className="hero-glow" />

          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} />
              AI-powered career guidance
            </div>

            <h1>
              Build the skills.
              <br />
              <span>Forge your career.</span>
            </h1>

            <p>
              SkillForge analyzes where you are today, identifies the skills
              you need for your target role, and builds a personalized path to
              get you there.
            </p>

            <div className="hero-actions">
              <Link to="/profile" className="hero-primary">
                Build my roadmap
                <ArrowRight size={17} />
              </Link>

              <Link to="/login" className="hero-secondary">
                Sign in
              </Link>
            </div>

            <div className="hero-note">
              <span />
              Takes a few minutes to set up
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="home-section">
          <div className="section-heading">
            <span>HOW IT WORKS</span>
            <h2>A clearer path from skills to career.</h2>
            <p>
              Stop guessing what to learn next. SkillForge turns your current
              profile into an actionable learning roadmap.
            </p>
          </div>

          <div className="feature-grid" id="features">
            <article className="feature-card">
              <div className="feature-icon">
                <Target size={20} />
              </div>
              <span>01</span>
              <h3>Define your target</h3>
              <p>
                Tell us your career goal, education, experience, projects, and
                current skills.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">
                <BrainCircuit size={20} />
              </div>
              <span>02</span>
              <h3>Find your gaps</h3>
              <p>
                AI compares your current profile with the capabilities your
                target role requires.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">
                <Route size={20} />
              </div>
              <span>03</span>
              <h3>Follow your roadmap</h3>
              <p>
                Get a structured sequence of topics and milestones designed
                around your skill gaps.
              </p>
            </article>
          </div>
        </section>

        {/* Product highlights */}
        <section className="home-section home-highlights">
          <div className="highlight-copy">
            <span>BUILT FOR STUDENTS</span>
            <h2>Know what to learn. Know why you are learning it.</h2>
            <p>
              Your dashboard brings your readiness score, skill analysis, gaps,
              and learning roadmap together in one place.
            </p>
          </div>

          <div className="highlight-preview" aria-hidden="true">
            <div className="preview-header">
              <span>CAREER READINESS</span>
              <strong>72%</strong>
            </div>
            <div className="preview-bars">
              <div><span>Programming</span><i><b style={{ width: "82%" }} /></i></div>
              <div><span>Data & ML</span><i><b style={{ width: "58%" }} /></i></div>
              <div><span>System Design</span><i><b style={{ width: "41%" }} /></i></div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="home-cta">
          <div>
            <span>READY TO START?</span>
            <h2>Your next skill is closer than you think.</h2>
          </div>

          <Link to="/profile" className="hero-primary">
            Get started
            <ArrowRight size={17} />
          </Link>
        </section>
      </main>

      <footer className="home-footer">
        <span>SkillForge</span>
        <span>Personalized learning, built around you.</span>
        <a
          href="https://github.com/axay-gamedev/SkillForge"
          target="_blank"
          rel="noreferrer"
          aria-label="SkillForge GitHub repository"
        >
          <Github size={15} />
          Open source
        </a>
      </footer>
    </div>
  );
};

export default Home;

import { ArrowRight, BrainCircuit, Route, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import GradientWaves from "../Components/GradientWaves";
import "../Styles/home.css";
import Navbar from "../Components/Navbar";

const Home = () => {
  return (
    <div className="home-page">
      {/* Landing page navigation */}
      <Navbar />

      <main>
        {/* Hero */}
        <div style={{ width: "100%", height: "600px", position: "relative", overflow: "hidden" }}>
          {/* Background Layer */}
          <GradientWaves
            horizonColor="#5227FF"
            waveColor="#FF9FFC"
            crestColor="#FFFFFF"
            speed={0.4}
            amplitude={2.5}
            waveScale={0.6}
            waveRatio={0.9}
            swell={35}
            turbulence={20}
            tilt={1.11}
            zoom={1.0}
            height={5.5}
            fogDepth={15}
            detail="medium"
            brightness={1.0}
            opacity={1.0}
            mouseInteraction={true}
            parallaxStrength={0.5}
            grain={true}
            grainIntensity={0.05}
          />

          {/* Foreground Hero Content */}
          <section className="home-hero" style={{ position: "relative", zIndex: 10 }}>
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

              
            </div>
          </section>
        </div>

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
              <div className="feature-icon"><Target size={20} /></div>
              <span>01</span>
              <h3>Define your target</h3>
              <p>Tell us your career goal, education, experience, projects, and current skills.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon"><BrainCircuit size={20} /></div>
              <span>02</span>
              <h3>Find your gaps</h3>
              <p>AI compares your current profile with the capabilities your target role requires.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon"><Route size={20} /></div>
              <span>03</span>
              <h3>Follow your roadmap</h3>
              <p>Get a structured sequence of topics and milestones designed around your skill gaps.</p>
            </article>
          </div>
        </section>

        {/* Product highlights */}
        <section className="home-section home-highlights">
          <div className="highlight-copy">
            <span>BUILT FOR STUDENTS</span>
            <h2>Know what to learn. Know why you are learning it.</h2>
            <p>Your dashboard brings your readiness score, skill analysis, gaps, and learning roadmap together in one place.</p>
          </div>

          <div className="highlight-preview" aria-hidden="true">
            <div className="preview-header"><span>CAREER READINESS</span><strong>72%</strong></div>
            <div className="preview-bars">
              <div><span>Programming</span><i><b style={{ width: "82%" }} /></i></div>
              <div><span>Data & ML</span><i><b style={{ width: "58%" }} /></i></div>
              <div><span>System Design</span><i><b style={{ width: "41%" }} /></i></div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="home-cta">
          <div><span>READY TO START?</span><h2>Your next skill is closer than you think.</h2></div>
          <Link to="/profile" className="hero-primary">Get started <ArrowRight size={17} /></Link>
        </section>
      </main>

      <footer className="home-footer">
        <span>SkillForge</span>
        <span>Personalized learning, built around you.</span>
        <a href="https://github.com/axay-gamedev/SkillForge" target="_blank" rel="noreferrer" aria-label="SkillForge GitHub repository">
        
                OpenSource
                <ArrowRight size={16} />
        </a>
      </footer>
    </div>
  );
};

export default Home;
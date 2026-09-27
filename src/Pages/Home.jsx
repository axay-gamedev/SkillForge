import { ArrowRight, BrainCircuit, Route, Target, Sparkles } from "lucide-react";
import Navbar from "../Components/Navbar";
import "../Styles/home.css";

const Home = () => (
  <div className="home-page">
    <Navbar />
    <main>
      <section className="home-hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge"><Sparkles size={14} /> AI-powered career guidance</div>
          <h1>Build the skills.<br /><span>Forge your career.</span></h1>
          <p>SkillForge analyzes where you are today, identifies the skills you need for your target role, and builds a personalized path to get you there.</p>
          <div className="hero-actions">
            <a href="/profile" className="hero-primary">Build my roadmap <ArrowRight size={17} /></a>
            <a href="/dashboard" className="hero-secondary">View dashboard</a>
          </div>
          <div className="hero-note"><span /> Takes a few minutes to set up</div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <span>HOW IT WORKS</span>
          <h2>A clearer path from skills to career.</h2>
          <p>Stop guessing what to learn next. SkillForge turns your current profile into an actionable learning roadmap.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card"><div className="feature-icon"><Target size={20} /></div><span>01</span><h3>Define your target</h3><p>Tell us your career goal, education, experience, projects, and current skills.</p></article>
          <article className="feature-card"><div className="feature-icon"><BrainCircuit size={20} /></div><span>02</span><h3>Find your gaps</h3><p>AI compares your current profile with the capabilities your target role requires.</p></article>
          <article className="feature-card"><div className="feature-icon"><Route size={20} /></div><span>03</span><h3>Follow your roadmap</h3><p>Get a structured sequence of topics and milestones designed around your gaps.</p></article>
        </div>
      </section>

      <section className="home-cta">
        <div><span>READY TO START?</span><h2>Your next skill is closer than you think.</h2></div>
        <a href="/profile" className="hero-primary">Get started <ArrowRight size={17} /></a>
      </section>
    </main>
    <footer className="home-footer"><span>SkillForge</span><span>Personalized learning, built around you.</span></footer>
  </div>
);

export default Home;

import { ArrowRight } from "lucide-react";
import { FaGithub } from 'react-icons/fa';
const Navbar = () => {
    return (
        <nav className="navbar">
            <a href="/"><div className="logo">
                Skill<span>Forge</span>
            </div></a>

            <div className="nav-links">
                <a href="/">Home</a>
                  <a href="/dashboard">Dashboard</a>
                <a href="/profile" >
                    Profile
                </a>
              
            </div>

            <a href="https://github.com/axay-gamedev/SkillForge"><button className="get-started">
                <FaGithub color="#000" size={24} strokeWidth={2} />
                Contribute
                <ArrowRight size={16} />
            </button></a>
        </nav>
    );
};

export default Navbar;
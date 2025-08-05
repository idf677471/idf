import React, { useState, useEffect, useRef } from 'react';
import { Github, ExternalLink, Dribbble, Twitter, Terminal, ChevronRight, Mail, Link } from 'lucide-react';

// Main App Component
const App = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define skills and contact information to be used in the terminal
  const [skills, setSkills] = useState([
    "React", "JavaScript (ES6+)", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Figma", "Git"
  ]);

  const [contactInfo, setContactInfo] = useState({
    email: "afek@example.com",
    github: "https://github.com/your-username",
    twitter: "https://twitter.com/your-username",
    dribbble: "https://dribbble.com/your-username"
  });

  // Function to fetch project data from the Gemini API
  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const chatHistory = [];
      const prompt = "Generate a JSON array of 6 creative and attractive portfolio projects for a web developer. Each object should have a 'title' (string), 'description' (string), 'githubUrl' (string), and 'liveUrl' (string). The project names should be unique and the descriptions should be engaging. The URLs can be placeholders.";
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = {
          contents: chatHistory,
          generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                  type: "ARRAY",
                  items: {
                      type: "OBJECT",
                      properties: {
                          "title": { "type": "STRING" },
                          "description": { "type": "STRING" },
                          "githubUrl": { "type": "STRING" },
                          "liveUrl": { "type": "STRING" }
                      },
                      "propertyOrdering": ["title", "description", "githubUrl", "liveUrl"]
                  }
              }
          }
      };
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      
      const result = await response.json();
      const json = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!json) {
        throw new Error("Invalid response from API: JSON content is missing.");
      }
      
      const parsedProjects = JSON.parse(json);
      setProjects(parsedProjects);

    } catch (e) {
      console.error("Error fetching projects:", e);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="bg-slate-950 text-gray-100 min-h-screen font-sans antialiased">
      {/* Header and Hero Section */}
      <header className="p-8 md:p-16 text-center overflow-hidden relative">
        <div className="relative z-10 space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white animate-fade-in">
            Afek
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto animate-slide-up">
            Creative Developer & Digital Craftsman
          </p>
          <div className="flex justify-center space-x-4 mt-6 animate-zoom-in">
            <a 
              href="#projects" 
              className="bg-teal-500 hover:bg-teal-600 text-slate-900 font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              View Projects
            </a>
            <a 
              href="https://github.com/your-username" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-slate-800 hover:bg-slate-700 text-gray-300 py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center"
            >
              <Github className="mr-2" size={20} />
              GitHub
            </a>
          </div>
        </div>
        {/* Animated background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 absolute top-10 left-10 animate-blob"></div>
          <div className="w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-2000"></div>
          <div className="w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 absolute bottom-10 right-10 animate-blob animation-delay-4000"></div>
        </div>
      </header>
      
      {/* Interactive Terminal Section */}
      <div className="container mx-auto p-8 md:p-16">
        <TerminalSection projects={projects} skills={skills} contactInfo={contactInfo} />
      </div>

      {/* Projects Section */}
      <main id="projects" className="container mx-auto p-8 md:p-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">My Projects</h2>
        {isLoading && (
          <div className="text-center text-lg text-slate-400">
            <div className="w-10 h-10 border-4 border-teal-500 border-solid border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Loading projects...
          </div>
        )}
        {error && (
          <div className="text-center text-red-400 text-lg">
            {error}
          </div>
        )}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className="bg-slate-800 rounded-xl p-6 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 group relative overflow-hidden border border-slate-700 hover:border-teal-500"
              >
                {/* Project card background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 space-y-3">
                  <h3 className="text-2xl font-bold text-teal-400">{project.title}</h3>
                  <p className="text-slate-300 text-sm">{project.description}</p>
                  <div className="flex items-center space-x-4">
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-slate-400 hover:text-white transition-colors flex items-center"
                    >
                      <Github size={20} className="mr-1" /> GitHub
                    </a>
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-slate-400 hover:text-white transition-colors flex items-center"
                    >
                      <ExternalLink size={20} className="mr-1" /> Live
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="py-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Afek. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Github size={24} /></a>
          <a href="https://twitter.com/your-username" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Twitter size={24} /></a>
          <a href="https://dribbble.com/your-username" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Dribbble size={24} /></a>
        </div>
      </footer>

      {/* Tailwind CSS keyframes for animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.8s ease-out 0.5s forwards; opacity: 0; }
        .animate-zoom-in { animation: zoomIn 0.8s ease-out 1s forwards; opacity: 0; }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

// Interactive Terminal Component
const TerminalSection = ({ projects, skills, contactInfo }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    "Welcome to Afek's interactive terminal. Type 'help' to get started.",
    ""
  ]);
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  // Command handler
  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const command = input.trim().toLowerCase();
      let newOutput = [...output, `$ ${input}`, ''];
      
      switch (command) {
        case 'help':
          newOutput.push(
            "Available commands:",
            "  whoami    - Learn more about me.",
            "  projects  - See my latest work.",
            "  skills    - View my technical skills.",
            "  contact   - Get in touch with me.",
            "  clear     - Clear the terminal.",
            "  help      - Show this help message."
          );
          break;
        case 'whoami':
          newOutput.push(
            "Hello, I'm Afek, a passionate web developer focused on creating engaging digital experiences.",
            "I specialize in React and Tailwind CSS, building responsive and modern web applications."
          );
          break;
        case 'projects':
          if (projects.length > 0) {
            newOutput.push("Here are some of my projects:");
            projects.forEach((proj, index) => {
              newOutput.push(`  ${index + 1}. ${proj.title} - ${proj.liveUrl}`);
            });
          } else {
            newOutput.push("Projects are currently loading or unavailable.");
          }
          break;
        case 'skills':
          if (skills.length > 0) {
            newOutput.push("My technical skills include:");
            skills.forEach(skill => {
              newOutput.push(`  - ${skill}`);
            });
          } else {
            newOutput.push("Skills are not yet defined.");
          }
          break;
        case 'contact':
          newOutput.push(
            "You can reach me at:",
            `  Email: ${contactInfo.email}`,
            `  GitHub: ${contactInfo.github}`,
            `  Twitter: ${contactInfo.twitter}`,
            `  Dribbble: ${contactInfo.dribbble}`
          );
          break;
        case 'clear':
          newOutput = [""];
          break;
        default:
          newOutput.push(`Command not found: ${input}. Type 'help' for a list of commands.`);
          break;
      }
      
      newOutput.push('');
      setOutput(newOutput);
      setInput('');
      e.target.blur(); // Blur the input after command execution
    }
  };

  // Scroll to bottom on new output and focus input
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [output]);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden p-6 animate-zoom-in">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-sm ml-auto text-slate-500">Afek's Terminal</span>
      </div>
      <div ref={outputRef} className="h-64 overflow-y-auto text-sm text-gray-300 font-mono pr-2" style={{ scrollbarWidth: 'thin' }}>
        {output.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
      <div className="flex items-center text-sm font-mono mt-4">
        <span className="text-teal-400 flex-shrink-0 flex items-center">
          <Terminal size={16} className="mr-1" />
          <span className="hidden sm:inline">afek@portfolio:~</span>$
        </span>
        <input 
          ref={inputRef}
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={handleCommand}
          className="bg-transparent border-none outline-none text-gray-100 caret-teal-400 p-0 ml-2 w-full"
        />
        <ChevronRight size={16} className="ml-1 text-teal-400" />
      </div>
    </div>
  );
};

export default App;

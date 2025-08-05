import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Github, ExternalLink, Dribbble, Twitter, Terminal, ChevronRight } from 'lucide-react';

// Starfield Background Component
const Starfield = () => {
  const canvasRef = useRef(null);
  const stars = useRef([]);
  const shootingStars = useRef([]);
  const animationFrameId = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars.current = [];
      shootingStars.current = []; // Clear shooting stars on resize
      for (let i = 0; i < 500; i++) {
        stars.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random(), // For size variation
          r: Math.random() * 1.5,
          color: `hsl(${Math.random() * 360}, 50%, 80%)`,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1
        });
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial resize and star generation

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f172a'; // Dark blue/slate background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw regular stars
      stars.current.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;
        
        // Wrap stars around the screen
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        ctx.beginPath();
        const size = star.r * star.z;
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
        ctx.closePath();
      });

      // Add new shooting stars periodically
      if (Math.random() < 0.05) { // Adjust frequency
        shootingStars.current.push({
          x: Math.random() * canvas.width * 0.2, // Start from top-left quarter
          y: Math.random() * canvas.height * 0.2,
          length: Math.random() * 50 + 20, // Length of the tail
          speed: Math.random() * 8 + 5, // Faster speed
          alpha: 1,
          color: `hsl(${Math.random() * 360}, 100%, 70%)`
        });
      }

      // Update and draw shooting stars
      shootingStars.current = shootingStars.current.filter(sStar => {
        sStar.x += sStar.speed;
        sStar.y += sStar.speed; // Diagonal movement (top-left to bottom-right)
        sStar.alpha -= 0.01; // Fade out

        ctx.beginPath();
        ctx.moveTo(sStar.x, sStar.y);
        ctx.lineTo(sStar.x - sStar.length, sStar.y - sStar.length); // Draw tail
        ctx.strokeStyle = `rgba(${parseInt(sStar.color.substring(4, 7))}, ${parseInt(sStar.color.substring(8, 11))}, ${parseInt(sStar.color.substring(12, 15))}, ${sStar.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Remove if off-screen or faded
        return sStar.x < canvas.width + sStar.length && sStar.y < canvas.height + sStar.length && sStar.alpha > 0;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10"></canvas>;
};

// Main App Component
const App = () => {
  // Hardcoded project data to make the site offline-first
  const [projects] = useState([
    {
      title: "Pixel Palettes",
      description: "A tool for generating and saving beautiful color palettes. Create, share, and get inspired by others' designs.",
      githubUrl: "https://github.com/your-username/pixel-palettes",
      liveUrl: "https://pixelpalettes.vercel.app"
    },
    {
      title: "Code Canvas",
      description: "An online code editor with live previews for HTML, CSS, and JavaScript. Perfect for quick prototyping and learning.",
      githubUrl: "https://github.com/your-username/code-canvas",
      liveUrl: "https://codecanvas.netlify.app"
    },
    {
      title: "TaskFlow",
      description: "A sleek, minimalist task management app to help you stay organized and boost productivity. Features drag-and-drop functionality.",
      githubUrl: "https://github.com/your-username/task-flow",
      liveUrl: "https://taskflow.app"
    },
    {
      title: "Astro Arcade",
      description: "A collection of simple, browser-based games built with vanilla JavaScript. Relive the glory days of arcade gaming.",
      githubUrl: "https://github.com/your-username/astro-arcade",
      liveUrl: "https://astro-arcade.com"
    },
    {
      title: "Recipe Rover",
      description: "Discover new recipes from around the world. Search, filter by ingredients, and save your favorites to a personal cookbook.",
      githubUrl: "https://github.com/your-username/recipe-rover",
      liveUrl: "https://reciperover.net"
    },
    {
      title: "Weather Wave",
      description: "A beautifully animated weather app that provides real-time forecasts and visual representations of current conditions.",
      githubUrl: "https://github.com/your-username/weather-wave",
      liveUrl: "https://weatherwave.io"
    },
  ]);

  // Define skills and contact information to be used in the terminal
  const [skills] = useState([
    "React", "JavaScript (ES6+)", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Figma", "Git"
  ]);

  const [contactInfo] = useState({
    email: "afek@example.com",
    github: "https://github.com/your-username",
    twitter: "https://twitter.com/your-username",
    dribbble: "https://dribbble.com/your-username"
  });

  return (
    <div className="bg-slate-950 text-gray-100 min-h-screen font-sans antialiased relative">
      {/* Animated Starfield Background */}
      <Starfield />

      {/* Header and Hero Section */}
      <header className="relative z-10 p-8 md:p-16 text-center overflow-hidden">
        <div className="space-y-4">
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
      </header>
      
      {/* Interactive Terminal Section */}
      <div className="container mx-auto p-8 md:p-16 relative z-10">
        <TerminalSection projects={projects} skills={skills} contactInfo={contactInfo} />
      </div>

      {/* Projects Section */}
      <main id="projects" className="container mx-auto p-8 md:p-16 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">My Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="bg-slate-800/50 rounded-xl p-6 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 group relative overflow-hidden border border-slate-700 hover:border-teal-500 backdrop-filter backdrop-blur-md"
            >
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
      </main>

      {/* Footer Section */}
      <footer className="py-8 text-center text-gray-500 relative z-10">
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
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.8s ease-out 0.5s forwards; opacity: 0; }
        .animate-zoom-in { animation: zoomIn 0.8s ease-out 1s forwards; opacity: 0; }
      `}</style>
    </div>
  );
};

// Interactive Terminal Component
const TerminalSection = ({ projects, skills, contactInfo }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    <span key="welcome" className="text-lime-400">Welcome to Afek's interactive terminal. Type 'help' to get started.</span>,
    <span key="empty-line"></span>
  ]);
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  // Command handler
  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const command = input.trim().toLowerCase();
      let newOutput = [...output, <span key={output.length} className="text-teal-400">{`$ ${input}`}</span>, <span key={output.length + 1}></span>];
      
      switch (command) {
        case 'help':
          newOutput.push(
            "Available commands:",
            "  <span class='text-lime-400'>whoami</span>    - Learn more about me.",
            "  <span class='text-lime-400'>projects</span>  - See my latest work.",
            "  <span class='text-lime-400'>skills</span>    - View my technical skills.",
            "  <span class='text-lime-400'>contact</span>   - Get in touch with me.",
            "  <span class='text-lime-400'>joke</span>      - Tell me a joke!",
            "  <span class='text-lime-400'>cowsay</span>    - Get a surprise ASCII cow.",
            "  <span class='text-lime-400'>clear</span>     - Clear the terminal.",
            "  <span class='text-lime-400'>help</span>      - Show this help message."
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
              newOutput.push(`  <span class='text-cyan-400'>${index + 1}. ${proj.title}</span> - ${proj.liveUrl}`);
            });
          } else {
            newOutput.push(<span className="text-red-400">Projects are currently loading or unavailable.</span>);
          }
          break;
        case 'skills':
          if (skills.length > 0) {
            newOutput.push("My technical skills include:");
            skills.forEach(skill => {
              newOutput.push(`  <span class='text-blue-400'>- ${skill}</span>`);
            });
          } else {
            newOutput.push(<span className="text-red-400">Skills are not yet defined.</span>);
          }
          break;
        case 'contact':
          newOutput.push(
            "You can reach me at:",
            `  <span class='text-orange-400'>Email:</span> ${contactInfo.email}`,
            `  <span class='text-orange-400'>GitHub:</span> ${contactInfo.github}`,
            `  <span class='text-orange-400'>Twitter:</span> ${contactInfo.twitter}`,
            `  <span class='text-orange-400'>Dribbble:</span> ${contactInfo.dribbble}`
          );
          break;
        case 'joke':
          newOutput.push(
            "Why don't scientists trust atoms?",
            "Because they make up everything!"
          );
          break;
        case 'cowsay':
          newOutput.push(
            `
  <pre className='text-yellow-400'>
   <
    Moo-ve along, nothing to see here!
   >
    ---------------------------
          \\   ^__^
           \\  (oo)\\_______
              (__)\\       )/\\/\\
                  ||----w |
                  ||     ||
  </pre>
            `.trim()
          );
          break;
        case 'play': // Removed this command as game is removed
          newOutput.push(<span className="text-red-400">The 'play' command is no longer available.</span>);
          break;
        case 'clear':
          newOutput = [""];
          break;
        default:
          newOutput.push(<span className="text-red-400">{`Command not found: ${input}. Type 'help' for a list of commands.`}</span>);
          break;
      }
      
      newOutput.push('');
      // Convert HTML strings to JSX
      const formattedOutput = newOutput.map((line, index) => {
          if (typeof line === 'string' && line.includes('<span')) {
              return <span key={index} dangerouslySetInnerHTML={{ __html: line }} />;
          }
          return <div key={index} className="whitespace-pre-wrap">{line}</div>;
      });
      
      setOutput(formattedOutput);
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
        {output}
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

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Github, ExternalLink, Dribbble, Twitter, Terminal, ChevronRight, Gamepad2 } from 'lucide-react';

// Starfield Background Component
const Starfield = () => {
  const canvasRef = useRef(null);
  const stars = useRef([]);
  const animationFrameId = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars.current = [];
      for (let i = 0; i < 500; i++) {
        stars.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random(),
          r: Math.random() * 1.5,
          color: `hsl(${Math.random() * 360}, 50%, 80%)`,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1
        });
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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

// Pong Game Component
const PongGame = () => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Game variables
    let ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 5, dy: 5, radius: 10 };
    let paddle1 = { x: 10, y: canvas.height / 2 - 40, width: 10, height: 80, score: 0 };
    let paddle2 = { x: canvas.width - 20, y: canvas.height / 2 - 40, width: 10, height: 80, score: 0 };

    // Draw everything
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw paddles
      ctx.fillStyle = '#67e8f9'; // Cyan
      ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
      ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#fde047'; // Yellow
      ctx.fill();
      ctx.closePath();

      // Draw scores
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '24px sans-serif';
      ctx.fillText(paddle1.score, canvas.width / 4, 30);
      ctx.fillText(paddle2.score, canvas.width * 3 / 4, 30);
    };

    // Update game state
    const update = () => {
      // Move ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Ball collision with top/bottom walls
      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      }

      // Ball collision with paddles
      if (ball.x - ball.radius < paddle1.x + paddle1.width && ball.y > paddle1.y && ball.y < paddle1.y + paddle1.height) {
        ball.dx = -ball.dx;
      }
      if (ball.x + ball.radius > paddle2.x && ball.y > paddle2.y && ball.y < paddle2.y + paddle2.height) {
        ball.dx = -ball.dx;
      }

      // Ball out of bounds (scoring)
      if (ball.x - ball.radius < 0) {
        paddle2.score++;
        resetBall();
      } else if (ball.x + ball.radius > canvas.width) {
        paddle1.score++;
        resetBall();
      }
    };

    // Reset ball position and direction
    const resetBall = () => {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx = (Math.random() > 0.5 ? 5 : -5);
      ball.dy = (Math.random() > 0.5 ? 5 : -5);
    };
    
    // Handle keyboard input
    const handleKeyDown = (e) => {
      const paddleSpeed = 15;
      if (e.key === 'w' || e.key === 'W') paddle1.y = Math.max(0, paddle1.y - paddleSpeed);
      if (e.key === 's' || e.key === 'S') paddle1.y = Math.min(canvas.height - paddle1.height, paddle1.y + paddleSpeed);
      if (e.key === 'ArrowUp') paddle2.y = Math.max(0, paddle2.y - paddleSpeed);
      if (e.key === 'ArrowDown') paddle2.y = Math.min(canvas.height - paddle2.height, paddle2.y + paddleSpeed);
    };
    
    window.addEventListener('keydown', handleKeyDown);

    // Main game loop
    const gameLoop = () => {
      update();
      draw();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    // Start game on window load
    const startGame = () => {
      canvas.width = window.innerWidth > 600 ? 600 : window.innerWidth * 0.9;
      canvas.height = canvas.width * 0.6;
      resetBall();
      gameLoop();
    };

    // Listen for resize to make canvas responsive
    const handleResize = () => {
      cancelAnimationFrame(animationFrameId.current);
      startGame();
    };

    window.addEventListener('resize', handleResize);
    startGame();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId.current);
    };

  }, []);

  return (
    <div className="relative overflow-hidden w-full max-w-2xl mx-auto rounded-xl shadow-2xl border-2 border-slate-700">
      <canvas ref={canvasRef}></canvas>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="text-center text-white p-4 bg-black bg-opacity-50 rounded">
          <p className="text-lg font-bold">Player 1: W & S</p>
          <p className="text-lg font-bold">Player 2: Arrow Up & Down</p>
        </div>
      </div>
    </div>
  );
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
              className="bg-slate-800 rounded-xl p-6 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 group relative overflow-hidden border border-slate-700 hover:border-teal-500"
            >
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
      </main>

      {/* Playground Section */}
      <section id="playground" className="container mx-auto p-8 md:p-16 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Playground</h2>
        <PongGame />
      </section>

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
            "  <span class='text-lime-400'>play</span>      - Launch a simple game!",
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
        case 'play':
          newOutput.push(
            <span>Ready for a game? Scroll down to the <a href="#playground" className="text-sky-400 underline">Playground</a> section to play Pong!</span>
          );
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

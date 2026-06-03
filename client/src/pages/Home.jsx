import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/shared/auth-modal";

export default function Home() {
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // When the page loads, check if the user has a token in their browser
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // The Interceptor
  const handleDashboardClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard"); // Let them in!
    } else {
      setShowAuthModal(true); // Pop the modal!
    }
  };

  // The Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false); // Update the screen instantly
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-indigo-500/30">
      {/* 1. NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-zinc-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl">
            &lt;/&gt;
          </div>
          <span className="text-xl font-bold tracking-tight">SyncSpace</span>
        </div>

        {/* CONDITIONAL NAVBAR BUTTONS */}
        <div className="flex gap-4">
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-zinc-400 hover:text-red-400"
              >
                Log out
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => setShowAuthModal(true)}
                className="text-zinc-300 hover:text-white"
              >
                Log in
              </Button>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <main className="flex flex-col items-center text-center px-4 pt-24 pb-16 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Live Collaborative Editing is here
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
          Code together. <br /> Debug with AI.
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          The ultimate real-time interview and collaboration platform. Write
          code, execute it instantly, and let Google Gemini fix your bugs—all in
          one shared workspace.
        </p>

        <div className="flex gap-4 mb-16">
          <Button
            onClick={handleDashboardClick}
            className="bg-white text-black hover:bg-zinc-200 text-lg px-8 py-6 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Go to Dashboard 🚀
          </Button>
        </div>

        {/* 3. HERO VIDEO PLACEHOLDER */}
        <div className="w-full relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl shadow-indigo-500/10 aspect-video flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10 pointer-events-none"></div>
          <p className="text-zinc-500 flex flex-col items-center gap-4 z-20">
            <span className="text-4xl">🎥</span>
            <span className="font-mono text-sm uppercase tracking-widest">
              Replace with your screen recording
            </span>
          </p>
        </div>
      </main>

      {/* 4. FEATURES SECTION */}
      <section className="border-t border-zinc-800/50 bg-zinc-900/20 py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need to ace the interview
            </h2>
            <p className="text-zinc-400">
              Built for modern developers and remote teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-2xl mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Sync</h3>
              <p className="text-zinc-400 leading-relaxed">
                Watch your peers type in real-time with sub-millisecond latency
                powered by WebSockets.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center text-2xl mb-6">
                ✨
              </div>
              <h3 className="text-xl font-bold mb-2">AI Code Fixer</h3>
              <p className="text-zinc-400 leading-relaxed">
                Stuck on a bug? Let our integrated Gemini AI instantly analyze
                and rewrite your code to perfection.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-green-500/50 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center text-2xl mb-6">
                ▶️
              </div>
              <h3 className="text-xl font-bold mb-2">Live Execution</h3>
              <p className="text-zinc-400 leading-relaxed">
                Compile and run JavaScript, Python, Java, and C++ directly in
                the browser with secure environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="border-t border-zinc-900 py-12 text-center text-zinc-500 text-sm bg-zinc-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-8 gap-4">
          <p>© 2026 SyncSpace. Built with by Aayushi Verma.</p>

          <div className="flex items-center gap-6 font-medium">
            <a
              href="https://www.linkedin.com/in/aayushi-verma-518a17280/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/aayusoni31"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* THE MODAL */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          setIsLoggedIn(true);
          navigate("/dashboard");
        }}
      />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/ui/Navbar';
import ProgressBar from './components/ui/ProgressBar';
import VideoHubModal from './components/ui/VideoHubModal';
import HeroSection from './components/sections/HeroSection';
import IntroSection from './components/sections/IntroSection';
import CacheAsideSection from './components/sections/CacheAsideSection';
import WriteThroughSection from './components/sections/WriteThroughSection';
import CacheInvalidationSection from './components/sections/CacheInvalidationSection';
import ComparisonSection from './components/sections/ComparisonSection';
import RealWorldSection from './components/sections/RealWorldSection';
import QuizSection from './components/sections/QuizSection';
import ChallengeSection from './components/sections/ChallengeSection';

const sections = [
  { id: 'hero', label: 'Welcome', time: '2 min' },
  { id: 'intro', label: 'What is Caching?', time: '5 min' },
  { id: 'cache-aside', label: 'Cache-Aside', time: '8 min' },
  { id: 'write-through', label: 'Write-Through', time: '8 min' },
  { id: 'invalidation', label: 'Cache Invalidation', time: '8 min' },
  { id: 'comparison', label: 'Strategy Comparison', time: '4 min' },
  { id: 'real-world', label: 'Real-World Use Cases', time: '4 min' },
  { id: 'quiz', label: 'Knowledge Check', time: '4 min' },
  { id: 'challenge', label: 'Hands-On Challenge', time: '5 min' },
];

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [completedSections, setCompletedSections] = useState(new Set());
  
  // Video Hub Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState('intro');

  const openVideo = (videoId = 'intro') => {
    setActiveVideoId(videoId);
    setIsVideoModalOpen(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const markCompleted = (sectionId) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]));
  };

  const progress = (completedSections.size / sections.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar sections={sections} activeSection={activeSection} onOpenVideos={() => openVideo('intro')} />
      <ProgressBar progress={progress} />

      {/* Global Video Modal */}
      <VideoHubModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        initialVideoId={activeVideoId}
      />

      <main>
        <section id="hero">
          <HeroSection onComplete={() => markCompleted('hero')} onOpenVideo={() => openVideo('intro')} />
        </section>

        <section id="intro">
          <IntroSection onComplete={() => markCompleted('intro')} onOpenVideo={() => openVideo('intro')} />
        </section>

        <section id="cache-aside">
          <CacheAsideSection onComplete={() => markCompleted('cache-aside')} onOpenVideo={() => openVideo('cache-aside')} />
        </section>

        <section id="write-through">
          <WriteThroughSection onComplete={() => markCompleted('write-through')} onOpenVideo={() => openVideo('write-through')} />
        </section>

        <section id="invalidation">
          <CacheInvalidationSection onComplete={() => markCompleted('invalidation')} onOpenVideo={() => openVideo('invalidation')} />
        </section>

        <section id="comparison">
          <ComparisonSection onComplete={() => markCompleted('comparison')} />
        </section>

        <section id="real-world">
          <RealWorldSection onComplete={() => markCompleted('real-world')} />
        </section>

        <section id="quiz">
          <QuizSection onComplete={() => markCompleted('quiz')} />
        </section>

        <section id="challenge">
          <ChallengeSection onComplete={() => markCompleted('challenge')} />
        </section>
      </main>

      <footer style={{
        padding: '40px 20px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: '14px'
      }}>
        <p>🎓 Redis Caching Strategies — Interactive Learning Experience</p>
        <p style={{ marginTop: '8px', fontSize: '12px' }}>
          Built for Kalvium Skilling Courses | Estimated Duration: 45 minutes | Includes Embedded Video Hub
        </p>
      </footer>
    </div>
  );
}

export default App;

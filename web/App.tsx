import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Showcase } from './components/Showcase';
import { Process } from './components/Process';
import { Pricing } from './components/Pricing';
import { Contact } from './components/Contact';
import { GlobalBackground } from './components/GlobalBackground';
import { BrandLogo } from './components/BrandLogo';
import { Story } from './components/Story';
import { BusinessBenefits } from './components/BusinessBenefits';

function App() {
  return (
    <div className="bg-dark-bg min-h-screen text-zinc-100 selection:bg-lavender selection:text-zinc-900 relative">
      <GlobalBackground />
      
      {/* Fixed Logo Layer - Behind content */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        <BrandLogo className="w-full h-full max-w-[1600px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Story /> {/* New Section: Idea/Origin */}
          <Features />
          <Showcase />
          <BusinessBenefits /> {/* New Section: Business Metrics */}
          <Process />
          <Pricing />
          <Contact />
        </main>
      </div>
    </div>
  );
}

export default App;
'use client';

import { motion } from 'framer-motion';
import { HeroSection } from '@/components/sections/HeroSection';
import { ThesisSection } from '@/components/sections/ThesisSection';
import { AttributionSection } from '@/components/sections/AttributionSection';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { SubstrateSection } from '@/components/sections/SubstrateSection';
import { ArchitectureSection } from '@/components/sections/ArchitectureSection';
import { CorridorsSection } from '@/components/sections/CorridorsSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { AgenticSection } from '@/components/sections/AgenticSection';
import { Footer } from '@/components/sections/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ThesisSection />
      <AttributionSection />
      <ProblemSection />
      <SubstrateSection />
      <ArchitectureSection />
      <CorridorsSection />
      <StatsSection />
      <AgenticSection />
      <Footer />
    </main>
  );
}

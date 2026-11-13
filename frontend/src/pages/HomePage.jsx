import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import CuratedCarousel from '../components/home/CuratedCarousel';
import EditorialBanner from '../components/home/EditorialBanner';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroBanner />
      <CategoryGrid />
      <CuratedCarousel />
      <EditorialBanner />
      <Testimonials />
      <Newsletter />
    </main>
  );
}


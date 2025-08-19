
import React from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Footer } from "@/components/Footer";
import { MobilePaddingWrapper } from "@/components/MobilePaddingWrapper";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`min-h-screen bg-white flex flex-col ${isMobile ? 'mobile-view' : ''}`}>
      <Header />
      <div className="flex-grow">
        <Hero />
        <MobilePaddingWrapper>
          <ServicesGrid />
        </MobilePaddingWrapper>
      </div>
      <Footer />
    </div>
  );
};

export default Index;

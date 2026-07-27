"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/layout/HeroSection";
import CategoryGrid from "@/components/layout/CategoryGrid";
import FeaturedProducts from "@/components/products/FeaturedProducts";
import WholesaleBanner from "@/components/layout/WholesaleBanner";
import TrustBadges from "@/components/layout/TrustBadges";
import NewsletterSection from "@/components/layout/NewsletterSection";
import RecentlyViewed from "@/components/products/RecentlyViewed";
import { allProducts } from "@/lib/mock-data";
import { getRecentlyViewed } from "@/lib/utils/recentlyViewed";
import { useContentStore } from "@/lib/store/contentStore";
import { Product } from "@/lib/types";

export default function HomePage() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const { heroHeading, heroSubtext, promoBannerText, featuredProductIds } = useContentStore();

  const featuredProducts = allProducts
    .filter((p) => featuredProductIds.includes(p.id))
    .slice(0, 8);

  useEffect(() => {
    setRecentlyViewed(getRecentlyViewed() as Product[]);
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection heroHeading={heroHeading} heroSubtext={heroSubtext} />
      <CategoryGrid />
      <FeaturedProducts products={featuredProducts} />
      <WholesaleBanner promoBannerText={promoBannerText} />
      <TrustBadges />
      <NewsletterSection />
      <RecentlyViewed products={recentlyViewed} />
    </div>
  );
}

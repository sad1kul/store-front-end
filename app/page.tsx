"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/layout/HeroSection";
import CategoryGrid from "@/components/layout/CategoryGrid";
import FeaturedProducts from "@/components/products/FeaturedProducts";
import WholesaleBanner from "@/components/layout/WholesaleBanner";
import TrustBadges from "@/components/layout/TrustBadges";
import NewsletterSection from "@/components/layout/NewsletterSection";
import RecentlyViewed from "@/components/products/RecentlyViewed";
import { getProductsApi } from "@/lib/api/products";
import { getRecentlyViewed } from "@/lib/utils/recentlyViewed";
import { useContentStore } from "@/lib/store/contentStore";
import { Product } from "@/lib/types";
import { toast } from "sonner";
import { ProductGridSkeleton } from "@/components/shared/LoadingSkeleton";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { heroHeading, heroSubtext, promoBannerText, fetchContent } = useContentStore();

  useEffect(() => {
    fetchContent();
    setRecentlyViewed(getRecentlyViewed() as Product[]);

    getProductsApi({ featured: true, limit: 8 })
      .then((res) => {
        if (res.success && res.data) {
          setFeaturedProducts(res.data.products);
        }
      })
      .catch((err) => {
        toast.error("Failed to load featured products", {
          action: {
            label: "Retry",
            onClick: () => window.location.reload(),
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fetchContent]);

  return (
    <div className="min-h-screen">
      <HeroSection heroHeading={heroHeading} heroSubtext={heroSubtext} />
      <CategoryGrid />
      {isLoading ? (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <ProductGridSkeleton />
        </div>
      ) : (
        <FeaturedProducts products={featuredProducts} />
      )}
      <WholesaleBanner promoBannerText={promoBannerText} />
      <TrustBadges />
      <NewsletterSection />
      <RecentlyViewed products={recentlyViewed} />
    </div>
  );
}

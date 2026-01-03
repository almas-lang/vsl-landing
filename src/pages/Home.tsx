import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { TestimonialGrid } from "../components/TestimonialGrid";
import { YouTubePlayer } from "../components/YouTubePlayer";
import { content } from "../config/content";

export const Home: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Capture UTM parameters when user lands on the page
  useEffect(() => {
    // Get Meta's actual tracking parameters (hsa_*)
    const metaCampaign = searchParams.get("hsa_cam") || "";
    const metaAdSet = searchParams.get("hsa_grp") || "";
    const metaAd = searchParams.get("hsa_ad") || "";

    const utmParams = {
      utm_source: searchParams.get("utm_source") || "",
      utm_medium: searchParams.get("utm_medium") || "",
      // Use Meta's actual IDs if custom UTM params aren't set
      utm_campaign: searchParams.get("utm_campaign") || metaCampaign,
      utm_content: searchParams.get("utm_content") || metaAd,
      utm_term: searchParams.get("utm_term") || metaAdSet,
    };

    // Only store if at least one UTM parameter exists
    if (Object.values(utmParams).some((value) => value !== "")) {
      localStorage.setItem("utm_params", JSON.stringify(utmParams));
      console.log("UTM parameters captured:", utmParams);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Purple Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 py-3 md:py-4">
          <div className="container mx-auto px-4">
            <p className="text-white text-center text-sm md:text-base font-medium">
              For UX/UI/Product Designers Earning 6+ LPA Who Are Tired Of Being Overlooked For Senior Roles
            </p>
          </div>
        </div>

        {/* Rating Section */}
        <div className="py-4 md:py-6 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-6 h-6 md:w-7 md:h-7 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-2xl md:text-3xl font-bold text-gray-900">
                {content.hero.rating.score}
              </span>
              <span className="text-gray-600 text-sm md:text-base">
                Out of {content.hero.rating.count.toLocaleString()} ratings
              </span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-6 md:py-12 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center space-y-6 md:space-y-8 mb-8 md:mb-12">
              {/* Main Headline */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight px-4">
                How We Help Designers Like You Break Into Senior & Leadership Positions
                In 90 Days And 2X Your Salary (₹18–28 LPA) – Or We Mentor You Until You Do
              </h1>

              {/* Subheadline */}
              <p className="text-base md:text-xl text-gray-600 max-w-4xl mx-auto px-4">
                Without - A formal design degree or research-heavy case studies | Managing teams or running major projects beforehand
              </p>
            </div>

            {/* Video Player */}
            <div className="max-w-5xl mx-auto">
              <YouTubePlayer videoId="JEbNNDD8FUs" />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialGrid />
      </main>

      <Footer />
    </div>
  );
};

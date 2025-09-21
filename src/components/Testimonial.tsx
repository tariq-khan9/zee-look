'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';

interface UserFeedback {
  id: string;
  user_name: string;
  user_email: string;
  rating: number;
  comment: string;
  product_id: string;
  created_at: string;
  products: {
    name: string;
    image_url: string;
  };
}

interface TestimonialProps {
  testimonials?: UserFeedback[];
}

export default function Testimonial({ testimonials: propTestimonials }: TestimonialProps) {
  const [testimonials, setTestimonials] = useState<UserFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch testimonials from Supabase
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/feedbacks');
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        setTestimonials(data.feedbacks || []);
        // Set initial index to 0 for consistent behavior
        if (data.feedbacks && data.feedbacks.length > 0) {
          setCurrentIndex(0);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    // Use prop testimonials if provided, otherwise fetch from API
    if (propTestimonials && propTestimonials.length > 0) {
      setTestimonials(propTestimonials);
      setCurrentIndex(0);
      setLoading(false);
    } else {
      fetchTestimonials();
    }
  }, [propTestimonials]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleProfileClick = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  // Generate profile image from user name initial if no image available
  const getProfileImage = (userName: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=10b981&color=fff&size=200`;
  };

  // Extract quote from comment (first sentence or phrase)
  const extractQuote = (comment: string) => {
    const sentences = comment.split(/[.!?]/);
    const firstSentence = sentences[0]?.trim();
    if (firstSentence && firstSentence.length > 50) {
      return firstSentence.substring(0, 50) + '...';
    }
    return firstSentence || comment.substring(0, 50) + '...';
  };

  return (
    <>
     
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
         
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-inter">
            What Our Customers Say
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-600">
            <p>Error loading testimonials: {error}</p>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && testimonials.length === 0 && (
          <div className="text-center text-slate-500">
            <p>No testimonials available at the moment.</p>
          </div>
        )}

        {/* Testimonials Content */}
        {!loading && !error && testimonials.length > 0 && (
          <>

        {/* Profile Selection - Static 5 Profiles */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {/* Previous Arrow */}
            <button
              onClick={handlePrevious}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors duration-500 ease-out"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Profile Pictures - 5 Profiles with Selected in Middle */}
            <div className="flex items-center space-x-3">
              {(() => {
                const totalProfiles = testimonials.length;
                if (totalProfiles === 0) return null;
                
                // Create array of 5 profile indices with selected one in middle
                const profileIndices = [];
                for (let i = -2; i <= 2; i++) {
                  let profileIndex = (currentIndex + i + totalProfiles) % totalProfiles;
                  profileIndices.push(profileIndex);
                }
                
                return profileIndices.map((profileIndex, displayPosition) => {
                  const testimonial = testimonials[profileIndex];
                  if (!testimonial) return null;
                  
                  const isSelected = displayPosition === 2; // Middle position
                  const distance = Math.abs(displayPosition - 2);
                  
                  return (
                    <button
                      key={`${testimonial.id}-${profileIndex}`}
                      onClick={() => handleProfileClick(profileIndex)}
                      className={`relative rounded-xl overflow-hidden transition-all duration-700 ease-out ${
                        isSelected
                          ? 'w-20 h-20 ring-4 ring-green-500 opacity-100'
                          : distance === 1
                          ? 'w-16 h-16 opacity-70 hover:opacity-90'
                          : 'w-14 h-14 opacity-50 hover:opacity-70'
                      }`}
                      aria-label={`View ${testimonial.user_name}'s testimonial`}
                    >
                      <Image
                        src={getProfileImage(testimonial.user_name)}
                        alt={testimonial.user_name}
                        fill
                        className="object-cover"
                        sizes={isSelected ? "80px" : distance === 1 ? "64px" : "56px"}
                      />
                    </button>
                  );
                });
              })()}
            </div>

            {/* Next Arrow */}
            <button
              onClick={handleNext}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors duration-500 ease-out"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Testimonial Card */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative bg-gray-50 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Side - User Image */}
              <div className="relative">
                <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden">
                  <Image
                    src={getProfileImage(currentTestimonial.user_name)}
                    alt={currentTestimonial.user_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Right Side - Testimonial Content */}
              <div className="space-y-6">
           

                {/* Testimonial Text */}
                <p className="text-slate-600 font-inter leading-relaxed text-xl md:text-2xl">
                  {currentTestimonial.comment}
                </p>

                {/* Customer Name */}
                <div className="pt-4">
                  <h4 className="font-semibold text-slate-900 font-inter text-xl">
                    {currentTestimonial.user_name}
                  </h4>
                  <div className="flex items-center mt-2">
                    {Array.from({ length: 5 }, (_, index) => (
                      <svg
                        key={index}
                        className={`w-5 h-5 ${
                          index < currentTestimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </section>
    </>
  );
}

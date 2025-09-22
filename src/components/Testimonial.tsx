'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';

interface UserFeedback {
  id: string;
  user_name: string;
  user_email: string;
  user_image?: string;
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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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
    setImageLoading(true);
    setImageError(false);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setImageLoading(true);
    setImageError(false);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleProfileClick = (index: number) => {
    if (index !== currentIndex) {
      setImageLoading(true);
      setImageError(false);
      setCurrentIndex(index);
    }
  };

  const currentTestimonial = testimonials[currentIndex];

  // Get profile image from Supabase or generate fallback
  const getProfileImage = (userName: string, userImage?: string) => {
    // If user has an actual image in Supabase, use it
    if (userImage && userImage.trim() !== '' && userImage.startsWith('http')) {
      return userImage;
    }
    // Fallback to generated avatar from name
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=10b981&color=fff&size=200`;
  };

  // Handle image load success
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Handle image load errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, userName: string) => {
    const target = e.target as HTMLImageElement;
    setImageError(true);
    setImageLoading(false);
    // Fallback to generated avatar if image fails to load
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=10b981&color=fff&size=200`;
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
            <div className="flex items-center justify-center space-x-3 min-h-[80px]">
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
                      className={`relative rounded-xl overflow-hidden transition-all duration-300 ease-out flex-shrink-0 group ${
                        isSelected
                          ? 'w-20 h-20 ring-4 ring-green-500 opacity-100 shadow-lg shadow-green-500/25'
                          : distance === 1
                          ? 'w-16 h-16 opacity-70 hover:opacity-90 hover:scale-105 hover:shadow-md'
                          : 'w-14 h-14 opacity-50 hover:opacity-70 hover:scale-105'
                      }`}
                      aria-label={`View ${testimonial.user_name}'s testimonial`}
                      style={{
                        willChange: 'transform, opacity',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)'
                      }}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={getProfileImage(testimonial.user_name, testimonial.user_image)}
                          alt={testimonial.user_name}
                          fill
                          className={`object-cover transition-transform duration-300 ease-out group-hover:scale-110 ${
                            isSelected ? 'scale-105' : ''
                          }`}
                          sizes="80px"
                          priority={isSelected}
                          onError={(e) => handleImageError(e, testimonial.user_name)}
                        />
                        {/* Hover overlay effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
                      </div>
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
          <div className="relative bg-gray-50 rounded-3xl p-8 md:p-12 overflow-hidden min-h-[400px]">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Side - User Image */}
              <div className="relative">
                <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden group">
                  {/* Image Loading Skeleton */}
                  {imageLoading && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl z-10">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  )}
                  
                  {/* Main Image Container */}
                  <div className="relative w-full h-full">
                    <Image
                      src={getProfileImage(currentTestimonial.user_name, currentTestimonial.user_image)}
                      alt={currentTestimonial.user_name}
                      fill
                      className={`object-cover group-hover:scale-105 transition-all duration-500 ease-out ${
                        imageError ? 'grayscale' : ''
                      }`}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onLoad={handleImageLoad}
                      onError={(e) => handleImageError(e, currentTestimonial.user_name)}
                      priority={currentIndex === 0}
                    />
                  </div>
                  
                  {/* Image Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-2xl z-5"></div>
                  
                  {/* Loading Spinner */}
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Testimonial Content */}
              <div className="space-y-6">
                {/* Quote Icon */}
                <div className="flex justify-start">
                  <svg 
                    className="text-green-400 w-20 h-20 opacity-40" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-500 font-story-script font-semibold leading-relaxed text-2xl md:text-4xl text-left">
                  {currentTestimonial.comment}
                </p>

                {/* Customer Name */}
                <div className="pt-4">
                  <h4 className="font-semibold text-slate-900 font-inter text-xl transition-opacity duration-500 ease-out">
                    {currentTestimonial.user_name}
                  </h4>
                  <div className="flex items-center mt-2 transition-opacity duration-500 ease-out">
                    {Array.from({ length: 5 }, (_, index) => (
                      <svg
                        key={index}
                        className={`w-5 h-5 transition-colors duration-500 ease-out ${
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

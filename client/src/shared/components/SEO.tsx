'use client';
import Head from 'next/head';
// import { ReactNode } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export const SEO = ({
  title = 'Project Management System',
  description = 'Project Management System - Streamline Your Team\'s Workflow',
  keywords = ['project management', 'team collaboration', 'productivity'],
  image = '/default-og-image.png',
  url = 'https://my-pms.vercel.app'
}: SEOProps) => {
  return (
    <Head>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph / Social Media */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};
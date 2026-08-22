import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SocialSphere AI — Turn Content Into Conversations',
  description:
    'Upload a PDF or image and get AI-powered social media analysis: impact scores, hook analysis, CTA detection, hashtag intelligence, platform suggestions, and an improved rewrite — all in seconds.',
  keywords: ['social media', 'content analysis', 'AI', 'copywriting', 'LinkedIn', 'Twitter', 'Instagram'],
  authors: [{ name: 'SocialSphere AI' }],
  openGraph: {
    title: 'SocialSphere AI — Turn Content Into Conversations',
    description: 'AI-powered social media content analysis and optimization',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-mesh min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

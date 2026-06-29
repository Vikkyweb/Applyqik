/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "remoteok.com",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "www.lever.co",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "www.ashbyhq.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wellfound.com",
        pathname: "/**",
      },
       {
        protocol: 'https',
        hostname: 'bookface-static.ycombinator.com',
        pathname: '/assets/**',
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

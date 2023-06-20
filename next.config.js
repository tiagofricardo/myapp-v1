/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["iuvrqbhlgqdianovamjs.supabase.co"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};


module.exports = nextConfig;


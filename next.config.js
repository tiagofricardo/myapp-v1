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


export default nextConfig;


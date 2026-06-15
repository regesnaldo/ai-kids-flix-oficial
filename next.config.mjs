/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mysql2", "drizzle-orm/mysql2"],
};

export default nextConfig;

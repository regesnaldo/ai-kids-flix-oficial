import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============================================
  // IMAGE OPTIMIZATION
  // ============================================
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui.aceternity.com",
        pathname: "/**",
      },
    ],
    unoptimized: false,
  },

  // ============================================
  // COMPRESSION & PERFORMANCE
  // ============================================
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // ============================================
  // HEADERS & SECURITY (Netflix-style)
  // ============================================
  async headers() {
    return [
      {
        // Headers de segurança globais
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        // Cache static assets (1 ano = immutable)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache static folder
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache fonts (1 ano)
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        // Cache images (1 dia + stale-while-revalidate)
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=31536000",
          },
        ],
      },
      {
        // Service Worker (no cache)
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        // PWA manifest (no cache)
        source: "/manifest.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        // Browser config (Windows)
        source: "/browserconfig.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800", // 1 semana
          },
          {
            key: "Content-Type",
            value: "application/xml",
          },
        ],
      },
    ];
  },

  // ============================================
  // REDIRECTS
  // ============================================
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // ============================================
  // REWRITES
  // ============================================
  async rewrites() {
    return [];
  },

  // ============================================
  // WEBPACK CONFIG (Performance Optimization)
  // ============================================
  webpack: (config, { isServer, dev }) => {
    // Optimize bundle size
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            // Vendor chunks
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: 10,
            },
            // Framer Motion
            framer: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: "framer-motion",
              chunks: "all",
              priority: 20,
            },
            // React and React DOM
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: "react",
              chunks: "all",
              priority: 20,
            },
            // Common UI components
            ui: {
              test: /[\\/]components[\\/]ui[\\/]/,
              name: "ui",
              chunks: "all",
              priority: 15,
            },
          },
        },
        runtimeChunk: {
          name: "runtime",
        },
      };
    }

    // Resolve aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": ".",
    };

    return config;
  },

  // ============================================
  // TURBOPACK CONFIG
  // ============================================
  turbopack: {},

  // ============================================
  // EXPERIMENTAL FEATURES
  // ============================================
  experimental: {
    // Optimize CSS
    optimizeCss: true,
    
    // Server Actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // ============================================
  // TYPESCRIPT
  // ============================================
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: "./tsconfig.json",
  },

  // ============================================
  // DIST DIR
  // ============================================
  distDir: ".next",
  cleanDistDir: true,

  // ============================================
  // TRAILING SLASH
  // ============================================
  trailingSlash: false,

  // ============================================
  // ASSET PREFIX (para CDN)
  // ============================================
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.aikidsflix.com' : undefined,

  // ============================================
  // BASE PATH
  // ============================================
  basePath: "",

  // ============================================
  // I18N - Desativado para evitar conflitos
  // ============================================
  // i18n: {
  //   locales: ["pt-BR", "en", "es"],
  //   defaultLocale: "pt-BR",
  //   localeDetection: true,
  // },

  // ============================================
  // LOGGING
  // ============================================
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;

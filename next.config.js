/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('node:path');

/** @type {import('next').NextConfig} */
module.exports = {
    basePath: '',
    sassOptions: {
        includePaths: [path.join('/', 'app'), 'src/assets'],
    },
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                hostname: '**',
            },
        ],
    },
    compiler: {
        styledComponents: true,
    },
    env: {
        CACHE_DEBUG: process.env.CACHE_DEBUG,
        CACHE_DEFAULT_TTL: process.env.CACHE_DEFAULT_TTL,
        CACHE_MAX_ENTRIES: process.env.CACHE_MAX_ENTRIES,
        NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
        CHOKIDAR_USEPOLLING: process.env.CHOKIDAR_USEPOLLING,
    },
    async headers() {
        return [
            {
                source: '/_next/image', // imagens otimizadas
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
    async rewrites() {
        return [];
    },
};
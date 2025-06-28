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
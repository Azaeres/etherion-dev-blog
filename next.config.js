const { withContentlayer } = require('next-contentlayer')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app umami.mellifera.io identity.netlify.com unpkg.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src 'self' 'unsafe-inline' blob: data: 'unsafe-eval';
  media-src 'none';
  connect-src * blob: data:;
  font-src 'self' fonts.gstatic.com;
  frame-src giscus.app
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = {
  ...withContentlayer(
    withBundleAnalyzer({
      reactStrictMode: true,
      pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
      eslint: {
        dirs: ['pages', 'components', 'lib', 'layouts', 'scripts'],
      },
      async headers() {
        return [
          {
            source: '/(.*)',
            headers: securityHeaders,
          },
        ]
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      webpack: (config, { dev, isServer }) => {
        config.module.rules.push({
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        })

        // Note: At one point Contentlayer started inline the react/jsx-runtime,
        // which Preact doesn't support. Basically, this can create conflicts with
        // the runtime internals.
        // Disabling client-side Preact for now.
        // if (!dev && !isServer) {
        //   // Replace React with Preact only in client production build
        //   Object.assign(config.resolve.alias, {
        //     'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
        //     react: 'preact/compat',
        //     'react-dom/test-utils': 'preact/test-utils',
        //     'react-dom': 'preact/compat',
        //   })
        // }

        return config
      },
    })
  ),
  transpilePackages: ['react-tweet'],
  // distDir: 'build',
  // images: {
  //   unoptimized: true,
  // },
  // output: 'export',
}

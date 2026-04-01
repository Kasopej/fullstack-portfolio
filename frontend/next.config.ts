import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // webpack(config: WebpackConfig) {
  //     config.module?.rules?.push(
  //       {
  //         test: /\.svg$/,
  //         resourceQuery: { not: [/custom/, /url/] },
  //         use: [
  //           {
  //             loader: '@svgr/webpack',
  //             options: {
  //               replaceAttrValues: {
  //                 currentColor: '{props.color ?? `currentColor`}',
  //               },
  //               svgo: true,
  //               svgoConfig: {
  //                 plugins: [
  //                   {
  //                     name: 'preset-default',
  //                     params: {
  //                       overrides: {
  //                         removeViewBox: false, // Prevent SVGO from removing viewBox attribute
  //                       },
  //                     },
  //                   },
  //                 ],
  //               },
  //             },
  //           },
  //         ],
  //       },
  //       {
  //         test: /\.svg$/i,
  //         type: 'asset',
  //         resourceQuery: /url/, // *.svg?url
  //       },
  //       {
  //         test: /\.svg$/,
  //         resourceQuery: /custom/,
  //         use: [
  //           'babel-loader',
  //           {
  //             loader: '@yzfe/svgicon-loader',
  //             options: {
  //               svgoConfig: {
  //                 plugins: [
  //                   {
  //                     name: 'preset-default',
  //                     params: {
  //                       overrides: {
  //                         removeViewBox: false,
  //                       },
  //                     },
  //                   },
  //                 ],
  //               },
  //               component: 'react',
  //             },
  //           },
  //         ],
  //       },
  //     )

  //     config.cache = process.env.NODE_ENV === 'development'
  //     return config
  //   },
  turbopack: {
      rules: {
        '*.svg': {
          condition: {
        not: {
          query: /[?&]url$/
        },
      },
          loaders: ['@svgr/webpack'],
          as: '*.ts',
        },
      },
    },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	compiler: {
		styledComponents: true
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack']
		});

		config.experiments = {
			asyncWebAssembly: true,
			layers: true
		};

		return config;
	}
};

module.exports = nextConfig;

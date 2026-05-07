import type {NextConfig} from "next";
import createNextIntlPlugin from 'next-intl/plugin';


const nextConfig: NextConfig = {
    allowedDevOrigins: ['127.0.0.1'],
    experimental: {
        authInterrupts: true
    },
    async redirects() {
        return [
            {
                source: "/admin",
                destination: "/admin/dashboard",
                permanent: false,
            },
            {
                source: "/dashboard",
                destination: "/admin/dashboard",
                permanent: false,
            },
        ]
    },
    images : {
        remotePatterns : [
            {
                hostname : "res.cloudinary.com"
            }
        ]
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
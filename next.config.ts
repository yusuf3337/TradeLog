import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  // Kullanıcının yerel ağ IP'si üzerinden giriş yapabilmesi için izin (HMR engellemesini kaldırır)
  allowedDevOrigins: ['192.168.0.107'],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

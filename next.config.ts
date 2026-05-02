import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Kullanıcının yerel ağ IP'si üzerinden giriş yapabilmesi için izin (HMR engellemesini kaldırır)
  allowedDevOrigins: ['192.168.0.107'],
};

export default nextConfig;

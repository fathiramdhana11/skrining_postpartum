// File pusat pengaturan API
// Gunakan IP Laptop Anda untuk akses via HP/Device lain di jaringan yang sama
// Gunakan localhost untuk penggunaan normal di laptop sendiri

/**
 * PANDUAN DEPLOY SEMENTARA (PUBLIC/JARINGAN):
 * 
 * MODE 1: SATU WI-FI (Paling Cepat)
 * 1. Set USE_MODE = "network"
 * 2. Jalankan: npm run start:network
 * 3. Buka di HP: http://192.168.1.86:5173
 * 
 * MODE 2: BEDA JARINGAN (Pakai Internet/Data HP)
 * 1. Jalankan di Terminal 1: npx localtunnel --port 5000
 * 2. Copy link yang muncul (misal: https://data-anda.loca.lt) ke NGROK_URL di bawah.
 * 3. Set USE_MODE = "public"
 * 4. Jalankan di Terminal 2: npx localtunnel --port 5173
 * 5. Jalankan di Terminal 3: npm run start:network
 * 6. Buka Link dari Terminal 2 di HP. (Password: cek Google "What is my IP") 
 *    Lewat Terminal: Ketik perintah: curl ifconfig.me
 * 
 * MODE 3: LOCAL (Hanya Laptop Sendiri)
 * 1. Set USE_MODE = "local"
 * 2. Jalankan: npm start
 */

const IP_LAPTOP = "192.168.1.86"; 
const NGROK_URL = "";
const USE_MODE = "local"; 

export const API_URL = 
  USE_MODE === "public" && NGROK_URL ? NGROK_URL :
  USE_MODE === "network" ? `http://${IP_LAPTOP}:5000` :
  "http://localhost:5000";

/**
 * Password Hash Generator
 *
 * Script sederhana untuk generate bcrypt hash dari password.
 * Gunakan hash ini untuk menambah user baru di src/lib/auth.ts
 *
 * Cara pakai:
 * 1. Jalankan: node scripts/generate-password.js
 * 2. Masukkan password yang ingin di-hash
 * 3. Copy hash yang dihasilkan ke array users
 */

import bcrypt from "bcryptjs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n🔐 Password Hash Generator for SIADIL\n");

rl.question("Masukkan password yang ingin di-hash: ", (password) => {
  if (!password) {
    console.log("❌ Password tidak boleh kosong!");
    rl.close();
    return;
  }

  console.log("\n⏳ Generating hash...\n");

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  console.log("✅ Hash berhasil dibuat!\n");
  console.log("Password:", password);
  console.log("Hash:", hash);
  console.log("\n📋 Contoh penggunaan:");
  console.log(`
{
  id: "x",
  username: "username",
  password: "${hash}",
  name: "Nama Lengkap",
  nip: "199001012020121001",
  role: "user",
  divisi: "Divisi",
}
  `);

  rl.close();
});

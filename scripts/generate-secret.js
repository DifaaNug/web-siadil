#!/usr/bin/env node

/**
 * Script untuk generate NEXTAUTH_SECRET yang aman
 * Jalankan dengan: node scripts/generate-secret.js
 */

import crypto from "crypto";

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString("hex");
}

console.log("\n🔐 NextAuth Secret Generator");
console.log("============================");
console.log("\n📋 Copy secret ini ke environment variables Vercel:");
console.log("\nNEXTAUTH_SECRET=" + generateSecret());
console.log(
  "\n⚠️  PENTING: Secret ini sangat rahasia, jangan share ke siapapun!"
);
console.log("💡 Secret ini berbeda untuk development dan production.\n");

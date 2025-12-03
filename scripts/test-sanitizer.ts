#!/usr/bin/env tsx
/**
 * Test script to verify sanitizer preserves srcset and sizes attributes
 */

import { sanitizeHtml } from "../lib/sanitize-html";

const testHtml = `<img src="/uploads/1764268977510-8b59095983d7b6bf.webp" alt="1764268977510 8b59095983d7b6bf" width="2880" height="2160" srcset="/uploads/1764268977510-8b59095983d7b6bf-small.webp 400w, /uploads/1764268977510-8b59095983d7b6bf-medium.webp 800w, /uploads/1764268977510-8b59095983d7b6bf-large.webp 1600w, /uploads/1764268977510-8b59095983d7b6bf.webp 2880w" sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px" loading="lazy">`;

console.log("🧪 Testing Sanitizer\n");
console.log("Input HTML:");
console.log(testHtml);
console.log("\n" + "=".repeat(80) + "\n");

const sanitized = sanitizeHtml(testHtml);

console.log("Sanitized HTML:");
console.log(sanitized);
console.log("\n" + "=".repeat(80) + "\n");

// Check for attributes
const checks = [
  { attr: "srcset", present: sanitized.includes("srcset=") },
  { attr: "sizes", present: sanitized.includes("sizes=") },
  { attr: "loading", present: sanitized.includes("loading=") },
  { attr: "width", present: sanitized.includes("width=") },
  { attr: "height", present: sanitized.includes("height=") },
  { attr: "alt", present: sanitized.includes("alt=") },
  { attr: "src", present: sanitized.includes("src=") },
];

console.log("Attribute Check:");
checks.forEach(({ attr, present }) => {
  const status = present ? "✅" : "❌";
  console.log(`  ${status} ${attr}: ${present ? "PRESENT" : "MISSING"}`);
});

console.log("\n" + "=".repeat(80) + "\n");

if (checks.every((c) => c.present)) {
  console.log("🎉 SUCCESS! All attributes preserved by sanitizer.");
  process.exit(0);
} else {
  console.log("❌ FAILURE! Some attributes were stripped by sanitizer.");
  process.exit(1);
}

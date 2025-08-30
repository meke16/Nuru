const { execSync } = import("child_process");
const fs = import("fs");

console.log("🔍 Running pre-deploy tests...");

// 1. Check package.json syntax
try {
  JSON.parse(fs.readFileSync("package.json", "utf8"));
  console.log("✅ package.json syntax is valid");
} catch (e) {
  console.error("❌ package.json is invalid");
  process.exit(1);
}

// 2. Run ESLint if installed
try {
  execSync("npx eslint . --ext .ts,.tsx,.js,.jsx", { stdio: "inherit" });
  console.log("✅ ESLint passed");
} catch (e) {
  console.error("❌ ESLint errors found");
  process.exit(1);
}

// 3. Check npm audit
try {
  execSync("npm audit --audit-level=high", { stdio: "inherit" });
} catch (e) {
  console.warn("⚠️ High vulnerabilities detected");
}

// 4. Test frontend build
try {
  console.log("🔧 Testing frontend build...");
  execSync("cd client && npm install --legacy-peer-deps && npm run build", { stdio: "inherit", shell: true });
  console.log("✅ Frontend build successful");
} catch (e) {
  console.error("❌ Frontend build failed");
  process.exit(1);
}

// 5. Test backend TypeScript build
try {
  execSync("npx tsc --noEmit", { stdio: "inherit" });
  console.log("✅ Backend TypeScript build successful");
} catch (e) {
  console.error("❌ Backend TypeScript compilation failed");
  process.exit(1);
}

console.log("🎉 Pre-deploy tests passed!");

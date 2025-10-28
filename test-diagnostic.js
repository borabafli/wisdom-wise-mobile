// Run this to find the exact problematic component
const fs = require('fs');

const files = [
  './src/screens/ProfileScreen.tsx',
  './src/screens/InsightsDashboard.tsx',
  './src/components/CustomTabBar.tsx',
];

const dangerousPatterns = [
  // Pattern: JSX with direct variable interpolation in View
  /(<View[^>]*>)\s*\{[^<{]*(?:t\(|\.|\w+)\}(?!\s*<)/g,
  // Pattern: Conditional that might return string
  /\{[^}]*\?[^:]*:[^}]*\}(?=\s*<\/View>)/g,
];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, i) => {
    if (line.match(/\{.*t\(['"].*['"]\).*\}/)) {
      const hasText = line.match(/<Text/);
      if (!hasText && line.match(/\{.*\}/)) {
        console.log(`${file}:${i+1} - Possible unwrapped t(): ${line.trim()}`);
      }
    }
  });
});

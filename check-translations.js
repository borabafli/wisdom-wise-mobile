const fs = require('fs');
const path = require('path');

// Read all translation files
const languages = ['en', 'de', 'fr', 'tr', 'es', 'pt'];
const translations = {};

languages.forEach(lang => {
  const filePath = path.join(__dirname, 'src/locales', `${lang}.json`);
  try {
    translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading ${lang}.json:`, error.message);
  }
});

// Flatten JSON object to dot notation paths
function flattenObject(obj, prefix = '') {
  const flattened = {};

  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], newKey));
    } else {
      flattened[newKey] = obj[key];
    }
  }

  return flattened;
}

// Get all keys from English (master)
const enFlat = flattenObject(translations.en);
const enKeys = Object.keys(enFlat).sort();

console.log('='.repeat(80));
console.log('TRANSLATION FILES COMPARISON REPORT');
console.log('='.repeat(80));
console.log(`\nTotal keys in en.json (master): ${enKeys.length}\n`);

// Compare each language
languages.slice(1).forEach(lang => {
  console.log('-'.repeat(80));
  console.log(`Language: ${lang.toUpperCase()}`);
  console.log('-'.repeat(80));

  const langFlat = flattenObject(translations[lang]);
  const langKeys = Object.keys(langFlat);

  // Find missing keys
  const missingKeys = enKeys.filter(key => !langFlat.hasOwnProperty(key));

  // Find extra keys
  const extraKeys = langKeys.filter(key => !enFlat.hasOwnProperty(key));

  const completion = ((langKeys.length / enKeys.length) * 100).toFixed(2);

  console.log(`Total keys present: ${langKeys.length}`);
  console.log(`Completion: ${completion}%`);
  console.log(`Missing keys: ${missingKeys.length}`);
  console.log(`Extra keys: ${extraKeys.length}`);

  if (missingKeys.length > 0) {
    console.log('\n📋 MISSING KEYS:');
    missingKeys.forEach((key, index) => {
      console.log(`  ${index + 1}. ${key}`);
      console.log(`     EN value: "${enFlat[key]}"`);
    });
  }

  if (extraKeys.length > 0) {
    console.log('\n➕ EXTRA KEYS (not in en.json):');
    extraKeys.forEach((key, index) => {
      console.log(`  ${index + 1}. ${key}`);
    });
  }

  console.log('');
});

console.log('='.repeat(80));
console.log('END OF REPORT');
console.log('='.repeat(80));

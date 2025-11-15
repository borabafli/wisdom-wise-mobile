const fs = require('fs');
const path = require('path');

// Load en.json
const enJsonPath = path.join(__dirname, 'src/locales/en.json');
const enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

// Load used keys from grep output
const usedKeysPath = '/tmp/used_keys.txt';
const usedKeys = fs.readFileSync(usedKeysPath, 'utf8')
  .split('\n')
  .filter(key => key.trim() !== '');

// Function to check if a key exists in the JSON object
function keyExists(obj, keyPath) {
  const keys = keyPath.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return false;
    }
    if (!(key in current)) {
      return false;
    }
    current = current[key];
  }

  return true;
}

// Function to get all keys from nested object
function getAllKeys(obj, prefix = '') {
  let keys = [];

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

// Get all available keys in en.json
const availableKeys = getAllKeys(enJson);

// Find missing keys (used in code but not in en.json)
const missingKeys = usedKeys.filter(key => !keyExists(enJson, key));

// Find unused keys (in en.json but not used in code)
const unusedKeys = availableKeys.filter(key => !usedKeys.includes(key));

// Group used keys by namespace
const keysByNamespace = {};
usedKeys.forEach(key => {
  const namespace = key.split('.')[0];
  if (!keysByNamespace[namespace]) {
    keysByNamespace[namespace] = [];
  }
  keysByNamespace[namespace].push(key);
});

// Output results
console.log('\n=== TRANSLATION KEY AUDIT REPORT ===\n');

console.log(`Total keys used in code: ${usedKeys.length}`);
console.log(`Total keys in en.json: ${availableKeys.length}`);
console.log(`Missing keys (used but not defined): ${missingKeys.length}`);
console.log(`Unused keys (defined but not used): ${unusedKeys.length}`);

if (missingKeys.length > 0) {
  console.log('\n\n⚠️  MISSING KEYS (Will show as raw keys in UI):\n');
  console.log('─'.repeat(80));
  missingKeys.forEach(key => {
    console.log(`  ❌ ${key}`);
  });
}

if (unusedKeys.length > 0) {
  console.log('\n\n📦 UNUSED KEYS (Defined but never used):\n');
  console.log('─'.repeat(80));

  // Group unused keys by namespace for better readability
  const unusedByNamespace = {};
  unusedKeys.forEach(key => {
    const namespace = key.split('.')[0];
    if (!unusedByNamespace[namespace]) {
      unusedByNamespace[namespace] = [];
    }
    unusedByNamespace[namespace].push(key);
  });

  Object.keys(unusedByNamespace).sort().forEach(namespace => {
    console.log(`\n  ${namespace}: (${unusedByNamespace[namespace].length} keys)`);
    unusedByNamespace[namespace].slice(0, 10).forEach(key => {
      console.log(`    • ${key}`);
    });
    if (unusedByNamespace[namespace].length > 10) {
      console.log(`    ... and ${unusedByNamespace[namespace].length - 10} more`);
    }
  });
}

console.log('\n\n📊 KEYS GROUPED BY NAMESPACE:\n');
console.log('─'.repeat(80));
Object.keys(keysByNamespace).sort().forEach(namespace => {
  console.log(`\n${namespace}: ${keysByNamespace[namespace].length} keys`);
  console.log(`  Sample keys:`);
  keysByNamespace[namespace].slice(0, 5).forEach(key => {
    console.log(`    • ${key}`);
  });
  if (keysByNamespace[namespace].length > 5) {
    console.log(`    ... and ${keysByNamespace[namespace].length - 5} more`);
  }
});

// Summary
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════');
console.log('SUMMARY');
console.log('═══════════════════════════════════════════════════════════════════════════════');

if (missingKeys.length === 0) {
  console.log('✅ All translation keys used in code exist in en.json');
} else {
  console.log(`❌ ${missingKeys.length} translation keys are missing from en.json`);
  console.log('   These will appear as raw key names in the UI (e.g., "insights.actions.reflectOnThis")');
}

if (unusedKeys.length > 0) {
  console.log(`\n📦 ${unusedKeys.length} keys in en.json are not used in code`);
  console.log('   These can be removed or may be for future use');
}

console.log('\n');

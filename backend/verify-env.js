/**
 * Simple script to verify .env file has required database variables
 * Does NOT display values, only checks if they exist
 */

require('dotenv').config();

const requiredVars = [
  'DB_HOST',
  'DB_NAME', 
  'DB_USER',
  'DB_PASSWORD'
];

console.log('🔍 Checking .env file for required database variables...\n');

let allPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName] || process.env[varName.replace('DB_', 'PG')];
  if (value) {
    console.log(`✅ ${varName}: ${value.length > 0 ? '[SET]' : '[EMPTY]'}`);
  } else {
    console.log(`❌ ${varName}: [MISSING]`);
    allPresent = false;
  }
});

// Check alternate names (PG*)
const pgVars = ['PGHOST', 'PGDATABASE', 'PGUSER', 'PGPASSWORD'];
pgVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const dbVarName = varName.replace('PG', 'DB_');
    console.log(`ℹ️  ${varName} found (can be used as ${dbVarName})`);
  }
});

console.log('\n' + '='.repeat(50));

if (allPresent) {
  console.log('✅ All required variables are present!');
  console.log('✅ Ready to run migration');
} else {
  console.log('❌ Some required variables are missing');
  console.log('\n💡 To get Railway database connection details:');
  console.log('   1. Go to https://railway.app');
  console.log('   2. Select your project');
  console.log('   3. Click on PostgreSQL service');
  console.log('   4. Click "Variables" tab');
  console.log('   5. Copy the values for:');
  console.log('      - PGHOST (or DB_HOST)');
  console.log('      - PGDATABASE (or DB_NAME)');
  console.log('      - PGUSER (or DB_USER)');
  console.log('      - PGPASSWORD (or DB_PASSWORD)');
  console.log('\n   Add them to your .env file in backend/ directory');
}


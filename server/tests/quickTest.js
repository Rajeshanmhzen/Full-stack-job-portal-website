import axios from 'axios';

async function quickTest() {
  console.log('🧪 Quick Performance Test\n');
  
  const BASE_URL = 'http://localhost:8081';
  
  try {
    // Test 1: Basic functionality
    console.log('1. Testing basic functionality...');
    const response = await axios.get(`${BASE_URL}/api/v1/job/search?q=developer`);
    console.log(`✅ Search works! Found ${response.data.jobs?.length || 0} jobs`);
    console.log(`   Response time: ${response.headers['x-response-time'] || 'N/A'}`);
    console.log(`   Cached: ${response.data.cached ? 'YES' : 'NO'}\n`);
    
    // Test 2: Cache test
    console.log('2. Testing cache performance...');
    const start1 = Date.now();
    await axios.get(`${BASE_URL}/api/v1/job/search?q=react`);
    const time1 = Date.now() - start1;
    
    const start2 = Date.now();
    const cached = await axios.get(`${BASE_URL}/api/v1/job/search?q=react`);
    const time2 = Date.now() - start2;
    
    console.log(`   First request: ${time1}ms`);
    console.log(`   Second request: ${time2}ms`);
    console.log(`   Cache improvement: ${((time1-time2)/time1*100).toFixed(1)}%`);
    console.log(`   Cache hit: ${cached.data.cached ? 'YES' : 'NO'}\n`);
    
    // Test 3: Load test
    console.log('3. Testing concurrent load (20 requests)...');
    const promises = [];
    const loadStart = Date.now();
    
    for (let i = 0; i < 20; i++) {
      promises.push(
        axios.get(`${BASE_URL}/api/v1/job/search?q=test${i}`)
          .then(() => ({ success: true }))
          .catch(() => ({ success: false }))
      );
    }
    
    const results = await Promise.all(promises);
    const loadTime = Date.now() - loadStart;
    const successful = results.filter(r => r.success).length;
    
    console.log(`   Success rate: ${successful}/20 (${(successful/20*100).toFixed(1)}%)`);
    console.log(`   Total time: ${loadTime}ms`);
    console.log(`   Avg per request: ${(loadTime/20).toFixed(2)}ms`);
    console.log(`   Requests/second: ${(20/(loadTime/1000)).toFixed(2)}\n`);
    
    // Results summary
    console.log('📊 QUICK TEST RESULTS:');
    console.log('======================');
    
    if (successful >= 18 && time2 < time1 * 0.5) {
      console.log('🎉 EXCELLENT! All optimizations working perfectly');
      console.log('   ✅ Search functionality: Working');
      console.log('   ✅ Caching system: Active');
      console.log('   ✅ Performance: Optimized');
      console.log('   ✅ Load handling: Strong');
    } else if (successful >= 15) {
      console.log('✅ GOOD! Most optimizations working');
      console.log('   ✅ Search functionality: Working');
      console.log('   ⚠️  Some performance issues detected');
    } else {
      console.log('⚠️  ISSUES DETECTED! Need investigation');
      console.log('   ❌ Performance problems found');
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure server is running: npm start');
    console.log('2. Check if port 8081 is free');
    console.log('3. Verify database connection');
  }
}

quickTest().catch(console.error);
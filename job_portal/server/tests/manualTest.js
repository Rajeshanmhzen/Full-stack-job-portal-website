import axios from 'axios';

console.log('🧪 Manual Performance Test - Run this yourself!\n');

const BASE_URL = 'http://localhost:8081';

async function testSpeed() {
  console.log('Testing search speed...\n');
  
  const queries = ['developer', 'react', 'node', 'python', 'java'];
  
  for (const query of queries) {
    console.log(`Searching for "${query}":`);
    
    // First search (no cache)
    const start1 = Date.now();
    try {
      const response1 = await axios.get(`${BASE_URL}/api/v1/job/search?q=${query}`);
      const time1 = Date.now() - start1;
      console.log(`  First search: ${time1}ms (${response1.data.jobs?.length || 0} jobs found)`);
      
      // Second search (should be cached)
      const start2 = Date.now();
      const response2 = await axios.get(`${BASE_URL}/api/v1/job/search?q=${query}`);
      const time2 = Date.now() - start2;
      console.log(`  Second search: ${time2}ms (cached: ${response2.data.cached ? 'YES' : 'NO'})`);
      console.log(`  Speed improvement: ${((time1-time2)/time1*100).toFixed(1)}%\n`);
      
    } catch (error) {
      console.log(`  ERROR: ${error.message}\n`);
    }
  }
}

async function testLoad() {
  console.log('Testing concurrent load (you can see this in real-time)...\n');
  
  const promises = [];
  const start = Date.now();
  
  console.log('Sending 25 concurrent requests...');
  
  for (let i = 0; i < 25; i++) {
    promises.push(
      axios.get(`${BASE_URL}/api/v1/job/search?q=test${i}`)
        .then(() => {
          process.stdout.write('✅ ');
          return { success: true };
        })
        .catch(() => {
          process.stdout.write('❌ ');
          return { success: false };
        })
    );
  }
  
  const results = await Promise.all(promises);
  const totalTime = Date.now() - start;
  const successful = results.filter(r => r.success).length;
  
  console.log(`\n\nResults:`);
  console.log(`Success rate: ${successful}/25 (${(successful/25*100).toFixed(1)}%)`);
  console.log(`Total time: ${totalTime}ms`);
  console.log(`Average per request: ${(totalTime/25).toFixed(2)}ms`);
  console.log(`Requests per second: ${(25/(totalTime/1000)).toFixed(2)}`);
}

// Run tests
async function runManualTest() {
  try {
    await testSpeed();
    await testLoad();
    
    console.log('\n🎉 Manual testing complete!');
    console.log('You can see the performance improvements yourself.');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Make sure your server is running: npm start');
  }
}

runManualTest();
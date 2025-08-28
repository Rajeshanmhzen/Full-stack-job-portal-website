import axios from 'axios';

class PreciseCapacityTester {
  constructor() {
    this.BASE_URL = 'http://localhost:8081';
    this.results = [];
  }

  async testCapacityAtLevel(userCount, duration = 30) {
    console.log(`Testing ${userCount} concurrent users...`);
    
    const metrics = {
      userCount,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      responseTimes: [],
      errors: [],
      startTime: Date.now()
    };

    const promises = [];
    
    // Create concurrent users
    for (let i = 0; i < userCount; i++) {
      promises.push(this.simulateUser(metrics, duration));
    }
    
    await Promise.all(promises);
    
    const totalTime = (Date.now() - metrics.startTime) / 1000;
    const successRate = (metrics.successfulRequests / metrics.totalRequests) * 100;
    const avgResponseTime = metrics.responseTimes.length > 0 
      ? metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length 
      : 0;
    const rps = metrics.totalRequests / totalTime;

    const result = {
      userCount,
      successRate: successRate.toFixed(2),
      avgResponseTime: avgResponseTime.toFixed(2),
      rps: rps.toFixed(2),
      totalRequests: metrics.totalRequests,
      isStable: successRate >= 95 && avgResponseTime < 3000
    };

    console.log(`  Success Rate: ${result.successRate}%`);
    console.log(`  Avg Response: ${result.avgResponseTime}ms`);
    console.log(`  RPS: ${result.rps}`);
    console.log(`  Status: ${result.isStable ? '✅ STABLE' : '❌ UNSTABLE'}\n`);

    this.results.push(result);
    return result;
  }

  async simulateUser(metrics, duration) {
    const endTime = Date.now() + (duration * 1000);
    
    while (Date.now() < endTime) {
      const start = Date.now();
      
      try {
        await axios.get(`${this.BASE_URL}/api/v1/job/search?q=test${Math.random()}`, {
          timeout: 10000
        });
        
        metrics.totalRequests++;
        metrics.successfulRequests++;
        metrics.responseTimes.push(Date.now() - start);
        
      } catch (error) {
        metrics.totalRequests++;
        metrics.failedRequests++;
        metrics.errors.push(error.message);
        metrics.responseTimes.push(Date.now() - start);
      }
      
      // Random delay between requests (0.5-2 seconds)
      await this.sleep(500 + Math.random() * 1500);
    }
  }

  async findPreciseCapacity() {
    console.log('🎯 Finding Precise Capacity Range\n');
    console.log('Testing with increasing user loads...\n');

    // Phase 1: Quick scan to find approximate range
    console.log('📊 Phase 1: Quick Capacity Scan');
    console.log('================================');
    
    const quickTestLevels = [ 200,300,400,500];
    let lastStableLevel = 0;
    let firstUnstableLevel = null;

    for (const level of quickTestLevels) {
      const result = await this.testCapacityAtLevel(level, 20); // Shorter duration for quick scan
      
      if (result.isStable) {
        lastStableLevel = level;
      } else if (!firstUnstableLevel) {
        firstUnstableLevel = level;
        break;
      }
      
      await this.sleep(3000); 
    }

    // Phase 2: Precise range finding
    console.log('🔍 Phase 2: Precise Range Detection');
    console.log('===================================');
    
    let lowerBound = lastStableLevel;
    let upperBound = firstUnstableLevel || 250;
    
    console.log(`Narrowing down between ${lowerBound} and ${upperBound} users...\n`);

    // Binary search for precise capacity
    while (upperBound - lowerBound > 10) {
      const midPoint = Math.floor((lowerBound + upperBound) / 2);
      const result = await this.testCapacityAtLevel(midPoint, 30);
      
      if (result.isStable) {
        lowerBound = midPoint;
      } else {
        upperBound = midPoint;
      }
      
      await this.sleep(3000);
    }

    // Phase 3: Fine-tune the exact range
    console.log('🎯 Phase 3: Fine-tuning Exact Range');
    console.log('===================================');
    
    const preciseTests = [];
    for (let i = lowerBound; i <= upperBound; i += 2) {
      const result = await this.testCapacityAtLevel(i, 45); // Longer test for accuracy
      preciseTests.push(result);
      await this.sleep(2000);
    }

    return this.calculatePreciseRange(preciseTests);
  }

  calculatePreciseRange(results) {
    const stableResults = results.filter(r => r.isStable);
    const unstableResults = results.filter(r => !r.isStable);

    const maxStable = stableResults.length > 0 
      ? Math.max(...stableResults.map(r => r.userCount))
      : 0;
    
    const minUnstable = unstableResults.length > 0
      ? Math.min(...unstableResults.map(r => r.userCount))
      : maxStable + 10;

    return {
      stableCapacity: maxStable,
      breakingPoint: minUnstable,
      preciseRange: `${maxStable}-${minUnstable}`,
      confidence: this.calculateConfidence(results)
    };
  }

  calculateConfidence(results) {
    const totalTests = results.length;
    const consistentResults = results.filter(r => {
      const expectedStable = r.userCount <= 100; // Adjust based on your expectations
      return (r.isStable && expectedStable) || (!r.isStable && !expectedStable);
    }).length;

    return ((consistentResults / totalTests) * 100).toFixed(1);
  }

  printDetailedResults(preciseRange) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 PRECISE CAPACITY ANALYSIS RESULTS');
    console.log('='.repeat(60));

    console.log('\n🎯 EXACT CAPACITY RANGE:');
    console.log(`   Maximum Stable Users: ${preciseRange.stableCapacity}`);
    console.log(`   Breaking Point: ${preciseRange.breakingPoint}`);
    console.log(`   Precise Range: ${preciseRange.preciseRange} concurrent users`);
    console.log(`   Confidence Level: ${preciseRange.confidence}%`);

    console.log('\n📈 DETAILED PERFORMANCE DATA:');
    console.log('User Count | Success Rate | Avg Response | RPS   | Status');
    console.log('-'.repeat(60));
    
    this.results.forEach(result => {
      const status = result.isStable ? '✅ STABLE  ' : '❌ UNSTABLE';
      console.log(`${result.userCount.toString().padStart(9)} | ${result.successRate.padStart(11)}% | ${result.avgResponseTime.padStart(11)}ms | ${result.rps.padStart(5)} | ${status}`);
    });

    console.log('\n💡 RECOMMENDATIONS:');
    if (preciseRange.stableCapacity >= 100) {
      console.log('🎉 EXCELLENT! Your website is production-ready');
      console.log('   - Can handle enterprise-level traffic');
      console.log('   - Consider horizontal scaling for even higher loads');
    } else if (preciseRange.stableCapacity >= 50) {
      console.log('✅ GOOD! Suitable for medium-scale applications');
      console.log('   - Consider database optimization for higher capacity');
      console.log('   - Implement caching for better performance');
    } else {
      console.log('⚠️  NEEDS OPTIMIZATION for production use');
      console.log('   - Replace linear search with database queries');
      console.log('   - Add database indexes');
      console.log('   - Implement connection pooling');
    }

    console.log('\n' + '='.repeat(60));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the precise capacity test
async function runPreciseTest() {
  const tester = new PreciseCapacityTester();
  
  try {
    // Check server first
    console.log('🔍 Checking server connection...');
    await axios.get('http://localhost:8081/health', { timeout: 5000 });
    console.log('✅ Server is running!\n');
    
    const preciseRange = await tester.findPreciseCapacity();
    tester.printDetailedResults(preciseRange);
    
  } catch (error) {
    console.log('❌ Server not responding. Make sure it\'s running on port 8081');
    console.log('Error:', error.message);
  }
}

runPreciseTest().catch(console.error);
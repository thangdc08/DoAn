const fs = require('fs');
const path = 'D:/Hoc_ki_8/DoAn/Code/Code/badminton-platform';
const gwPath = path + '/backend/api-gateway/src/main/resources/application.yml';

let yaml = fs.readFileSync(gwPath, 'utf8');

const rateLimiterBlock = `
      - name: RequestRateLimiter
        args:
          redis-rate-limiter.replenishRate: 10
          redis-rate-limiter.burstCapacity: 20
          redis-rate-limiter.requestedTokens: 1
          key-resolver: "#{@ipKeyResolver}"`;

// Fix chat-service URI: http://localhost:8686 -> lb://chat-service
yaml = yaml.replace(
  'uri: http://localhost:8686',
  'uri: lb://chat-service'
);

// Add rate limiter to community-service (after its RewritePath filter)
yaml = yaml.replace(
  /(filters:\s*\n\s*- RewritePath=\/communities\/\(\?<segment>\.\*\), \/\$\{segment\})/,
  '$1' + rateLimiterBlock
);

// Add rate limiter to chat-service (after its RewritePath filter)
yaml = yaml.replace(
  /(filters:\s*\n\s*- RewritePath=\/chat\/api\/\(\?<segment>\.\*\), \/\$\{segment\})/,
  '$1' + rateLimiterBlock
);

// Add rate limiter to notification-service (after its RewritePath filter)
yaml = yaml.replace(
  /(filters:\s*\n\s*- RewritePath=\/notifications\/\(\?<segment>\.\*\), \/api\/notifications\/\$\{segment\})/,
  '$1' + rateLimiterBlock
);

fs.writeFileSync(gwPath, yaml);
console.log('OK: gateway rate-limiters added, chat-service URI fixed');

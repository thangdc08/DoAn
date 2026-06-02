const fs = require('fs');
const path = require('path');
const base = 'D:/Hoc_ki_8/DoAn/Code/Code/badminton-platform';

function read(f) { return fs.readFileSync(path.join(base, f), 'utf8'); }
function write(f, c) { fs.writeFileSync(path.join(base, f), c, 'utf8'); console.log('OK:', f); }

// ===== Fix PaymentService.java: idempotency guard =====
let ps = read('backend/payment-service/src/main/java/com/badminton/paymentservice/service/PaymentService.java');

// Find lines 77-79 and replace
ps = ps.replace(
  /if \("SUCCESS"\.equals\(transaction\.getStatus\(\)\)\) \{\n\s*return true;\n\s*\}/,
  'if ("SUCCESS".equals(transaction.getStatus())) {\n        log.info("Transaction {} already SUCCESS, skipping duplicate callback", txnRef);\n        return true;\n    }\n    if ("FAILED".equals(transaction.getStatus())) {\n        log.warn("Transaction {} already FAILED, ignoring duplicate callback", txnRef);\n        return false;\n    }'
);
write('backend/payment-service/src/main/java/com/badminton/paymentservice/service/PaymentService.java', ps);

const fs = require('fs');
const path = 'D:/Hoc_ki_8/DoAn/Code/Code/badminton-platform/frontend/src/pages/user/CreateMatchPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace mapLevelToApi usage with mapUiLevelToApi
content = content.replace(
  "selectedLevels.map((lv) => mapLevelToApi(lv))",
  "selectedLevels.map((lv) => mapUiLevelToApi(lv))"
);

// Fix default fallback from INTERMEDIATE to BEGINNER
content = content.replace(
  "const primaryLevel = mappedLevels[0] || 'INTERMEDIATE';",
  "const primaryLevel = mappedLevels[0] || 'BEGINNER';"
);

fs.writeFileSync(path, content, 'utf8');
console.log('CreateMatchPage.tsx updated');

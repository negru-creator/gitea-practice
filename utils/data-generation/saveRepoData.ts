export default function saveRepoData(repoData: { repoName: string; isTemplate: boolean }, filePath: string = `./test-data/repos-data/testRepoTemplate1.json`): void {
    const fs = require('fs');
    const path = require('path');
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(repoData, null, 2));
}
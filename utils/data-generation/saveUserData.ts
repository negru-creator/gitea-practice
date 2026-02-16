export default function saveUserData(userData: { testUserName: string; testEmail: string; testPassword: string }, filePath: string = `./test-data/users-data/${userData.testUserName}.json`): void {
    const fs = require('fs');
    const path = require('path');
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(userData));
}
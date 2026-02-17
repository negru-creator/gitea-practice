export function generateUniqueEmail(): string {
    const timestamp = Date.now();
    return `negru-${timestamp}@qamadness.com`;
}

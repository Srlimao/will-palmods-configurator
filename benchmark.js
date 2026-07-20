import { UE_KEYCODES } from './src/components/shared/KeyBindInput/keycodes.js';

const search = 'a';
const ITERATIONS = 100000;

console.time('Baseline');
for (let i = 0; i < ITERATIONS; i++) {
    const filteredKeys = UE_KEYCODES.filter(k => k.toLowerCase().includes(search.toLowerCase()));
}
console.timeEnd('Baseline');

console.time('Optimized');
const searchLower = search.toLowerCase();
for (let i = 0; i < ITERATIONS; i++) {
    const filteredKeys = UE_KEYCODES.filter(k => k.toLowerCase().includes(searchLower));
}
console.timeEnd('Optimized');

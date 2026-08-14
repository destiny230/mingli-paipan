// 测试 iztro 紫微排盘（正确参数）
const { astro } = require('iztro');

// 1992-1-15 12:30 = 午时 (timeIndex 6)
// bySolar(solarDateStr, timeIndex, gender, fixLeap, language)
const r = astro.bySolar('1992-1-15', 6, '女', true, 'zh-CN');
console.log('name:', r.name);
console.log('solar:', r.solarDate, '| lunar:', r.lunarDate);
console.log('五行局:', r.fiveElementsClass);
console.log('命主:', r.horoscope, '| 身主:', r.zodiac);
const m = r.palaces.find(p => p.name === '命宫');
console.log('命宫主星:', m.majorStars.map(s => s.name).join(','));
console.log('命宫辅星:', m.minorStars.map(s => s.name).join(','));
console.log('命宫宫干:', m.heavenlyStem + m.earthlyBranch);
console.log('所有宫位:', r.palaces.map(p => `${p.name}(${p.heavenlyStem}${p.earthlyBranch})`).join(' '));
console.log('生年四化:', r.stars.filter(s => s.type === 'natal').map(s => `${s.name}(${s.function})`).join(', '));

// 验证 lunar-javascript 排盘能力 v2
const { Solar, Lunar, LunarYear, EightChar, LunarUtil } = require('lunar-javascript');

const solar = Solar.fromYmdHms(1992, 1, 15, 12, 30, 0);
const lunar = solar.getLunar();
const ec = lunar.getEightChar();

console.log('=== 八字排盘 ===');
console.log('四柱:', ec.getYear(), ec.getMonth(), ec.getDay(), ec.getTime());
console.log('十神(天干):', ec.getYearShiShenGan(), ec.getMonthShiShenGan(), '日主', ec.getTimeShiShenGan());
console.log('纳音:', ec.getYearNaYin(), ec.getMonthNaYin(), ec.getDayNaYin(), ec.getTimeNaYin());
console.log('胎元:', ec.getTaiYuan(), '| 命宫:', ec.getMingGong(), '| 身宫:', ec.getShenGong());

console.log('\n=== 大运 (EightChar.getYun) ===');
try {
  const yun = ec.getYun(1); // 1=男
  console.log('起运:', yun.getStartYear(), '年', yun.getStartMonth(), '月', yun.getStartDay(), '日');
  console.log('起运描述:', yun.getStartYear(), '年', yun.getStartMonth(), '个月后起运');
  const daYun = yun.getDaYun();
  for (let i = 0; i < Math.min(8, daYun.length); i++) {
    const d = daYun[i];
    console.log(`第${i+1}运: ${d.getStartAge()}岁 ${d.getGanZhi()} (${d.getStartYear()}-${d.getEndYear()}) 十神:${d.getShiShenGan()}`);
  }
  console.log('\n=== 流年 ===');
  const liuNian = yun.getLiuNian();
  for (let i = 0; i < Math.min(3, liuNian.length); i++) {
    const l = liuNian[i];
    console.log(`流年: ${l.getYear()} ${l.getGanZhi()} 年龄${l.getAge()} 十神:${l.getShiShenGan()}/${l.getShiShenZhi()}`);
  }
} catch(e) { console.log('大运 API 错误:', e.message); }

console.log('\n=== 紫微斗数 ===');
try {
  // lunar-javascript 通过 Lunar.getZiWei 或类似 API？查一下方法
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(lunar)).filter(m => /ziwei|ziWei|purple|star/i.test(m));
  console.log('紫微相关方法:', methods.join(', ') || '无');
} catch(e) { console.log('检查失败:', e.message); }

console.log('\n=== 奇门遁甲 ===');
try {
  const methods2 = Object.getOwnPropertyNames(Object.getPrototypeOf(lunar)).filter(m => /qimen|qiMen|dun/i.test(m));
  console.log('奇门相关方法:', methods2.join(', ') || '无');
} catch(e) { console.log('检查失败:', e.message); }

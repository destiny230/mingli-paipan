// 验证 lunar-javascript 排盘能力
const { Solar, Lunar, LunarYear, EightChar, LunarUtil } = require('lunar-javascript');

// 测试：1992-01-15 12:30（示例，非耀先八字）
const solar = Solar.fromYmdHms(1992, 1, 15, 12, 30, 0);
const lunar = solar.getLunar();

console.log('=== 八字排盘 ===');
const ec = lunar.getEightChar();
console.log('四柱:', ec.getYear(), ec.getMonth(), ec.getDay(), ec.getTime());
console.log('年柱天干地支:', ec.getYearGan(), ec.getYearZhi(), '| 藏干:', ec.getYearHideGan().join(','));
console.log('月柱:', ec.getMonthGan(), ec.getMonthZhi(), '| 藏干:', ec.getMonthHideGan().join(','));
console.log('日柱:', ec.getDayGan(), ec.getDayZhi(), '| 藏干:', ec.getDayHideGan().join(','));
console.log('时柱:', ec.getTimeGan(), ec.getTimeZhi(), '| 藏干:', ec.getTimeHideGan().join(','));
console.log('十神(日干论):', ec.getYearShiShenGan(), ec.getMonthShiShenGan(), ec.getDayShiShenGan(), ec.getTimeShiShenGan());
console.log('十神(地支):', ec.getYearShiShenZhi().join(','), '|', ec.getMonthShiShenZhi().join(','), '|', ec.getTimeShiShenZhi().join(','));
console.log('纳音:', ec.getYearNaYin(), ec.getMonthNaYin(), ec.getDayNaYin(), ec.getTimeNaYin());
console.log('胎元:', ec.getTaiYuan(), '| 命宫:', ec.getMingGong(), '| 身宫:', ec.getShenGong());
console.log('大运起运:', lunar.getYun(1).getStartYear(), '年', lunar.getYun(1).getStartMonth(), '月', lunar.getYun(1).getStartDay(), '日');

console.log('\n=== 大运 ===');
const yun = lunar.getYun(1); // 1=男
const daYun = yun.getDaYun();
for (let i = 0; i < Math.min(8, daYun.length); i++) {
  const d = daYun[i];
  console.log(`第${d.getIndex()+1}运: ${d.getStartAge()}岁起 ${d.getGanZhi()} (${d.getStartYear()}-${d.getEndYear()})`);
}

console.log('\n=== 流年 ===');
const liuNian = yun.getLiuNian();
for (let i = 0; i < Math.min(3, liuNian.length); i++) {
  const l = liuNian[i];
  console.log(`流年: ${l.getYear()} ${l.getGanZhi()} 年龄${l.getAge()}`);
}

console.log('\n=== 紫微斗数 ===');
try {
  // lunar-javascript 1.7.7 紫微支持（通过 Lunar.getZiWei? 实际API可能不同）
  console.log('尝试紫微 API...');
  console.log('五行局:', lunar.getEarthBranchIndex ? 'has getEarthBranchIndex' : 'n/a');
} catch(e) { console.log('紫微 API 需确认:', e.message); }

console.log('\n=== 奇门遁甲 ===');
try {
  const qm = lunar.getQiMen();
  if (qm) {
    console.log('局:', qm.getJu(), '| 遁:', qm.getDun(), '| 元:', qm.getYuan());
    console.log('值符:', qm.getZhiFu(), '| 值使:', qm.getZhiShi());
    console.log('时辰:', qm.getTimeGan(), qm.getTimeZhi());
  } else {
    console.log('getQiMen 返回空，检查 API');
  }
} catch(e) { console.log('奇门 API:', e.message); }

console.log('\n=== 神煞 ===');
console.log('天乙贵人:', ec.getTianYiGan());
console.log('文昌:', ec.getWenChangGan(), '| 桃花:', ec.getTaoHuaGan());

// 排盘引擎封装：八字 + 紫微 + 奇门 统一入口
const { Solar } = require('lunar-javascript');
const { astro } = require('iztro');
const qm = require('qimen-dunjia');

/** 公历日期 → 时辰索引（iztro 用 0-12） */
function timeIndexFromHour(hour) {
  // 子0(23-1) 丑1(1-3) 寅2(3-5) 卯3(5-7) 辰4(7-9) 巳5(9-11)
  // 午6(11-13) 未7(13-15) 申8(15-17) 酉9(17-19) 戌10(19-21) 亥11(21-23) 晚子12(23-24)
  if (hour >= 23) return 12;
  if (hour < 1) return 0;
  if (hour < 3) return 1;
  if (hour < 5) return 2;
  if (hour < 7) return 3;
  if (hour < 9) return 4;
  if (hour < 11) return 5;
  if (hour < 13) return 6;
  if (hour < 15) return 7;
  if (hour < 17) return 8;
  if (hour < 19) return 9;
  if (hour < 21) return 10;
  return 11;
}

/** 地支藏干（用于显示） */
const HIDE_GAN = {
  '子': ['癸'], '丑': ['己','癸','辛'], '寅': ['甲','丙','戊'],
  '卯': ['乙'], '辰': ['戊','乙','癸'], '巳': ['丙','庚','戊'],
  '午': ['丁','己'], '未': ['己','丁','乙'], '申': ['庚','壬','戊'],
  '酉': ['辛'], '戌': ['戊','辛','丁'], '亥': ['壬','甲']
};

/** 八字排盘 */
function paipanBazi(year, month, day, hour, minute) {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute || 0, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  
  const pillars = {
    year:  { gan: ec.getYearGan(), zhi: ec.getYearZhi(), shishen: ec.getYearShiShenGan(), hide: ec.getYearHideGan(), nayin: ec.getYearNaYin() },
    month: { gan: ec.getMonthGan(), zhi: ec.getMonthZhi(), shishen: ec.getMonthShiShenGan(), hide: ec.getMonthHideGan(), nayin: ec.getMonthNaYin() },
    day:   { gan: ec.getDayGan(), zhi: ec.getDayZhi(), shishen: '日主', hide: ec.getDayHideGan(), nayin: ec.getDayNaYin() },
    time:  { gan: ec.getTimeGan(), zhi: ec.getTimeZhi(), shishen: ec.getTimeShiShenGan(), hide: ec.getTimeHideGan(), nayin: ec.getTimeNaYin() }
  };
  
  // 大运（性别 1男 0女）
  let dayun = [];
  try {
    const yun = ec.getYun(1);
    const dy = yun.getDaYun();
    for (let i = 0; i < Math.min(10, dy.length); i++) {
      const d = dy[i];
      dayun.push({ age: d.getStartAge(), ganZhi: d.getGanZhi(), startYear: d.getStartYear(), endYear: d.getEndYear() });
    }
  } catch(e) { dayun = []; }
  
  return {
    solar: `${year}-${month}-${day} ${hour}:${minute||0}`,
    lunar: lunar.toString(),
    pillars,
    taiYuan: ec.getTaiYuan(),
    mingGong: ec.getMingGong(),
    shenGong: ec.getShenGong(),
    dayun
  };
}

/** 紫微斗数排盘 */
function paipanZiwei(year, month, day, hour, gender) {
  const ti = timeIndexFromHour(hour);
  const g = gender === '男' ? '男' : '女';
  try {
    const r = astro.bySolar(`${year}-${month}-${day}`, ti, g, true, 'zh-CN');
    const palaces = r.palaces.map(p => ({
      name: p.name,
      ganZhi: p.heavenlyStem + p.earthlyBranch,
      majorStars: p.majorStars.map(s => s.name),
      minorStars: p.minorStars.map(s => s.name),
      adjStars: p.adjectiveStars.map(s => s.name)
    }));
    // 命宫在 palaces 中找
    const ming = r.palaces.find(p => p.name === '命宫');
    return {
      solarDate: r.solarDate,
      lunarDate: r.lunarDate,
      chineseDate: r.chineseDate,
      fiveElementsClass: r.fiveElementsClass,
      zodiac: r.zodiac,
      soul: typeof r.soul === 'function' ? r.soul() : r.soul,
      body: typeof r.body === 'function' ? r.body() : r.body,
      mingGong: ming ? { ganZhi: ming.heavenlyStem + ming.earthlyBranch, majorStars: ming.majorStars.map(s=>s.name) } : null,
      palaces
    };
  } catch(e) {
    return { error: e.message };
  }
}

/** 奇门遁甲排盘 */
function paipanQimen(year, month, day, hour) {
  const hh = String(hour).padStart(2, '0');
  const dt = `${year}${String(month).padStart(2,'0')}${String(day).padStart(2,'0')}${hh}`;
  try {
    const chart = qm.generateChartByDatetime(dt);
    const o = qm.chartToObject ? qm.chartToObject(chart) : {};
    return o;
  } catch(e) {
    return { error: e.message };
  }
}

module.exports = { paipanBazi, paipanZiwei, paipanQimen, timeIndexFromHour };

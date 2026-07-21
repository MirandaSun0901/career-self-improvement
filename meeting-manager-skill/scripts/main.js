/**
 * meeting-manager Skill - 核心逻辑
 * 功能：自动初始化专属表格、解析飞书妙记、填入表格
 */

const CACHE_DIR = 'workspace/cache';
const CONFIG_PATH = `${CACHE_DIR}/meeting_manager_config.json`;

/* 表格字段定义（用于自动建表） */
const TABLE_FIELDS = [
  { field_name: '会议时间', type: 5 },
  { field_name: '会议形式', type: 3, property: { options: [
    { name: '定计划', color: 0 },
    { name: '周会', color: 1 },
    { name: '月度经营会议', color: 2 }
  ]}},
  { field_name: '会议主题', type: 1 },
  { field_name: '汇报人', type: 11 },
  { field_name: '智能纪要链接', type: 15 },
  { field_name: '待行动项', type: 1 },
  { field_name: '进度', type: 3, property: { options: [
    { name: '待开始', color: 0 },
    { name: '进行中', color: 1 },
    { name: '已完成', color: 2 }
  ]}}
];

/**
 * 读取本地配置（app_token + table_id）
 */
function readConfig() {
  try {
    const fs = require('fs');
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }
  } catch (e) { /* ignore */ }
  return null;
}

/**
 * 保存配置到本地缓存
 */
function saveConfig(config) {
  const fs = require('fs');
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

/**
 * 为当前用户自动创建专属会议管理看板
 */
async function initTable() {
  // 1. 创建多维表格
  const app = await feishu_bitable_app.create({ name: '会议管理看板' });
  if (!app || !app.app_token) throw new Error('创建多维表格失败');
  
  // 2. 创建数据表 + 字段
  const table = await feishu_bitable_app_table.create({
    app_token: app.app_token,
    name: '会议记录',
    table: { name: '会议记录', fields: TABLE_FIELDS }
  });
  
  if (!table || !table.table_id) throw new Error('创建数据表失败');
  
  const config = {
    app_token: app.app_token,
    table_id: table.table_id,
    created_at: new Date().toISOString()
  };
  
  saveConfig(config);
  return config;
}

/**
 * 获取配置（存在则读缓存，不存在则初始化）
 */
async function getConfig() {
  let config = readConfig();
  if (!config) {
    config = await initTable();
  }
  return config;
}

/**
 * 会议形式分类
 */
function classifyTopic(summary, content) {
  const text = (summary + ' ' + content).toLowerCase();
  if (/(定计划|规划|OKR|okr|季度计划|年度计划|战略规划)/.test(text)) return '定计划';
  if (/(月度经营|月会|月经营分析|月度复盘|月度会议)/.test(text)) return '月度经营会议';
  return '周会';
}

/**
 * 从文档内容提取行动项
 */
function extractActionItems(content) {
  const lines = content.split('\n');
  const actionLines = [];
  let inSection = false;
  for (const line of lines) {
    const t = line.trim();
    if (/(行动项|待办|待行动|todo|action)\s*$/i.test(t)) { inSection = true; continue; }
    if (inSection) {
      if (/^##|^---|^$/.test(t)) break;
      if (/\[.*\]/.test(t) || /[-*\d]/.test(t)) actionLines.push(t.replace(/^[-*\[\]\s]+/, ''));
    }
  }
  if (actionLines.length === 0) return '无待行动项';
  return actionLines.map((s, i) => `${i+1}. ${s}`).join('\n');
}

/**
 * 提取汇报人
 */
function extractReporter(content) {
  const m = content.match(/\*\*(主持人|组织者|汇报人)\*\*[：:]\s*([^\n]+)/);
  return m ? m[2].trim() : null;
}

/**
 * 提取会议时间
 */
function extractDate(content) {
  const m = content.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (m) return `${m[1]}/${m[2]}/${m[3]}`;
  const m2 = content.match(/(\d{4}-\d{2}-\d{2})/);
  return m2 ? m2[1] : null;
}

/**
 * 解析整篇智能纪要
 */
function parseMinutes(docContent, docUrl, docTitle) {
  const content = docContent.markdown || '';
  const summary = docContent.title || docTitle || '';
  
  const dateStr = extractDate(content);
  const topic = classifyTopic(summary, content);
  const reporterName = extractReporter(content);
  const actionItems = extractActionItems(content);
  
  let timestamp = null;
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) timestamp = d.getTime();
  }
  
  return { timestamp, topic, reporterName, docUrl, actionItems, title: summary };
}

/**
 * 获取已处理的文档 ID 列表
 */
async function getProcessedIds() {
  try {
    const fs = require('fs');
    const p = `${CACHE_DIR}/processed_minutes.json`;
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch (e) { /* ignore */ }
  return [];
}

function markProcessed(docId) {
  try {
    const fs = require('fs');
    const list = getProcessedIds();
    list.push({ docId, processedAt: new Date().toISOString() });
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(`${CACHE_DIR}/processed_minutes.json`, JSON.stringify(list, null, 2));
  } catch (e) { /* ignore */ }
}

/**
 * 手动处理单篇智能纪要
 */
export async function processMinutes(docUrl, docTitle) {
  // 1. 获取/初始化表格
  const config = await getConfig();
  
  // 2. 读取文档
  const docContent = await feishu_fetch_doc({ doc_id: docUrl });
  if (!docContent) return { success: false, error: '无法读取文档' };
  
  // 3. 解析
  const parsed = parseMinutes(docContent, docUrl, docTitle);
  
  // 4. 构造 fields（用字段名写入）
  const fields = {};
  if (parsed.timestamp) fields['会议时间'] = parsed.timestamp;
  fields['会议形式'] = parsed.topic;
  fields['会议主题'] = parsed.title || '智能纪要';
  
  if (parsed.reporterName) {
    try {
      const user = await feishu_search_user({ query: parsed.reporterName });
      if (user.users && user.users.length) {
        fields['汇报人'] = [{ id: user.users[0].open_id }];
      }
    } catch (e) { /* fallback to name */ }
    if (!fields['汇报人']) fields['汇报人'] = parsed.reporterName;
  }
  
  fields['智能纪要链接'] = { link: parsed.docUrl, text: parsed.title || '智能纪要' };
  fields['待行动项'] = parsed.actionItems;
  fields['进度'] = '待开始';
  
  // 5. 写入表格
  const result = await feishu_bitable_app_table_record.create({
    app_token: config.app_token,
    table_id: config.table_id,
    fields: fields
  });
  
  if (result && result.record) {
    markProcessed(docUrl);
    return { success: true, record_id: result.record.record_id, config };
  }
  
  return { success: false, error: '写入表格失败' };
}

/**
 * 每日自动扫描入口
 */
export async function dailyScan() {
  // 确保用户有自己的表格
  const config = await getConfig();
  
  // 搜索智能纪要文档
  const searchResult = await feishu_search_doc_wiki({
    action: 'search',
    query: '智能纪要',
    filter: { doc_types: ['DOCX'] },
    sort_type: 'EDIT_TIME'
  });
  
  if (!searchResult || !searchResult.results || searchResult.results.length === 0) {
    return { scanned: 0, processed: 0, message: '未发现新智能纪要', config };
  }
  
  const processedIds = await getProcessedIds();
  const processedSet = new Set(processedIds.map(p => p.docId));
  
  const newMinutes = searchResult.results.filter(m => !processedSet.has(m.result_meta.url));
  
  if (newMinutes.length === 0) {
    return { scanned: searchResult.results.length, processed: 0, message: '所有纪要已处理', config };
  }
  
  const results = [];
  for (const m of newMinutes.slice(0, 20)) {
    try {
      const r = await processMinutes(m.result_meta.url, m.title_highlighted);
      results.push({ url: m.result_meta.url, success: r.success });
    } catch (e) {
      results.push({ url: m.result_meta.url, success: false, error: e.message });
    }
  }
  
  return {
    scanned: searchResult.results.length,
    processed: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    config,
    details: results
  };
}

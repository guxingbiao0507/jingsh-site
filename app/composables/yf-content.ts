export type Lang = 'zh' | 'en'

export interface Bi {
  zh: string
  en: string
}

export type CategoryId = 'roller' | 'belt' | 'chain' | 'lift'

export interface Category {
  id: CategoryId
  name: Bi
  desc: Bi
  code: string
}

export interface Product {
  slug: string
  cat: CategoryId
  name: Bi
}

export interface CaseItem {
  slug: string
  name: Bi
  tag: Bi
}

export type AppRoute =
  | { page: 'home' }
  | { page: 'product'; slug: string }
  | { page: 'article'; id: string }
  | { page: 'case'; slug: string }
  | { page: 'about' }
  | { page: 'contact' }

export const categories: Category[] = [
  { id: 'roller', code: 'SYS.01', name: { zh: '滚筒输送机', en: 'Roller Conveyors' }, desc: { zh: '直行 / 转弯 / 积放 / 重型链条，覆盖轻型到重型全载荷输送场景', en: 'Straight, curved, accumulating and heavy-duty chain-driven roller conveying for every load class' } },
  { id: 'belt', code: 'SYS.02', name: { zh: '皮带输送机', en: 'Belt Conveyors' }, desc: { zh: '槽型 / 隔断 / 防跑偏 / 同步输送，适配食品、粮食与工业物料', en: 'Troughed, cleated, anti-deviation and synchronous belts for food, grain and industrial material' } },
  { id: 'chain', code: 'SYS.03', name: { zh: '链板 / 链条输送机', en: 'Chain & Slat Conveyors' }, desc: { zh: '链板、倍速链、链条传动，面向重载与装配线节拍输送', en: 'Slat, double-speed and chain transmission for heavy loads and paced assembly lines' } },
  { id: 'lift', code: 'SYS.04', name: { zh: '提升机 / 升降台', en: 'Lifts & Elevators' }, desc: { zh: '垂直 / Z 型 / C 型连续提升与液压升降，打通跨楼层物流动线', en: 'Vertical, Z-type and C-type continuous lifts plus hydraulic tables for multi-floor logistics' } },
]

export const products: Product[] = [
  { slug: 'roller-straight', cat: 'roller', name: { zh: '直行滚筒输送机', en: 'Straight Roller Conveyor' } },
  { slug: 'roller-curve', cat: 'roller', name: { zh: '转弯滚筒输送机', en: 'Curved Roller Conveyor' } },
  { slug: 'roller-taper', cat: 'roller', name: { zh: '锥形滚筒输送机', en: 'Tapered Roller Conveyor' } },
  { slug: 'roller-motorized', cat: 'roller', name: { zh: '电动滚筒输送机', en: 'Motorized Roller Conveyor' } },
  { slug: 'roller-brake', cat: 'roller', name: { zh: '刹车滚筒输送机', en: 'Brake Roller Conveyor' } },
  { slug: 'roller-belt-driven', cat: 'roller', name: { zh: '皮带驱动滚筒输送机', en: 'Belt-Driven Roller Conveyor' } },
  { slug: 'roller-heavy-chain', cat: 'roller', name: { zh: '重型链条滚筒输送机', en: 'Heavy-Duty Chain Roller Conveyor' } },
  { slug: 'roller-accumulating', cat: 'roller', name: { zh: '链条积放滚筒输送机', en: 'Accumulating Roller Conveyor' } },
  { slug: 'roller-diverging', cat: 'roller', name: { zh: '分合流滚筒输送机', en: 'Merge & Divert Roller Conveyor' } },
  { slug: 'belt-trough', cat: 'belt', name: { zh: '槽型皮带输送机', en: 'Troughed Belt Conveyor' } },
  { slug: 'belt-cleated', cat: 'belt', name: { zh: '带隔断皮带输送机', en: 'Cleated Belt Conveyor' } },
  { slug: 'belt-detachable', cat: 'belt', name: { zh: '可拆卸皮带输送机', en: 'Detachable Belt Conveyor' } },
  { slug: 'belt-anti-deviation', cat: 'belt', name: { zh: '连接用防跑偏皮带机', en: 'Anti-Deviation Belt Conveyor' } },
  { slug: 'belt-synchronous', cat: 'belt', name: { zh: '同步皮带输送机', en: 'Synchronous Belt Conveyor' } },
  { slug: 'belt-curve', cat: 'belt', name: { zh: '转弯皮带输送机', en: 'Curved Belt Conveyor' } },
  { slug: 'slat-chain', cat: 'chain', name: { zh: '链板输送机', en: 'Slat Chain Conveyor' } },
  { slug: 'chain-conveyor', cat: 'chain', name: { zh: '链条输送机', en: 'Chain Conveyor' } },
  { slug: 'double-speed-chain', cat: 'chain', name: { zh: '倍速链输送机', en: 'Double-Speed Chain Conveyor' } },
  { slug: 'lift-vertical', cat: 'lift', name: { zh: '垂直提升机', en: 'Vertical Lift' } },
  { slug: 'lift-hydraulic', cat: 'lift', name: { zh: '液压升降台', en: 'Hydraulic Lift Table' } },
  { slug: 'lift-c-type', cat: 'lift', name: { zh: 'C型提升机', en: 'C-Type Lift' } },
  { slug: 'lift-z-type', cat: 'lift', name: { zh: 'Z型提升机', en: 'Z-Type Lift' } },
]

export const cases: CaseItem[] = [
  { slug: 'case-shanghai-warehouse', name: { zh: '上海某物流仓储滚筒输送线组', en: 'Shanghai Logistics Warehouse Roller Line' }, tag: { zh: '物流仓储', en: 'Warehousing' } },
  { slug: 'case-shanghai-express', name: { zh: '上海某快递行业滚筒输送机', en: 'Shanghai Express Roller Conveyor' }, tag: { zh: '快递分拨', en: 'Express' } },
  { slug: 'case-lcd-roller', name: { zh: '江苏某液晶显示屏制造滚筒输送机', en: 'Jiangsu LCD Manufacturing Roller Conveyor' }, tag: { zh: '电子制造', en: 'Electronics' } },
  { slug: 'case-zhejiang-mfg', name: { zh: '浙江某制造行业滚筒输送机', en: 'Zhejiang Manufacturing Roller Conveyor' }, tag: { zh: '装备制造', en: 'Manufacturing' } },
  { slug: 'case-food-belt', name: { zh: '江苏某食品行业皮带输送机', en: 'Jiangsu Food Industry Belt Conveyor' }, tag: { zh: '食品加工', en: 'Food' } },
  { slug: 'case-chemical-belt', name: { zh: '江苏某化工行业皮带输送机', en: 'Jiangsu Chemical Industry Belt Conveyor' }, tag: { zh: '化工原料', en: 'Chemical' } },
  { slug: 'case-electronics-slat', name: { zh: '江苏某电子厂链板输送机', en: 'Jiangsu Electronics Plant Slat Conveyor' }, tag: { zh: '电子制造', en: 'Electronics' } },
  { slug: 'case-electronics-incline', name: { zh: '江苏某电子厂倾斜皮带输送机', en: 'Jiangsu Electronics Incline Belt Conveyor' }, tag: { zh: '电子制造', en: 'Electronics' } },
  { slug: 'case-woodbox-lift', name: { zh: '江苏某木箱厂提升机', en: 'Jiangsu Wooden Box Plant Lift' }, tag: { zh: '包装行业', en: 'Packaging' } },
]

export const news = [
  { date: '2022-12-22', title: { zh: '滚筒输送机定制应该注意什么', en: 'What to Consider When Customizing Roller Conveyors' } },
  { date: '2022-12-22', title: { zh: '解析滚筒输送机轴承使用注意事项', en: 'Key Notes on Roller Conveyor Bearing Usage' } },
  { date: '2022-12-22', title: { zh: '为什么食品传送带选择 PU 传送带？', en: 'Why Choose PU Conveyor Belts for Food?' } },
  { date: '2022-12-22', title: { zh: '链板输送机日常保养技巧', en: 'Daily Maintenance Tips for Slat Conveyors' } },
  { date: '2022-12-22', title: { zh: '皮带输送机安全保护装置介绍', en: 'Safety Protection Devices for Belt Conveyors' } },
  { date: '2022-12-22', title: { zh: '金属板链输送线怎么清洗', en: 'How to Clean Metal Slat Conveyor Lines' } },
]

export const newsArticleIds = [
  'roller-customization',
  'roller-bearing-notes',
  'why-pu-belt',
  'slat-maintenance',
  'belt-safety-devices',
  'metal-slat-cleaning',
]

export const stats = [
  { value: 20, suffix: '+', label: { zh: '年行业经验', en: 'Years of Experience' } },
  { value: 3000, suffix: '+', label: { zh: '成功案例', en: 'Projects Delivered' } },
  { value: 118, suffix: '', label: { zh: '覆盖城市', en: 'Cities Covered' } },
  { value: 23, suffix: '', label: { zh: '覆盖省份', en: 'Provinces Covered' } },
]

export const contacts = {
  phones: [
    { num: '151-6157-3181', who: { zh: '孙 闪', en: 'Sun Shan' } },
    { num: '153-6521-5320', who: { zh: '刘 梅', en: 'Liu Mei' } },
    { num: '153-6529-7658', who: { zh: '日语专线', en: 'Japanese Line' } },
  ],
  qq: '2836178166',
  address: {
    zh: '江苏省无锡市新吴区硕放中通路8号',
    en: 'No.8 Zhongtong Road, Shuofang, Xinwu District, Wuxi, Jiangsu, China',
  },
}

export const ui = {
  nav: {
    products: { zh: '产品中心', en: 'Products' },
    strengths: { zh: '核心优势', en: 'Strengths' },
    cases: { zh: '成功案例', en: 'Cases' },
    about: { zh: '关于tbseo', en: 'About' },
    news: { zh: 'tbseo资讯', en: 'News' },
    contact: { zh: '联系我们', en: 'Contact' },
  },
  hero: {
    kicker: { zh: '搜索引擎优化 · 数字营销', en: 'SEO Optimization · Digital Marketing' },
    titleA: { zh: '智能优化', en: 'Smart SEO,' },
    titleB: { zh: '驱动品牌增长', en: 'Driving Growth' },
    sub: {
      zh: '无锡tbseo网络科技有限公司 —— 专业从事搜索引擎优化与数字营销服务，传承专业SEO技术精髓，提供关键词优化、内容营销、外链建设一站式解决方案。',
      en: 'Wuxi Tbseo Network Technology Co., Ltd. — a professional SEO and digital marketing agency, delivering one-stop keyword optimization, content marketing, and link building solutions.',
    },
    cta1: { zh: '浏览产品中心', en: 'Explore Services' },
    cta2: { zh: '获取免费方案', en: 'Get a Free Proposal' },
    hotline: { zh: '24 小时服务热线', en: '24H Service Hotline' },
    panelTitle: { zh: 'SEO数据监控', en: 'SEO ANALYTICS MONITOR' },
    panelItems: [
      { k: { zh: '关键词排名', en: 'Keyword Rank' }, v: 'Top 3' },
      { k: { zh: '月流量增长', en: 'Traffic Growth' }, v: '+150%' },
      { k: { zh: '外链数量', en: 'Backlinks' }, v: '2,400+' },
      { k: { zh: '运行状态', en: 'Status' }, v: 'ONLINE' },
    ],
  },
  marquee: [
    { zh: '关键词优化', en: 'KEYWORD SEO' },
    { zh: '内容营销', en: 'CONTENT MARKETING' },
    { zh: '外链建设', en: 'LINK BUILDING' },
    { zh: '技术SEO', en: 'TECHNICAL SEO' },
    { zh: '数据分析', en: 'DATA ANALYTICS' },
    { zh: '品牌推广', en: 'BRAND PROMOTION' },
    { zh: '搜索引擎营销', en: 'SEARCH MARKETING' },
    { zh: '精准获客', en: 'TARGETED LEADS' },
  ],
  products: {
    kicker: { zh: '服务项目', en: 'SERVICES' },
    title: { zh: '全方位SEO服务体系', en: 'Full-Service SEO Solutions' },
    sub: {
      zh: '涵盖关键词优化、内容营销、外链建设、技术SEO、数据分析等核心服务，全部支持定制化方案',
      en: 'Keyword optimization, content marketing, link building, technical SEO, data analytics — all open to customized solutions',
    },
    all: { zh: '全部产品', en: 'All Products' },
    detail: { zh: '咨询此产品', en: 'Inquire' },
  },
  why: {
    kicker: { zh: '核心优势', en: 'WHY TBSEO' },
    title: { zh: 'tbseo · 值得您的选择', en: 'Why Choose tbseo' },
    items: [
      { title: { zh: '专业团队', en: 'Expert Team' }, desc: { zh: '深耕SEO领域二十年，3000+ 成功案例，服务遍及 23 省 118 城', en: '20 years in SEO, 3000+ projects across 118 cities in 23 provinces' } },
      { title: { zh: '定制方案', en: 'Custom Strategy' }, desc: { zh: '专业SEO技术团队，根据企业需求独立制定优化策略，满足个性化需求', en: 'Professional SEO team, independently crafting strategies to your requirements' } },
      { title: { zh: '数据驱动', en: 'Data-Driven' }, desc: { zh: '核心团队深耕搜索引擎优化 10 年以上，精准数据分析与效果追踪', en: 'Core team with 10+ years in SEO, precise data analysis and performance tracking' } },
      { title: { zh: '效果保障', en: 'Result Guaranteed' }, desc: { zh: '1 对 1 专业服务，24 小时在线响应，数据驱动的效果保障', en: '1-on-1 dedicated service, 24h response, data-driven result guarantee' } },
    ],
  },
  casesSec: {
    kicker: { zh: '成功案例', en: 'CASE STUDIES' },
    title: { zh: '3000+ 项目的实战验证', en: 'Proven in 3000+ Projects' },
    sub: {
      zh: '从电商零售到教育金融，从科技企业到传统行业，tbseo服务运行在全国各行各业的企业中',
      en: 'From e-commerce to education and finance, tech enterprises to traditional industries — tbseo services power businesses nationwide',
    },
  },
  about: {
    kicker: { zh: '关于tbseo', en: 'ABOUT TBSEO' },
    title: { zh: '专业SEO × 数字增长', en: 'Professional SEO × Digital Growth' },
    p1: { zh: '无锡tbseo网络科技有限公司是专业从事搜索引擎优化与数字营销服务的科技公司。公司的SEO技术团队、内容策略团队以及数据分析团队都在互联网营销领域深耕10年以上，深谙搜索引擎算法规则与最佳实践。', en: 'Wuxi Tbseo Network Technology Co., Ltd. specializes in search engine optimization and digital marketing services. Our SEO technical team, content strategy team and data analysis team each bring 10+ years of experience in internet marketing.' },
    p2: { zh: '公司秉承「客户至上」的经营理念，坚持以数据驱动增长、用诚信和共赢发展企业。选择tbseo，您将获得专业SEO技术、精准数据分析与贴心售后于一体的高品质服务。', en: 'Adhering to a customer-first philosophy, we win with data-driven growth, and grow through integrity and mutual success. Choosing tbseo means professional SEO technology, precise data analytics and thoughtful service.' },
    points: [
      { zh: '专业SEO标准', en: 'Professional SEO standards' },
      { zh: '10 年以上经验团队', en: 'Team with 10+ years of experience' },
      { zh: '数据驱动策略', en: 'Data-driven strategies' },
      { zh: '精准效果追踪', en: 'Precise performance tracking' },
    ],
  },
  newsSec: {
    kicker: { zh: 'tbseo资讯', en: 'INSIGHTS' },
    title: { zh: '技术分享与行业洞察', en: 'Technical Insights' },
    more: { zh: '阅读文章', en: 'Read Article' },
  },
  contact: {
    kicker: { zh: '联系我们', en: 'CONTACT' },
    title: { zh: '需要定制输送设备方案？', en: 'Need a Custom Conveying Solution?' },
    sub: {
      zh: '我们的技术团队将根据您的需求，提供从方案设计、设备制造到安装调试的一站式服务。',
      en: 'Our engineering team provides a one-stop service from solution design and manufacturing to installation and commissioning.',
    },
    form: {
      name: { zh: '您的称呼', en: 'Your Name' },
      phone: { zh: '联系电话', en: 'Phone Number' },
      need: { zh: '需求描述（如：食品厂皮带输送线，长度 20 米）', en: 'Describe your needs (e.g. 20m belt line for a food plant)' },
      submit: { zh: '提交需求', en: 'Submit Request' },
      success: { zh: '已收到您的需求，我们将尽快与您联系！', en: 'Request received. We will contact you shortly!' },
    },
    addrLabel: { zh: '公司地址', en: 'Address' },
    phoneLabel: { zh: '咨询热线', en: 'Hotlines' },
    qqLabel: { zh: '在线咨询 QQ', en: 'QQ Online Chat' },
  },
  footer: {
    desc: { zh: '专业从事搜索引擎优化与数字营销服务，提供数据驱动的SEO解决方案。', en: 'A professional SEO and digital marketing agency — delivering data-driven search optimization solutions.' },
    productTitle: { zh: '服务项目', en: 'Services' },
    contactTitle: { zh: '联系方式', en: 'Contact' },
    icp: '苏ICP备2022048827号',
    psb: '苏公网安备32021402003517号',
    rights: { zh: '无锡tbseo网络科技有限公司 版权所有', en: 'Wuxi Tbseo Network Technology Co., Ltd. All rights reserved.' },
  },
}

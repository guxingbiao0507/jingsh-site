export type Lang = 'zh' | 'en'

export interface Bi {
  zh: string
  en: string
}

export const nav = {
  home: { zh: '首页', en: 'Home' },
  news: { zh: '新闻资讯', en: 'News & Blogs' },
  contact: { zh: '联系我们', en: 'Contact Us' },
}

export const hero = {
  titleA: { zh: 'We know the law,', en: 'We know the law,' },
  titleB: { zh: "and we're on your side", en: "and we're on your side" },
  sub: {
    zh: '成立于 1994 年，经过 20 余年的稳健运营和规范化发展，京师律师事务所的影响力已辐射至全球范围。',
    en: 'Founded in 1994, after more than 20 years of steady operation and standardized development, the influence of Jingsh Law firm has radiated to the global scope.',
  },
}

export const heroHighlights = [
  {
    title: {
      zh: '北欧与欧洲国际法律服务',
      en: 'International Legal Services Across Nordic and Europe',
    },
    desc: {
      zh: '我们为企业与个人提供量身定制的跨境法律、税务与合规解决方案。',
      en: 'We support enterprises and individuals with practical legal, tax, and compliance solutions tailored to cross-border business scenarios.',
    },
  },
  {
    title: {
      zh: '投资与本地化一站式支持',
      en: 'One-Stop Support for Investment and Localization',
    },
    desc: {
      zh: '从公司设立到争议解决，JINGSH Nordic 为您在本地市场的长期发展提供高效支持。',
      en: 'From company setup to dispute resolution, JINGSH Nordic provides efficient support for your long-term development in local markets.',
    },
  },
]

export const about = {
  title: { zh: '关于我们', en: 'About Us' },
  paragraphs: [
    {
      zh: '京师律师事务所成立于 1994 年，已成长为中国领先的综合性律师事务所之一。律所在全球范围内运营近 100 家办公室，覆盖约 50 个国家和地区，覆盖中国主要城市及国际重要城市。',
      en: 'Jingsh Law Firm was established in 1994 and has grown into one of the leading full-service law firms in China. The firm operates nearly 100 offices across approximately 50 countries and regions, covering major cities both in China and internationally.',
    },
    {
      zh: '京师拥有超过 9,000 名律师。许多专业人士拥有法律高级学位，并持有注册会计师（CPA）、税务顾问和专利代理人等专业资质。',
      en: 'Jingsh has a team of over 9,000 lawyers. Many of its professionals hold advanced degrees in law and additional qualifications such as Certified Public Accountant (CPA), tax advisor, and patent agent credentials.',
    },
    {
      zh: '律所提供广泛的法律服务领域，涵盖公司与商业法、资本市场、金融服务、知识产权、建设工程与基础设施、劳动与雇佣、争议解决和监管合规等。',
      en: 'The firm provides comprehensive legal services across a wide range of practice areas, including corporate and commercial law, capital markets, financial services, intellectual property, construction and infrastructure, labor and employment, dispute resolution, and regulatory compliance.',
    },
    {
      zh: '凭借全球网络和多学科专业知识，京师致力于为客户提供高效、务实、优质的法律解决方案。',
      en: 'Leveraging its global network and multidisciplinary expertise, Jingsh is committed to delivering efficient, practical, and high-quality legal solutions to clients worldwide.',
    },
  ],
}

export const nordicPresence = {
  title: { zh: '北欧业务', en: 'Nordic Presence' },
  intro: {
    zh: '京师在北欧地区通过两家本地实体运营，提供综合法律与商业执行服务：',
    en: 'Jingsh operates in the Nordic region through two local entities, providing integrated legal and business execution services:',
  },
}

export const nordicOffices = [
  {
    flag: '🇫🇮',
    name: { zh: '京师芬兰', en: 'Jingsh Finland' },
    company: 'JINGSH Finance & Legal Nordic Oy',
    location: { zh: '芬兰赫尔辛基 | 成立于 2024', en: 'Helsinki, Finland | Established in 2024' },
    focus: {
      zh: '专注芬兰及北欧地区的市场进入与商务运营',
      en: 'Focused on market entry and business operations in Finland and the Nordics',
    },
    email: 'demi.wei@jingsh.fi',
    address: { zh: 'Fredrikinkatu 23 D 4, 00120, Helsinki', en: 'Fredrikinkatu 23 D 4, 00120, Helsinki' },
    label: { zh: '京师芬兰 / JINGSH Finland', en: 'Jingsh Finland / JINGSH Finland' },
  },
  {
    flag: '🇩🇰',
    name: { zh: '京师丹麦', en: 'Jingsh Denmark' },
    company: 'JINGSH Finance & Legal Denmark ApS',
    location: { zh: '丹麦哥本哈根 | 成立于 2025', en: 'Copenhagen, Denmark | Established in 2025' },
    focus: {
      zh: '支持北欧及欧盟跨境架构与运营',
      en: 'Supporting Nordic and EU cross-border structuring and operations',
    },
    email: 'demi.wei@jingsh.fi',
    address: { zh: 'Admiralgade 22, 1. tv, 1066 København K', en: 'Admiralgade 22, 1. tv, 1066 København K' },
    label: { zh: '京师丹麦 / JINGSH Denmark', en: 'Jingsh Denmark / JINGSH Denmark' },
  },
]

export const nordicCapabilities = {
  title: { zh: '北欧核心能力', en: 'Capabilities in the Nordics' },
  intro: {
    zh: '通过北欧办公室，京师为进入并在欧洲及北欧地区运营的企业提供一站式解决方案，包括：',
    en: 'Through its Nordic offices, Jingsh provides one-stop solutions for companies entering and operating in Europe and the Nordic region, including:',
  },
  items: [
    { zh: '市场进入策略与架构设计', en: 'Market entry strategy and structuring' },
    { zh: '公司注册与公司治理', en: 'Company incorporation and corporate governance' },
    { zh: '税务与 VAT 合规（含欧盟框架）', en: 'Tax and VAT compliance (including EU frameworks)' },
    { zh: '跨境雇佣与项目执行', en: 'Cross-border employment and project execution' },
    { zh: '并购与商业交易', en: 'Mergers & acquisitions and commercial transactions' },
    { zh: '争议解决与监管咨询', en: 'Dispute resolution and regulatory advisory' },
    { zh: '本地运营支持与持续合规', en: 'Local operational support and ongoing compliance' },
  ],
  closing: {
    zh: '通过结合法律专业与务实商业执行，京师支持客户从市场进入到长期运营的全生命周期。',
    en: 'By combining legal expertise with practical business execution, Jingsh supports clients throughout the entire lifecycle — from market entry to long-term operations.',
  },
}

export const features = [
  {
    title: { zh: '市场进入与公司设立', en: 'Market Entry & Company Setup' },
    items: {
      zh: '芬兰和丹麦公司注册\n子公司与分公司架构选择\n公司治理\n银行账户协助',
      en: 'Company incorporation in Finland & Denmark\nSubsidiary vs branch structuring\nCorporate governance\nBank account support',
    },
    sub: { zh: '北欧市场进入一站式服务', en: 'End-to-end setup for entering the Nordic market' },
  },
  {
    title: { zh: '税务、会计与合规', en: 'Tax, Accounting & Compliance' },
    items: {
      zh: 'VAT 及 EORI 注册\n欧盟合规税务架构规划\n会计与薪资管理\n持续合规服务',
      en: 'VAT & EORI registration\nTax structuring (EU compliant)\nAccounting & payroll\nOngoing compliance',
    },
    sub: { zh: '在欧洲合规运营', en: 'Stay compliant and operate smoothly in Europe' },
  },
  {
    title: { zh: '雇佣与商务运营', en: 'Employment & Business Operations' },
    items: {
      zh: '跨境雇佣与派驻\n本地招聘方案\n项目执行支持\n运营顾问服务',
      en: 'Cross-border employment / secondment\nLocal hiring solutions\nProject execution support\nOperational advisory',
    },
    sub: { zh: '支持本地业务落地', en: 'Support your real business operations on the ground' },
  },
]

export const newsItems = [
  {
    date: '2024-05-29',
    slug: 'jingsh-lawyer-received-invitation-for-the-fifth-bifp-in-russia',
    title: {
      zh: '京师律师受邀出席第五届俄罗斯贝加尔国际合作伙伴论坛',
      en: 'Jingsh Lawyer Received Invitation for the fifth BIFP in Russia',
    },
    desc: {
      zh: '2024年5月27日至29日，第五届贝加尔国际合作伙伴论坛（BIFP）在俄罗斯伊尔库茨克举行。京师律师温国彪，中俄商业服务部主任',
      en: 'From 27 to 29 May 2024, the fifth Baikal International Forum of Partners (shortened as BIFP) was held in Irkutsk, Russia. Jingsh Lawyer Wen Guobiao, the Director of the China-Russia Commercial Service',
    },
  },
  {
    date: '2024-04-18',
    slug: 'jingsh-korea-incorporated-officially-established-in-seoul-korea',
    title: {
      zh: '京师韩国正式成立 — 首尔注册获批',
      en: 'Jingsh Korea Incorporated Officially Established in Seoul, Korea',
    },
    desc: {
      zh: '2024年4月18日，首尔中央地方法院批准并颁发了京师韩国（注册号：110111-8920088）的注册证书。2024年5月24日，韩国国税厅',
      en: 'On April 18, 2024, the Seoul Central District Court approved and issued the registration certificate for Jingsh Korea (Registration No.: 110111-8920088). On May 24, 2024, the Korean National Tax Servi',
    },
  },
  {
    date: '2024-05-29',
    slug: 'governor-of-irkutsk-oblast-igor-kobzev-received-jingsh-lawyers',
    title: {
      zh: '伊尔库茨克州州长接见京师律师代表团',
      en: 'Governor of Irkutsk Oblast Igor Kobzev Received Jingsh Lawyers',
    },
    desc: {
      zh: '5月29日下午，俄罗斯伊尔库茨克州州长伊戈尔·伊万诺维奇·科布泽夫亲切接见了由温国彪主任率领的京师中俄法律与商业服务代表团',
      en: 'On the afternoon of May 29th, Igor Ivanovich Kobzev, the Governor of Irkutsk Oblast, Russia, warmly received a delegation led by Wen Guobiao, the Director of the China-Russia Legal and Commercial Serv',
    },
  },
]

export const contact = {
  kicker: { zh: '联系', en: 'Contact' },
  title: { zh: '联系我们', en: 'Contact Us' },
}

export const footer = {
  infoTitle: { zh: '信息', en: 'Information' },
  rights: {
    zh: 'Copyright ©1994-2025 JINGSH LAW FIRM ALL RIGHTS RESERVED.',
    en: 'Copyright ©1994-2025 JINGSH LAW FIRM ALL RIGHTS RESERVED.',
  },
}

/** Used by nuxtcms cases pages (build compatibility). */
export const stats = [
  { value: '9000', suffix: '+', label: { zh: '执业律师', en: 'Lawyers' } },
  { value: '50', suffix: '+', label: { zh: '国家与地区', en: 'Countries & Regions' } },
  { value: '100', suffix: '+', label: { zh: '全球办公室', en: 'Global Offices' } },
  { value: '30', suffix: '+', label: { zh: '年专业经验', en: 'Years of Experience' } },
]

export type RoutePath =
  | '/'
  | '/products'
  | '/accessories'
  | '/spring-cage-connection'
  | '/screw-connection'
  | '/screw-support'
  | '/bolt-connection'
  | '/nut-connection'
  | '/pcb-terminal-blocks'
  | '/pcb-connectors'
  | '/barrier-terminal-blocks'
  | '/quality'
  | '/about'
  | '/contact'
  | '/quote'
  | `/model/${string}`;

export interface ProductSku {
  model: string;
  name: string;
  connectionType: string;
  wireRangeIec: string;
  wireRangeUl?: string;
  currentRating: string;
  voltageRating: string;
  widthOrPitch?: string;
  torqueOrStrip?: string;
  mounting: string;
  approvals: string[];
  image?: string;
}

export interface ProductCategory {
  id: string;
  indexNumber: string;
  slug: RoutePath;
  seriesCode: string;
  title: string;
  shortTitle: string;
  classification: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  wireRangeSummary: string;
  currentMaxSummary: string;
  voltageMaxSummary: string;
  railCompatibility: string;
  principleTitle: string;
  principleSummary: string;
  principlePoints: { title: string; detail: string }[];
  steps?: { step: number; title: string; detail: string }[];
  faqs: { question: string; answer: string }[];
  skus: ProductSku[];
}

export interface AccessoryItem {
  id: string;
  series: string;
  title: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
  specs: { label: string; value: string }[];
}

export interface ApplicationSector {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  image: string;
  imageAlt: string;
  demands: string[];
  recommendedSeries: { label: string; series: string; route: RoutePath }[];
}

export interface CertificationItem {
  id: string;
  code: string;
  verification: string;
  title: string;
  description: string;
  scope: string;
}

export interface TestingProtocolItem {
  title: string;
  detail: string;
}

export interface WhyChoosePillar {
  number: string;
  title: string;
  description: string;
}

export interface HeroMetric {
  label: string;
  value: string;
  unit: string;
}

export const CONTACT_INFO = {
  email: 'sales@termicore.com',
  phone: '+91 20 6724 8900',
  location: 'Pune Industrial Estate, Maharashtra, India',
};

export const IMAGES = {
  logo: 'images/termicore_logo_1794579091329.jpg',
  heroDinRail: 'images/hero_din_rail_blocks_1794553738491.jpg',
  controlCabinet: 'images/app_control_cabinet_1794553742856.jpg',
  springCage: 'images/prod_spring_cage_1794553739589.jpg',
  screwClamp: 'images/prod_screw_clamp_1794553739965.jpg',
  boltPower: 'images/prod_bolt_power_1794553740772.jpg',
  nutDistribution: 'images/prod_nut_distribution_1794553741438.jpg',
  pcbTerminalBlocks: 'images/prod_pcb_terminal_blocks_1794843509272.jpg',
  pcbConnectors: 'images/prod_pcb_connectors_1794843510259.jpg',
  barrierTerminalBlocks: 'images/prod_barrier_terminal_blocks_1795016866027.jpg',
  skuDisconnect: 'images/sku_disconnect_test_1794644117370.jpg',
  skuDoubleLevel: 'images/sku_double_level_1794644116021.jpg',
  skuEarthGround: 'images/sku_earth_ground_1794644115840.jpg',
  skuFuseHolder: 'images/sku_fuse_holder_1794644117399.jpg',
  skuHeavyBusbar: 'images/sku_heavy_busbar_1794644117814.jpg',
  skuHighPowerUnbranded: 'images/sku_high_power_unbranded_1794644336758.jpg',
  skuMiniMicro: 'images/sku_mini_micro_block_1794644315264.jpg',
  skuMultiConductor: 'images/sku_multi_conductor_block_1794644315558.jpg',
  skuMultiOutlet: 'images/sku_multi_outlet_1794644118792.jpg',
  skuPcbFlangedPlug: 'images/sku_pcb_flanged_plug_1794843510532.jpg',
  skuPcbHighCurrent: 'images/sku_pcb_high_current_1794843933475.jpg',
  skuPcbLeverBlock: 'images/sku_pcb_lever_block_1794843933022.jpg',
  skuPcbPushIn: 'images/sku_pcb_push_in_1794843509680.jpg',
};

export interface ProductNavSubItem {
  label: string;
  specTag?: string;
  route: RoutePath;
  filter?: {
    typeFilter?: string;
    processFilter?: 'All' | 'tht' | 'thr' | 'plug';
    accessoryCategory?: string;
  };
}

export interface ProductNavGroup {
  id: 'pcb' | 'din-rail' | 'barrier';
  title: string;
  seriesBadge: string;
  summary: string;
  image: string;
  imageAlt: string;
  route: RoutePath;
  items: ProductNavSubItem[];
}

export const PRODUCT_NAV_GROUPS: ProductNavGroup[] = [
  {
    id: 'pcb',
    title: 'PCB Terminal Blocks',
    seriesBadge: 'TPC · TPS · TPL',
    summary: 'Board-to-wire solder clamps & plugs (2.54–15 mm)',
    image: IMAGES.pcbTerminalBlocks,
    imageAlt: 'TermiCore PCB terminal blocks mounted on industrial circuit board',
    route: '/pcb-terminal-blocks',
    items: [
      { label: 'Direct-Solder PCB Clamps', specTag: 'TPC / TPS', route: '/pcb-terminal-blocks', filter: { typeFilter: 'All' } },
      { label: 'Pluggable Wire-to-Board Plugs', specTag: 'TPL', route: '/pcb-connectors', filter: { typeFilter: 'Flanged Plug' } },
      { label: 'Reflow Pin Headers & Sockets', specTag: 'THR / THT', route: '/pcb-connectors', filter: { typeFilter: 'THR Reflow Header' } },
      { label: 'Automated SMT Tape-on-Reel', specTag: '260°C LCP', route: '/pcb-terminal-blocks', filter: { processFilter: 'thr' } },
      { label: 'Transformer & Coil Terminals', specTag: 'High Creepage', route: '/pcb-terminal-blocks', filter: { typeFilter: 'Transformer Terminal' } },
      { label: 'Panel Bulkhead Feed-Through', specTag: 'Through-Wall', route: '/pcb-terminal-blocks', filter: { typeFilter: 'Panel Feed-Through' } },
      { label: 'Multi-Level & Specialty Pitches', specTag: '45° / Dual', route: '/pcb-terminal-blocks', filter: { typeFilter: 'Special Type' } },
    ],
  },
  {
    id: 'din-rail',
    title: 'DIN Rail Terminal Blocks',
    seriesBadge: 'TSC · TSC-R · TSS · TBC · TNC',
    summary: 'TS 35 & G 32 control, metering & feeders up to 300 A',
    image: IMAGES.screwClamp,
    imageAlt: 'TermiCore DIN-rail screw clamp terminal block cutaway on TS 35 rail',
    route: '/products',
    items: [
      { label: 'Spring Cage Connection', specTag: 'TSC', route: '/spring-cage-connection' },
      { label: 'Screw Clamp Connection', specTag: 'TSC-R', route: '/screw-connection' },
      { label: 'Spring Support Connection', specTag: 'TSS', route: '/screw-support' },
      { label: 'Bolt Connection', specTag: 'TBC / TBH', route: '/bolt-connection' },
      { label: '1-Nut Distribution', specTag: 'TNC / TNO', route: '/nut-connection' },
    ],
  },
  {
    id: 'barrier',
    title: 'Barrier Terminal Blocks',
    seriesBadge: 'TBB · TBD',
    summary: 'Insulated barrier strips for fork/ring lugs & panels',
    image: IMAGES.barrierTerminalBlocks,
    imageAlt: 'TermiCore black PA 6.6 barrier terminal strip with brass captive screws',
    route: '/barrier-terminal-blocks',
    items: [
      { label: 'Single-Tier Barrier Strips', specTag: 'TBB-SR', route: '/barrier-terminal-blocks', filter: { typeFilter: 'Single-Tier' } },
      { label: 'Dual-Tier High-Density Strips', specTag: 'TBD-BL', route: '/barrier-terminal-blocks', filter: { typeFilter: 'Dual-Tier' } },
      { label: 'Detachable Pluggable Strips', specTag: 'TBB-PL', route: '/barrier-terminal-blocks', filter: { typeFilter: 'Pluggable' } },
      { label: 'Through-Wall Panel Blocks', specTag: 'TBB-FT', route: '/barrier-terminal-blocks', filter: { typeFilter: 'Through-Wall' } },
      { label: 'Chassis Flange-Mount Blocks', specTag: 'TBB-PM', route: '/barrier-terminal-blocks', filter: { typeFilter: 'Chassis Flange' } },
      { label: 'Heavy-Duty Lug Terminals', specTag: 'TBB-WT', route: '/barrier-terminal-blocks', filter: { typeFilter: 'High-Current Lug' } },
      { label: 'Safety Covers & Mounting Hardware', specTag: 'Add-Ons', route: '/accessories' },
    ],
  },
];

export function resolveAssetUrl(src: string): string {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  const metaEnv = (import.meta as unknown as { env?: { BASE_URL?: string } }).env;
  const base = metaEnv?.BASE_URL ?? '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const cleanSrc = src.replace(/^\/+/, '');
  return `${normalizedBase}${cleanSrc}`;
}

export const HERO_METRICS: HeroMetric[] = [
  { label: 'Max Voltage', value: '1000 V', unit: 'IEC 60947-7-1' },
  { label: 'Max Current', value: '300 A', unit: 'Up to 120 mm²' },
  { label: 'Catalog Models', value: '70+', unit: '8 Product Series' },
  { label: 'Flame Rating', value: '94 V-0', unit: 'UL 94 · PA 6.6' },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'spring-cage',
    indexNumber: '01',
    slug: '/spring-cage-connection',
    seriesCode: 'TSC',
    title: 'Spring Cage Connection',
    shortTitle: 'Spring Cage',
    classification: 'DIN Rail · Spring',
    tagline: 'Vibration-proof stainless steel spring clamp blocks for rapid, maintenance-free wiring.',
    description:
      'Engineered with corrosion-resistant CrNi stainless steel leaf springs and electrolytic copper current bars, the TSC Spring Cage series delivers constant contact force across thermal expansion and mechanical shock without periodic re-tightening.',
    image: IMAGES.springCage,
    imageAlt: 'TermiCore TSC Spring Cage DIN-rail terminal blocks',
    wireRangeSummary: '0.2 – 16 mm²',
    currentMaxSummary: '76 A',
    voltageMaxSummary: '800 V',
    railCompatibility: 'TS 35 DIN Rail',
    principleTitle: 'Constant-Force Stainless Steel Spring Cage',
    principleSummary:
      'Unlike rigid screw joints that can relax when copper strands settle, the TSC spring clamp continuously compensates for conductor creep and panel vibration.',
    principlePoints: [
      {
        title: 'Gas-Tight Contact Zone',
        detail: 'High-pressure spring edges cut through surface oxides on copper conductors for stable millivolt drop.',
      },
      {
        title: 'Zero Re-Torquing Required',
        detail: 'Maintains rated pull-out force after thermal cycling, railway shock, and heavy machinery vibration.',
      },
      {
        title: 'Front-Entry Ergonomics',
        detail: 'Top-facing actuator and wire entry ports save cabinet depth and speed up harness termination.',
      },
    ],
    steps: [
      {
        step: 1,
        title: 'Open Clamp',
        detail: 'Insert a standard 3.5 mm flat screwdriver into the rectangular actuator slot.',
      },
      {
        step: 2,
        title: 'Insert Conductor',
        detail: 'Push the stripped solid or ferruled wire cleanly into the round clamping port.',
      },
      {
        step: 3,
        title: 'Release & Lock',
        detail: 'Withdraw the tool; the CrNi spring automatically locks the wire against the copper busbar.',
      },
    ],
    faqs: [
      {
        question: 'Can TSC spring cage blocks accept stranded wire without ferrules?',
        answer:
          'Yes. Opening the spring slot with a screwdriver allows both flexible stranded conductors and ferruled wires to be clamped without strand splay.',
      },
      {
        question: 'Are TSC blocks compatible with standard TS 35 DIN rails?',
        answer:
          'All TSC series blocks snap directly onto both TS 35 x 7.5 mm and TS 35 x 15 mm symmetrical top-hat DIN rails.',
      },
    ],
    skus: [
      {
        model: 'TSC 2.5',
        name: 'TSC 2.5 Feed-Through Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '800 V',
        widthOrPitch: '5.2 mm',
        torqueOrStrip: '10 mm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.springCage,
      },
      {
        model: 'TSC 4',
        name: 'TSC 4 Feed-Through Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.2 - 4.0 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: '32 A',
        voltageRating: '800 V',
        widthOrPitch: '6.2 mm',
        torqueOrStrip: '10 mm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.springCage,
      },
      {
        model: 'TSC 6',
        name: 'TSC 6 Feed-Through Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.5 - 6.0 mm²',
        wireRangeUl: '20 - 8 AWG',
        currentRating: '41 A',
        voltageRating: '800 V',
        widthOrPitch: '8.2 mm',
        torqueOrStrip: '12 mm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.springCage,
      },
      {
        model: 'TSC 10',
        name: 'TSC 10 Power Feed-Through',
        connectionType: 'Feed-Through',
        wireRangeIec: '1.5 - 10 mm²',
        wireRangeUl: '16 - 6 AWG',
        currentRating: '57 A',
        voltageRating: '800 V',
        widthOrPitch: '10.2 mm',
        torqueOrStrip: '18 mm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.springCage,
      },
      {
        model: 'TSC 16',
        name: 'TSC 16 Heavy Feed-Through',
        connectionType: 'Feed-Through',
        wireRangeIec: '2.5 - 16 mm²',
        wireRangeUl: '14 - 4 AWG',
        currentRating: '76 A',
        voltageRating: '800 V',
        widthOrPitch: '12.2 mm',
        torqueOrStrip: '18 mm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.springCage,
      },
      {
        model: 'TSC 2.5-3L',
        name: 'TSC 2.5 Multi-Conductor 3-Wire',
        connectionType: 'Multi-Conductor',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '800 V',
        widthOrPitch: '5.2 mm',
        torqueOrStrip: '10 mm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE'],
        image: IMAGES.skuMultiConductor,
      },
      {
        model: 'TSC 2.5-4L',
        name: 'TSC 2.5 Multi-Conductor 4-Wire',
        connectionType: 'Multi-Conductor',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '800 V',
        widthOrPitch: '5.2 mm',
        torqueOrStrip: '10 mm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE'],
        image: IMAGES.skuMultiConductor,
      },
      {
        model: 'TSC 2.5-D',
        name: 'TSC 2.5 Double-Level Block',
        connectionType: 'Double Level',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '22 A',
        voltageRating: '500 V',
        widthOrPitch: '5.2 mm',
        torqueOrStrip: '10 mm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE'],
        image: IMAGES.skuDoubleLevel,
      },
      {
        model: 'TSC 4-PE',
        name: 'TSC 4 Earth / Ground Block',
        connectionType: 'Earth / Ground',
        wireRangeIec: '0.2 - 4.0 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: 'PE Ground',
        voltageRating: '800 V',
        widthOrPitch: '6.2 mm',
        torqueOrStrip: '10 mm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-2', 'CE'],
        image: IMAGES.skuEarthGround,
      },
      {
        model: 'TSC 2.5-MT',
        name: 'TSC 2.5 Knife Disconnect & Test',
        connectionType: 'Disconnect & Test',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '20 A',
        voltageRating: '400 V',
        widthOrPitch: '5.2 mm',
        torqueOrStrip: '10 mm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE'],
        image: IMAGES.skuDisconnect,
      },
      {
        model: 'TSC 4-FS',
        name: 'TSC 4 Fuse Holder Block',
        connectionType: 'Fuse Holder',
        wireRangeIec: '0.2 - 4.0 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: '6.3 A',
        voltageRating: '500 V',
        widthOrPitch: '8.2 mm',
        torqueOrStrip: '10 mm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-3', 'CE'],
        image: IMAGES.skuFuseHolder,
      },
      {
        model: 'TSC 1.5-M',
        name: 'TSC 1.5 Mini / Micro Block',
        connectionType: 'Mini / Micro',
        wireRangeIec: '0.14 - 1.5 mm²',
        wireRangeUl: '26 - 14 AWG',
        currentRating: '17.5 A',
        voltageRating: '500 V',
        widthOrPitch: '4.2 mm',
        torqueOrStrip: '8 mm',
        mounting: 'TS 15 / TS 35',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE'],
        image: IMAGES.skuMiniMicro,
      },
      {
        model: 'TPI 2.5',
        name: 'TPI 2.5 Push-In DIN Rail Block',
        connectionType: 'Push-In Design',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '800 V',
        widthOrPitch: '5.2 mm',
        torqueOrStrip: '10 mm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.springCage,
      },
      {
        model: 'TPI 4',
        name: 'TPI 4 Push-In DIN Rail Block',
        connectionType: 'Push-In Design',
        wireRangeIec: '0.2 - 4.0 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: '32 A',
        voltageRating: '800 V',
        widthOrPitch: '6.2 mm',
        torqueOrStrip: '12 mm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.springCage,
      },
    ],
  },
  {
    id: 'screw-connection',
    indexNumber: '02',
    slug: '/screw-connection',
    seriesCode: 'TSC-R',
    title: 'Screw Clamp Connection',
    shortTitle: 'Screw Clamp',
    classification: 'DIN Rail · Screw',
    tagline: 'Universal rising-cage screw clamp terminal blocks with Reakdyn anti-loosening locking.',
    description:
      'The TSC-R Screw Clamp series combines high-torque steel clamping yokes with an integrated Reakdyn anti-vibration slot, ensuring permanent clamping integrity from 0.2 mm² PLC signals to 35 mm² motor feeders.',
    image: IMAGES.screwClamp,
    imageAlt: 'TermiCore TSC-R Screw Clamp DIN-rail terminal blocks',
    wireRangeSummary: '0.2 – 35 mm²',
    currentMaxSummary: '125 A',
    voltageMaxSummary: '1000 V',
    railCompatibility: 'TS 35 / G 32',
    principleTitle: 'Reakdyn Anti-Loosening Clamping Yoke',
    principleSummary:
      'As the steel terminal screw is tightened, the split clamping yoke deforms elastically, locking the screw threads against backing out under thermal or mechanical vibration.',
    principlePoints: [
      {
        title: 'Dual Cross-Bridging Channels',
        detail: 'Center jumper shafts accept insulated screw or plug-in bridges for fast common busing.',
      },
      {
        title: 'Multi-Conductor Capacity',
        detail: 'Wide funnel-shaped wire entry accommodates two equal-gauge conductors cleanly.',
      },
      {
        title: 'Universal Rail Foot',
        detail: 'Precision molded PA 6.6 housing latches onto both TS 35 and G 32 mounting rails.',
      },
    ],
    steps: [
      {
        step: 1,
        title: 'Strip & Prepare',
        detail: 'Strip conductor insulation cleanly to the specified length without nicking strands.',
      },
      {
        step: 2,
        title: 'Seat in Yoke',
        detail: 'Insert the wire completely into the open rectangular steel clamping yoke.',
      },
      {
        step: 3,
        title: 'Torque Screw',
        detail: 'Tighten to the rated torque so the Reakdyn collar engages and locks the joint.',
      },
    ],
    faqs: [
      {
        question: 'What is the Reakdyn principle in TSC-R terminals?',
        answer:
          'Reakdyn is a captive spring-action effect inside the threaded yoke collar that creates continuous friction against the screw thread, preventing loosening during thermal cycling.',
      },
      {
        question: 'Can I mount TSC-R blocks on G 32 asymmetrical rails?',
        answer:
          'Yes, the universal foot profile on TSC-R models fits both symmetrical TS 35 and asymmetrical G 32 DIN rails.',
      },
    ],
    skus: [
      {
        model: 'TSC-R 2.5',
        name: 'TSC-R 2.5 Universal Screw Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '800 V',
        widthOrPitch: '5.2 mm',
        torqueOrStrip: '0.4 - 0.5 Nm',
        mounting: 'TS 35 / G 32 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.screwClamp,
      },
      {
        model: 'TSC-R 4',
        name: 'TSC-R 4 Universal Screw Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.2 - 4.0 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: '32 A',
        voltageRating: '800 V',
        widthOrPitch: '6.2 mm',
        torqueOrStrip: '0.5 - 0.6 Nm',
        mounting: 'TS 35 / G 32 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.screwClamp,
      },
      {
        model: 'TSC-R 6',
        name: 'TSC-R 6 Universal Screw Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.5 - 6.0 mm²',
        wireRangeUl: '20 - 8 AWG',
        currentRating: '41 A',
        voltageRating: '1000 V',
        widthOrPitch: '8.2 mm',
        torqueOrStrip: '0.8 - 1.0 Nm',
        mounting: 'TS 35 / G 32 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.screwClamp,
      },
      {
        model: 'TSC-R 10',
        name: 'TSC-R 10 Power Screw Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '1.5 - 10 mm²',
        wireRangeUl: '16 - 6 AWG',
        currentRating: '57 A',
        voltageRating: '1000 V',
        widthOrPitch: '10.2 mm',
        torqueOrStrip: '1.2 - 1.5 Nm',
        mounting: 'TS 35 / G 32 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.screwClamp,
      },
      {
        model: 'TSC-R 16',
        name: 'TSC-R 16 High-Capacity Screw Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '2.5 - 16 mm²',
        wireRangeUl: '14 - 4 AWG',
        currentRating: '76 A',
        voltageRating: '1000 V',
        widthOrPitch: '12.2 mm',
        torqueOrStrip: '1.8 - 2.0 Nm',
        mounting: 'TS 35 / G 32 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.screwClamp,
      },
      {
        model: 'TSC-R 35',
        name: 'TSC-R 35 Main Feeder Screw Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '6.0 - 35 mm²',
        wireRangeUl: '10 - 2 AWG',
        currentRating: '125 A',
        voltageRating: '1000 V',
        widthOrPitch: '16.0 mm',
        torqueOrStrip: '3.2 - 3.7 Nm',
        mounting: 'TS 35 / G 32 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.skuHighPowerUnbranded,
      },
      {
        model: 'TSC-R 4-D',
        name: 'TSC-R 4 Double-Level Screw Block',
        connectionType: 'Double Level',
        wireRangeIec: '0.2 - 4.0 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: '30 A',
        voltageRating: '500 V',
        widthOrPitch: '6.2 mm',
        torqueOrStrip: '0.5 - 0.6 Nm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE'],
        image: IMAGES.skuDoubleLevel,
      },
      {
        model: 'TSC-R 4-PE',
        name: 'TSC-R 4 Earth / Ground Screw Block',
        connectionType: 'Earth / Ground',
        wireRangeIec: '0.2 - 4.0 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: 'PE Ground',
        voltageRating: '800 V',
        widthOrPitch: '6.2 mm',
        torqueOrStrip: '0.5 - 0.6 Nm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-2', 'CE'],
        image: IMAGES.skuEarthGround,
      },
      {
        model: 'TSC-R 4-FS',
        name: 'TSC-R 4 Fuse Holder Screw Block',
        connectionType: 'Fuse Holder',
        wireRangeIec: '0.2 - 4.0 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: '6.3 A',
        voltageRating: '500 V',
        widthOrPitch: '8.2 mm',
        torqueOrStrip: '0.5 - 0.6 Nm',
        mounting: 'TS 35 DIN Rail',
        approvals: ['UL 1059', 'IEC 60947-7-3', 'CE'],
        image: IMAGES.skuFuseHolder,
      },
    ],
  },
  {
    id: 'screw-support',
    indexNumber: '03',
    slug: '/screw-support',
    seriesCode: 'TSS',
    title: 'Spring Support Connection',
    shortTitle: 'Spring Support',
    classification: 'DIN Rail · Metering',
    tagline: 'Spring-backed screw terminals & slide-disconnect blocks for CT/PT metering and relay protection.',
    description:
      'The TSS Spring Support series pairs captive screw clamping with internal spring-loaded pressure plates and longitudinal disconnect sliders, ideal for current transformer (CT) secondary loops, voltage transformers, and high-vibration switchgear panels.',
    image: IMAGES.skuDisconnect,
    imageAlt: 'TermiCore TSS Spring Support and CT/PT disconnect terminal blocks',
    wireRangeSummary: '0.2 – 10 mm²',
    currentMaxSummary: '57 A',
    voltageMaxSummary: '800 V',
    railCompatibility: 'TS 35 / G 32',
    principleTitle: 'Spring-Supported Screw & Slide Disconnect',
    principleSummary:
      'A pre-tensioned spring leaf under the screw saddle keeps steady axial pressure on the conductor while integrated test sockets allow safe current-transformer shorting prior to calibration.',
    principlePoints: [
      {
        title: 'CT Short-Circuiting Capability',
        detail: 'Cross-switching bridge slots let technicians short CT secondaries before opening the circuit.',
      },
      {
        title: 'Anti-Vibration Leaf Support',
        detail: 'Dual mechanical retention resists shock in substations and turbine control cabinets.',
      },
      {
        title: '4 mm Test Socket Ports',
        detail: 'Integrated test receptacles accept insulated 4 mm banana plugs for live multimeter checks.',
      },
    ],
    steps: [
      {
        step: 1,
        title: 'Engage Shorting Bridge',
        detail: 'Close the adjacent CT shorting jumper if isolating an active current transformer.',
      },
      {
        step: 2,
        title: 'Open Longitudinal Slider',
        detail: 'Loosen the captive orange slider screw and slide the copper link to open.',
      },
      {
        step: 3,
        title: 'Probe & Verify',
        detail: 'Insert 4 mm test plugs directly into the top test sockets for instrument calibration.',
      },
    ],
    faqs: [
      {
        question: 'Why use TSS blocks for CT and PT circuits?',
        answer:
          'TSS 6-TD and TSS 6-SC blocks include a visible longitudinal disconnect link and 4 mm test sockets so protection engineers can isolate and test relays safely without unbolting field wires.',
      },
    ],
    skus: [
      {
        model: 'TSS 2.5',
        name: 'TSS 2.5 Spring-Support Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '800 V',
        widthOrPitch: '5.2 mm',
        torqueOrStrip: '0.5 Nm · Spring',
        mounting: 'TS 35 / G 32 Rail',
        approvals: ['IEC 60947-7-1', 'UL 1059', 'CE'],
        image: IMAGES.screwClamp,
      },
      {
        model: 'TSS 4',
        name: 'TSS 4 Spring-Support Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.2 - 4.0 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: '32 A',
        voltageRating: '800 V',
        widthOrPitch: '6.2 mm',
        torqueOrStrip: '0.6 Nm · Spring',
        mounting: 'TS 35 / G 32 Rail',
        approvals: ['IEC 60947-7-1', 'UL 1059', 'CE'],
        image: IMAGES.screwClamp,
      },
      {
        model: 'TSS 6',
        name: 'TSS 6 CT/PT Metering Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.5 - 6.0 mm²',
        wireRangeUl: '20 - 8 AWG',
        currentRating: '41 A',
        voltageRating: '800 V',
        widthOrPitch: '8.2 mm',
        torqueOrStrip: '1.0 Nm · Spring',
        mounting: 'TS 35 / G 32 Rail',
        approvals: ['IEC 60947-7-1', 'UL 1059', 'CE'],
        image: IMAGES.skuDisconnect,
      },
      {
        model: 'TSS 6-TD',
        name: 'TSS 6 Slide Disconnect & Test Block',
        connectionType: 'Disconnect & Test',
        wireRangeIec: '0.5 - 6.0 mm²',
        wireRangeUl: '20 - 8 AWG',
        currentRating: '41 A',
        voltageRating: '500 V',
        widthOrPitch: '8.2 mm',
        torqueOrStrip: '1.0 Nm · 4 mm Test',
        mounting: 'TS 35 DIN Rail',
        approvals: ['IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.skuDisconnect,
      },
      {
        model: 'TSS 6-SC',
        name: 'TSS 6 Short-Circuiting Test Block',
        connectionType: 'Disconnect & Test',
        wireRangeIec: '0.5 - 10 mm²',
        wireRangeUl: '20 - 6 AWG',
        currentRating: '57 A',
        voltageRating: '500 V',
        widthOrPitch: '8.2 mm',
        torqueOrStrip: '1.2 Nm · CT Short',
        mounting: 'TS 35 DIN Rail',
        approvals: ['IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.skuDisconnect,
      },
      {
        model: 'TSS 4-PE',
        name: 'TSS 4 Earth / Ground Block',
        connectionType: 'Earth / Ground',
        wireRangeIec: '0.2 - 4.0 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: 'PE Ground',
        voltageRating: '800 V',
        widthOrPitch: '6.2 mm',
        torqueOrStrip: '0.6 Nm · Spring',
        mounting: 'TS 35 DIN Rail',
        approvals: ['IEC 60947-7-2', 'CE'],
        image: IMAGES.skuEarthGround,
      },
    ],
  },
  {
    id: 'bolt-connection',
    indexNumber: '04',
    slug: '/bolt-connection',
    seriesCode: 'TBC / TBH',
    title: 'Bolt Connection',
    shortTitle: 'Bolt Stud',
    classification: 'DIN Rail · High Power',
    tagline: 'Heavy-duty threaded stud terminal blocks up to 300 A for ring-lug power feeders.',
    description:
      'Designed for high-current main incoming feeders, transformer terminations, and switchgear busbars, TBC and TBH stud blocks clamp crimped ring and fork lugs directly onto solid copper current bars with captive nuts and hinged IP20 safety shrouds.',
    image: IMAGES.boltPower,
    imageAlt: 'TermiCore TBC Bolt Stud high-power DIN-rail terminal blocks',
    wireRangeSummary: '6.0 – 120 mm²',
    currentMaxSummary: '300 A',
    voltageMaxSummary: '1000 V',
    railCompatibility: 'TS 35 / Panel',
    principleTitle: 'Direct Stud-to-Busbar Lug Compression',
    principleSummary:
      'Crimped copper cable lugs are bolted directly against an electrolytic copper current bar via M6, M8, M10, or M12 threaded studs and serrated locking washers.',
    principlePoints: [
      {
        title: 'IP20 Hinged Protective Covers',
        detail: 'TBH models feature snap-shut transparent covers with integrated marking and probe ports.',
      },
      {
        title: 'Multi-Lug Stacking',
        detail: 'Accommodates up to two ring lugs per stud side for compact feeder looping.',
      },
      {
        title: '1000 V Insulation Clearance',
        detail: 'Extended side partitions maintain full IEC 60947-7-1 creepage distances at high current.',
      },
    ],
    steps: [
      {
        step: 1,
        title: 'Crimp Cable Lug',
        detail: 'Terminate the feeder cable into a tinned copper ring or fork lug.',
      },
      {
        step: 2,
        title: 'Seat on Stud',
        detail: 'Open the protective shroud and place the lug onto the threaded copper/steel stud.',
      },
      {
        step: 3,
        title: 'Torque & Close Hood',
        detail: 'Tighten the captive hex nut to rated Nm torque and snap the IP20 cover closed.',
      },
    ],
    faqs: [
      {
        question: 'What is the difference between TBC and TBH bolt terminals?',
        answer:
          'TBC uses open-access stud housings with optional snap-on covers, while TBH integrates a permanent hinged transparent protective hood that cannot be misplaced during field maintenance.',
      },
    ],
    skus: [
      {
        model: 'TBC 35',
        name: 'TBC 35 Stud Terminal Block',
        connectionType: 'Stud Terminal',
        wireRangeIec: '6.0 - 35 mm²',
        wireRangeUl: '10 - 2 AWG',
        currentRating: '125 A',
        voltageRating: '1000 V',
        widthOrPitch: '22.0 mm',
        torqueOrStrip: '3.0 Nm (M6)',
        mounting: 'TS 35 DIN Rail',
        approvals: ['IEC 60947-7-1', 'UL 1059', 'CE', 'RoHS'],
        image: IMAGES.boltPower,
      },
      {
        model: 'TBC 50',
        name: 'TBC 50 Stud Terminal Block',
        connectionType: 'Stud Terminal',
        wireRangeIec: '10 - 50 mm²',
        wireRangeUl: '8 - 1/0 AWG',
        currentRating: '150 A',
        voltageRating: '1000 V',
        widthOrPitch: '26.0 mm',
        torqueOrStrip: '6.0 Nm (M8)',
        mounting: 'TS 35 DIN Rail',
        approvals: ['IEC 60947-7-1', 'UL 1059', 'CE', 'RoHS'],
        image: IMAGES.boltPower,
      },
      {
        model: 'TBC 70',
        name: 'TBC 70 Stud Terminal Block',
        connectionType: 'Stud Terminal',
        wireRangeIec: '16 - 70 mm²',
        wireRangeUl: '6 - 2/0 AWG',
        currentRating: '192 A',
        voltageRating: '1000 V',
        widthOrPitch: '32.0 mm',
        torqueOrStrip: '10.0 Nm (M8)',
        mounting: 'TS 35 DIN Rail',
        approvals: ['IEC 60947-7-1', 'UL 1059', 'CE', 'RoHS'],
        image: IMAGES.skuHeavyBusbar,
      },
      {
        model: 'TBC 95',
        name: 'TBC 95 Heavy Busbar Stud Block',
        connectionType: 'Stud Terminal',
        wireRangeIec: '25 - 95 mm²',
        wireRangeUl: '4 - 3/0 AWG',
        currentRating: '232 A',
        voltageRating: '1000 V',
        widthOrPitch: '38.0 mm',
        torqueOrStrip: '14.0 Nm (M10)',
        mounting: 'TS 35 / Panel Mount',
        approvals: ['IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.skuHeavyBusbar,
      },
      {
        model: 'TBC 120',
        name: 'TBC 120 High-Power Stud Block',
        connectionType: 'Stud Terminal',
        wireRangeIec: '35 - 120 mm²',
        wireRangeUl: '2 - 250 kcmil',
        currentRating: '300 A',
        voltageRating: '1000 V',
        widthOrPitch: '42.0 mm',
        torqueOrStrip: '20.0 Nm (M12)',
        mounting: 'TS 35 / Panel Mount',
        approvals: ['IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.skuHighPowerUnbranded,
      },
      {
        model: 'TBH 50',
        name: 'TBH 50 Hinged-Cover Stud Block',
        connectionType: 'Stud Terminal',
        wireRangeIec: '10 - 50 mm²',
        wireRangeUl: '8 - 1/0 AWG',
        currentRating: '150 A',
        voltageRating: '1000 V',
        widthOrPitch: '28.0 mm',
        torqueOrStrip: '6.0 Nm (M8)',
        mounting: 'TS 35 DIN Rail',
        approvals: ['IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.boltPower,
      },
      {
        model: 'TBH 95',
        name: 'TBH 95 Hinged-Cover Stud Block',
        connectionType: 'Stud Terminal',
        wireRangeIec: '25 - 95 mm²',
        wireRangeUl: '4 - 3/0 AWG',
        currentRating: '232 A',
        voltageRating: '1000 V',
        widthOrPitch: '40.0 mm',
        torqueOrStrip: '14.0 Nm (M10)',
        mounting: 'TS 35 / Panel Mount',
        approvals: ['IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.skuHeavyBusbar,
      },
    ],
  },
  {
    id: 'nut-connection',
    indexNumber: '05',
    slug: '/nut-connection',
    seriesCode: 'TNC / TNO',
    title: '1-Nut Distribution',
    shortTitle: '1-Nut Split',
    classification: 'DIN Rail · Distribution',
    tagline: 'Compact 1-incoming to multi-outgoing power distribution blocks saving DIN-rail space.',
    description:
      'TermiCore TNC and TNO distribution blocks split a single heavy main feeder into 2 to 8 balanced branch circuits inside one finger-safe IP20 housing, eliminating bulky copper busbar fabrication and external cross-jumpers.',
    image: IMAGES.nutDistribution,
    imageAlt: 'TermiCore TNC 1-Nut power distribution terminal blocks',
    wireRangeSummary: '1.5 – 120 mm²',
    currentMaxSummary: '269 A',
    voltageMaxSummary: '1000 V',
    railCompatibility: 'TS 35 / Panel',
    principleTitle: 'Integrated Monoblock Busbar Splitting',
    principleSummary:
      'One machined brass/copper distribution manifold feeds multiple isolated outgoing screw clamps, drastically reducing wiring time and panel footprint.',
    principlePoints: [
      {
        title: 'Up to 60% Panel Space Savings',
        detail: 'Replaces banks of bridged feed-through blocks with a single compact manifold.',
      },
      {
        title: 'Color-Coded Phase Identification',
        detail: 'Available in Grey, Blue (Neutral), and Yellow/Green (PE) for rapid three-phase layout.',
      },
      {
        title: 'Modular Side Snap-Lock',
        detail: 'Interlocking dovetail sides assemble multi-pole L1/L2/L3/N groups in seconds.',
      },
    ],
    steps: [
      {
        step: 1,
        title: 'Snap Poles Together',
        detail: 'Interlock L1, L2, L3, and N modules and clip onto the TS 35 DIN rail.',
      },
      {
        step: 2,
        title: 'Terminate Main Incoming',
        detail: 'Insert the main feeder cable into the high-capacity top input port and torque.',
      },
      {
        step: 3,
        title: 'Wire Branch Outputs',
        detail: 'Connect up to 8 branch circuits into the individually numbered output clamps.',
      },
    ],
    faqs: [
      {
        question: 'Can TNC blocks be panel-mounted without a DIN rail?',
        answer:
          'Yes. All TNC and TNO housings include both a snap-fit TS 35 DIN-rail foot and integrated flange screw holes for direct backplate mounting.',
      },
    ],
    skus: [
      {
        model: 'TNC1X4',
        name: 'TNC1X4 1-to-4 Distribution Block',
        connectionType: '1-to-Many Distribution',
        wireRangeIec: 'In: 16 mm² / Out: 4 × 6 mm²',
        wireRangeUl: 'In: 6 AWG / Out: 10 AWG',
        currentRating: '80 A',
        voltageRating: '1000 V',
        widthOrPitch: '27.0 mm',
        torqueOrStrip: 'In 2.5 / Out 1.2 Nm',
        mounting: 'TS 35 / Panel',
        approvals: ['IEC 60947-7-1', 'UL 1059', 'CE', 'RoHS'],
        image: IMAGES.nutDistribution,
      },
      {
        model: 'TNC1X6',
        name: 'TNC1X6 1-to-6 Distribution Block',
        connectionType: '1-to-Many Distribution',
        wireRangeIec: 'In: 35 mm² / Out: 6 × 10 mm²',
        wireRangeUl: 'In: 2 AWG / Out: 8 AWG',
        currentRating: '125 A',
        voltageRating: '1000 V',
        widthOrPitch: '32.0 mm',
        torqueOrStrip: 'In 3.5 / Out 1.5 Nm',
        mounting: 'TS 35 / Panel',
        approvals: ['IEC 60947-7-1', 'UL 1059', 'CE', 'RoHS'],
        image: IMAGES.skuMultiOutlet,
      },
      {
        model: 'TNC1X8',
        name: 'TNC1X8 1-to-8 Distribution Block',
        connectionType: '1-to-Many Distribution',
        wireRangeIec: 'In: 50 mm² / Out: 8 × 16 mm²',
        wireRangeUl: 'In: 1/0 AWG / Out: 6 AWG',
        currentRating: '160 A',
        voltageRating: '1000 V',
        widthOrPitch: '40.0 mm',
        torqueOrStrip: 'In 6.0 / Out 2.0 Nm',
        mounting: 'TS 35 / Panel',
        approvals: ['IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.skuMultiOutlet,
      },
      {
        model: 'TNO 35',
        name: 'TNO 35 Single-Outlet Feeder Block',
        connectionType: '1-to-Many Distribution',
        wireRangeIec: 'In: 35 mm² / Out: 2 × 16 mm²',
        wireRangeUl: 'In: 2 AWG / Out: 6 AWG',
        currentRating: '125 A',
        voltageRating: '1000 V',
        widthOrPitch: '22.0 mm',
        torqueOrStrip: '3.5 Nm',
        mounting: 'TS 35 / Panel',
        approvals: ['IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.nutDistribution,
      },
      {
        model: 'TNO 70',
        name: 'TNO 70 Heavy Distribution Block',
        connectionType: '1-to-Many Distribution',
        wireRangeIec: 'In: 70 mm² / Out: 4 × 25 mm²',
        wireRangeUl: 'In: 2/0 AWG / Out: 4 AWG',
        currentRating: '192 A',
        voltageRating: '1000 V',
        widthOrPitch: '36.0 mm',
        torqueOrStrip: '8.0 Nm',
        mounting: 'TS 35 / Panel',
        approvals: ['IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.skuMultiOutlet,
      },
      {
        model: 'TNO 120',
        name: 'TNO 120 Main Bus Distribution Block',
        connectionType: '1-to-Many Distribution',
        wireRangeIec: 'In: 120 mm² / Out: 6 × 35 mm²',
        wireRangeUl: 'In: 250 kcmil / Out: 2 AWG',
        currentRating: '269 A',
        voltageRating: '1000 V',
        widthOrPitch: '48.0 mm',
        torqueOrStrip: '14.0 Nm',
        mounting: 'TS 35 / Panel',
        approvals: ['IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.skuHighPowerUnbranded,
      },
    ],
  },
  {
    id: 'pcb-terminal-blocks',
    indexNumber: '06',
    slug: '/pcb-terminal-blocks',
    seriesCode: 'TPC / TPS',
    title: 'PCB Terminal Blocks',
    shortTitle: 'PCB Blocks',
    classification: 'Board-to-Wire · Direct',
    tagline: 'Direct-solder screw, push-in, and lever PCB terminal blocks from 2.54 mm to 15.0 mm pitch.',
    description:
      'Engineered for power electronics, VFD drives, solar inverters, and PLC I/O boards, TPC and TPS direct-mount PCB blocks span micro 2.54 mm signal pitches to 232 A / 1000 V power clamps with wave-solder THT and 260°C reflow THR housings.',
    image: IMAGES.pcbTerminalBlocks,
    imageAlt: 'TermiCore TPC and TPS direct-solder PCB terminal blocks',
    wireRangeSummary: '0.14 – 95 mm²',
    currentMaxSummary: '232 A',
    voltageMaxSummary: '1000 V',
    railCompatibility: 'Wave THT / Reflow THR',
    principleTitle: 'Low-Resistance Board-to-Wire Solder Pins',
    principleSummary:
      'Double solder pins on higher-current pitches absorb mechanical insertion torque so stress is never transferred to PCB copper traces.',
    principlePoints: [
      {
        title: 'Tool-Free Lever & Push-In Options',
        detail: 'TPS lever clamps open effortlessly by hand for field-serviceable inverter connections.',
      },
      {
        title: '260°C Pin-in-Paste (THR)',
        detail: 'High-temperature LCP housings integrate directly into automated SMT reflow lines.',
      },
      {
        title: 'Up to 1000 V Creepage Spacing',
        detail: 'Extended 7.62 mm and 15.0 mm pitches meet strict solar and industrial drive clearances.',
      },
    ],
    steps: [
      {
        step: 1,
        title: 'Solder to PCB',
        detail: 'Place module into PCB through-holes for wave soldering or SMT pin-in-paste reflow.',
      },
      {
        step: 2,
        title: 'Open Actuator / Clamp',
        detail: 'Flip the orange TPS lever or turn the rising-cage screw on TPC models.',
      },
      {
        step: 3,
        title: 'Insert & Lock Wire',
        detail: 'Seat conductor fully to the wire stop and close the lever or torque the screw.',
      },
    ],
    faqs: [
      {
        question: 'Are TPC THR models compatible with lead-free reflow profiles?',
        answer:
          'Yes. THR variants are molded in UL 94 V-0 LCP resin rated for peak reflow temperatures up to 260°C for 10 seconds.',
      },
    ],
    skus: [
      {
        model: 'TPC 2.54-PI',
        name: 'TPC 2.54-PI Micro Push-In PCB Block',
        connectionType: 'Push-In Spring',
        wireRangeIec: '0.14 - 0.5 mm²',
        wireRangeUl: '26 - 20 AWG',
        currentRating: '6 A',
        voltageRating: '160 V',
        widthOrPitch: '2.54 mm',
        torqueOrStrip: '2.54 mm · Wave THT',
        mounting: 'Wave Solder (THT)',
        approvals: ['UL 1059', 'IEC 60947-7-4', 'RoHS'],
        image: IMAGES.skuPcbPushIn,
      },
      {
        model: 'TPC 3.5-SC',
        name: 'TPC 3.5-SC Compact Screw PCB Block',
        connectionType: 'Rising Screw Clamp',
        wireRangeIec: '0.14 - 1.5 mm²',
        wireRangeUl: '26 - 16 AWG',
        currentRating: '13.5 A',
        voltageRating: '320 V',
        widthOrPitch: '3.5 mm',
        torqueOrStrip: '3.5 mm · 0.25 Nm',
        mounting: 'Wave Solder (THT)',
        approvals: ['UL 1059', 'IEC 60947-7-4', 'CE', 'RoHS'],
        image: IMAGES.pcbTerminalBlocks,
      },
      {
        model: 'TPC 5.0-SC',
        name: 'TPC 5.0-SC Rising Cage PCB Block',
        connectionType: 'Rising Screw Clamp',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '400 V',
        widthOrPitch: '5.0 mm',
        torqueOrStrip: '5.0 mm · 0.5 Nm',
        mounting: 'Wave Solder (THT)',
        approvals: ['UL 1059', 'IEC 60947-7-4', 'CE', 'RoHS'],
        image: IMAGES.pcbTerminalBlocks,
      },
      {
        model: 'TPC 5.08-SC',
        name: 'TPC 5.08-SC Rising Screw PCB Block',
        connectionType: 'Rising Screw Clamp',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '400 V',
        widthOrPitch: '5.08 mm',
        torqueOrStrip: '5.08 mm · 0.5 Nm',
        mounting: 'Wave Solder (THT)',
        approvals: ['UL 1059', 'IEC 60947-7-4', 'CE', 'RoHS'],
        image: IMAGES.pcbTerminalBlocks,
      },
      {
        model: 'TPC 5.08-THR',
        name: 'TPC 5.08-THR Reflow PCB Block',
        connectionType: 'Push-In Spring',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '400 V',
        widthOrPitch: '5.08 mm',
        torqueOrStrip: '5.08 mm · 260°C LCP',
        mounting: 'Reflow Solder (THR 260°C)',
        approvals: ['UL 1059', 'IEC 60947-7-4', 'RoHS'],
        image: IMAGES.skuPcbPushIn,
      },
      {
        model: 'TPS 2.5-LV',
        name: 'TPS 2.5-LV Lever-Actuated PCB Block',
        connectionType: 'Lever Actuated',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '400 V',
        widthOrPitch: '5.0 mm',
        torqueOrStrip: '5.0 mm · Tool-Free',
        mounting: 'Wave Solder (THT)',
        approvals: ['UL 1059', 'IEC 60947-7-4', 'CE', 'RoHS'],
        image: IMAGES.skuPcbLeverBlock,
      },
      {
        model: 'TPS 5.08-LV',
        name: 'TPS 5.08-LV Tool-Free Lever PCB Block',
        connectionType: 'Lever Actuated',
        wireRangeIec: '0.2 - 4.0 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: '32 A',
        voltageRating: '630 V',
        widthOrPitch: '5.08 mm',
        torqueOrStrip: '5.08 mm · Tool-Free',
        mounting: 'Wave Solder (THT)',
        approvals: ['UL 1059', 'IEC 60947-7-4', 'CE', 'RoHS'],
        image: IMAGES.skuPcbLeverBlock,
      },
      {
        model: 'TPC 7.62-PW',
        name: 'TPC 7.62-PW High-Voltage PCB Block',
        connectionType: 'Rising Screw Clamp',
        wireRangeIec: '0.5 - 6.0 mm²',
        wireRangeUl: '20 - 8 AWG',
        currentRating: '41 A',
        voltageRating: '1000 V',
        widthOrPitch: '7.62 mm',
        torqueOrStrip: '7.62 mm · 1.2 Nm',
        mounting: 'Wave Solder (THT)',
        approvals: ['UL 1059', 'IEC 60947-7-4', 'CE'],
        image: IMAGES.skuPcbHighCurrent,
      },
      {
        model: 'TPC 15.0-HP',
        name: 'TPC 15.0-HP 232 A Power PCB Block',
        connectionType: 'Rising Screw Clamp',
        wireRangeIec: '10 - 95 mm²',
        wireRangeUl: '8 - 3/0 AWG',
        currentRating: '232 A',
        voltageRating: '1000 V',
        widthOrPitch: '15.0 mm',
        torqueOrStrip: '15.0 mm · 6.0 Nm',
        mounting: 'Wave Solder (THT)',
        approvals: ['UL 1059', 'IEC 60947-7-4', 'CE'],
        image: IMAGES.skuPcbHighCurrent,
      },
      {
        model: 'TPC 10.16-TF',
        name: 'TPC 10.16-TF Transformer Terminal Block',
        connectionType: 'Transformer Terminal',
        wireRangeIec: '0.5 - 10 mm²',
        wireRangeUl: '20 - 6 AWG',
        currentRating: '57 A',
        voltageRating: '800 V',
        widthOrPitch: '10.16 mm',
        torqueOrStrip: '10.16 mm · 1.5 Nm',
        mounting: 'Transformer / Coil Mount',
        approvals: ['UL 1059', 'IEC 60947-7-4', 'CE', 'RoHS'],
        image: IMAGES.skuPcbHighCurrent,
      },
      {
        model: 'TPF 7.62-PT',
        name: 'TPF 7.62-PT Panel Feed-Through PCB Block',
        connectionType: 'Panel Feed-Through',
        wireRangeIec: '0.2 - 6.0 mm²',
        wireRangeUl: '24 - 8 AWG',
        currentRating: '41 A',
        voltageRating: '630 V',
        widthOrPitch: '7.62 mm',
        torqueOrStrip: '7.62 mm · 1.2 Nm',
        mounting: 'Panel Cutout / Wave THT',
        approvals: ['UL 1059', 'IEC 60947-7-4', 'CE', 'RoHS'],
        image: IMAGES.pcbTerminalBlocks,
      },
      {
        model: 'TPC 5.08-SP',
        name: 'TPC 5.08-SP Double-Tier Special PCB Block',
        connectionType: 'Special Type',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '20 A',
        voltageRating: '320 V',
        widthOrPitch: '5.08 mm',
        torqueOrStrip: '5.08 mm · 45° Angle',
        mounting: 'Wave Solder (THT)',
        approvals: ['UL 1059', 'IEC 60947-7-4', 'CE'],
        image: IMAGES.skuPcbPushIn,
      },
      {
        model: 'TPC 3.5-TR',
        name: 'TPC 3.5-TR Tape-on-Reel SMT PCB Block',
        connectionType: 'Push-In Spring',
        wireRangeIec: '0.14 - 1.5 mm²',
        wireRangeUl: '26 - 16 AWG',
        currentRating: '13.5 A',
        voltageRating: '320 V',
        widthOrPitch: '3.5 mm',
        torqueOrStrip: 'Tape-on-Reel · 260°C LCP',
        mounting: 'Reflow Solder (THR 260°C)',
        approvals: ['UL 1059', 'IEC 60947-7-4', 'RoHS'],
        image: IMAGES.skuPcbPushIn,
      },
    ],
  },
  {
    id: 'pcb-connectors',
    indexNumber: '07',
    slug: '/pcb-connectors',
    seriesCode: 'TPL / TPH',
    title: 'PCB Connectors',
    shortTitle: 'PCB Connectors',
    classification: 'Board-to-Wire · Pluggable',
    tagline: 'Two-piece pluggable PCB headers, THR sockets, and locking plugs up to 125 A / 1000 V.',
    description:
      'Modular plug-and-header systems allow sub-assemblies and control boards to be pre-wired off-board and snapped into place during final commissioning, featuring coding keys, M2.5/M3 screw flanges, and Lock-and-Release latches.',
    image: IMAGES.pcbConnectors,
    imageAlt: 'TermiCore TPL and TPH pluggable PCB connectors and headers',
    wireRangeSummary: '0.14 – 35 mm²',
    currentMaxSummary: '125 A',
    voltageMaxSummary: '1000 V',
    railCompatibility: 'Plug / Header / THR',
    principleTitle: 'Vibration-Locked Two-Piece Board Interconnect',
    principleSummary:
      'Silver- or tin-plated copper alloy tuning-fork contacts mate securely with shrouded PCB pin headers while mechanical flanges prevent accidental uncoupling.',
    principlePoints: [
      {
        title: 'M2.5 / M3 Screw & Latch Locking',
        detail: 'Flanged and Lock-and-Release plugs hold firm under continuous machine shock.',
      },
      {
        title: 'Keying & Polarized Coding',
        detail: 'Snap-in coding profiles prevent mismating adjacent I/O connectors on dense controller boards.',
      },
      {
        title: 'Hot-Swap Sub-Assembly Speed',
        detail: 'Replace field electronics in seconds without disconnecting individual harness conductors.',
      },
    ],
    steps: [
      {
        step: 1,
        title: 'Terminate Plug Harness',
        detail: 'Wire field conductors into the removable TPL or TPH plug off-board.',
      },
      {
        step: 2,
        title: 'Mate to PCB Header',
        detail: 'Align polarized coding keys and press the plug onto the soldered board header.',
      },
      {
        step: 3,
        title: 'Engage Flange / Latch',
        detail: 'Tighten flange screws or snap the Lock-and-Release ejector latches closed.',
      },
    ],
    faqs: [
      {
        question: 'Are TPL headers available for SMT reflow assembly?',
        answer:
          'Yes. TPL 5.08-THR headers are manufactured from high-temp LCP and supplied in tape-and-reel or tray packaging for automated pick-and-place.',
      },
    ],
    skus: [
      {
        model: 'TPL 3.5-PI',
        name: 'TPL 3.5-PI Pluggable Push-In Socket',
        connectionType: 'Push-In Spring',
        wireRangeIec: '0.14 - 1.5 mm²',
        wireRangeUl: '26 - 16 AWG',
        currentRating: '10 A',
        voltageRating: '160 V',
        widthOrPitch: '3.5 mm',
        torqueOrStrip: '3.5 mm · Tool-Free',
        mounting: 'Pluggable / Panel Flange',
        approvals: ['UL 1059', 'IEC 61984', 'RoHS'],
        image: IMAGES.skuPcbPushIn,
      },
      {
        model: 'TPL 3.81-SC',
        name: 'TPL 3.81-SC Compact Screw Plug',
        connectionType: 'Rising Screw Clamp',
        wireRangeIec: '0.14 - 1.5 mm²',
        wireRangeUl: '26 - 16 AWG',
        currentRating: '10 A',
        voltageRating: '320 V',
        widthOrPitch: '3.81 mm',
        torqueOrStrip: '3.81 mm · 0.25 Nm',
        mounting: 'Pluggable / Panel Flange',
        approvals: ['UL 1059', 'IEC 61984', 'CE', 'RoHS'],
        image: IMAGES.pcbConnectors,
      },
      {
        model: 'TPL 5.08-SC',
        name: 'TPL 5.08-SC Universal Pluggable Socket',
        connectionType: 'Rising Screw Clamp',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '16 A',
        voltageRating: '400 V',
        widthOrPitch: '5.08 mm',
        torqueOrStrip: '5.08 mm · 0.5 Nm',
        mounting: 'Pluggable / Panel Flange',
        approvals: ['UL 1059', 'IEC 61984', 'CE', 'RoHS'],
        image: IMAGES.pcbConnectors,
      },
      {
        model: 'TPL 5.08-FL',
        name: 'TPL 5.08-FL Screw-Flanged Locking Plug',
        connectionType: 'Flanged Plug',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '16 A',
        voltageRating: '400 V',
        widthOrPitch: '5.08 mm',
        torqueOrStrip: '5.08 mm · M2.5 Flange',
        mounting: 'Pluggable / Panel Flange',
        approvals: ['UL 1059', 'IEC 61984', 'CE', 'RoHS'],
        image: IMAGES.skuPcbFlangedPlug,
      },
      {
        model: 'TPL 5.08-THR',
        name: 'TPL 5.08-THR Reflow Pin Header',
        connectionType: 'THR Reflow Header',
        wireRangeIec: 'Header Pin 1.0 × 1.0 mm',
        wireRangeUl: 'Mates w/ TPL 5.08',
        currentRating: '16 A',
        voltageRating: '400 V',
        widthOrPitch: '5.08 mm',
        torqueOrStrip: '5.08 mm · 260°C LCP',
        mounting: 'Reflow Solder (THR 260°C)',
        approvals: ['UL 1059', 'IEC 61984', 'RoHS'],
        image: IMAGES.pcbConnectors,
      },
      {
        model: 'TPL 7.62-LR',
        name: 'TPL 7.62-LR Lock-and-Release Plug',
        connectionType: 'Flanged Plug',
        wireRangeIec: '0.5 - 6.0 mm²',
        wireRangeUl: '20 - 8 AWG',
        currentRating: '41 A',
        voltageRating: '1000 V',
        widthOrPitch: '7.62 mm',
        torqueOrStrip: '7.62 mm · Ejector Latch',
        mounting: 'Pluggable / Panel Flange',
        approvals: ['UL 1059', 'IEC 61984', 'CE', 'RoHS'],
        image: IMAGES.skuPcbFlangedPlug,
      },
      {
        model: 'TPH 10.16-HC',
        name: 'TPH 10.16-HC High-Current PCB Connector',
        connectionType: 'High-Current Plug',
        wireRangeIec: '1.5 - 16 mm²',
        wireRangeUl: '16 - 4 AWG',
        currentRating: '76 A',
        voltageRating: '1000 V',
        widthOrPitch: '10.16 mm',
        torqueOrStrip: '10.16 mm · 1.8 Nm',
        mounting: 'Pluggable / Panel Flange',
        approvals: ['UL 1059', 'IEC 61984', 'CE'],
        image: IMAGES.skuPcbHighCurrent,
      },
      {
        model: 'TPH 15.0-HC',
        name: 'TPH 15.0-HC 125 A Feeder Plug',
        connectionType: 'High-Current Plug',
        wireRangeIec: '6.0 - 35 mm²',
        wireRangeUl: '10 - 2 AWG',
        currentRating: '125 A',
        voltageRating: '1000 V',
        widthOrPitch: '15.0 mm',
        torqueOrStrip: '15.0 mm · 3.5 Nm',
        mounting: 'Pluggable / Panel Flange',
        approvals: ['UL 1059', 'IEC 61984', 'CE'],
        image: IMAGES.skuPcbHighCurrent,
      },
      {
        model: 'TPL 3.81-SK',
        name: 'TPL 3.81-SK Shrouded PCB Header Socket',
        connectionType: 'THR Reflow Header',
        wireRangeIec: 'Header Pin 0.8 × 0.8 mm',
        wireRangeUl: 'Mates w/ TPL 3.81',
        currentRating: '10 A',
        voltageRating: '320 V',
        widthOrPitch: '3.81 mm',
        torqueOrStrip: '3.81 mm · 260°C LCP',
        mounting: 'Reflow Solder (THR 260°C)',
        approvals: ['UL 1059', 'IEC 61984', 'RoHS'],
        image: IMAGES.pcbConnectors,
      },
    ],
  },
  {
    id: 'barrier-terminal-blocks',
    indexNumber: '08',
    slug: '/barrier-terminal-blocks',
    seriesCode: 'TBB / TBD',
    title: 'Barrier Terminal Blocks',
    shortTitle: 'Barrier Blocks',
    classification: 'Panel & PCB · Barrier',
    tagline: 'Rugged insulated barrier strips in single-row, bi-level, pluggable, and panel-mount configurations.',
    description:
      'Built for heavy-duty HVAC, power supply, industrial control, and field-wiring enclosures, TermiCore TBB and TBD barrier terminal blocks pair high-wall UL 94 V-0 polyamide insulation with captive washer screws for fork lugs, ring terminals, and stripped copper wire.',
    image: IMAGES.barrierTerminalBlocks,
    imageAlt: 'TermiCore TBB and TBD barrier terminal blocks in single row, bi-level, and panel styles',
    wireRangeSummary: '0.5 – 25 mm²',
    currentMaxSummary: '85 A',
    voltageMaxSummary: '600 V',
    railCompatibility: 'Panel / PCB / Plug',
    principleTitle: 'Isolated High-Wall Screw Barrier Termination',
    principleSummary:
      'Molded dielectric barrier walls separate each pole to maintain extended creepage distances while captive pressure plates accept bare conductors or crimped ring/fork lugs without loosening.',
    principlePoints: [
      {
        title: 'Fork & Ring Lug Compatibility',
        detail: 'Captive elevator screws with serrated pressure washers grip bare wire and crimped lugs securely.',
      },
      {
        title: 'Single-Row, Bi-Level & Feed-Through',
        detail: 'Available from compact 7.62 mm single-row PCB strips to stacked dual-level and panel-cutout blocks.',
      },
      {
        title: 'High-Creepage UL 94 V-0 Walls',
        detail: 'Deep inter-pole barriers prevent arc tracking and support clear pole numbering strips.',
      },
    ],
    steps: [
      {
        step: 1,
        title: 'Mount Strip or PCB Base',
        detail: 'Secure the barrier strip via end mounting ears, panel cutout, or wave-soldered PCB pins.',
      },
      {
        step: 2,
        title: 'Insert Lug or Conductor',
        detail: 'Slide a crimped fork/ring terminal or stripped wire neatly under the captive screw washer.',
      },
      {
        step: 3,
        title: 'Torque & Fit Safety Cover',
        detail: 'Tighten to the rated torque and snap on the optional clear dust/touch protection cover.',
      },
    ],
    faqs: [
      {
        question: 'Can TBB barrier terminal blocks accept crimped ring and fork lugs?',
        answer:
          'Yes. All TBB and TBD models use captive screw-and-washer assemblies designed specifically for bare conductors as well as ring and fork crimp terminals.',
      },
      {
        question: 'What configurations are included in the TBB/TBD barrier series?',
        answer:
          'The range covers Single-Tier strips, Dual-Tier stacked blocks, Pluggable two-piece strips, Through-Wall panel feed-throughs, Chassis Flange strips, and High-Current Lug blocks.',
      },
    ],
    skus: [
      {
        model: 'TBB 7.62-SR',
        name: 'TBB 7.62-SR Single-Tier Barrier Block',
        connectionType: 'Single-Tier',
        wireRangeIec: '0.5 - 2.5 mm²',
        wireRangeUl: '22 - 12 AWG',
        currentRating: '20 A',
        voltageRating: '300 V',
        widthOrPitch: '7.62 mm',
        torqueOrStrip: '0.5 Nm · M3 Screw',
        mounting: 'PCB / Direct Panel',
        approvals: ['UL 1059', 'CE', 'RoHS'],
        image: IMAGES.barrierTerminalBlocks,
      },
      {
        model: 'TBB 9.5-SR',
        name: 'TBB 9.5-SR Power Single-Tier Barrier',
        connectionType: 'Single-Tier',
        wireRangeIec: '0.75 - 4.0 mm²',
        wireRangeUl: '20 - 10 AWG',
        currentRating: '30 A',
        voltageRating: '600 V',
        widthOrPitch: '9.5 mm',
        torqueOrStrip: '0.8 Nm · M3.5 Screw',
        mounting: 'Direct Panel Mount',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.barrierTerminalBlocks,
      },
      {
        model: 'TBB 11.0-SR',
        name: 'TBB 11.0-SR Heavy Single-Tier Barrier',
        connectionType: 'Single-Tier',
        wireRangeIec: '1.5 - 10 mm²',
        wireRangeUl: '16 - 6 AWG',
        currentRating: '50 A',
        voltageRating: '600 V',
        widthOrPitch: '11.0 mm',
        torqueOrStrip: '1.4 Nm · M4 Screw',
        mounting: 'Direct Panel Mount',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.barrierTerminalBlocks,
      },
      {
        model: 'TBD 8.25-BL',
        name: 'TBD 8.25-BL Dual-Tier Compact Barrier',
        connectionType: 'Dual-Tier',
        wireRangeIec: '0.5 - 2.5 mm²',
        wireRangeUl: '22 - 12 AWG',
        currentRating: '20 A',
        voltageRating: '300 V',
        widthOrPitch: '8.25 mm',
        torqueOrStrip: '0.5 Nm · Dual Tier',
        mounting: 'PCB / Chassis Mount',
        approvals: ['UL 1059', 'CE', 'RoHS'],
        image: IMAGES.barrierTerminalBlocks,
      },
      {
        model: 'TBD 9.5-BL',
        name: 'TBD 9.5-BL High-Density Dual-Tier Barrier',
        connectionType: 'Dual-Tier',
        wireRangeIec: '0.5 - 4.0 mm²',
        wireRangeUl: '20 - 10 AWG',
        currentRating: '30 A',
        voltageRating: '600 V',
        widthOrPitch: '9.5 mm',
        torqueOrStrip: '0.8 Nm · Dual Tier',
        mounting: 'Chassis / Panel Mount',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.barrierTerminalBlocks,
      },
      {
        model: 'TBB 7.62-PL',
        name: 'TBB 7.62-PL Pluggable Barrier Terminal',
        connectionType: 'Pluggable',
        wireRangeIec: '0.5 - 2.5 mm²',
        wireRangeUl: '22 - 12 AWG',
        currentRating: '20 A',
        voltageRating: '300 V',
        widthOrPitch: '7.62 mm',
        torqueOrStrip: '0.5 Nm · Quick Plug',
        mounting: '2-Piece Panel / PCB',
        approvals: ['UL 1059', 'CE', 'RoHS'],
        image: IMAGES.barrierTerminalBlocks,
      },
      {
        model: 'TBB 10.0-FT',
        name: 'TBB 10.0-FT Through-Wall Barrier Block',
        connectionType: 'Through-Wall',
        wireRangeIec: '1.0 - 6.0 mm²',
        wireRangeUl: '18 - 8 AWG',
        currentRating: '40 A',
        voltageRating: '600 V',
        widthOrPitch: '10.0 mm',
        torqueOrStrip: '1.2 Nm · Cutout Wall',
        mounting: 'Panel Feed-Through',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.barrierTerminalBlocks,
      },
      {
        model: 'TBB 13.0-PM',
        name: 'TBB 13.0-PM Chassis Flange Barrier',
        connectionType: 'Chassis Flange',
        wireRangeIec: '2.5 - 16 mm²',
        wireRangeUl: '14 - 4 AWG',
        currentRating: '65 A',
        voltageRating: '600 V',
        widthOrPitch: '13.0 mm',
        torqueOrStrip: '2.0 Nm · Flange Lug',
        mounting: 'Flange Panel Mount',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.barrierTerminalBlocks,
      },
      {
        model: 'TBB 16.0-WT',
        name: 'TBB 16.0-WT High-Current Lug Barrier',
        connectionType: 'High-Current Lug',
        wireRangeIec: '4.0 - 25 mm²',
        wireRangeUl: '12 - 2 AWG',
        currentRating: '85 A',
        voltageRating: '600 V',
        widthOrPitch: '16.0 mm',
        torqueOrStrip: '2.5 Nm · M5 Stud/Screw',
        mounting: 'Chassis / Busbar Mount',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
        image: IMAGES.barrierTerminalBlocks,
      },
    ],
  },
];

export const ACCESSORIES: AccessoryItem[] = [
  {
    id: 'ep-series',
    series: 'EP Series',
    title: 'End Plates',
    category: 'Insulation & End Covers',
    description:
      'Snap-on UL 94 V-0 polyamide end covers that seal the open live side of terminal block assemblies for IP20 finger safety.',
    image: 'images/acc_end_plates_1794643969735.jpg',
    imageAlt: 'TermiCore EP Series snap-on terminal block end plates',
    specs: [
      { label: 'Thickness', value: '1.5 - 2.2 mm' },
      { label: 'Material', value: 'PA 6.6 UL 94 V-0' },
      { label: 'Fit Series', value: 'TSC / TSC-R / TSS' },
      { label: 'Colors', value: 'Grey / Blue / Orange' },
    ],
  },
  {
    id: 'pp-series',
    series: 'PP Series',
    title: 'Partition Plates',
    category: 'Insulation & End Covers',
    description:
      'Extended-profile separating plates for visual circuit grouping and increased creepage/clearance between differing voltage potentials.',
    image: 'images/acc_partition_plates_1794643970225.jpg',
    imageAlt: 'TermiCore PP Series high-voltage partition plates',
    specs: [
      { label: 'Thickness', value: '2.0 mm' },
      { label: 'Dielectric', value: '1000 V Isolation' },
      { label: 'Material', value: 'PA 6.6 UL 94 V-0' },
      { label: 'Compatibility', value: '2.5 - 35 mm² Blocks' },
    ],
  },
  {
    id: 'jumper-series',
    series: 'CJ / PJ Series',
    title: 'Insulated Cross Jumpers',
    category: 'Potential Distribution',
    description:
      'Finger-safe copper cross-connecting bridges in 2-pole, 4-pole, and 10-pole configurations for rapid common busing.',
    image: 'images/acc_cross_jumpers_1794643971235.jpg',
    imageAlt: 'TermiCore insulated plug-in and screw cross jumpers',
    specs: [
      { label: 'Poles', value: '2 / 3 / 4 / 10 / 20 Way' },
      { label: 'Rated Current', value: '24 A - 76 A' },
      { label: 'Conductor', value: 'Tinned Copper' },
      { label: 'Style', value: 'Push-In & Screw' },
    ],
  },
  {
    id: 'marker-series',
    series: 'MT / TM Series',
    title: 'Terminal Marking Tags',
    category: 'Identification',
    description:
      'Snap-in white polyamide marking strips and pre-printed terminal tags compatible with thermal transfer and plotter printers.',
    image: 'images/acc_marking_tags_1794643971909.jpg',
    imageAlt: 'TermiCore MT and TM series terminal block marking tags',
    specs: [
      { label: 'Pitch Match', value: '5.2 / 6.2 / 8.2 mm' },
      { label: 'Print Type', value: 'Thermal / Plotter' },
      { label: 'Material', value: 'Halogen-Free PA' },
      { label: 'Format', value: 'Blank & Pre-Numbered' },
    ],
  },
  {
    id: 'din-rails',
    series: 'TS 35 / G 32',
    title: 'DIN Mounting Rails',
    category: 'Mounting Hardware',
    description:
      'Cold-rolled galvanized steel and aluminum DIN rails in slotted and unslotted 1 m / 2 m lengths per EN 60715.',
    image: 'images/acc_din_rails_1794643971282.jpg',
    imageAlt: 'TermiCore TS 35 and G 32 DIN mounting rails',
    specs: [
      { label: 'Profiles', value: 'TS 35×7.5 / 35×15 / G32' },
      { label: 'Finish', value: 'Trivalent Zinc-Plated' },
      { label: 'Standard', value: 'IEC / EN 60715' },
      { label: 'Lengths', value: '1000 mm / 2000 mm' },
    ],
  },
  {
    id: 'test-plugs',
    series: 'TP / PS Series',
    title: 'Test Plugs & Sockets',
    category: 'Testing & Metering',
    description:
      'Shrouded 2 mm and 4 mm test adapters and reducing sockets for live multimeter probing on disconnect and feed-through blocks.',
    image: 'images/acc_test_plugs_1794643972356.jpg',
    imageAlt: 'TermiCore TP and PS series test plugs and sockets',
    specs: [
      { label: 'Probe Diameter', value: '2.0 mm / 4.0 mm' },
      { label: 'Rated Current', value: 'Up to 32 A' },
      { label: 'Voltage', value: '600 V CAT III' },
      { label: 'Colors', value: 'Red / Black / Yellow' },
    ],
  },
  {
    id: 'lug-series',
    series: 'TCL / TFL Series',
    title: 'Insulated & Uninsulated Cable Lugs',
    category: 'Wire Termination',
    description:
      'Electrolytic tinned copper ring, fork, and pin cable lugs engineered for TBC/TBH bolt terminals and heavy feeder crimping.',
    image: 'images/acc_cable_lug_1794729919569.jpg',
    imageAlt: 'TermiCore tinned copper ring and fork cable lugs',
    specs: [
      { label: 'Cross-Section', value: '0.5 - 120 mm²' },
      { label: 'Stud Sizes', value: 'M4 - M12' },
      { label: 'Plating', value: 'Electro-Tin Cu' },
      { label: 'Insulation', value: 'PVC / Bare Cu' },
    ],
  },
];

export const APPLICATION_SECTORS: ApplicationSector[] = [
  {
    id: 'automation',
    title: 'Industrial Automation & PLC Panels',
    subtitle: 'High-Density Control Cabinets',
    summary:
      'Modular DIN-rail blocks and pluggable PCB headers engineered for compact PLC I/O marshalling, sensor distribution, and clean cabinet serviceability.',
    image: IMAGES.controlCabinet,
    imageAlt: 'Industrial automation control cabinet wired with TermiCore DIN-rail terminal blocks',
    demands: [
      '5.2 mm slim profile maximizes DIN-rail I/O channel density',
      'Color-coded cross jumpers simplify 24 V DC common distribution',
      'Tool-free spring cage and lever clamps cut panel wiring time by 40%',
    ],
    recommendedSeries: [
      { label: 'Spring Cage', series: 'TSC', route: '/spring-cage-connection' },
      { label: 'PCB Connectors', series: 'TPL', route: '/pcb-connectors' },
    ],
  },
  {
    id: 'power-switchgear',
    title: 'Power Distribution & Switchgear',
    subtitle: 'Heavy Feeder & Metering Enclosures',
    summary:
      'High-current stud terminals, 1-Nut power splitters, and CT/PT disconnect blocks rated up to 1000 V and 300 A for switchgear and MCC panels.',
    image: IMAGES.skuHeavyBusbar,
    imageAlt: 'Heavy-duty switchgear busbar and bolt stud terminal assembly',
    demands: [
      'Up to 300 A continuous rating with 120 mm² ring-lug termination',
      '1-to-8 monoblock splitters replace bulky fabricated copper busbars',
      'Dedicated CT/PT slide-disconnect blocks for safe relay commissioning',
    ],
    recommendedSeries: [
      { label: 'Bolt Stud', series: 'TBC / TBH', route: '/bolt-connection' },
      { label: '1-Nut Split', series: 'TNC / TNO', route: '/nut-connection' },
      { label: 'Spring Support', series: 'TSS', route: '/screw-support' },
    ],
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy & Inverters',
    subtitle: 'Solar Combiner, BESS & EV Charging',
    summary:
      '1000 V creepage-rated PCB power blocks and vibration-resistant DIN-rail terminals built for outdoor inverters, battery racks, and EV chargers.',
    image: IMAGES.pcbTerminalBlocks,
    imageAlt: 'High-voltage PCB terminal blocks for solar inverters and power electronics',
    demands: [
      '1000 V IEC 60947 clearance across 7.62–15.0 mm PCB pitches',
      '260°C THR reflow housings for automated power-board SMT lines',
      'UL 94 V-0 flame-retardant housings for high-ambient inverter cabinets',
    ],
    recommendedSeries: [
      { label: 'PCB Blocks', series: 'TPC / TPS', route: '/pcb-terminal-blocks' },
      { label: 'Screw Clamp', series: 'TSC-R', route: '/screw-connection' },
    ],
  },
  {
    id: 'rail-machinery',
    title: 'Machinery & Railway Rolling Stock',
    subtitle: 'High-Shock & Vibration Environments',
    summary:
      'Self-locking CrNi spring clamps and Reakdyn anti-loosening screw yokes tested against continuous mechanical vibration and thermal cycling.',
    image: IMAGES.springCage,
    imageAlt: 'Vibration-proof spring cage terminal blocks for machinery and rail',
    demands: [
      'Zero conductor loosening under continuous shock and vibration',
      'Gas-tight contact zone prevents millivolt drift in humid enclosures',
      'Flanged pluggable connectors lock firmly to moving machine heads',
    ],
    recommendedSeries: [
      { label: 'Spring Cage', series: 'TSC', route: '/spring-cage-connection' },
      { label: 'PCB Connectors', series: 'TPL', route: '/pcb-connectors' },
    ],
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'ul-1059',
    code: 'UL 1059',
    verification: 'North America',
    title: 'Component Recognition for Terminal Blocks',
    description:
      'Verified dielectric withstand, temperature rise, and AWG wire pull-out retention for industrial control equipment.',
    scope: 'TSC, TSC-R, TSS, TBC, TPC & TPL Series',
  },
  {
    id: 'iec-60947',
    code: 'IEC 60947-7-1',
    verification: 'Global IEC',
    title: 'Low-Voltage Switchgear & Controlgear',
    description:
      'Type-tested for rated impulse withstand voltage (8 kV), short-time withstand current (120 A/mm²), and aging resistance.',
    scope: 'DIN Rail Feed-Through, PE & Disconnect',
  },
  {
    id: 'iso-9001',
    code: 'ISO 9001:2015',
    verification: 'QMS Audited',
    title: 'Quality Management System',
    description:
      'End-to-end process traceability from raw copper bar stamping and PA 6.6 molding through automated optical inspection.',
    scope: 'Manufacturing & Calibration Facilities',
  },
  {
    id: 'ce-lvd',
    code: 'CE / LVD',
    verification: 'European Union',
    title: 'Low Voltage Directive Compliance',
    description:
      'Full conformity with EU Low Voltage Directive 2014/35/EU for safe deployment in industrial machinery and switchgear.',
    scope: 'All TermiCore DIN & PCB Lines',
  },
  {
    id: 'rohs-reach',
    code: 'RoHS 3 / REACH',
    verification: 'Environmental',
    title: 'Hazardous Substance & Halogen-Free Compliance',
    description:
      'Lead-free electro-tinned brass/copper conductors and RoHS-compliant polyamide housings safe for global export.',
    scope: '100% Product Portfolio',
  },
  {
    id: 'atex-iecex',
    code: 'ATEX / IECEx',
    verification: 'Hazardous Zones',
    title: 'Increased Safety Ex e Enclosures',
    description:
      'Selected TSC and TSC-R series engineered for Zone 1 and Zone 2 hazardous area junction boxes.',
    scope: 'Selected TSC & TSC-R Models',
  },
];

export const TESTING_PROTOCOLS: TestingProtocolItem[] = [
  {
    title: 'Dielectric & Impulse Withstand',
    detail: 'High-potential testing up to 8 kV impulse and 2.5–3.5 kV AC RMS between adjacent poles and DIN rail.',
  },
  {
    title: 'Mechanical Wire Pull-Out',
    detail: 'Tensile retention verification across minimum and maximum IEC/AWG wire gauges after 192-hour thermal aging.',
  },
  {
    title: 'Temperature Rise & Thermal Cycling',
    detail: 'Continuous rated current load testing ensuring terminal temperature rise stays well below IEC 45 K limits.',
  },
  {
    title: 'Vibration & Shock Endurance',
    detail: 'Swept-sine vibration and mechanical shock profiles confirming uninterrupted contact resistance stability.',
  },
];

export const WHY_CHOOSE_PILLARS: WhyChoosePillar[] = [
  {
    number: '01',
    title: 'Electrolytic Copper Bars',
    description:
      'High-conductivity ETP copper current bars with corrosion-resistant tin plating keep voltage drop and heat generation minimal.',
  },
  {
    number: '02',
    title: 'UL 94 V-0 Polyamide Housings',
    description:
      'Self-extinguishing, halogen-free PA 6.6 and high-temp LCP moldings deliver superior tracking resistance and impact strength.',
  },
  {
    number: '03',
    title: 'Full DIN & PCB Ecosystem',
    description:
      'Matched end plates, cross jumpers, marking tags, and 2.54–15 mm PCB blocks from one vertically integrated supplier.',
  },
  {
    number: '04',
    title: 'Factory-Direct Engineering',
    description:
      'Rapid CAD STEP file delivery, sample kits, and tiered OEM pricing backed by responsive application engineers.',
  },
];

export const SPREADSHEET_ID = '1iHrPxhvsFnedO2Js7u3wmFbPAxLeC4F1WP71MBv5gcw';

export interface SheetConfig {
  gid: string;
  name: string;
  shortName: string;
  category: 'overview' | 'billing' | 'iocl' | 'other' | 'sales';
  icon: string;
}

export const SHEETS: SheetConfig[] = [
  { gid: '105280238', name: 'Vishal Electricals - Main', shortName: 'VE Main', category: 'overview', icon: '🏢' },
  { gid: '174412694', name: 'MIS Dashboard', shortName: 'MIS', category: 'overview', icon: '📊' },
  { gid: '118852844', name: 'Sales Register 26-27', shortName: 'Sales Reg', category: 'sales', icon: '📋' },
  { gid: '548407335', name: 'EMD / SD Details', shortName: 'EMD/SD', category: 'overview', icon: '💰' },
  { gid: '751444077', name: 'GAIL Vijaipur', shortName: 'GAIL', category: 'billing', icon: '🏭' },
  { gid: '1347791283', name: 'NTPC Dadri', shortName: 'NTPC', category: 'billing', icon: '⚡' },
  { gid: '321034887', name: 'Paradip Port Authority', shortName: 'Paradip Port', category: 'billing', icon: '🚢' },
  { gid: '1979702996', name: 'IOCL Paradeep HM', shortName: 'IOCL Paradeep', category: 'iocl', icon: '🛢️' },
  { gid: '1893067828', name: 'AAI Amritsar', shortName: 'AAI Amritsar', category: 'billing', icon: '✈️' },
  { gid: '1234783628', name: 'IOCL Vijayawada', shortName: 'IOCL Vijayawada', category: 'iocl', icon: '🛢️' },
  { gid: '977030954', name: 'IOCL Tirupati', shortName: 'IOCL Tirupati', category: 'iocl', icon: '🛢️' },
  { gid: '1642019228', name: 'IOCL Warangal', shortName: 'IOCL Warangal', category: 'iocl', icon: '🛢️' },
  { gid: '1920245490', name: 'IOCL Secunderabad', shortName: 'IOCL Secunderabad', category: 'iocl', icon: '🛢️' },
  { gid: '2004258151', name: 'IOCL Nizamabad', shortName: 'IOCL Nizamabad', category: 'iocl', icon: '🛢️' },
  { gid: '1666678437', name: 'IOCL Bathinda', shortName: 'IOCL Bathinda', category: 'iocl', icon: '🛢️' },
  { gid: '458687889', name: 'IOCL Raipur DO', shortName: 'IOCL Raipur', category: 'iocl', icon: '🛢️' },
  { gid: '178072507', name: 'IOCL Vizag', shortName: 'IOCL Vizag', category: 'iocl', icon: '🛢️' },
  { gid: '1087865048', name: 'IOCL Bangalore DO', shortName: 'IOCL Bangalore', category: 'iocl', icon: '🛢️' },
  { gid: '1871920534', name: 'IOCL Moradabad DO', shortName: 'IOCL Moradabad', category: 'iocl', icon: '🛢️' },
  { gid: '1053026690', name: 'Transrail Lighting Ltd', shortName: 'Transrail', category: 'other', icon: '💡' },
  { gid: '1485879867', name: 'Genpact India - DLF Gurgaon', shortName: 'Genpact', category: 'other', icon: '🏗️' },
  { gid: '1545839474', name: 'IOCL Mumbai DO', shortName: 'IOCL Mumbai', category: 'iocl', icon: '🛢️' },
  { gid: '477557482', name: 'NFC Hyderabad', shortName: 'NFC Hyderabad', category: 'other', icon: '☢️' },
  { gid: '279843949', name: 'NFC Kota Township', shortName: 'NFC Kota', category: 'other', icon: '☢️' },
  { gid: '671962254', name: 'HPCL Loni', shortName: 'HPCL Loni', category: 'billing', icon: '⛽' },
  { gid: '387496523', name: 'IOCL Jharsuguda', shortName: 'IOCL Jharsuguda', category: 'iocl', icon: '🛢️' },
  { gid: '323328787', name: 'IOCL Sarpara', shortName: 'IOCL Sarpara', category: 'iocl', icon: '🛢️' },
  { gid: '1725908395', name: 'IOCL Allahabad', shortName: 'IOCL Allahabad', category: 'iocl', icon: '🛢️' },
  { gid: '493192291', name: 'IOCL Khunti', shortName: 'IOCL Khunti', category: 'iocl', icon: '🛢️' },
  { gid: '1199190624', name: 'IOCL Ahmednagar', shortName: 'IOCL Ahmednagar', category: 'iocl', icon: '🛢️' },
  { gid: '1110433204', name: 'IOCL Paradeep Automation', shortName: 'IOCL Paradeep Auto', category: 'iocl', icon: '🛢️' },
  { gid: '606059273', name: 'IOCL Jatni', shortName: 'IOCL Jatni', category: 'iocl', icon: '🛢️' },
  { gid: '1612881510', name: 'IOCL Loni', shortName: 'IOCL Loni', category: 'iocl', icon: '🛢️' },
  { gid: '1855046779', name: 'IOCL Howrah', shortName: 'IOCL Howrah', category: 'iocl', icon: '🛢️' },
  { gid: '980845244', name: 'IOCL Kanpur', shortName: 'IOCL Kanpur', category: 'iocl', icon: '🛢️' },
  { gid: '989690966', name: 'IOCL Barauni', shortName: 'IOCL Barauni', category: 'iocl', icon: '🛢️' },
  { gid: '0', name: 'IOCL Mathura BDFP', shortName: 'IOCL Mathura', category: 'iocl', icon: '🛢️' },
  { gid: '2070489175', name: 'IOCL Panipat DO', shortName: 'IOCL Panipat DO', category: 'iocl', icon: '🛢️' },
  { gid: '776970165', name: 'IOCL Salem', shortName: 'IOCL Salem', category: 'iocl', icon: '🛢️' },
  { gid: '1201529354', name: 'IOCL Coimbatore', shortName: 'IOCL Coimbatore', category: 'iocl', icon: '🛢️' },
  { gid: '1729965160', name: 'IOCL Madurai', shortName: 'IOCL Madurai', category: 'iocl', icon: '🛢️' },
  { gid: '131840235', name: 'IOCL Trichy', shortName: 'IOCL Trichy', category: 'iocl', icon: '🛢️' },
  { gid: '923489850', name: 'IOCL Chennai', shortName: 'IOCL Chennai', category: 'iocl', icon: '🛢️' },
  { gid: '996674553', name: 'IOCL Hissar', shortName: 'IOCL Hissar', category: 'iocl', icon: '🛢️' },
  { gid: '2095150463', name: 'IOCL Panipat Refinery', shortName: 'IOCL Panipat Ref', category: 'iocl', icon: '🛢️' },
  { gid: '22890483', name: 'IOCL Nashik', shortName: 'IOCL Nashik', category: 'iocl', icon: '🛢️' },
];

export const CATEGORIES = [
  { key: 'all', label: 'All Sheets', icon: '📁' },
  { key: 'overview', label: 'Overview', icon: '📊' },
  { key: 'sales', label: 'Sales', icon: '📋' },
  { key: 'billing', label: 'Billing', icon: '💰' },
  { key: 'iocl', label: 'IOCL Sites', icon: '🛢️' },
  { key: 'other', label: 'Other Clients', icon: '🏗️' },
];

export function getSheetCsvUrl(gid: string): string {
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;
}

export function getSheetEditUrl(gid: string): string {
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?gid=${gid}#gid=${gid}`;
}

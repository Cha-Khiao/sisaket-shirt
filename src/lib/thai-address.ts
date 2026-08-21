type AddressDB = Record<string, Record<string, { s: string; z: string }[]>>;

export interface AddressEntry {
  province: string;
  district: string;
  subdistrict: string;
  zipcode: string;
}

let db: AddressDB | null = null;
let _provinces: string[] = [];
let loadPromise: Promise<void> | null = null;

function ensureLoaded(): Promise<void> {
  if (db) return Promise.resolve();
  if (!loadPromise) {
    loadPromise = fetch('/thai-address.json')
      .then(r => r.json())
      .then((data: AddressDB) => {
        db = data;
        _provinces = Object.keys(db).sort();
      });
  }
  return loadPromise;
}

export async function loadAddressData(): Promise<void> {
  return ensureLoaded();
}

export function getProvinces(): string[] {
  return _provinces;
}

export function getDistricts(province: string): string[] {
  if (!db) return [];
  const p = db[province];
  return p ? Object.keys(p).sort() : [];
}

export function getSubdistricts(province: string, district: string): string[] {
  if (!db) return [];
  const subs = db[province]?.[district];
  return subs ? subs.map(s => s.s).sort() : [];
}

export function getZipcode(province: string, district: string, subdistrict: string): string {
  if (!db) return '';
  const subs = db[province]?.[district];
  const found = subs?.find(s => s.s === subdistrict);
  return found?.z || '';
}

export function searchByZipcode(zipcode: string): AddressEntry[] {
  if (!db) return [];
  const results: AddressEntry[] = [];
  for (const [province, districts] of Object.entries(db)) {
    for (const [district, subs] of Object.entries(districts)) {
      for (const sub of subs) {
        if (sub.z === zipcode) {
          results.push({ province, district, subdistrict: sub.s, zipcode });
        }
      }
    }
  }
  return results;
}

export function searchProvinces(query: string): string[] {
  if (!query) return _provinces;
  return _provinces.filter(p => p.includes(query));
}

export function searchDistricts(province: string, query: string): string[] {
  const all = getDistricts(province);
  if (!query) return all;
  return all.filter(d => d.includes(query));
}

export function searchSubdistricts(province: string, district: string, query: string): string[] {
  const all = getSubdistricts(province, district);
  if (!query) return all;
  return all.filter(s => s.includes(query));
}

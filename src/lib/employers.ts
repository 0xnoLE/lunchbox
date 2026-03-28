export interface IndustrySector {
  naicsCode: string;
  label: string;
  employees: number;
  establishments: number;
  emoji: string;
}

export interface EmployerData {
  zip: string;
  sectors: IndustrySector[];
  totalEmployees: number;
  totalEstablishments: number;
}

const NAICS_EMOJIS: Record<string, string> = {
  '11': '🌾',
  '21': '⛏️',
  '22': '⚡',
  '23': '🏗️',
  '31': '🏭',
  '32': '🏭',
  '33': '🏭',
  '42': '📦',
  '44': '🛍️',
  '45': '🛍️',
  '48': '🚛',
  '49': '📮',
  '51': '💻',
  '52': '🏦',
  '53': '🏢',
  '54': '🔬',
  '55': '🏛️',
  '56': '🧹',
  '61': '🎓',
  '62': '🏥',
  '71': '🎭',
  '72': '🍽️',
  '81': '🔧',
  '92': '🏛️',
  '99': '🏢',
  '00': '🏢',
};

const NAICS_LABELS: Record<string, string> = {
  '11': 'Agriculture & Forestry',
  '21': 'Mining & Extraction',
  '22': 'Utilities',
  '23': 'Construction',
  '31': 'Manufacturing',
  '32': 'Manufacturing',
  '33': 'Manufacturing',
  '42': 'Wholesale Trade',
  '44': 'Retail Trade',
  '45': 'Retail Trade',
  '48': 'Transportation',
  '49': 'Warehousing & Postal',
  '51': 'Information & Tech',
  '52': 'Finance & Insurance',
  '53': 'Real Estate',
  '54': 'Professional Services',
  '55': 'Management',
  '56': 'Administrative Services',
  '61': 'Educational Services',
  '62': 'Health Care',
  '71': 'Arts & Entertainment',
  '72': 'Food & Hospitality',
  '81': 'Other Services',
  '92': 'Public Administration',
};

export async function getEmployerData(zip: string): Promise<EmployerData | null> {
  // Clean zip to 5 digits
  const cleanZip = zip.replace(/\D/g, '').substring(0, 5);
  if (cleanZip.length !== 5) return null;

  try {
    const url = `https://api.census.gov/data/2021/cbp?get=NAME,EMP,ESTAB,NAICS2017_LABEL,NAICS2017&for=zip+code+tabulation+area:${cleanZip}&NAICS2017=00`;

    const response = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`Census API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length < 2) {
      return null;
    }

    // data[0] is headers, data[1..] are rows
    const headers: string[] = data[0];
    const empIdx = headers.indexOf('EMP');
    const estabIdx = headers.indexOf('ESTAB');

    const row = data[1];
    const totalEmployees = parseInt(row[empIdx]) || 0;
    const totalEstablishments = parseInt(row[estabIdx]) || 0;

    // Now fetch by major sector
    const sectors = await getMajorIndustries(cleanZip);

    return {
      zip: cleanZip,
      sectors,
      totalEmployees,
      totalEstablishments,
    };
  } catch (error) {
    console.error('Error fetching employer data:', error);
    // Return sectors only
    try {
      const sectors = await getMajorIndustries(zip);
      return {
        zip,
        sectors,
        totalEmployees: sectors.reduce((sum, s) => sum + s.employees, 0),
        totalEstablishments: sectors.reduce((sum, s) => sum + s.establishments, 0),
      };
    } catch {
      return null;
    }
  }
}

export async function getMajorIndustries(zip: string): Promise<IndustrySector[]> {
  const cleanZip = zip.replace(/\D/g, '').substring(0, 5);
  if (cleanZip.length !== 5) return [];

  try {
    // Fetch 2-digit NAICS sector data
    const sectorCodes = ['23', '31', '44', '48', '51', '52', '54', '61', '62', '72', '92'];
    const url = `https://api.census.gov/data/2021/cbp?get=NAICS2017,EMP,ESTAB&for=zip+code+tabulation+area:${cleanZip}&NAICS2017=${sectorCodes.join(',')}`;

    const response = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`Census sectors API failed: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length < 2) {
      return [];
    }

    const headers: string[] = data[0];
    const naicsIdx = headers.indexOf('NAICS2017');
    const empIdx = headers.indexOf('EMP');
    const estabIdx = headers.indexOf('ESTAB');

    const sectors: IndustrySector[] = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const naics = row[naicsIdx];
      const employees = parseInt(row[empIdx]) || 0;
      const establishments = parseInt(row[estabIdx]) || 0;

      if (employees > 0) {
        sectors.push({
          naicsCode: naics,
          label: NAICS_LABELS[naics] || `Industry ${naics}`,
          employees,
          establishments,
          emoji: NAICS_EMOJIS[naics] || '🏢',
        });
      }
    }

    return sectors.sort((a, b) => b.employees - a.employees).slice(0, 10);
  } catch (error) {
    console.error('Error fetching major industries:', error);
    return [];
  }
}

export const DEMO_META = {
  outlet: 'Cyberhub Gourmet Kitchen #03',
  location: 'Ground Floor, Building 10, Sector 24',
  auditor: 'Rajesh Verma (Lead QHS Inspector)',
  rep: 'Chef Santosh Kumar (Kitchen Manager)',
}

// Realistic non-conformances layered on top of an otherwise all-pass run
export const DEMO_OVERRIDES = {
  14: { status: 'F', obs: '2 dressing squeeze bottles missing date-opened sticker' },
  29: { status: 'F', obs: 'Soup bain-marie operating at 58°C, thermostat dialed up to 70°C immediately' },
  47: { status: 'F', obs: 'Exhaust baffle filters due for deep degreasing cycle' },
  58: { status: 'P', obs: 'Pest control done 28-Aug-2026, certificate valid' },
  60: { status: 'P', obs: 'Cleaned on 01-Sep-2026' },
}

// Predefined relational pricing matrix for vehicle parts, damage severity and labor hours (INR)
export const PARTS_CATALOG = {
  front_bumper: {
    name: 'Front Bumper Assembly',
    category: 'Exterior Body',
    basePartCost: 5500,
    paintCost: 2500,
    laborHours: 2.5,
    hourlyRate: 600,
    oemCode: 'OEM-FB-4091',
  },
  rear_bumper: {
    name: 'Rear Bumper Assembly',
    category: 'Exterior Body',
    basePartCost: 4800,
    paintCost: 2200,
    laborHours: 2.0,
    hourlyRate: 600,
    oemCode: 'OEM-RB-3210',
  },
  hood: {
    name: 'Engine Hood / Bonnet',
    category: 'Sheet Metal',
    basePartCost: 9200,
    paintCost: 3800,
    laborHours: 3.5,
    hourlyRate: 650,
    oemCode: 'OEM-HD-7712',
  },
  left_fender: {
    name: 'Left Front Fender',
    category: 'Sheet Metal',
    basePartCost: 3800,
    paintCost: 2200,
    laborHours: 2.0,
    hourlyRate: 600,
    oemCode: 'OEM-LF-5110',
  },
  right_fender: {
    name: 'Right Front Fender',
    category: 'Sheet Metal',
    basePartCost: 3800,
    paintCost: 2200,
    laborHours: 2.0,
    hourlyRate: 600,
    oemCode: 'OEM-RF-5111',
  },
  headlight_left: {
    name: 'Left LED Headlight Unit',
    category: 'Electrical & Optics',
    basePartCost: 7500,
    paintCost: 0,
    laborHours: 1.0,
    hourlyRate: 600,
    oemCode: 'OEM-HL-9014',
  },
  headlight_right: {
    name: 'Right LED Headlight Unit',
    category: 'Electrical & Optics',
    basePartCost: 7500,
    paintCost: 0,
    laborHours: 1.0,
    hourlyRate: 600,
    oemCode: 'OEM-HR-9015',
  },
  windshield: {
    name: 'Acoustic Windshield Glass',
    category: 'Glass',
    basePartCost: 6800,
    paintCost: 0,
    laborHours: 3.0,
    hourlyRate: 700,
    oemCode: 'OEM-WS-1200',
  },
  left_door: {
    name: 'Front Left Door Panel',
    category: 'Sheet Metal',
    basePartCost: 8500,
    paintCost: 3500,
    laborHours: 3.0,
    hourlyRate: 650,
    oemCode: 'OEM-DL-6421',
  },
  right_door: {
    name: 'Front Right Door Panel',
    category: 'Sheet Metal',
    basePartCost: 8500,
    paintCost: 3500,
    laborHours: 3.0,
    hourlyRate: 650,
    oemCode: 'OEM-DR-6422',
  },
  rear_quarter_panel: {
    name: 'Rear Quarter Panel',
    category: 'Body Shell',
    basePartCost: 7200,
    paintCost: 3000,
    laborHours: 3.0,
    hourlyRate: 600,
    oemCode: 'OEM-RQ-8831',
  },
  radiator_grille: {
    name: 'Radiator & Chrome Grille Assembly',
    category: 'Cooling & Front End',
    basePartCost: 6200,
    paintCost: 800,
    laborHours: 2.0,
    hourlyRate: 600,
    oemCode: 'OEM-RG-2201',
  },
};

export const SEVERITY_MULTIPLIERS = {
  minor: {
    label: 'Minor',
    code: 'MIN',
    range: '10% – 30%',
    partMultiplier: 0.35, // Can often be repaired rather than full replacement
    paintMultiplier: 0.6,
    laborMultiplier: 0.7,
    action: 'Surface Buffing / Spot Repair',
  },
  moderate: {
    label: 'Moderate',
    code: 'MOD',
    range: '31% – 70%',
    partMultiplier: 0.85,
    paintMultiplier: 1.0,
    laborMultiplier: 1.1,
    action: 'Panel Beating & Full Section Refinishing',
  },
  severe: {
    label: 'Severe',
    code: 'SEV',
    range: '71% – 100%',
    partMultiplier: 1.25, // Full OEM replacement + mounting brackets
    paintMultiplier: 1.2,
    laborMultiplier: 1.6,
    action: 'Complete Part Replacement & Structural Realignment',
  },
};

/**
 * Calculate detailed cost breakdown based on detected damaged parts and overall severity
 */
export function calculateDamageCost(detectedParts = [], severityKey = 'moderate') {
  const severity = SEVERITY_MULTIPLIERS[severityKey] || SEVERITY_MULTIPLIERS.moderate;
  
  if (!detectedParts.length) {
    detectedParts = ['front_bumper'];
  }

  let totalPartsCost = 0;
  let totalPaintCost = 0;
  let totalLaborCost = 0;
  let totalLaborHours = 0;
  const items = [];

  detectedParts.forEach(partKey => {
    const part = PARTS_CATALOG[partKey] || PARTS_CATALOG.front_bumper;
    const partCost = Math.round(part.basePartCost * severity.partMultiplier);
    const paintCost = Math.round(part.paintCost * severity.paintMultiplier);
    const laborCost = Math.round(part.laborHours * part.hourlyRate * severity.laborMultiplier);
    const itemTotal = partCost + paintCost + laborCost;

    totalPartsCost += partCost;
    totalPaintCost += paintCost;
    totalLaborCost += laborCost;
    totalLaborHours += (part.laborHours * severity.laborMultiplier);

    items.push({
      partKey,
      partName: part.name,
      category: part.category,
      oemCode: part.oemCode,
      partCost,
      paintCost,
      laborCost,
      laborHours: Number((part.laborHours * severity.laborMultiplier).toFixed(1)),
      itemTotal,
      action: severity.action,
    });
  });

  const subTotal = totalPartsCost + totalPaintCost + totalLaborCost;
  // Apply consumable charges (fasteners, primer, masking) approx 5%
  const consumables = Math.round(subTotal * 0.04);
  // GST 18% standard for motor repairs
  const gst = Math.round((subTotal + consumables) * 0.18);
  const totalPayout = subTotal + consumables + gst;

  return {
    items,
    totalPartsCost,
    totalPaintCost,
    totalLaborCost,
    totalLaborHours: Number(totalLaborHours.toFixed(1)),
    consumables,
    gst,
    subTotal,
    totalPayout,
    severity: severity.label,
    severityRange: severity.range,
  };
}

export function formatINR(amount) {
  if (typeof amount !== 'number') return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
}

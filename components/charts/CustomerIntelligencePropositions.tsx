'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

const NUM_ROWS = 7

// Color scheme matching the images
const HEADER_COLORS = {
  customerInfo: '#FDDCB5',
  contactDetails: '#A8D8E8',
  threatExposure: '#C8E6C9',
  purchasingBehaviour: '#E1BEE7',
  serviceRequirements: '#FDDCB5',
  cmiInsights: '#A8D8E8',
}

const SUB_HEADER_BG = '#B0D4E8'

// --- Column definitions ---
const customerInfoColumns = [
  'Customer Name',
  'Company Name',
  'Country',
  'Type of Business (Shipowner, Shipyard, Naval Authority, Offshore Operator)',
  'Vessel Fleet Type (Commercial Cargo, Tanker, Offshore Support Vessel, Naval)',
  'Installed Gearbox Brand & Model',
  'Other Key Insights (Gearbox Power Range (kW / MW), Fleet Size & Average Vessel)',
]

const contactDetailsColumns = [
  'Key Contact Person',
  'Designation/Role (Technical Superintendent, Fleet Manager, Chief Engineer, Head of Procurement)',
  'Email Address',
  'Phone/WhatsApp Number',
  'LinkedIn Profile',
  'Website URL',
]

const threatExposureColumns = [
  'Types of Failure Drivers',
  'Past Incidents or Recent Triggers',
  'Others (Vessel Downtime Risk, Charter Revenue Loss Risk, etc.)',
]

const purchasingBehaviourColumns = [
  'Decision-makers (CSO, CISO, and Others)',
  'Procurement Method',
  'Approx. Budget',
]

const serviceRequirementsColumns = [
  'Type of Gearbox Required',
  'Service Intensity (Periodic, shutdown-based, etc.)',
  'Preferred Contract Duration (Monthly/Yearly)',
  'Technology Expectations',
  'Compliance & Certification Requirements',
]

const cmiInsightsColumns = [
  'Customer Benchmarking Summary',
  'Additional Comments / Notes by CMI Team',
]

// --- Demo data ---
const DEMO_DATA: Record<string, string[][]> = {
  'Customer Information': [
    ['Maersk Line', 'A.P. Moller-Maersk', 'Denmark', 'Shipowner', 'Commercial Cargo, Container Ships', 'MAN Energy Solutions / Alpha CP', '15,000 kW avg, 700+ vessels, 10,000-24,000 TEU avg'],
    ['NYK Line', 'Nippon Yusen Kabushiki Kaisha', 'Japan', 'Shipowner', 'Commercial Cargo, Tanker, Car Carrier', 'Wartsila / Gear WLL-2500', '8,500 kW avg, 500+ vessels, Panamax-class avg'],
    ['Fincantieri S.p.A.', 'Fincantieri', 'Italy', 'Shipyard', 'Naval, Commercial Cargo', 'RENK AG / MARRS-D Series', '22,000 kW, 50+ builds/yr, Destroyer & Frigate class'],
    ['COSCO Shipping', 'China COSCO Shipping Corp.', 'China', 'Shipowner', 'Commercial Cargo, Tanker, Bulk Carrier', 'CSSC / MG-6000 Series', '12,000 kW avg, 1,300+ vessels, VLCC & Capesize avg'],
    ['Bourbon Offshore', 'Bourbon Corp.', 'France', 'Offshore Operator', 'Offshore Support Vessel', 'ZF Marine / ZF 9300', '5,500 kW avg, 250+ vessels, PSV & AHTS avg'],
    ['Indian Navy', 'Ministry of Defence, India', 'India', 'Naval Authority', 'Naval (Frigate, Corvette, Submarine)', 'BEL/GRSE / Indigenous COGAG', '30,000 kW, 140+ vessels, Destroyer & Submarine class'],
    ['Tidewater Inc.', 'Tidewater Inc.', 'United States', 'Shipowner', 'Offshore Support Vessel', 'Reintjes / WAF Series', '4,200 kW avg, 200+ vessels, PSV class avg'],
  ],
  'Contact Details': [
    ['Henrik Jensen', 'Technical Superintendent', 'h.jensen@maersk.com', '+45 3363 XXXX', 'linkedin.com/in/henrikj', 'www.maersk.com'],
    ['Takeshi Yamamoto', 'Fleet Manager', 't.yamamoto@nyk.com', '+81 3 3284 XXXX', 'linkedin.com/in/takeshiy', 'www.nyk.com'],
    ['Marco Bellini', 'Chief Engineer', 'm.bellini@fincantieri.it', '+39 040 319 XXXX', 'linkedin.com/in/marcob', 'www.fincantieri.com'],
    ['Wei Zhang', 'Head of Procurement', 'w.zhang@cosco.com', '+86 21 6596 XXXX', 'linkedin.com/in/weizhang', 'www.coscoshipping.com'],
    ['Pierre Durand', 'Technical Superintendent', 'p.durand@bourbon-online.com', '+33 4 91 13 XXXX', 'linkedin.com/in/pierred', 'www.bourbonoffshore.com'],
    ['Adm. R. Sharma', 'Director General Naval Design', 'r.sharma@navy.gov.in', '+91 11 2301 XXXX', 'N/A', 'www.indiannavy.nic.in'],
    ['James Miller', 'Fleet Manager', 'j.miller@tidewater.com', '+1 713 470 XXXX', 'linkedin.com/in/jamesm', 'www.tidewater.com'],
  ],
  'Threat Exposure & Risk Drivers': [
    ['Gear tooth fatigue, bearing wear, lubrication failure', 'Gearbox overhaul on 2 vessels in 2024', 'High downtime risk; $45K/day revenue loss per vessel'],
    ['Misalignment, vibration-induced cracking', 'Propulsion failure incident Q3 2023', 'Charter revenue loss risk; aging fleet concern'],
    ['Thermal stress, shock loading during sea trials', 'Warranty claim on 3 vessels in 2024', 'Delivery delay risk; reputational impact'],
    ['Corrosion, overload fatigue, seal degradation', 'Emergency drydock for 4 tankers in 2023', 'Vessel downtime risk; $55K/day revenue loss'],
    ['Harsh environment erosion, dynamic load stress', 'Gearbox replacement on 5 PSVs in 2024', 'Offshore contract penalty risk; $30K/day'],
    ['Combat damage tolerance, shock loading', 'Gearbox refit program 2023-2025', 'Operational readiness risk; strategic impact'],
    ['Corrosion, seal failure in tropical waters', 'Unplanned maintenance on 8 vessels 2024', 'Charter revenue loss; $25K/day per vessel'],
  ],
  'Purchasing Behaviour': [
    ['VP Fleet Operations, CPO', 'Global tender, framework agreement', '$8M - $12M annually'],
    ['CTO, Head of Marine Engineering', 'Direct OEM negotiation', '$5M - $8M annually'],
    ['Director of Procurement, Naval Architect', 'Government tender process', '$15M - $25M per program'],
    ['VP Engineering, Group CPO', 'Competitive bidding, consortium', '$10M - $18M annually'],
    ['COO, Technical Director', 'Preferred supplier list', '$3M - $5M annually'],
    ['DGND, Acquisition Director', 'Defence procurement process', '$20M - $40M per program'],
    ['SVP Operations, Procurement Manager', 'Reverse auction, RFQ', '$2M - $4M annually'],
  ],
  'Service Requirements': [
    ['Helical, Two-stage, 10,000-20,000 kW', 'Periodic (5-year intervals)', 'Multi-year (3-5 yr framework)', 'Condition monitoring, digital twin', 'DNV GL, IMO Tier III'],
    ['Bevel, Two-stage, 5,000-12,000 kW', 'Periodic (4-year intervals)', 'Yearly renewable', 'Predictive maintenance sensors', 'ClassNK, SOLAS'],
    ['Helical, Three-stage, 15,000-30,000 kW', 'Shutdown-based', 'Per-program (5-10 yr)', 'Low noise/vibration, CODLAG', 'NATO STANAG, RINA Naval'],
    ['Helical, Two-stage, 8,000-18,000 kW', 'Periodic (5-year intervals)', 'Multi-year (3 yr framework)', 'Remote monitoring, IoT sensors', 'CCS, IMO Tier II/III'],
    ['Spur, Single-stage, 3,000-7,000 kW', 'Shutdown-based (dry dock)', 'Yearly renewable', 'Compact design, high torque density', 'Bureau Veritas, ABS'],
    ['Helical, Three-stage, 20,000-40,000 kW', 'Periodic + shutdown-based', 'Per-program (10-15 yr)', 'Shock resistance, stealth', 'IRS, MIL-STD-167'],
    ['Spur, Single-stage, 2,500-5,000 kW', 'Periodic (3-year intervals)', 'Yearly renewable', 'Fuel efficiency optimization', 'ABS, USCG compliance'],
  ],
  'CMI Insights': [
    ['Top 3 global fleet operator; early adopter of green gearbox tech; high retention value', 'Priority target for premium service contracts'],
    ['Strong Japan market anchor; diversified fleet; potential for standardized gearbox supply', 'Explore multi-year framework deal'],
    ['Key European defence shipbuilder; high-value contracts; long procurement cycles', 'Engage early in new frigate programs'],
    ['Largest Chinese fleet; aggressive expansion; price-sensitive but volume-driven', 'Volume discount strategy recommended'],
    ['Mid-tier OSV operator; cost-conscious; consolidating supplier base', 'Bundle service + spare parts offering'],
    ['Strategic government account; long-term programs; indigenous sourcing preference', 'JV/technology transfer opportunity'],
    ['Major US OSV operator; fleet renewal underway; prefers US-certified suppliers', 'Align with US content requirements'],
  ],
}

interface SectionDef {
  groupName: string
  color: string
  subHeaderBg: string
  columns: string[]
}

function DemoTable({ sections }: { sections: SectionDef[] }) {
  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg">
      <table className="w-full text-sm border-collapse min-w-[1200px]">
        <thead>
          <tr>
            {sections.map((section, idx) => (
              <th
                key={idx}
                colSpan={section.columns.length}
                className="border border-gray-300 px-3 py-2 text-center font-bold text-sm text-black"
                style={{ backgroundColor: section.color }}
              >
                {section.groupName}
              </th>
            ))}
          </tr>
          <tr>
            {sections.map((section) =>
              section.columns.map((col, colIdx) => (
                <th
                  key={`${section.groupName}-${colIdx}`}
                  className="border border-gray-300 px-3 py-2 text-center font-semibold text-xs text-black min-w-[120px] max-w-[180px]"
                  style={{ backgroundColor: section.subHeaderBg }}
                >
                  {col}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: NUM_ROWS }, (_, rowIdx) => (
            <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {sections.map((section) =>
                section.columns.map((_, colIdx) => {
                  const sectionData = DEMO_DATA[section.groupName]
                  const cellValue = sectionData?.[rowIdx]?.[colIdx] ?? 'xx'
                  return (
                    <td
                      key={`${section.groupName}-${rowIdx}-${colIdx}`}
                      className="border border-gray-300 px-3 py-3 text-center text-sm text-black"
                    >
                      {cellValue}
                    </td>
                  )
                })
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AccordionItem({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white hover:from-[#34495E] hover:to-[#2C3E50] transition-all"
      >
        <span className="font-semibold text-sm">{title}</span>
        {isOpen ? (
          <ChevronDown className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  )
}

export function CustomerIntelligencePropositions({ height }: { height?: number }) {
  const prop1Sections: SectionDef[] = [
    { groupName: 'Customer Information', color: HEADER_COLORS.customerInfo, subHeaderBg: SUB_HEADER_BG, columns: customerInfoColumns },
    { groupName: 'Contact Details', color: HEADER_COLORS.contactDetails, subHeaderBg: SUB_HEADER_BG, columns: contactDetailsColumns },
  ]

  const prop2Sections: SectionDef[] = [
    ...prop1Sections,
    { groupName: 'Threat Exposure & Risk Drivers', color: HEADER_COLORS.threatExposure, subHeaderBg: '#B5D8B5', columns: threatExposureColumns },
    { groupName: 'Purchasing Behaviour', color: HEADER_COLORS.purchasingBehaviour, subHeaderBg: '#D1A8E0', columns: purchasingBehaviourColumns },
  ]

  const prop3Sections: SectionDef[] = [
    ...prop2Sections,
    { groupName: 'Service Requirements', color: HEADER_COLORS.serviceRequirements, subHeaderBg: SUB_HEADER_BG, columns: serviceRequirementsColumns },
    { groupName: 'CMI Insights', color: HEADER_COLORS.cmiInsights, subHeaderBg: SUB_HEADER_BG, columns: cmiInsightsColumns },
  ]

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-black">Customer Intelligence Database</h2>
        <p className="text-sm text-gray-600 mt-1">
          Three proposition levels for customer profiling and intelligence gathering
        </p>
      </div>

      <AccordionItem title="Proposition 1 - Basic" defaultOpen={true}>
        <p className="text-xs text-gray-500 mb-3">
          Basic customer profiling with company details and contact information.
        </p>
        <DemoTable sections={prop1Sections} />
      </AccordionItem>

      <AccordionItem title="Proposition 2 - Advanced">
        <p className="text-xs text-gray-500 mb-3">
          Includes Proposition 1 plus threat exposure analysis and purchasing behaviour insights.
        </p>
        <DemoTable sections={prop2Sections} />
      </AccordionItem>

      <AccordionItem title="Proposition 3 - Premium">
        <p className="text-xs text-gray-500 mb-3">
          Includes Proposition 2 plus service requirements and CMI team insights.
        </p>
        <DemoTable sections={prop3Sections} />
      </AccordionItem>
    </div>
  )
}

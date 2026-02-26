'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

const PLACEHOLDER = 'xx'
const NUM_ROWS = 7

// Color scheme matching the images
const HEADER_COLORS = {
  customerInfo: '#FDDCB5',    // Light peach/orange
  contactDetails: '#A8D8E8',  // Light cyan/blue
  threatExposure: '#C8E6C9',  // Light green
  purchasingBehaviour: '#E1BEE7', // Light purple
  serviceRequirements: '#FDDCB5', // Light peach/orange
  cmiInsights: '#A8D8E8',     // Light cyan/blue
}

const SUB_HEADER_BG = '#B0D4E8' // Slightly darker cyan for sub-headers

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

function PlaceholderTable({ sections }: { sections: Array<{ groupName: string; color: string; subHeaderBg: string; columns: string[] }> }) {
  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg">
      <table className="w-full text-sm border-collapse min-w-[1200px]">
        <thead>
          {/* Group header row */}
          <tr>
            {sections.map((section, idx) => (
              <th
                key={idx}
                colSpan={section.columns.length}
                className="border border-gray-300 px-3 py-2 text-center font-bold text-sm"
                style={{ backgroundColor: section.color }}
              >
                {section.groupName}
              </th>
            ))}
          </tr>
          {/* Sub-header row */}
          <tr>
            {sections.map((section) =>
              section.columns.map((col, colIdx) => (
                <th
                  key={`${section.groupName}-${colIdx}`}
                  className="border border-gray-300 px-3 py-2 text-center font-semibold text-xs min-w-[120px] max-w-[180px]"
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
                section.columns.map((_, colIdx) => (
                  <td
                    key={`${section.groupName}-${rowIdx}-${colIdx}`}
                    className="border border-gray-300 px-3 py-3 text-center text-sm text-black"
                  >
                    {colIdx === 0 && section === sections[0] ? `Customer ${rowIdx + 1}` : PLACEHOLDER}
                  </td>
                ))
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
  // Proposition 1: Customer Information + Contact Details
  const prop1Sections = [
    { groupName: 'Customer Information', color: HEADER_COLORS.customerInfo, subHeaderBg: SUB_HEADER_BG, columns: customerInfoColumns },
    { groupName: 'Contact Details', color: HEADER_COLORS.contactDetails, subHeaderBg: SUB_HEADER_BG, columns: contactDetailsColumns },
  ]

  // Proposition 2: Proposition 1 + Threat Exposure & Risk Drivers + Purchasing Behaviour
  const prop2Sections = [
    ...prop1Sections,
    { groupName: 'Threat Exposure & Risk Drivers', color: HEADER_COLORS.threatExposure, subHeaderBg: '#B5D8B5', columns: threatExposureColumns },
    { groupName: 'Purchasing Behaviour', color: HEADER_COLORS.purchasingBehaviour, subHeaderBg: '#D1A8E0', columns: purchasingBehaviourColumns },
  ]

  // Proposition 3: Proposition 2 + Service Requirements + CMI Insights
  const prop3Sections = [
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
        <PlaceholderTable sections={prop1Sections} />
      </AccordionItem>

      <AccordionItem title="Proposition 2 - Advanced">
        <p className="text-xs text-gray-500 mb-3">
          Includes Proposition 1 plus threat exposure analysis and purchasing behaviour insights.
        </p>
        <PlaceholderTable sections={prop2Sections} />
      </AccordionItem>

      <AccordionItem title="Proposition 3 - Premium">
        <p className="text-xs text-gray-500 mb-3">
          Includes Proposition 2 plus service requirements and CMI team insights.
        </p>
        <PlaceholderTable sections={prop3Sections} />
      </AccordionItem>
    </div>
  )
}

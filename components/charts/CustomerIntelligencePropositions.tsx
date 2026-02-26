'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

const NUM_ROWS = 10

// Color scheme matching the images
const HEADER_COLORS = {
  customerInfo: '#FDDCB5',
  contactDetails: '#A8D8E8',
  needsPainPoints: '#B0D4E8',
  cmiInsights: '#B0D4E8',
}

const SUB_HEADER_BG = '#B0D4E8'
const NEEDS_SUB_BG = '#D6EAF4'
const CMI_SUB_BG = '#D6EAF4'

// ============================================================
// PROPOSITION 1 - Brokerage Service
// ============================================================
const prop1CustomerInfoColumns = [
  'Organization / Company Name',
  'Parent Group / Holding Company',
  'Country',
  'City / Hub (Marina / Cluster)',
  'Customer Type',
  'Brokerage Service Focus',
  'Propulsion Preference',
  'Transaction / Portfolio Size',
  'Key Regions of Operation',
]

const prop1ContactColumns = [
  'Key Contact Person',
  'Designation / Department',
  'Email Address',
  'Phone / WhatsApp',
  'LinkedIn Profile',
  'Website URL',
]

const prop1NeedsColumns = [
  'Primary Need Focus (Products / Services / Both)',
  'Key Needs \u2013 New Build Brokerage',
  'Key Needs \u2013 Pre-Owned Brokerage',
  'Key Needs \u2013 Sale & Purchase Advisory',
  'Pain Points / Challenges',
]

const prop1CmiColumns = [
  'Benchmarking Summary (Peer Group)',
  'Strategic Fit Score (1-5)',
  'Source / Reference Notes',
]

// ============================================================
// PROPOSITION 2 - Management Service
// ============================================================
const prop2CustomerInfoColumns = [
  'Organization / Company Name',
  'Parent Group / Holding Company',
  'Country',
  'City / Hub (Marina / Cluster)',
  'Customer Type',
  'Management Service Focus',
  'Yacht Length Focus',
  'Propulsion Preference',
  'Fleet Under Management (#)',
  'Key Regions of Operation',
]

const prop2ContactColumns = [
  'Key Contact Person',
  'Designation / Department',
  'Email Address',
  'Phone / WhatsApp',
  'LinkedIn Profile',
  'Website URL',
]

const prop2NeedsColumns = [
  'Primary Need Focus (Products / Services / Both)',
  'Key Needs \u2013 Technical Management',
  'Key Needs \u2013 Crew Management',
  'Key Needs \u2013 Compliance / Regulatory',
  'Key Needs \u2013 Financial & Accounting',
  'Pain Points / Challenges',
]

const prop2CmiColumns = [
  'Benchmarking Summary (Peer Group)',
  'Strategic Fit Score (1-5)',
  'Source / Reference Notes',
]

// ============================================================
// PROPOSITION 3 - Charter Service
// ============================================================
const prop3CustomerInfoColumns = [
  'Organization / Company Name',
  'Parent Group / Holding Company',
  'Country',
  'City / Hub (Marina / Cluster)',
  'Customer Type',
  'Charter Service Focus',
  'Charter Model (Agency / Operator)',
  'Yacht Length Focus',
  'Propulsion Preference',
  'Charter Fleet / Listings (#)',
  'Key Regions of Operation',
]

const prop3ContactColumns = [
  'Key Contact Person',
  'Designation / Department',
  'Email Address',
  'Phone / WhatsApp',
  'LinkedIn Profile',
  'Website URL',
]

const prop3NeedsColumns = [
  'Primary Need Focus (Products / Services / Both)',
  'Key Needs \u2013 Marketing / Listings',
  'Key Needs \u2013 Booking / Sales',
  'Key Needs \u2013 Operations / Guest Experience',
  'Pain Points / Challenges',
]

const prop3CmiColumns = [
  'Benchmarking Summary (Peer Group)',
  'Strategic Fit Score (1-5)',
  'Source / Reference Notes',
]

// ============================================================
// DEMO DATA - Proposition 1 (Brokerage)
// ============================================================
const PROP1_DEMO: Record<string, string[][]> = {
  'Customer Information': [
    ['Camper & Nicholsons', 'Camper & Nicholsons International', 'United Kingdom', 'London / Antibes', 'Brokerage Firm', 'New Build & S&P', 'Conventional Diesel', '$500M+ portfolio', 'Mediterranean, Caribbean, N. America'],
    ['Burgess Yachts', 'Burgess Maritime Ltd', 'United Kingdom', 'London / Monaco', 'Brokerage Firm', 'New Build Brokerage', 'Diesel-electric', '$400M+ portfolio', 'Mediterranean, N. Europe, Asia Pacific'],
    ['Fraser Yachts', 'Fraser Group', 'Monaco', 'Monaco / Fort Lauderdale', 'Brokerage Firm', 'Sale & Purchase Advisory', 'Conventional Diesel', '$350M+ portfolio', 'Mediterranean, Caribbean'],
    ['Northrop & Johnson', 'Northrop & Johnson Inc.', 'United States', 'Fort Lauderdale / Monaco', 'Brokerage Firm', 'Pre-Owned Brokerage', 'Hybrid Propulsion', '$300M+ portfolio', 'N. America, Caribbean, Med'],
    ['Denison Yachting', 'Denison Yacht Sales', 'United States', 'Fort Lauderdale / Palm Beach', 'Brokerage Firm', 'New Build & Pre-Owned', 'Conventional Diesel', '$250M+ portfolio', 'N. America, Caribbean'],
    ['Y.CO', 'Y.CO Limited', 'United Kingdom', 'London / Monaco / Miami', 'Brokerage & Mgmt', 'Full Service Brokerage', 'Diesel-electric', '$600M+ portfolio', 'Global'],
    ['IYC (International Yacht Co.)', 'IYC Group', 'United States', 'Fort Lauderdale / Antibes', 'Brokerage Firm', 'S&P Advisory', 'Conventional Diesel', '$200M+ portfolio', 'N. America, Med'],
    ['Edmiston & Company', 'Edmiston & Company', 'United Kingdom', 'London / Monaco', 'Brokerage Firm', 'New Build Brokerage', 'Hybrid Propulsion', '$450M+ portfolio', 'Med, N. Europe, Middle East'],
    ['Merle Wood & Associates', 'Merle Wood & Associates Inc.', 'United States', 'Fort Lauderdale', 'Brokerage Firm', 'Pre-Owned & S&P', 'Conventional Diesel', '$180M+ portfolio', 'N. America, Caribbean'],
    ['Cecil Wright & Partners', 'Cecil Wright & Partners LLP', 'United Kingdom', 'London / Palma', 'Brokerage Firm', 'Sale & Purchase Advisory', 'Conventional Diesel', '$220M+ portfolio', 'Med, N. Europe'],
  ],
  'Contact Details': [
    ['Simon Trott', 'Head of Brokerage', 's.trott@camperandnicholsons.com', '+44 20 7009 XXXX', 'linkedin.com/in/simontrott', 'www.camperandnicholsons.com'],
    ['Jonathan Beckett', 'CEO / Brokerage', 'j.beckett@burgessyachts.com', '+44 20 7766 XXXX', 'linkedin.com/in/jbeckett', 'www.burgessyachts.com'],
    ['Mark de Vos', 'Head of Sales', 'm.devos@fraseryachts.com', '+377 93 XX XXXX', 'linkedin.com/in/markdevos', 'www.fraseryachts.com'],
    ['Daniel Ziriakus', 'President / S&P', 'd.ziriakus@nyachts.com', '+1 954 522 XXXX', 'linkedin.com/in/dziriakus', 'www.northropandjohnson.com'],
    ['Bob Denison', 'President / Founder', 'b.denison@denisonyachting.com', '+1 954 763 XXXX', 'linkedin.com/in/bobdenison', 'www.denisonyachting.com'],
    ['Charlie Birkett', 'CEO', 'c.birkett@y.co', '+44 20 7586 XXXX', 'linkedin.com/in/cbirkett', 'www.y.co'],
    ['Mark Elliott', 'Director of Sales', 'm.elliott@iyc.com', '+1 954 522 XXXX', 'linkedin.com/in/melliott', 'www.iyc.com'],
    ['Nicholas Edmiston', 'Founder / Chairman', 'n.edmiston@edmistoncompany.com', '+44 20 7495 XXXX', 'linkedin.com/in/nedmiston', 'www.edmistoncompany.com'],
    ['Merle Wood', 'CEO / Founder', 'm.wood@merlewoodandassociates.com', '+1 954 525 XXXX', 'linkedin.com/in/merlewood', 'www.merlewoodandassociates.com'],
    ['Cecil Wright', 'Managing Partner', 'c.wright@cecilwright.com', '+44 20 7724 XXXX', 'linkedin.com/in/cecilwright', 'www.cecilwright.com'],
  ],
  'Needs & Pain Points': [
    ['Both', 'Custom 60m+ motor yacht projects; shipyard selection advisory', 'Market access to off-market 40m-80m listings', 'Valuation & negotiation for complex multi-jurisdiction deals', 'Lengthy transaction timelines; client expectations on pricing'],
    ['Services', 'Superyacht 70m+ new build program management', 'N/A (new build focus)', 'Post-delivery S&P exit strategy advisory', 'Shipyard delays; cost overruns; client scope changes'],
    ['Both', 'N/A', 'Sourcing pre-owned 30-60m yachts; survey coordination', 'Tax-efficient ownership structuring; flag state advisory', 'Market transparency; accurate vessel valuation'],
    ['Products', 'N/A', 'Nationwide pre-owned inventory sourcing 30-50m', 'Due diligence on hull condition & class status', 'Competitive brokerage market; fee pressure'],
    ['Both', 'New build partnerships with US/European yards', 'Strong pre-owned 25-45m segment', 'Insurance & finance advisory for buyers', 'Seasonal demand swings; inventory turnover'],
    ['Both', 'Full new build supervision from concept to delivery', 'Curated off-market pre-owned portfolio', 'End-to-end transaction management; legal/tax/flag', 'High-touch client expectations; global coordination'],
    ['Services', 'N/A', 'US-based pre-owned 30-60m sourcing', 'Buyer/seller representation & negotiation', 'Market competition; digital listing platforms'],
    ['Services', 'Superyacht 80m+ new build projects; design coordination', 'N/A', 'Confidential sale advisory for UHNW clients', 'Discreet deal sourcing; long sales cycles'],
    ['Both', 'N/A', 'Pre-owned 30-50m motor yachts; US market', 'Purchase advisory; survey & sea trial coordination', 'Regional market saturation; client trust building'],
    ['Services', 'N/A', 'Curated European pre-owned 40-70m listings', 'Vendor due diligence & transaction structuring', 'Brexit-related legal complexity; EU VAT changes'],
  ],
  'CMI Insights': [
    ['Global leader; top 3 by transaction volume; strong brand heritage', '5', 'Industry reports; MYBA data; direct engagement'],
    ['Top-tier superyacht specialist; premium positioning; high avg deal size', '5', 'Boat International; Superyacht Times; direct engagement'],
    ['Strong Med & Monaco presence; high-value S&P deals; trusted by UHNW', '4', 'Monaco Yacht Show data; MYBA membership records'],
    ['US market leader; strong Caribbean presence; growing international reach', '4', 'IYBA reports; Fort Lauderdale boat show data'],
    ['Mid-market US leader; strong digital presence; growing new build program', '3', 'IYBA data; company website; trade publications'],
    ['Full-service differentiation; global ops; high client retention', '5', 'Direct engagement; Superyacht Group data'],
    ['Strong US brokerage network; mid-market focus; growing S&P advisory', '3', 'IYBA reports; online listings data'],
    ['Ultra-premium niche; UHNW focus; long-standing relationships', '5', 'Superyacht Times; direct referral network'],
    ['Regional US leader; strong reputation; founder-led firm', '3', 'IYBA data; client testimonials; trade press'],
    ['Boutique S&P advisory; European focus; high expertise per deal', '4', 'MYBA data; direct client referrals'],
  ],
}

// ============================================================
// DEMO DATA - Proposition 2 (Management)
// ============================================================
const PROP2_DEMO: Record<string, string[][]> = {
  'Customer Information': [
    ['Hill Robinson', 'Hill Robinson Yacht Management', 'United Kingdom', 'London / Antibes / Fort Lauderdale', 'Management Firm', 'Full Scope Management', '50-100m', 'Conventional Diesel', '35+ yachts', 'Med, Caribbean, N. America'],
    ['Moravia Yachting', 'Moravia Yachting Ltd', 'British Virgin Islands', 'Tortola / Antibes', 'Management Firm', 'Technical & Crew', '30-70m', 'Diesel-electric', '28 yachts', 'Caribbean, Med'],
    ['Luxury Yacht Group', 'LYG Holdings LLC', 'United States', 'Fort Lauderdale / Palm Beach', 'Management Firm', 'Full Scope Management', '30-60m', 'Conventional Diesel', '22 yachts', 'N. America, Caribbean'],
    ['V.Ships Leisure', 'V.Group Ltd', 'Monaco', 'Monaco / Isle of Man', 'Management Firm', 'Technical Management', '70-100m+', 'Diesel-electric', '18 superyachts', 'Med, N. Europe, Middle East'],
    ['Platinum Yacht Management', 'Platinum Marine Group', 'Australia', 'Gold Coast / Sydney', 'Management Firm', 'Full Scope Management', '30-50m', 'Conventional Diesel', '15 yachts', 'Asia Pacific, Oceania'],
    ['YPI Crew', 'Yachting Partners International', 'France', 'Antibes / Monaco', 'Crew Agency + Mgmt', 'Crew Management', '40-80m', 'Conventional Diesel', '40+ crew placements', 'Med, Global'],
    ['West Nautical', 'West Nautical Ltd', 'United Kingdom', 'Newcastle / Monaco', 'Management Firm', 'Full Scope Management', '30-70m', 'Hybrid Propulsion', '12 yachts', 'N. Europe, Med'],
    ['Dohle Yachts', 'Dohle Group', 'Germany', 'Hamburg / Antibes', 'Management Firm', 'Technical & Compliance', '50-100m+', 'Conventional Diesel', '20 yachts', 'Med, N. Europe, Asia'],
    ['Atlantis Marine', 'Atlantis Marine Services', 'Greece', 'Athens / Piraeus', 'Management Firm', 'Technical Management', '30-50m', 'Conventional Diesel', '25 yachts', 'Med, Turkey, Greece'],
    ['Columbia Yacht Management', 'Columbia Shipmanagement', 'Cyprus', 'Limassol', 'Management Firm', 'Full Scope Management', '40-80m', 'Diesel-electric', '16 yachts', 'Med, Middle East'],
  ],
  'Contact Details': [
    ['Adam Richardson', 'CEO / Managing Director', 'a.richardson@hillrobinson.com', '+44 20 3637 XXXX', 'linkedin.com/in/adamrichardson', 'www.hillrobinson.com'],
    ['Michael Lewis', 'Fleet Director', 'm.lewis@moraviayachting.com', '+1 284 494 XXXX', 'linkedin.com/in/mlewis', 'www.moraviayachting.com'],
    ['Douglas Spiel', 'CEO', 'd.spiel@luxyachtgroup.com', '+1 954 525 XXXX', 'linkedin.com/in/dspiel', 'www.luxyachtgroup.com'],
    ['Roberto Giorgi', 'Managing Director', 'r.giorgi@vshipsleisure.com', '+377 97 XX XXXX', 'linkedin.com/in/rgiorgi', 'www.vshipsleisure.com'],
    ['James Thompson', 'Director', 'j.thompson@platinumyacht.com.au', '+61 7 5591 XXXX', 'linkedin.com/in/jthompson', 'www.platinumyacht.com.au'],
    ['Sabine Loviny', 'Head of Crew Services', 's.loviny@ypicrew.com', '+33 4 93 XX XXXX', 'linkedin.com/in/sloviny', 'www.ypicrew.com'],
    ['Geoff Moore', 'Managing Director', 'g.moore@westnautical.com', '+44 191 478 XXXX', 'linkedin.com/in/gmoore', 'www.westnautical.com'],
    ['Andreas Steffens', 'Director Yacht Division', 'a.steffens@dohle-yachts.com', '+49 40 311 XXXX', 'linkedin.com/in/asteffens', 'www.dohle-yachts.com'],
    ['Nikos Papadopoulos', 'Operations Director', 'n.papadopoulos@atlantismarine.gr', '+30 210 45 XXXX', 'linkedin.com/in/npapadopoulos', 'www.atlantismarine.gr'],
    ['Markos Hadjiconstantis', 'Head of Yacht Ops', 'm.hadjic@columbiayacht.com', '+357 25 84 XXXX', 'linkedin.com/in/mhadjic', 'www.columbiayacht.com'],
  ],
  'Needs & Pain Points': [
    ['Services', 'Predictive maintenance systems; class survey coordination; drydock planning', 'Qualified officer sourcing; MLC compliance; crew retention programs', 'ISM/ISPS audits; flag state compliance; environmental regulations', 'Centralized accounting; owner reporting; tax-efficient structures', 'Rising crew costs; insurance premium increases; regulatory changes'],
    ['Services', 'Engine overhaul scheduling; HVAC/electrical systems mgmt', 'Caribbean-experienced crew sourcing; crew rotation logistics', 'BVI/Cayman flag compliance; safety drills & documentation', 'Multi-currency accounting; charter income management', 'Remote vessel locations; crew visa complexity'],
    ['Both', 'Hull & machinery maintenance programs; warranty tracking', 'US-licensed crew sourcing; STCW compliance', 'USCG inspections; environmental compliance (MARPOL)', 'US tax reporting; LLC/trust structure management', 'Seasonal US market; hurricane preparedness'],
    ['Services', 'Complex propulsion system management; steel/aluminum hull surveys', 'Senior officer recruitment for 70m+ yachts; training programs', 'Large yacht code (LY3) compliance; MCA audits', 'N/A (technical focus)', 'Aging superyacht fleet; retrofit complexity'],
    ['Both', 'Tropical climate maintenance; anti-fouling programs', 'Australian maritime crew certifications; crew welfare', 'AMSA compliance; Great Barrier Reef environmental regs', 'AUD/USD reporting; Australian tax obligations', 'Limited local shipyard capacity; remote cruising areas'],
    ['Services', 'N/A (crew focus)', 'Global crew database; competency assessments; payroll mgmt', 'MLC 2006 compliance; SEA certification; crew medical', 'Crew payroll; tax withholding; multi-jurisdiction', 'Crew retention in competitive market; seasonal demand spikes'],
    ['Both', 'Northern climate maintenance; winterization programs', 'UK/EU crew certifications; bilingual crew sourcing', 'MCA compliance; UK post-Brexit flag requirements', 'GBP/EUR multi-currency; UK HMRC reporting', 'Brexit regulatory uncertainty; UK/EU yacht registration'],
    ['Services', 'German engineering standards; class society coordination (GL/DNV)', 'European officer recruitment; training academy partnerships', 'ISM/ISPS; German flag compliance; EU maritime directives', 'German GAAP reporting; VAT optimization', 'Complex EU regulatory landscape; crew availability'],
    ['Services', 'Med-specific maintenance; local shipyard coordination', 'Greek/EU crew sourcing; seasonal crew management', 'Greek flag compliance; Hellenic Coast Guard inspections', 'Greek tax reporting; charter revenue accounting', 'Seasonal demand; local bureaucracy; aging fleet'],
    ['Both', 'ISM-certified technical oversight; class survey management', 'Multi-national crew management; MLC compliance', 'Cyprus flag admin; EU maritime regulations; GDPR', 'Cyprus corporate structures; EU VAT reporting', 'Political complexity (East Med); insurance costs'],
  ],
  'CMI Insights': [
    ['Global leader in yacht management; 35+ fleet; strong technical reputation', '5', 'Direct engagement; Superyacht Times; MYBA records'],
    ['Caribbean specialist; strong crew management; BVI-based tax advantage', '4', 'Client referrals; Caribbean yacht show data'],
    ['Leading US management firm; strong charter integration; growing fleet', '4', 'IYBA data; Fort Lauderdale market reports'],
    ['Backed by V.Group shipping expertise; superyacht specialist niche', '5', 'V.Group annual reports; industry benchmarks'],
    ['APAC market leader; growing fleet; strong regional expertise', '3', 'Australian Super Yacht Group data; local industry reports'],
    ['Premier crew agency; 40+ years experience; global network', '4', 'PYA membership data; crew placement statistics'],
    ['Growing UK-based firm; strong N. Europe presence; hybrid yacht expertise', '3', 'UK Maritime data; company reports; direct engagement'],
    ['German shipping heritage; technical excellence; class society relationships', '4', 'German Shipowners Assoc.; Dohle Group annual reports'],
    ['Regional Med specialist; competitive pricing; local knowledge', '3', 'Greek yacht registry data; local industry contacts'],
    ['Cyprus-based; leverages shipping management heritage; EU access', '4', 'Cyprus Shipping Chamber; EU maritime reports'],
  ],
}

// ============================================================
// DEMO DATA - Proposition 3 (Charter)
// ============================================================
const PROP3_DEMO: Record<string, string[][]> = {
  'Customer Information': [
    ['Burgess Yachts Charter', 'Burgess Maritime Ltd', 'United Kingdom', 'London / Monaco / Dubai', 'Charter Company', 'Luxury Motor Yacht Charter', 'Agency (Central Agent)', '50-100m+', 'Conventional Diesel', '80+ listings', 'Med, Caribbean, SE Asia, Middle East'],
    ['Camper & Nicholsons Charter', 'C&N International', 'United Kingdom', 'Antibes / Monaco / Palm Beach', 'Charter Company', 'Motor & Sail Charter', 'Agency (Central Agent)', '30-80m', 'Diesel-electric', '120+ listings', 'Med, Caribbean, N. America'],
    ['Fraser Charter', 'Fraser Group', 'Monaco', 'Monaco / Fort Lauderdale / Antibes', 'Charter Company', 'Superyacht Charter', 'Agency (Central Agent)', '40-100m+', 'Conventional Diesel', '90+ listings', 'Med, Caribbean'],
    ['Ahoy Club', 'Ahoy Club Pty Ltd', 'Australia', 'Sydney / Monaco', 'Charter Platform', 'Digital-First Charter', 'Operator (Direct Book)', '20-60m', 'Mixed', '200+ listings (platform)', 'Global (digital platform)'],
    ['YachtCharterFleet', 'YCF Media Ltd', 'United Kingdom', 'London', 'Charter Marketplace', 'Charter Listings & Marketing', 'Agency (Marketplace)', '25-100m+', 'N/A (all types)', '1,500+ listings (marketplace)', 'Global'],
    ['Morley Yachts', 'Morley Yachts LLC', 'United States', 'Newport / Fort Lauderdale', 'Charter Company', 'Motor Yacht Charter', 'Operator', '25-45m', 'Conventional Diesel', '15 owned/managed', 'N. America, New England, Caribbean'],
    ['Yachting Partners International', 'YPI SA', 'Monaco', 'Monaco / Antibes / Palma', 'Charter Company', 'Full Service Charter', 'Agency (Central Agent)', '30-80m', 'Conventional Diesel', '60+ listings', 'Med, Adriatic, Greek Islands'],
    ['Charterworld', 'Charterworld Ltd', 'New Zealand', 'Auckland / London', 'Charter Marketplace', 'Charter Marketing & Booking', 'Agency (Marketplace)', '25-100m', 'N/A (all types)', '800+ listings (marketplace)', 'Global (Pacific, Med, Caribbean)'],
    ['Yacht Sourcing', 'Yacht Sourcing Pte Ltd', 'Singapore', 'Singapore / Phuket', 'Charter Company', 'SE Asia Yacht Charter', 'Operator & Agency', '20-50m', 'Conventional Diesel', '30+ listings', 'SE Asia, Indonesia, Thailand'],
    ['Simpson Marine Charter', 'Simpson Marine Ltd', 'Hong Kong', 'Hong Kong / Phuket / Australia', 'Charter Company', 'Asia-Pacific Charter', 'Agency (Central Agent)', '25-60m', 'Diesel-electric', '45+ listings', 'Asia Pacific, Greater China'],
  ],
  'Contact Details': [
    ['Jonathan Beckett', 'CEO / Charter Division', 'j.beckett@burgessyachts.com', '+44 20 7766 XXXX', 'linkedin.com/in/jbeckett', 'www.burgessyachts.com'],
    ['Alex Busher', 'Charter Director', 'a.busher@camperandnicholsons.com', '+33 4 92 91 XXXX', 'linkedin.com/in/abusher', 'www.camperandnicholsons.com'],
    ['Giles Reardon', 'Charter Director', 'g.reardon@fraseryachts.com', '+377 93 XX XXXX', 'linkedin.com/in/greardon', 'www.fraseryachts.com'],
    ['Ian Malouf', 'Founder & CEO', 'i.malouf@ahoyclub.com', '+61 2 XXXX XXXX', 'linkedin.com/in/imalouf', 'www.ahoyclub.com'],
    ['Richard Downs-Mayger', 'Managing Director', 'r.downs@yachtcharterfleet.com', '+44 20 XXXX XXXX', 'linkedin.com/in/rdowns', 'www.yachtcharterfleet.com'],
    ['James Morley', 'Owner / Operator', 'j.morley@morleyyachts.com', '+1 401 849 XXXX', 'linkedin.com/in/jmorley', 'www.morleyyachts.com'],
    ['Fiona McCarthy', 'Charter Manager', 'f.mccarthy@ypigroup.com', '+377 97 XX XXXX', 'linkedin.com/in/fmccarthy', 'www.ypigroup.com'],
    ['Kevin Kokalas', 'Founder', 'k.kokalas@charterworld.com', '+64 9 369 XXXX', 'linkedin.com/in/kkokalas', 'www.charterworld.com'],
    ['Olivier Besson', 'Managing Director', 'o.besson@yachtsourcing.com', '+65 6735 XXXX', 'linkedin.com/in/obesson', 'www.yachtsourcing.com'],
    ['Mike Simpson', 'CEO', 'm.simpson@simpsonmarine.com', '+852 2555 XXXX', 'linkedin.com/in/msimpson', 'www.simpsonmarine.com'],
  ],
  'Needs & Pain Points': [
    ['Services', 'Premium photo/video production; VIP event marketing; print & digital campaigns', 'Seamless itinerary planning; multi-destination booking; MYBA contract management', 'White-glove guest services; Michelin-level catering coordination; concierge', 'Consistent 5-star guest experience across diverse fleet; crew quality assurance'],
    ['Both', 'Multi-channel marketing; yacht show presence; social media strategy', 'Centralized booking system; dynamic pricing; client CRM', 'Crew briefing standards; provisioning quality; water toys coordination', 'Seasonal pricing optimization; managing owner/charter guest expectations'],
    ['Services', 'Targeted UHNW marketing; discreet off-market charter listings', 'VIP booking concierge; repeat client loyalty programs', 'Customized itinerary design; special event charters (weddings, corporate)', 'High cancellation risk for peak season; fuel cost volatility'],
    ['Products', 'Digital platform marketing; SEO/SEM; app-based discovery', 'Instant online booking; automated pricing; payment processing', 'Digital check-in; guest feedback systems; real-time communication', 'Technology investment costs; competing with established agencies'],
    ['Services', 'SEO-driven content marketing; yacht profile optimization', 'Lead generation for charter agencies; booking inquiry management', 'N/A (marketplace model)', 'Commission model sustainability; competition from direct booking'],
    ['Both', 'Local market advertising; boat show participation; repeat client outreach', 'Direct booking management; seasonal rate optimization', 'Hands-on crew management; guest preference tracking; provisioning', 'Weather dependency; short New England season; maintenance costs'],
    ['Services', 'Med-focused marketing; luxury travel partnerships; yacht show presence', 'Multi-week Mediterranean itinerary planning; VIP concierge', 'Local destination expertise; restaurant/activity reservations; crew briefings', 'Peak season overcrowding in popular Med destinations; berth availability'],
    ['Services', 'Global SEO; charter yacht profile creation; virtual tours', 'Inquiry management; broker-to-broker networking', 'N/A (marketplace model)', 'Maintaining listing accuracy; global time zone coverage'],
    ['Both', 'SE Asia destination marketing; eco-tourism positioning', 'Custom itinerary design for remote Indonesian islands; local permits', 'Local guide coordination; diving/snorkeling expertise; cultural experiences', 'Infrastructure limitations in remote areas; seasonal monsoons'],
    ['Both', 'Asia-Pacific luxury lifestyle marketing; Greater China outreach', 'Mandarin/Cantonese client services; Asia-specific itineraries', 'Cultural sensitivity training for crew; Asian cuisine catering', 'Limited superyacht infrastructure in Asia; regulatory complexity'],
  ],
  'CMI Insights': [
    ['Global charter leader; premium superyacht positioning; 80+ fleet', '5', 'Burgess annual report; MYBA charter data; direct engagement'],
    ['Heritage brand; global reach; strong sail + motor charter portfolio', '5', 'C&N annual data; yacht show contacts; MYBA statistics'],
    ['Top-tier Med charter specialist; UHNW client base; 90+ fleet', '5', 'MYS data; Fraser internal reports; direct engagement'],
    ['Disruptive digital platform; fast growth; strong tech investment', '4', 'Tech Crunch coverage; app store data; direct engagement'],
    ['Largest charter marketplace; dominant SEO position; lead generator', '4', 'Web traffic data; industry benchmarks; advertising partnerships'],
    ['Boutique US operator; owner-operated fleet; strong repeat clients', '3', 'Local yacht club data; client testimonials; IYBA membership'],
    ['Established Med charter agency; strong Greek Islands & Adriatic', '4', 'MYBA data; Monaco Yacht Show contacts; client referrals'],
    ['Global marketplace; strong Pacific coverage; NZ-based', '3', 'Web analytics; Google Trends data; industry contacts'],
    ['SE Asia specialist; growing eco-charter niche; local expertise', '3', 'APSA data; local tourism board; regional yacht shows'],
    ['Asia-Pacific leader; Greater China market access; growing fleet', '4', 'HKYBA data; Simpson Marine annual report; APSA membership'],
  ],
}

// ============================================================
// Table section definitions
// ============================================================
interface SectionDef {
  groupName: string
  color: string
  subHeaderBg: string
  columns: string[]
}

function DemoTable({ sections, demoData }: { sections: SectionDef[]; demoData: Record<string, string[][]> }) {
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
                  const sectionData = demoData[section.groupName]
                  const cellValue = sectionData?.[rowIdx]?.[colIdx] ?? ''
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
  // Proposition 1 - Brokerage Service
  const prop1Sections: SectionDef[] = [
    { groupName: 'Customer Information', color: HEADER_COLORS.customerInfo, subHeaderBg: SUB_HEADER_BG, columns: prop1CustomerInfoColumns },
    { groupName: 'Contact Details', color: HEADER_COLORS.contactDetails, subHeaderBg: SUB_HEADER_BG, columns: prop1ContactColumns },
    { groupName: 'Needs & Pain Points', color: HEADER_COLORS.needsPainPoints, subHeaderBg: NEEDS_SUB_BG, columns: prop1NeedsColumns },
    { groupName: 'CMI Insights', color: HEADER_COLORS.cmiInsights, subHeaderBg: CMI_SUB_BG, columns: prop1CmiColumns },
  ]

  // Proposition 2 - Management Service
  const prop2Sections: SectionDef[] = [
    { groupName: 'Customer Information', color: HEADER_COLORS.customerInfo, subHeaderBg: SUB_HEADER_BG, columns: prop2CustomerInfoColumns },
    { groupName: 'Contact Details', color: HEADER_COLORS.contactDetails, subHeaderBg: SUB_HEADER_BG, columns: prop2ContactColumns },
    { groupName: 'Needs & Pain Points', color: HEADER_COLORS.needsPainPoints, subHeaderBg: NEEDS_SUB_BG, columns: prop2NeedsColumns },
    { groupName: 'CMI Insights', color: HEADER_COLORS.cmiInsights, subHeaderBg: CMI_SUB_BG, columns: prop2CmiColumns },
  ]

  // Proposition 3 - Charter Service
  const prop3Sections: SectionDef[] = [
    { groupName: 'Customer Information', color: HEADER_COLORS.customerInfo, subHeaderBg: SUB_HEADER_BG, columns: prop3CustomerInfoColumns },
    { groupName: 'Contact Details', color: HEADER_COLORS.contactDetails, subHeaderBg: SUB_HEADER_BG, columns: prop3ContactColumns },
    { groupName: 'Needs & Pain Points', color: HEADER_COLORS.needsPainPoints, subHeaderBg: NEEDS_SUB_BG, columns: prop3NeedsColumns },
    { groupName: 'CMI Insights', color: HEADER_COLORS.cmiInsights, subHeaderBg: CMI_SUB_BG, columns: prop3CmiColumns },
  ]

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-black">Customer Intelligence Database</h2>
        <p className="text-sm text-gray-600 mt-1">
          Three proposition levels tailored to each yacht service vertical
        </p>
      </div>

      <AccordionItem title="Proposition 1 - Yatch Brokerage" defaultOpen={true}>
        <p className="text-xs text-gray-500 mb-3">
          Customer intelligence for yacht brokerage clients: new build, pre-owned, and sale & purchase advisory.
        </p>
        <DemoTable sections={prop1Sections} demoData={PROP1_DEMO} />
      </AccordionItem>

      <AccordionItem title="Proposition 2 - Yatch Management">
        <p className="text-xs text-gray-500 mb-3">
          Customer intelligence for yacht management clients: technical, crew, compliance, and financial management.
        </p>
        <DemoTable sections={prop2Sections} demoData={PROP2_DEMO} />
      </AccordionItem>

      <AccordionItem title="Proposition 3 - Yatch Charter">
        <p className="text-xs text-gray-500 mb-3">
          Customer intelligence for yacht charter clients: marketing, booking, sales, and guest operations.
        </p>
        <DemoTable sections={prop3Sections} demoData={PROP3_DEMO} />
      </AccordionItem>
    </div>
  )
}

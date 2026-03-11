'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useDashboardStore } from '@/lib/store'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'

// Hardcoded hierarchy matching the user's specification
const GEOGRAPHY_HIERARCHY: Record<string, string[]> = {
  'North America': ['U.S.', 'Canada'],
  'Europe': ['U.K.', 'Germany', 'Italy', 'France', 'Spain', 'Russia', 'Rest of Europe'],
  'Asia Pacific': ['China', 'India', 'Japan', 'South Korea', 'ASEAN', 'Australia', 'Rest of Asia Pacific'],
  'Middle East & Africa': ['GCC', 'South Africa', 'Rest of Middle East & Africa'],
  'Latin America': ['Brazil', 'Argentina', 'Mexico', 'Rest of Latin America'],
}

const REGION_ORDER = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa']

export function GeographyMultiSelect() {
  const { data, filters, updateFilters } = useDashboardStore()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set())
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Build hierarchical geography structure from data, merging with hardcoded hierarchy
  const { regions, countries } = useMemo(() => {
    if (!data || !data.dimensions?.geographies) {
      return { regions: REGION_ORDER, countries: GEOGRAPHY_HIERARCHY }
    }

    const geo = data.dimensions.geographies
    const dataCountries = geo.countries || {}
    const mergedCountries: Record<string, string[]> = { ...GEOGRAPHY_HIERARCHY }

    for (const [region, countryList] of Object.entries(dataCountries)) {
      if (countryList.length > 0) {
        mergedCountries[region] = countryList
      }
    }

    const dataRegions = geo.regions?.length > 0 ? geo.regions : REGION_ORDER
    const orderedRegions = REGION_ORDER.filter(r => dataRegions.includes(r))
    dataRegions.forEach(r => {
      if (!orderedRegions.includes(r)) orderedRegions.push(r)
    })

    return { regions: orderedRegions, countries: mergedCountries }
  }, [data])

  // Filter items based on search - search both regions and countries
  const searchResults = useMemo(() => {
    if (!searchTerm) return null
    const search = searchTerm.toLowerCase()
    const results: { type: 'region' | 'country'; name: string; parent?: string }[] = []

    regions.forEach(region => {
      if (region.toLowerCase().includes(search)) {
        results.push({ type: 'region', name: region })
      }
      const regionCountries = countries[region] || []
      regionCountries.forEach(country => {
        if (country.toLowerCase().includes(search)) {
          results.push({ type: 'country', name: country, parent: region })
        }
      })
    })

    return results
  }, [searchTerm, regions, countries])

  const toggleRegionExpand = (region: string) => {
    setExpandedRegions(prev => {
      const next = new Set(prev)
      if (next.has(region)) {
        next.delete(region)
      } else {
        next.add(region)
      }
      return next
    })
  }

  // Simple independent toggle - selecting a region does NOT select its countries
  const handleToggle = (geography: string) => {
    const current = filters.geographies
    const updated = current.includes(geography)
      ? current.filter(g => g !== geography)
      : [...current, geography]

    updateFilters({ geographies: updated })
  }

  const handleSelectAll = () => {
    // Select only regions (not individual countries)
    updateFilters({ geographies: [...regions] })
  }

  const handleClearAll = () => {
    updateFilters({ geographies: [] })
  }

  if (!data) return null

  const selectedCount = filters.geographies.length

  const renderCountryCheckbox = (country: string) => (
    <label
      key={country}
      className="flex items-center py-1 hover:bg-blue-50 cursor-pointer"
      style={{ paddingLeft: '48px', paddingRight: '12px' }}
    >
      <input
        type="checkbox"
        checked={filters.geographies.includes(country)}
        onChange={() => handleToggle(country)}
        className="mr-2 h-3.5 w-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      />
      <span className="text-xs text-black flex-1">{country}</span>
      {filters.geographies.includes(country) && (
        <Check className="h-3 w-3 text-blue-600 flex-shrink-0" />
      )}
    </label>
  )

  const renderRegion = (region: string) => {
    const regionCountries = countries[region] || []
    const isExpanded = expandedRegions.has(region)
    const hasCountries = regionCountries.length > 0
    const isSelected = filters.geographies.includes(region)

    return (
      <div key={region}>
        <div className="flex items-center hover:bg-blue-50">
          {/* Expand/collapse button */}
          {hasCountries ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleRegionExpand(region)
              }}
              className="flex items-center justify-center w-6 h-6 ml-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-6 ml-1" />
          )}

          {/* Region checkbox - independent, does NOT select children */}
          <label
            className="flex items-center py-1.5 cursor-pointer flex-1"
            style={{ paddingRight: '12px' }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggle(region)}
              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-black font-medium flex-1">{region}</span>
            {isSelected && (
              <Check className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
            )}
          </label>
        </div>

        {/* Expanded countries */}
        {isExpanded && hasCountries && (
          <div className="bg-gray-50/50">
            {regionCountries.map(country => renderCountryCheckbox(country))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
      >
        <span className="text-sm text-black">
          {selectedCount === 0
            ? 'Select geographies...'
            : `${selectedCount} selected`}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b">
            <input
              type="text"
              placeholder="Search geographies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="px-3 py-2 bg-gray-50 border-b flex gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1 text-xs bg-gray-100 text-black rounded hover:bg-gray-200"
            >
              Clear All
            </button>
          </div>

          {/* Geography List */}
          <div className="overflow-y-auto max-h-64">
            {searchResults !== null ? (
              // Search mode
              searchResults.length === 0 ? (
                <div className="px-3 py-4 text-sm text-black text-center">
                  No geographies found matching your search
                </div>
              ) : (
                searchResults.map(result => {
                  if (result.type === 'region') {
                    return (
                      <label
                        key={result.name}
                        className="flex items-center py-1.5 hover:bg-blue-50 cursor-pointer"
                        style={{ paddingLeft: '12px', paddingRight: '12px' }}
                      >
                        <input
                          type="checkbox"
                          checked={filters.geographies.includes(result.name)}
                          onChange={() => handleToggle(result.name)}
                          className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-black font-medium flex-1">{result.name}</span>
                      </label>
                    )
                  } else {
                    return (
                      <label
                        key={result.name}
                        className="flex items-center py-1.5 hover:bg-blue-50 cursor-pointer"
                        style={{ paddingLeft: '28px', paddingRight: '12px' }}
                      >
                        <input
                          type="checkbox"
                          checked={filters.geographies.includes(result.name)}
                          onChange={() => handleToggle(result.name)}
                          className="mr-2 h-3.5 w-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-xs text-black flex-1">{result.name}</span>
                        <span className="text-xs text-gray-400 ml-2">{result.parent}</span>
                      </label>
                    )
                  }
                })
              )
            ) : (
              // Hierarchical mode - regions with expandable countries
              regions.map(region => renderRegion(region))
            )}
          </div>
        </div>
      )}

      {/* Selected Count Badge */}
      {selectedCount > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs text-black">
            {selectedCount} {selectedCount === 1 ? 'geography' : 'geographies'} selected
          </span>
        </div>
      )}
    </div>
  )
}

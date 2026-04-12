import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SAMPLE_LISTINGS = [
  { id: 1, price: 1250000, beds: 4, baths: 3, sqft: 2800, address: '1421 Brickell Ave', city: 'Miami', zip: '33131', type: 'Condo', status: 'Active', year: 2019, agent: 'Salazar & Co', lat: 35, left: 45 },
  { id: 2, price: 875000, beds: 3, baths: 2, sqft: 1950, address: '742 Ocean Dr', city: 'Miami Beach', zip: '33139', type: 'Condo', status: 'Active', year: 2015, agent: 'Salazar & Co', lat: 55, left: 70 },
  { id: 3, price: 2100000, beds: 5, baths: 4, sqft: 3600, address: '3200 Coral Way', city: 'Coral Gables', zip: '33145', type: 'House', status: 'Active', year: 2021, agent: 'Salazar & Co', lat: 65, left: 25 },
  { id: 4, price: 450000, beds: 2, baths: 2, sqft: 1100, address: '5600 Collins Ave #812', city: 'Miami Beach', zip: '33140', type: 'Condo', status: 'Pending', year: 2008, agent: 'Salazar & Co', lat: 25, left: 60 },
  { id: 5, price: 3400000, beds: 6, baths: 5, sqft: 4200, address: '45 Star Island Dr', city: 'Miami Beach', zip: '33139', type: 'House', status: 'Active', year: 2022, agent: 'Salazar & Co', lat: 40, left: 80 },
  { id: 6, price: 625000, beds: 3, baths: 2, sqft: 1650, address: '1900 N Bayshore Dr #3401', city: 'Miami', zip: '33132', type: 'Condo', status: 'Coming Soon', year: 2017, agent: 'Salazar & Co', lat: 75, left: 40 },
  { id: 7, price: 1750000, beds: 4, baths: 3, sqft: 2400, address: '820 Anastasia Ave', city: 'Coral Gables', zip: '33134', type: 'Townhouse', status: 'Active', year: 2020, agent: 'Salazar & Co', lat: 50, left: 15 },
  { id: 8, price: 980000, beds: 3, baths: 3, sqft: 2100, address: '2600 SW 3rd Ave #1205', city: 'Miami', zip: '33129', type: 'Condo', status: 'Active', year: 2023, agent: 'Salazar & Co', lat: 30, left: 35 },
  { id: 9, price: 550000, beds: 2, baths: 1, sqft: 1200, address: '150 SE 3rd Ave #410', city: 'Miami', zip: '33131', type: 'Condo', status: 'Pending', year: 2016, agent: 'Salazar & Co', lat: 60, left: 55 },
  { id: 10, price: 4200000, beds: 5, baths: 6, sqft: 5100, address: '7800 Fisher Island Dr', city: 'Fisher Island', zip: '33109', type: 'House', status: 'Active', year: 2024, agent: 'Salazar & Co', lat: 80, left: 65 },
]

const PRICE_OPTIONS = [
  { label: 'No Min', value: 0 },
  { label: '$200K', value: 200000 },
  { label: '$400K', value: 400000 },
  { label: '$600K', value: 600000 },
  { label: '$800K', value: 800000 },
  { label: '$1M', value: 1000000 },
  { label: '$1.5M', value: 1500000 },
  { label: '$2M', value: 2000000 },
  { label: '$3M', value: 3000000 },
  { label: '$5M', value: 5000000 },
]

const PROPERTY_TYPES = ['House', 'Condo', 'Townhouse', 'Multi-Family', 'Land']
const BEDROOM_OPTIONS = ['Any', '1+', '2+', '3+', '4+', '5+']
const BATHROOM_OPTIONS = ['Any', '1+', '2+', '3+', '4+']
const STATUS_OPTIONS = ['Active', 'Pending', 'Coming Soon']
const SORT_OPTIONS = ['Recommended', 'Price Low-High', 'Price High-Low', 'Newest', 'Sqft']

function formatPrice(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? '#0D9488' : 'none'} stroke={filled ? '#0D9488' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

function HouseIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function MapPin({ listing, isHovered, onHover, onLeave }) {
  return (
    <motion.div
      className="absolute cursor-pointer z-10"
      style={{ top: `${listing.lat}%`, left: `${listing.left}%` }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.2 }}
    >
      <div className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${isHovered ? 'bg-accent text-white' : 'bg-surface text-foreground border border-border'}`}>
        {formatPrice(listing.price)}
      </div>
      <div className={`w-2 h-2 rotate-45 -mt-1 mx-auto transition-colors ${isHovered ? 'bg-accent' : 'bg-surface border-r border-b border-border'}`} />
    </motion.div>
  )
}

function PropertyCard({ listing, onHover, onLeave, isHighlighted }) {
  const [fav, setFav] = useState(false)

  return (
    <motion.div
      className={`bg-surface rounded-lg border overflow-hidden cursor-pointer transition-colors ${isHighlighted ? 'border-accent' : 'border-border'}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Photo placeholder */}
      <div className="relative aspect-[4/3] bg-[#1a1a1a] flex items-center justify-center">
        <HouseIcon />
        {listing.status !== 'Active' && (
          <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-medium ${listing.status === 'Pending' ? 'bg-amber-600/80 text-white' : 'bg-blue-600/80 text-white'}`}>
            {listing.status}
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setFav(!fav) }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors text-white/70 hover:text-white"
        >
          <HeartIcon filled={fav} />
        </button>
      </div>

      {/* Details */}
      <div className="p-3">
        <div className="text-xl font-bold text-foreground">
          ${listing.price.toLocaleString()}
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-sm text-muted">
          <span><span className="font-semibold text-foreground">{listing.beds}</span> bd</span>
          <span className="text-border">|</span>
          <span><span className="font-semibold text-foreground">{listing.baths}</span> ba</span>
          <span className="text-border">|</span>
          <span><span className="font-semibold text-foreground">{listing.sqft.toLocaleString()}</span> sqft</span>
        </div>
        <div className="mt-1.5 text-sm text-muted truncate">
          {listing.address}, {listing.city}, FL {listing.zip}
        </div>
        <div className="mt-1.5 text-xs text-muted/60">
          Listed by {listing.agent}
        </div>
      </div>
    </motion.div>
  )
}

function PillToggle({ options, value, onChange, multi = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = multi ? value.includes(opt) : value === opt
        return (
          <button
            key={opt}
            onClick={() => {
              if (multi) {
                onChange(active ? value.filter((v) => v !== opt) : [...value, opt])
              } else {
                onChange(opt)
              }
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${active ? 'bg-accent text-white border-accent' : 'bg-transparent text-muted border-border hover:border-muted'}`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function Dropdown({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-surface border border-border rounded-lg px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:border-accent cursor-pointer"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
        <ChevronIcon />
      </div>
    </div>
  )
}

export default function PropertySearch() {
  const [mode, setMode] = useState('Buy')
  const [search, setSearch] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [propertyTypes, setPropertyTypes] = useState([])
  const [bedrooms, setBedrooms] = useState('Any')
  const [bathrooms, setBathrooms] = useState('Any')
  const [sqftMin, setSqftMin] = useState('')
  const [sqftMax, setSqftMax] = useState('')
  const [yearMin, setYearMin] = useState('')
  const [yearMax, setYearMax] = useState('')
  const [statuses, setStatuses] = useState([])
  const [sortBy, setSortBy] = useState('Recommended')
  const [hoveredId, setHoveredId] = useState(null)

  const activeFilterCount = [
    propertyTypes.length > 0,
    bedrooms !== 'Any',
    bathrooms !== 'Any',
    sqftMin || sqftMax,
    yearMin || yearMax,
    statuses.length > 0,
    sortBy !== 'Recommended',
  ].filter(Boolean).length

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-background z-20">
        <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
          {/* Buy / Rent Toggle */}
          <div className="flex bg-surface rounded-full p-0.5 border border-border">
            {['Buy', 'Rent'].map((opt) => (
              <button
                key={opt}
                onClick={() => setMode(opt)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === opt ? 'bg-accent text-white' : 'text-muted hover:text-foreground'}`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="City, Neighborhood, Address, ZIP"
              className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <Dropdown
              value={priceMin}
              onChange={setPriceMin}
              options={PRICE_OPTIONS.map((o) => ({ label: o.label, value: String(o.value) }))}
              placeholder="Min Price"
            />
            <span className="text-muted text-sm">&ndash;</span>
            <Dropdown
              value={priceMax}
              onChange={setPriceMax}
              options={PRICE_OPTIONS.map((o) => ({ label: o.label, value: String(o.value) }))}
              placeholder="Max Price"
            />
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${filtersOpen ? 'bg-accent text-white border-accent' : 'bg-surface text-foreground border-border hover:border-muted'}`}
          >
            <FilterIcon />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden border-t border-border"
            >
              <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Property Type */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Property Type</label>
                  <PillToggle options={PROPERTY_TYPES} value={propertyTypes} onChange={setPropertyTypes} multi />
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Bedrooms</label>
                  <PillToggle options={BEDROOM_OPTIONS} value={bedrooms} onChange={setBedrooms} />
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Bathrooms</label>
                  <PillToggle options={BATHROOM_OPTIONS} value={bathrooms} onChange={setBathrooms} />
                </div>

                {/* Square Feet */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Square Feet</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={sqftMin}
                      onChange={(e) => setSqftMin(e.target.value)}
                      placeholder="Min"
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
                    />
                    <span className="text-muted text-sm">&ndash;</span>
                    <input
                      type="number"
                      value={sqftMax}
                      onChange={(e) => setSqftMax(e.target.value)}
                      placeholder="Max"
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* Year Built */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Year Built</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={yearMin}
                      onChange={(e) => setYearMin(e.target.value)}
                      placeholder="Min"
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
                    />
                    <span className="text-muted text-sm">&ndash;</span>
                    <input
                      type="number"
                      value={yearMax}
                      onChange={(e) => setYearMax(e.target.value)}
                      placeholder="Max"
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Status</label>
                  <PillToggle options={STATUS_OPTIONS} value={statuses} onChange={setStatuses} multi />
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Sort By</label>
                  <Dropdown value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
                </div>

                {/* Reset */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setPropertyTypes([])
                      setBedrooms('Any')
                      setBathrooms('Any')
                      setSqftMin('')
                      setSqftMax('')
                      setYearMin('')
                      setYearMax('')
                      setStatuses([])
                      setSortBy('Recommended')
                    }}
                    className="px-4 py-2 text-sm text-accent hover:text-accent-light transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map - Hidden on mobile */}
        <div className="hidden lg:block w-[60%] relative bg-[#0f1218] border-r border-border">
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0D9488" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Faux road lines */}
          <div className="absolute inset-0 opacity-[0.07]">
            <div className="absolute top-[30%] left-0 right-0 h-px bg-muted" />
            <div className="absolute top-[50%] left-0 right-0 h-px bg-muted" />
            <div className="absolute top-[70%] left-0 right-0 h-px bg-muted" />
            <div className="absolute top-0 bottom-0 left-[25%] w-px bg-muted" />
            <div className="absolute top-0 bottom-0 left-[50%] w-px bg-muted" />
            <div className="absolute top-0 bottom-0 left-[75%] w-px bg-muted" />
          </div>

          {/* Water area */}
          <div className="absolute bottom-0 right-0 w-[40%] h-[45%] bg-[#0a1520] rounded-tl-[80px] opacity-60" />

          {/* Map label */}
          <div className="absolute top-4 left-4 bg-surface/80 backdrop-blur border border-border rounded-lg px-3 py-1.5 text-xs text-muted font-medium">
            <div className="flex items-center gap-1.5">
              <LocationIcon />
              Miami-Dade County, FL
            </div>
          </div>

          {/* Property pins */}
          {SAMPLE_LISTINGS.map((listing) => (
            <MapPin
              key={listing.id}
              listing={listing}
              isHovered={hoveredId === listing.id}
              onHover={() => setHoveredId(listing.id)}
              onLeave={() => setHoveredId(null)}
            />
          ))}

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1">
            <button className="w-8 h-8 bg-surface border border-border rounded flex items-center justify-center text-muted hover:text-foreground transition-colors text-lg">+</button>
            <button className="w-8 h-8 bg-surface border border-border rounded flex items-center justify-center text-muted hover:text-foreground transition-colors text-lg">&minus;</button>
          </div>
        </div>

        {/* Listings */}
        <div className="flex-1 lg:w-[40%] overflow-y-auto">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <p className="text-sm text-muted">
              <span className="font-semibold text-foreground">{SAMPLE_LISTINGS.length}</span> homes in Miami
            </p>
            <div className="lg:hidden">
              <Dropdown value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {SAMPLE_LISTINGS.map((listing) => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                isHighlighted={hoveredId === listing.id}
                onHover={() => setHoveredId(listing.id)}
                onLeave={() => setHoveredId(null)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

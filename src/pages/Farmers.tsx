import { useState, useMemo } from 'react'
import {
  MdPeople, MdPhone, MdLocationOn,
  MdGrass, MdBarChart, MdOpenInNew, MdLandscape
} from 'react-icons/md'
import { TbPlant2 } from 'react-icons/tb'
import SearchBar from '../components/shared/SearchBar'
import FilterBar from '../components/shared/FilterBar'
import StatusBadge from '../components/ui/StatusBadge'
import Drawer from '../components/shared/Drawer'
import { farmers } from '../data/mockData'
import './Farmers.css'

type Farmer = typeof farmers[0]

export default function Farmers() {
  const [search, setSearch]           = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [cropFilter, setCropFilter]   = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected]       = useState<Farmer | null>(null)
  const [sortKey, setSortKey]         = useState<keyof Farmer>('name')
  const [sortDir, setSortDir]         = useState<'asc' | 'desc'>('asc')

  const stateOptions  = [...new Set(farmers.map(f => f.location))].map(s => ({ label: s, value: s }))
  const cropOptions   = [...new Set(farmers.map(f => f.crop))].map(c => ({ label: c, value: c }))
  const statusOptions = [
    { label: 'Active',  value: 'active'  },
    { label: 'Warning', value: 'warning' },
    { label: 'Alert',   value: 'danger'  },
  ]

  const filtered = useMemo(() => {
    return farmers
      .filter(f => {
        const q = search.toLowerCase()
        return (
          (f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q) || f.crop.toLowerCase().includes(q)) &&
          (stateFilter  ? f.location  === stateFilter  : true) &&
          (cropFilter   ? f.crop   === cropFilter   : true) &&
          (statusFilter ? f.status === statusFilter : true)
        )
      })
      .sort((a, b) => {
        const av = a[sortKey]
        const bv = b[sortKey]
        if (av < bv) return sortDir === 'asc' ? -1 : 1
        if (av > bv) return sortDir === 'asc' ?  1 : -1
        return 0
      })
  }, [search, stateFilter, cropFilter, statusFilter, sortKey, sortDir])

  function handleSort(key: keyof Farmer) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function SortIcon({ col }: { col: keyof Farmer }) {
    if (sortKey !== col) return <span className="sort-icon inactive">↕</span>
    return <span className="sort-icon active">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="farmers-page">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">All Farmers</h2>
          <p className="page-subtitle">{filtered.length} farmers found</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="farmers-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search farmers, state, crop..."
        />
        <FilterBar
          filters={[
            { key: 'state',  label: 'State',  options: stateOptions,  value: stateFilter,  onChange: setStateFilter  },
            { key: 'crop',   label: 'Crop',   options: cropOptions,   value: cropFilter,   onChange: setCropFilter   },
            { key: 'status', label: 'Status', options: statusOptions, value: statusFilter, onChange: setStatusFilter },
          ]}
        />
      </div>

      {/* Table */}
      <div className="farmers-table-wrap">
        <table className="farmers-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                Farmer <SortIcon col="name" />
              </th>
              <th onClick={() => handleSort('location')}>
                State <SortIcon col="location" />
              </th>
              <th onClick={() => handleSort('crop')}>
                Crop <SortIcon col="crop" />
              </th>
              <th onClick={() => handleSort('ndvi')}>
                NDVI <SortIcon col="ndvi" />
              </th>
              <th onClick={() => handleSort('area')}>
                Area (ha) <SortIcon col="area" />
              </th>
              <th onClick={() => handleSort('fields')}>
                Fields <SortIcon col="fields" />
              </th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="farmers-empty">
                  <MdPeople size={36} />
                  <p>No farmers match your search</p>
                </td>
              </tr>
            ) : (
              filtered.map(f => (
                <tr
                  key={f.id}
                  className="farmers-row"
                  onClick={() => setSelected(f)}
                >
                  <td>
                    <div className="farmer-name-cell">
                      <div className="farmer-avatar">
                        {f.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="farmer-name">{f.name}</p>
                        <p className="farmer-id">ID: {f.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cell-with-icon">
                      <MdLocationOn size={14} className="cell-icon" />
                      {f.location}
                    </div>
                  </td>
                  <td>
                    <div className="cell-with-icon">
                      <TbPlant2 size={14} className="cell-icon" />
                      {f.crop}
                    </div>
                  </td>
                  <td>
                    <div className={`ndvi-pill ${f.ndvi >= 0.6 ? 'good' : f.ndvi >= 0.5 ? 'mid' : 'low'}`}>
                      {f.ndvi.toFixed(2)}
                    </div>
                  </td>
                  <td className="cell-num">{f.area.toLocaleString()}</td>
                  <td className="cell-num">{f.fields}</td>
                  <td><StatusBadge status={f.status as any} /></td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={e => { e.stopPropagation(); setSelected(f) }}
                    >
                      <MdOpenInNew size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Farmer Detail Drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Farmer Details"
      >
        {selected && (
          <div className="farmer-detail">

            {/* Profile */}
            <div className="farmer-detail-profile">
              <div className="farmer-detail-avatar">
                {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="farmer-detail-name">{selected.name}</h3>
                <p className="farmer-detail-id">Farmer ID: {selected.id}</p>
                <StatusBadge status={selected.status as any} />
              </div>
            </div>

            {/* Stats Row */}
            <div className="farmer-detail-stats">
              <div className="fd-stat">
                <MdLandscape size={18} className="fd-stat-icon" />
                <p className="fd-stat-val">{selected.fields}</p>
                <p className="fd-stat-label">Fields</p>
              </div>
              <div className="fd-stat">
                <MdBarChart size={18} className="fd-stat-icon" />
                <p className="fd-stat-val">{selected.area} ha</p>
                <p className="fd-stat-label">Total Area</p>
              </div>
              <div className="fd-stat">
                <MdGrass size={18} className="fd-stat-icon" />
                <p className="fd-stat-val">{selected.ndvi.toFixed(2)}</p>
                <p className="fd-stat-label">NDVI</p>
              </div>
            </div>

            {/* Info List */}
            <div className="farmer-detail-section">
              <p className="fd-section-title">Farm Information</p>
              <div className="fd-info-list">
                <div className="fd-info-row">
                  <span className="fd-info-label">
                    <MdLocationOn size={15} /> State
                  </span>
                  <span className="fd-info-val">{selected.location}</span>
                </div>
                <div className="fd-info-row">
                  <span className="fd-info-label">
                    <TbPlant2 size={15} /> Primary Crop
                  </span>
                  <span className="fd-info-val">{selected.crop}</span>
                </div>
                <div className="fd-info-row">
                  <span className="fd-info-label">
                    <MdPhone size={15} /> Phone
                  </span>
                  <span className="fd-info-val">{selected.phone}</span>
                </div>
              </div>
            </div>

            {/* NDVI Health Bar */}
            <div className="farmer-detail-section">
              <p className="fd-section-title">Crop Health (NDVI)</p>
              <div className="fd-ndvi-bar-wrap">
                <div className="fd-ndvi-bar-bg">
                  <div
                    className="fd-ndvi-bar-fill"
                    style={{ width: `${selected.ndvi * 100}%` }}
                  />
                </div>
                <span className="fd-ndvi-val">{(selected.ndvi * 100).toFixed(0)}%</span>
              </div>
              <p className="fd-ndvi-note">
                {selected.ndvi >= 0.65
                  ? 'Crop health is excellent'
                  : selected.ndvi >= 0.5
                  ? 'Crop health is moderate — monitor closely'
                  : 'Crop health is low — action required'}
              </p>
            </div>

            {/* Actions */}
            <div className="farmer-detail-section">
              <p className="fd-section-title">Actions</p>
              <div className="fd-actions">
                <button className="fd-btn primary">Send Alert</button>
                <button className="fd-btn secondary">View Fields</button>
                <button className="fd-btn danger">Suspend Account</button>
              </div>
            </div>

          </div>
        )}
      </Drawer>
    </div>
  )
}
import { useState, useRef } from 'react'
import { MdUpload, MdImage, MdCheckCircle, MdEdit } from 'react-icons/md'
import './Content.css'

interface ContentImage {
  id: string
  label: string
  description: string
  page: string
  currentUrl: string
  previewUrl: string | null
  file: File | null
  saved: boolean
}

const initialImages: ContentImage[] = [
  {
    id: 'hero_bg',
    label: 'Hero Background',
    description: 'Main banner image on the landing page — the big full-width background',
    page: 'Landing Page',
    currentUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    previewUrl: null,
    file: null,
    saved: true,
  },
  {
    id: 'how_we_work_1',
    label: 'How We Work — Image 1',
    description: 'Top-left image in the "How We Do Agricultural Work" grid',
    page: 'Landing Page',
    currentUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    previewUrl: null,
    file: null,
    saved: true,
  },
  {
    id: 'how_we_work_2',
    label: 'How We Work — Image 2',
    description: 'Top-right image in the "How We Do Agricultural Work" grid',
    page: 'Landing Page',
    currentUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
    previewUrl: null,
    file: null,
    saved: true,
  },
  {
    id: 'how_we_work_3',
    label: 'How We Work — Image 3',
    description: 'Bottom image in the "How We Do Agricultural Work" grid',
    page: 'Landing Page',
    currentUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
    previewUrl: null,
    file: null,
    saved: true,
  },
  {
    id: 'role_farmer',
    label: 'Farmers Role Card',
    description: 'Image shown on the "Farmers — Grow & Manage Produce" card',
    page: 'Landing Page',
    currentUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400',
    previewUrl: null,
    file: null,
    saved: true,
  },
  {
    id: 'role_buyer',
    label: 'Buyers Role Card',
    description: 'Image shown on the "Buyers — Source Quality Produce" card',
    page: 'Landing Page',
    currentUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400',
    previewUrl: null,
    file: null,
    saved: true,
  },
  {
    id: 'role_seller',
    label: 'Sellers Role Card',
    description: 'Image shown on the "Sellers — List & Sell Availability" card',
    page: 'Landing Page',
    currentUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400',
    previewUrl: null,
    file: null,
    saved: true,
  },
  {
    id: 'signin_side',
    label: 'Sign In — Side Image',
    description: 'The full-height left panel image on the Sign In page',
    page: 'Sign In Page',
    currentUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600',
    previewUrl: null,
    file: null,
    saved: true,
  },
  {
    id: 'register_side',
    label: 'Register — Side Image',
    description: 'The full-height left panel image on the Register/Sign Up page',
    page: 'Register Page',
    currentUrl: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600',
    previewUrl: null,
    file: null,
    saved: true,
  },
]

const pages = ['All Pages', 'Landing Page', 'Sign In Page', 'Register Page']

export default function Content() {
  const [images, setImages]         = useState<ContentImage[]>(initialImages)
  const [pageFilter, setPageFilter] = useState('All Pages')
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const filtered = pageFilter === 'All Pages'
    ? images
    : images.filter(img => img.page === pageFilter)

  function handleFileChange(id: string, file: File | null) {
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setImages(prev => prev.map(img =>
      img.id === id ? { ...img, file, previewUrl, saved: false } : img
    ))
  }

  function handleSave(id: string) {
    setImages(prev => prev.map(img =>
      img.id === id
        ? {
            ...img,
            currentUrl: img.previewUrl ?? img.currentUrl,
            previewUrl: null,
            file: null,
            saved: true,
          }
        : img
    ))
    setSaveSuccess(id)
    setTimeout(() => setSaveSuccess(null), 3000)
  }

  function handleDiscard(id: string) {
    setImages(prev => prev.map(img =>
      img.id === id
        ? { ...img, previewUrl: null, file: null, saved: true }
        : img
    ))
  }

  function triggerFileInput(id: string) {
    fileInputRefs.current[id]?.click()
  }

  const pendingCount = images.filter(img => !img.saved).length

  return (
    <div className="content-page">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Content Manager</h2>
          <p className="page-subtitle">
            Manage all brand and marketing images across AgroFlow+
            {pendingCount > 0 && (
              <span className="pending-badge">{pendingCount} unsaved change{pendingCount > 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
      </div>

      {/* Page Filter Tabs */}
      <div className="content-tabs">
        {pages.map(p => (
          <button
            key={p}
            className={`content-tab${pageFilter === p ? ' active' : ''}`}
            onClick={() => setPageFilter(p)}
          >
            {p}
            <span className="content-tab-count">
              {p === 'All Pages'
                ? images.length
                : images.filter(img => img.page === p).length}
            </span>
          </button>
        ))}
      </div>

      {/* Image Cards Grid */}
      <div className="content-grid">
        {filtered.map(img => (
          <div key={img.id} className={`content-card${!img.saved ? ' unsaved' : ''}`}>

            {/* Image Preview */}
            <div className="content-card-image-wrap">
              <img
                src={img.previewUrl ?? img.currentUrl}
                alt={img.label}
                className="content-card-image"
              />

              {/* Overlay on hover */}
              <div className="content-card-overlay">
                <button
                  className="content-upload-overlay-btn"
                  onClick={() => triggerFileInput(img.id)}
                >
                  <MdEdit size={16} />
                  Change Image
                </button>
              </div>

              {/* Unsaved indicator */}
              {!img.saved && (
                <div className="content-unsaved-dot" title="Unsaved changes" />
              )}

              {/* Page tag */}
              <div className="content-page-tag">{img.page}</div>
            </div>

            {/* Card Body */}
            <div className="content-card-body">
              <p className="content-card-label">{img.label}</p>
              <p className="content-card-desc">{img.description}</p>

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={el => { fileInputRefs.current[img.id] = el }}
                onChange={e => handleFileChange(img.id, e.target.files?.[0] ?? null)}
              />

              {/* Actions */}
              {img.saved ? (
                <button
                  className="content-btn upload"
                  onClick={() => triggerFileInput(img.id)}
                >
                  <MdUpload size={15} />
                  Upload New Image
                </button>
              ) : (
                <div className="content-card-actions">
                  <button
                    className="content-btn save"
                    onClick={() => handleSave(img.id)}
                  >
                    {saveSuccess === img.id ? (
                      <>
                        <MdCheckCircle size={15} />
                        Saved!
                      </>
                    ) : (
                      <>
                        <MdCheckCircle size={15} />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    className="content-btn discard"
                    onClick={() => handleDiscard(img.id)}
                  >
                    Discard
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="content-note">
        <MdImage size={15} />
        <p>
          Images saved here will update live across the AgroFlow+ platform once the backend is connected.
          For now changes are previewed locally.
        </p>
      </div>

    </div>
  )
}
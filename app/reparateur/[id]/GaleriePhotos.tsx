'use client'
import { useState } from 'react'

export default function GaleriePhotos({ photos }: { photos: string[] }) {
  const [page, setPage] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const PER_PAGE = 6
  const totalPages = Math.ceil(photos.length / PER_PAGE)
  const photosPage = photos.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  const prev = () => setLightbox(i => i !== null ? Math.max(0, i - 1) : null)
  const next = () => setLightbox(i => i !== null ? Math.min(photos.length - 1, i + 1) : null)

  if (photos.length === 0) return null

  return (
    <>
      <div style={{ background: '#fff', border: '0.5px solid #e8eaf0', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Photos</div>
          <div style={{ fontSize: '11px', color: '#888' }}>{photos.length} photo{photos.length > 1 ? 's' : ''}</div>
        </div>

        {/* Grille 3x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', marginBottom: '8px' }}>
          {photosPage.map((url, i) => (
            <div
              key={i}
              onClick={() => setLightbox(page * PER_PAGE + i)}
              style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '1/1', cursor: 'pointer', position: 'relative' }}
            >
              <img src={url} alt={'photo ' + (page * PER_PAGE + i + 1)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}
              >
                <i className="ti ti-zoom-in" style={{ fontSize: '20px', color: 'rgba(255,255,255,0)' }} aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{ background: '#f4f6fb', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '5px 12px', fontSize: '11px', color: page === 0 ? '#ccc' : '#555', cursor: page === 0 ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <i className="ti ti-chevron-left" style={{ fontSize: '12px' }} aria-hidden="true" /> Précédent
            </button>
            <div style={{ fontSize: '11px', color: '#888' }}>Page {page + 1} / {totalPages}</div>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              style={{ background: page === totalPages - 1 ? '#e0e0e0' : '#0f2d6b', border: 'none', borderRadius: '8px', padding: '5px 12px', fontSize: '11px', color: '#fff', cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Suivant <i className="ti ti-chevron-right" style={{ fontSize: '12px' }} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', flexDirection: 'column' }}
          onClick={e => { if (e.target === e.currentTarget) setLightbox(null) }}
        >
          {/* Header */}
          <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderBottom: '1px solid #222' }}>
            <button
              onClick={() => setLightbox(null)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
            >
              <i className="ti ti-x" style={{ fontSize: '18px' }} aria-hidden="true" />
            </button>
          </div>

          {/* Photo principale */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '16px' }}>
            <img
              src={photos[lightbox]}
              alt={'photo ' + (lightbox + 1)}
              style={{ maxWidth: '90vw', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px', width: 'auto', height: 'auto' }}
            />
            {lightbox > 0 && (
              <button
                onClick={prev}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
              >
                <i className="ti ti-chevron-left" style={{ fontSize: '20px' }} aria-hidden="true" />
              </button>
            )}
            {lightbox < photos.length - 1 && (
              <button
                onClick={next}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
              >
                <i className="ti ti-chevron-right" style={{ fontSize: '20px' }} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Footer — compteur + miniatures */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #222' }}>
            <div style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>
              {lightbox + 1} / {photos.length} photo{photos.length > 1 ? 's' : ''}
            </div>
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', overflowX: 'auto', paddingBottom: '4px' }}>
              {photos.map((url, i) => (
                <div
                  key={i}
                  onClick={() => setLightbox(i)}
                  style={{
                    width: '44px', height: '44px', borderRadius: '6px', overflow: 'hidden',
                    flexShrink: 0, cursor: 'pointer',
                    border: lightbox === i ? '2px solid #2563eb' : '2px solid transparent',
                    opacity: lightbox === i ? 1 : 0.5,
                    transition: 'opacity 0.15s',
                  }}
                >
                  <img src={url} alt={'miniature ' + (i + 1)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

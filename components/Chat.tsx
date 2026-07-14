'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Chat({
  reservationId,
  userId,
  senderType,
  nomInterlocuteur,
}: {
  reservationId: string
  userId: string
  senderType: 'client' | 'reparateur'
  nomInterlocuteur: string
}) {
  const [messages, setMessages] = useState<any[]>([])
  const [contenu, setContenu] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const loadMessages = async () => {
    const res = await fetch('/api/messages?reservation_id=' + reservationId)
    const data = await res.json()
    setMessages(data.messages || [])
    // Marquer comme lus
    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservation_id: reservationId, reader_id: userId })
    })
  }

  useEffect(() => {
    loadMessages()

    // Polling toutes les 3 secondes
    const interval = setInterval(loadMessages, 3000)
    return () => clearInterval(interval)
  }, [reservationId])

  useEffect(() => {
    if (bottomRef.current) {
      const container = bottomRef.current.parentElement
      if (container) container.scrollTop = container.scrollHeight
    }
  }, [messages])

  const envoyer = async () => {
    if (!contenu.trim() || loading) return
    setLoading(true)
    const msg = contenu.trim()
    setContenu('')
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reservation_id: reservationId,
        sender_id: userId,
        sender_type: senderType,
        contenu: msg,
      })
    })
    setLoading(false)
  }

  const MOIS = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']
  const formatDate = (d: string) => {
    const date = new Date(d)
    return date.getDate() + ' ' + MOIS[date.getMonth()] + ' à ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '400px', background: '#fff', border: '1px solid #e8eaf0', borderRadius: '12px', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: '#2563eb', flexShrink: 0 }}>
          {nomInterlocuteur[0]?.toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{nomInterlocuteur}</div>
          <div style={{ fontSize: '11px', color: '#16a34a' }}>En ligne</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#bbb', fontSize: '13px', marginTop: '2rem' }}>
            Démarrez la conversation
          </div>
        )}
        {messages.map((m: any) => {
          const isMe = m.sender_id === userId
          return (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '75%', padding: '8px 12px', borderRadius: isMe ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                background: isMe ? '#2563eb' : '#f4f6fb',
                color: isMe ? '#fff' : '#111',
                fontSize: '13px', lineHeight: 1.5,
              }}>
                {m.contenu}
              </div>
              <div style={{ fontSize: '10px', color: '#bbb', marginTop: '3px' }}>
                {formatDate(m.created_at)}
                {isMe && <span style={{ marginLeft: '4px' }}>{m.lu ? ' ✓✓' : ' ✓'}</span>}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input type="text" style={{ display: 'none' }} autoComplete="username" readOnly />
        <input type="password" style={{ display: 'none' }} autoComplete="current-password" readOnly />
        <input
          type="search"
          value={contenu}
          onChange={e => setContenu(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && envoyer()}
          placeholder="Écrire un message..."
          autoComplete="off"
          name="chat-message"
          style={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: '20px', padding: '8px 14px', fontSize: '13px', outline: 'none', fontFamily: '"DM Sans", sans-serif', background: '#f8f9fc' }}
        />
        <button
          onClick={envoyer}
          disabled={!contenu.trim() || loading}
          style={{ width: '36px', height: '36px', borderRadius: '50%', background: contenu.trim() ? '#2563eb' : '#e0e0e0', border: 'none', cursor: contenu.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <i className="ti ti-send" style={{ fontSize: '16px', color: '#fff' }} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Inscrire() {
  const [form, setForm] = useState({
    nom: '', adresse: '', ville: '', code_postal: '', telephone: '',
    email: '', services: '', horaires: '', description: ''
  })
  const [kbis, setKbis] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = as

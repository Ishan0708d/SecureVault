import { useState, useRef } from 'react'
import { auth } from '../firebase'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const formatSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function Upload() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef()
  const navigate = useNavigate()

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile)
    setError('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFileChange(dropped)
  }

  const handleUpload = async () => {
    if (!file) { setError('Please select a file to upload'); return }

    try {
      setUploading(true)
      setProgress(0)
      const token = await auth.currentUser.getIdToken()
      const formData = new FormData()
      formData.append('file', file)

      await axios.post('http://localhost:3000/files/upload', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total)
          setProgress(pct)
        }
      })

      setCompleted(prev => [...prev, { name: file.name, size: file.size }])
      setFile(null)
      setProgress(0)
    } catch (err) {
      setError('Failed to upload file. Please try again')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0f1a 0%, #0f1e3a 50%, #0a1628 100%)', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>

      {/* Nav */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>SecureVault</span>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem', color: '#fff' }}>
          Back to Dashboard
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.5px' }}>Secure File Upload</h1>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          style={{
            border: `2px dashed ${dragOver ? '#8fafd4' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: '14px', padding: '3rem 2rem', textAlign: 'center',
            background: dragOver ? 'rgba(100,140,200,0.1)' : 'rgba(255,255,255,0.04)',
            cursor: 'pointer', marginBottom: '2rem', transition: 'all 0.2s'
          }}>
          <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={e => handleFileChange(e.target.files[0])} />

          <div style={{ width: '48px', height: '48px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '10px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '3px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', width: '2px', height: '10px', background: 'rgba(255,255,255,0.5)' }} />
              <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%) rotate(45deg) translate(-3px, 3px)', width: '6px', height: '6px', borderTop: '2px solid rgba(255,255,255,0.5)', borderRight: '2px solid rgba(255,255,255,0.5)' }} />
            </div>
          </div>

          <p style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.4rem', color: '#fff' }}>
            {file ? file.name : 'Drop files here or click to browse'}
          </p>
          <p style={{ color: '#aaa', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
            Supports: PDF, DOC, XLS, JPG, PNG, ZIP (Max 5MB per file)
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); file ? handleUpload() : fileInputRef.current.click() }}
            style={{ background: 'linear-gradient(135deg, #6b8cba, #8fafd4)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
            {file ? 'Upload File' : 'Select Files'}
          </button>
        </div>

        {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

        {/* Upload Options */}
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>Upload Options</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { title: 'Encrypt files', desc: 'Automatically encrypt all uploaded files with 256-bit AES encryption' },
            { title: 'Virus scan', desc: 'Scan files for malware and viruses before uploading' },
          ].map(opt => (
            <div key={opt.title} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1.2rem 1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px', color: '#fff' }}>{opt.title}</div>
              <div style={{ fontSize: '0.82rem', color: '#aaa', lineHeight: 1.5 }}>{opt.desc}</div>
            </div>
          ))}
        </div>

        {/* Uploading */}
        {uploading && (
          <>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>Uploading (1 file)</h2>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1.2rem 1.5rem', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem', color: '#fff' }}>{file?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '2px' }}>{formatSize(file?.size)} • {progress}% complete</div>
                </div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #6b8cba, #8fafd4)' }} />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '999px', height: '6px' }}>
                <div style={{ background: 'linear-gradient(135deg, #6b8cba, #8fafd4)', height: '6px', borderRadius: '999px', width: `${progress}%`, transition: 'width 0.3s' }} />
              </div>
            </div>
          </>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>Completed ({completed.length} file{completed.length > 1 ? 's' : ''})</h2>
            <div style={{ marginBottom: '2rem' }}>
              {completed.map((f, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1.2rem 1.5rem', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem', color: '#fff' }}>{f.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '2px' }}>{formatSize(f.size)} • Encrypted and uploaded successfully</div>
                  </div>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf82' }} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Bottom Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          {[
            { icon: '—', label: 'End-to-End Encrypted' },
            { icon: '—', label: 'Virus Protection' },
            { icon: '—', label: 'Version Control' },
          ].map(card => (
            <div key={card.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <div style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', margin: '0 auto 0.8rem' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{card.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
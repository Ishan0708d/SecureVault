import { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Loading from '/components/Loading'
import axios from 'axios'


const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatSize = (bytes) => {
  if (!bytes) return 'N/A'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const FileIcon = ({ filename }) => {
  const ext = filename?.split('.').pop().toLowerCase()
  const colors = { pdf: '#ff6b6b', jpg: '#8fafd4', jpeg: '#8fafd4', png: '#8fafd4', doc: '#6b8cba', docx: '#6b8cba', xlsx: '#4caf82', xls: '#4caf82', txt: '#aaa' }
  const color = colors[ext] || '#aaa'
  return <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: `${color}22`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: '10px', height: '12px', border: `1.5px solid ${color}`, borderRadius: '2px' }} />
  </div>
}

export default function Dashboard() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const navigate = useNavigate()

  const fetchFiles = async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/files`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFiles(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchFiles() }, [])

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/', { replace: true })
  }

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return
    try {
      const token = await auth.currentUser.getIdToken()
      await axios.delete(`${import.meta.env.VITE_API_URL}/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFiles(files.filter(f => f.id !== fileId))
    } catch (err) {
      console.error(err)
    }
  }

  const filteredFiles = files.filter(f =>
    f.filename.toLowerCase().includes(search.toLowerCase())
  )

  const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0)
  const recentFiles = [...files].sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)).slice(0, 4)

  if (loading) {
    return <Loading onFinish={() => setLoading(false)} />
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #0a0f1a 0%, #0f1e3a 50%, #0a1628 100%)', color: '#fff' }}>

      {/* Top Nav */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', backdropFilter: 'blur(12px)' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>SecureVault</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{auth.currentUser?.email}</span>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem', color: '#fff' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        {/* Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Dashboard</h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['all', 'recent'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '6px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                  background: activeTab === tab ? 'linear-gradient(135deg, #6b8cba, #8fafd4)' : 'rgba(255,255,255,0.06)',
                  color: '#fff'
                }}>
                  {tab === 'all' ? 'All Files' : 'Recent'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              placeholder="Search files..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', width: '220px', fontSize: '0.9rem', outline: 'none', color: '#fff' }}
            />
            <button onClick={() => navigate('/upload')} style={{
              background: 'linear-gradient(135deg, #6b8cba, #8fafd4)', color: '#fff', border: 'none', borderRadius: '8px',
              padding: '8px 18px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600
            }}>+ Upload File</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Files', value: files.length, sub: '+12%' },
            { label: 'Storage Used', value: formatSize(totalSize), sub: '68%' },
            { label: 'Shared Files', value: 0, sub: '+8' },
            { label: 'Security Score', value: '100%', sub: 'Active' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #6b8cba, #8fafd4)' }} />
                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{stat.sub}</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Files Table */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: '2rem' }}>
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Recent Files</h2>
            <span style={{ fontSize: '0.85rem', color: '#aaa', cursor: 'pointer' }}>View All</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['NAME', 'MODIFIED', 'SIZE', 'STATUS', 'ACTIONS'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', color: '#aaa', fontWeight: 600, letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>Loading...</td></tr>
              ) : filteredFiles.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>No files found</td></tr>
              ) : (
                (activeTab === 'recent' ? recentFiles : filteredFiles).map(file => (
                  <tr key={file.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileIcon filename={file.filename} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{file.filename}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#aaa' }}>{formatDate(file.uploaded_at)}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#aaa' }}>{formatSize(file.size)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: 'rgba(107,140,186,0.15)', borderRadius: '20px', padding: '3px 10px', fontSize: '0.75rem', color: '#8fafd4', border: '1px solid rgba(107,140,186,0.3)' }}>Encrypted</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <a href={`${import.meta.env.VITE_API_URL}/${file.file_url}`} target="_blank" rel="noreferrer"
                          style={{ fontSize: '0.8rem', color: '#8fafd4', textDecoration: 'none', border: '1px solid rgba(143,175,212,0.3)', borderRadius: '5px', padding: '3px 10px' }}>
                          Download
                        </a>
                        <button onClick={() => handleDelete(file.id)}
                          style={{ fontSize: '0.8rem', color: '#ff6b6b', background: 'none', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '5px', padding: '3px 10px', cursor: 'pointer' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

          {/* Storage Overview */}
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>Storage Overview</h3>
            <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.5rem' }}>{formatSize(totalSize)} used</div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '999px', height: '8px', marginBottom: '1rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #6b8cba, #8fafd4)', height: '8px', borderRadius: '999px', width: `${Math.min((totalSize / (100 * 1024 * 1024)) * 100, 100)}%` }} />
            </div>
            {[{ label: 'Documents', color: '#6b8cba' }, { label: 'Images', color: '#8fafd4' }, { label: 'Others', color: '#aaa' }].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                <span style={{ fontSize: '0.85rem', color: '#aaa' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Activity Log */}
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>Activity Log</h3>
            {recentFiles.slice(0, 3).map(file => (
              <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(107,140,186,0.15)', border: '1px solid rgba(107,140,186,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '10px', height: '10px', border: '1.5px solid #8fafd4', borderRadius: '2px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>File uploaded</div>
                  <div style={{ fontSize: '0.78rem', color: '#aaa' }}>{file.filename} · {formatDate(file.uploaded_at)}</div>
                </div>
              </div>
            ))}
            {recentFiles.length === 0 && <p style={{ color: '#aaa', fontSize: '0.85rem' }}>No recent activity</p>}
          </div>

        </div>
      </div>
    </div>
  )
}
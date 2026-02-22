import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0f1a', minHeight: '100vh', color: '#fff' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.4rem 3rem', position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10, 15, 26, 0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>SecureVault</span>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/login')} style={{
            background: 'none', border: 'none', color: '#fff',
            cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, padding: '8px 20px'
          }}>Log In</button>
          <button onClick={() => navigate('/signup')} style={{
            background: 'linear-gradient(135deg, #6b8cba, #8fafd4)',
            color: '#fff', border: 'none', borderRadius: '999px',
            padding: '10px 24px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600
          }}>Sign Up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '4rem 3rem', position: 'relative', overflow: 'hidden', textAlign: 'center',
        background: 'radial-gradient(ellipse at 60% 80%, rgba(70,100,160,0.35) 0%, transparent 65%), radial-gradient(ellipse at 20% 50%, rgba(30,50,100,0.2) 0%, transparent 60%), #0a0f1a'
      }}>

        {/* Badge */}
        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', padding: '6px 18px', fontSize: '0.8rem', color: '#aaa', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          Trusted by 500,000+ Users Worldwide
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '1.5rem', maxWidth: '750px' }}>
          Protect Your Data with Military-Grade Encryption
        </h1>

        {/* Subheadline */}
        <p style={{ color: '#888', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '480px' }}>
          Trusted by Fortune 500 companies. Zero-knowledge architecture ensures your files remain private and secure.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginBottom: '2.5rem' }}>
          {[
            { value: '500K+', label: 'Active Users' },
            { value: '2.5PB', label: 'Data Protected' },
            { value: '99.99%', label: 'Uptime SLA' },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-1px' }}>{stat.value}</div>
              <div style={{ color: '#666', fontSize: '0.82rem', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
          <button onClick={() => navigate('/signup')} style={{
            background: 'linear-gradient(135deg, #6b8cba, #8fafd4)', color: '#fff',
            border: 'none', borderRadius: '999px', padding: '14px 32px',
            cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600
          }}>Get Started Free</button>
          <button style={{
            background: 'rgba(255,255,255,0.06)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px',
            padding: '14px 32px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500
          }}>Watch Demo</button>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#555' }}>
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </section>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid hsla(0, 0%, 100%, 0.08)',
        padding: '1.2rem 3rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(255,255,255,0.02)', color: '#555', fontSize: '0.78rem', letterSpacing: '2px', textTransform: 'uppercase'
      }}>
        <span>End-To-End Encryption</span>
        <span style={{ color: '#667', letterSpacing: '4px' }}>F I L E &nbsp; I N T E G R I T Y</span>
        <span>Zero Knowledge Architecture</span>
      </div>

      {/* Trusted Section */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '5rem 3rem',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(70,100,160,0.2) 0%, transparent 60%), #0a0f1a'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.8rem', letterSpacing: '-1px' }}>Trusted by Industry Leaders</h2>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Join 10,000+ companies protecting 2.5 petabytes of sensitive data</p>
        </div>

        {/* Company Logos */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
              padding: '16px 28px', color: '#555', fontSize: '0.85rem',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              Company Logo
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', maxWidth: '900px', width: '100%', marginBottom: '4rem' }}>
          {[
            { title: 'SOC 2 Certified', desc: 'Industry-standard security compliance' },
            { title: '256-bit Encryption', desc: 'Military-grade data protection' },
            { title: 'GDPR Compliant', desc: 'European data privacy standards' },
            { title: '24/7 Support', desc: 'Always here to help you' },
          ].map(card => (
            <div key={card.title} style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: '14px',
              padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center'
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{card.title}</div>
              <div style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.5 }}>{card.desc}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/signup')} style={{
            background: 'linear-gradient(135deg, #6b8cba, #8fafd4)',
            color: '#fff', border: 'none', borderRadius: '999px',
            padding: '14px 36px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, marginRight: '1rem'
          }}>Get Started Free</button>
          <button onClick={() => navigate('/login')} style={{
            background: 'rgba(255,255,255,0.06)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px',
            padding: '14px 36px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500
          }}>Log In</button>
        </div>
      </section>

    </div>
  )
}
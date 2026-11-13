import React, { useState, useEffect } from 'react'
import './luxury-clinic.css'
import {
  CLINIC_INFO,
  ASSETS,
  INDIVIDUAL_SERVICES,
  BROW_COMPARISON_TABLE,
  ACADEMY_COURSES,
  BLOG_EDITORIAL_PLAN,
  CLIENT_JOURNEY_STEPS,
  CLINIC_FAQS
} from './contentData'

// Helper for client-side navigation with URL updates and scroll to top
function useNavigation() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/')

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { currentPath, navigate }
}

export function LuxuryApp() {
  const { currentPath, navigate } = useNavigation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lang, setLang] = useState('en') // 'en' | 'ta'

  // Booking Modal State (can be opened from any page or button)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingService, setBookingService] = useState('Microblading')
  const [bookingDate, setBookingDate] = useState('Tomorrow')
  const [bookingTime, setBookingTime] = useState('10:30 AM')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientNotes, setClientNotes] = useState('')
  const [bookingSent, setBookingSent] = useState(false)

  // Before/After Slider State (for Home & Service pages)
  const [baPosition, setBaPosition] = useState(50)
  const [activeBaTab, setActiveBaTab] = useState('Brows')

  // Timed Consultation Pop-up
  const [showConsultPopup, setShowConsultPopup] = useState(false)
  useEffect(() => {
    const seen = sessionStorage.getItem('browlicious_consult_popup_seen')
    if (!seen) {
      const timer = setTimeout(() => {
        setShowConsultPopup(true)
        sessionStorage.setItem('browlicious_consult_popup_seen', 'true')
      }, 7000)
      return () => clearTimeout(timer)
    }
  }, [])

  const openBookingFor = (serviceName) => {
    if (serviceName) setBookingService(serviceName)
    setBookingSent(false)
    setBookingOpen(true)
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    if (!clientName || !clientPhone) {
      alert('Please provide your name and phone number.')
      return
    }

    const message = [
      '✨ *NEW APPOINTMENT ENQUIRY - BROWLICIOUS CHENNAI*',
      '---------------------------------------',
      `👤 *Client Name:* ${clientName}`,
      `📞 *Mobile:* ${clientPhone}`,
      `📧 *Email:* ${clientEmail || 'Not provided'}`,
      `💄 *Treatment / Course:* ${bookingService}`,
      `📅 *Preferred Date:* ${bookingDate}`,
      `⏰ *Preferred Time:* ${bookingTime}`,
      `📝 *Notes / Goals:* ${clientNotes || 'None'}`,
      '---------------------------------------',
      'Please confirm my booking slot and send clinic details.'
    ].join('\n')

    window.open(`${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`, '_blank')
    setBookingSent(true)
  }

  // Determine which page component to display based on currentPath
  let PageContent = null

  if (currentPath === '/' || currentPath === '') {
    PageContent = <HomePage navigate={navigate} onBook={openBookingFor} baPosition={baPosition} setBaPosition={setBaPosition} activeBaTab={activeBaTab} setActiveBaTab={setActiveBaTab} lang={lang} />
  } else if (currentPath === '/about') {
    PageContent = <AboutPage navigate={navigate} onBook={openBookingFor} />
  } else if (currentPath === '/services') {
    PageContent = <ServicesDirectoryPage navigate={navigate} onBook={openBookingFor} />
  } else if (currentPath.startsWith('/services/')) {
    const slug = currentPath.replace('/services/', '').trim()
    const serviceData = INDIVIDUAL_SERVICES[slug]
    if (serviceData) {
      PageContent = <IndividualServicePage service={serviceData} navigate={navigate} onBook={openBookingFor} />
    } else {
      PageContent = <ServicesDirectoryPage navigate={navigate} onBook={openBookingFor} />
    }
  } else if (currentPath === '/aftercare' || currentPath === '/journey') {
    PageContent = <JourneyAftercarePage navigate={navigate} onBook={openBookingFor} />
  } else if (currentPath === '/academy') {
    PageContent = <AcademyPage navigate={navigate} onBook={openBookingFor} />
  } else if (currentPath === '/blog' || currentPath.startsWith('/blog')) {
    PageContent = <BlogPage navigate={navigate} onBook={openBookingFor} />
  } else if (currentPath === '/contact') {
    PageContent = <ContactPage navigate={navigate} onBook={openBookingFor} />
  } else {
    PageContent = <HomePage navigate={navigate} onBook={openBookingFor} baPosition={baPosition} setBaPosition={setBaPosition} activeBaTab={activeBaTab} setActiveBaTab={setActiveBaTab} lang={lang} />
  }

  return (
    <div className="browlicious-luxury-theme">
      {/* ====================================================================
          STICKY TOP BAR
          ==================================================================== */}
      <aside className="luxury-topbar" aria-label="Quick Clinic Contact">
        <div className="luxury-shell topbar-content">
          <div className="topbar-left">
            <span className="topbar-badge">
              <span className="sparkle">✦</span> {lang === 'ta' ? 'அண்ணா நகர், சென்னை' : 'Anna Nagar, Chennai'}
            </span>
            <span className="topbar-announcement">
              {lang === 'ta'
                ? 'சென்னை முன்னணி PMU & அழகியல் கிளினிக் • 5000+ திருப்திகரமான வாடிக்கையாளர்கள்'
                : "Chennai's No.1 PMU & Aesthetics Clinic • 5000+ Happy Clients"}
            </span>
          </div>

          <div className="topbar-actions">
            <button
              className="lang-switch"
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              title="Toggle Tamil / English"
            >
              {lang === 'en' ? '🇮🇳 தமிழ்' : '🇬🇧 English'}
            </button>
            <a href={`tel:${CLINIC_INFO.phoneCall}`} className="topbar-btn topbar-btn-call">
              📞 {lang === 'ta' ? 'அழைக்க' : 'Call Now'}
            </a>
            <a
              href={`${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent('Hello Browlicious! I would like to make an enquiry.')}`}
              target="_blank"
              rel="noreferrer"
              className="topbar-btn topbar-btn-wa"
            >
              💬 WhatsApp
            </a>
            <button onClick={() => openBookingFor('Consultation')} className="topbar-btn topbar-btn-book">
              ✨ {lang === 'ta' ? 'முன்பதிவு' : 'Book Appointment'}
            </button>
          </div>
        </div>
      </aside>

      {/* ====================================================================
          STICKY MAIN NAVIGATION HEADER
          ==================================================================== */}
      <header className="luxury-navbar">
        <div className="luxury-shell navbar-container">
          <button className="brand-wrapper" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <div className="brand-crest">
              <img src={ASSETS.pmuClinicLogo} alt="Browlicious PMU Clinic Logo" />
            </div>
            <div className="brand-text">
              <b>Browlicious</b>
              <span>PMU & Aesthetics Clinic · Chennai</span>
            </div>
          </button>

          <nav className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <button
              className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
              onClick={() => { navigate('/'); setMobileMenuOpen(false) }}
            >
              Home
            </button>
            <button
              className={`nav-link ${currentPath === '/about' ? 'active' : ''}`}
              onClick={() => { navigate('/about'); setMobileMenuOpen(false) }}
            >
              About Us
            </button>
            <button
              className={`nav-link ${currentPath.startsWith('/services') ? 'active' : ''}`}
              onClick={() => { navigate('/services'); setMobileMenuOpen(false) }}
            >
              Services (14)
            </button>
            <button
              className={`nav-link ${currentPath === '/aftercare' ? 'active' : ''}`}
              onClick={() => { navigate('/aftercare'); setMobileMenuOpen(false) }}
            >
              Journey & Aftercare
            </button>
            <button
              className={`nav-link ${currentPath === '/academy' ? 'active' : ''}`}
              onClick={() => { navigate('/academy'); setMobileMenuOpen(false) }}
            >
              The Academy
            </button>
            <button
              className={`nav-link ${currentPath === '/blog' ? 'active' : ''}`}
              onClick={() => { navigate('/blog'); setMobileMenuOpen(false) }}
            >
              Blog & Journal
            </button>
            <button
              className={`nav-link ${currentPath === '/contact' ? 'active' : ''}`}
              onClick={() => { navigate('/contact'); setMobileMenuOpen(false) }}
            >
              Contact
            </button>
          </nav>

          <div className="nav-cta-group">
            <button className="btn-luxury-gold" onClick={() => openBookingFor('Free Consultation')}>
              Book a Free Consultation <span>↗</span>
            </button>
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Render Current Individual Page */}
      <main id="main-content">
        {PageContent}
      </main>

      {/* ====================================================================
          LUXURY CLINIC FOOTER
          ==================================================================== */}
      <footer className="luxury-footer">
        <div className="luxury-shell">
          <div className="footer-top-grid">
            <div className="footer-col">
              <div className="footer-brand">
                <b>Browlicious</b>
                <span>Permanent Makeup Clinic and Academy · Chennai</span>
              </div>
              <p className="footer-about-text">
                Permanent makeup that looks like you, only effortlessly polished. Specialist brows, lips, eyes, scalp and skin restoration in Anna Nagar East, Chennai.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href={CLINIC_INFO.instagramUrl} target="_blank" rel="noreferrer" className="topbar-btn topbar-btn-call" style={{ fontSize: '11px', padding: '6px 12px' }}>
                  Instagram ↗
                </a>
                <a href={CLINIC_INFO.mapUrl} target="_blank" rel="noreferrer" className="topbar-btn topbar-btn-call" style={{ fontSize: '11px', padding: '6px 12px' }}>
                  Google Maps ↗
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h5>Treatments</h5>
              <ul className="footer-links-list">
                <li><button onClick={() => navigate('/services/microblading')} className="nav-link">Microblading</button></li>
                <li><button onClick={() => navigate('/services/ombre-brows')} className="nav-link">Ombre (Powder) Brows</button></li>
                <li><button onClick={() => navigate('/services/combination-brows')} className="nav-link">Combination Brows</button></li>
                <li><button onClick={() => navigate('/services/lip-blush')} className="nav-link">Lip Blush</button></li>
                <li><button onClick={() => navigate('/services/dark-lip-correction')} className="nav-link">Dark Lip Pigmentation</button></li>
                <li><button onClick={() => navigate('/services/eyeliner')} className="nav-link">Permanent Eyeliner</button></li>
                <li><button onClick={() => navigate('/services/smp-men')} className="nav-link">SMP for Men & Women</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Clinic & Academy</h5>
              <ul className="footer-links-list">
                <li><button onClick={() => navigate('/about')} className="nav-link">About Us & Durga</button></li>
                <li><button onClick={() => navigate('/aftercare')} className="nav-link">7-Step Journey & FAQ</button></li>
                <li><button onClick={() => navigate('/aftercare')} className="nav-link">Aftercare Rules</button></li>
                <li><button onClick={() => navigate('/academy')} className="nav-link">PMU Training Academy</button></li>
                <li><button onClick={() => navigate('/blog')} className="nav-link">12-Week Blog Hub</button></li>
                <li><button onClick={() => navigate('/contact')} className="nav-link">Contact & Location</button></li>
              </ul>
            </div>

            <div className="footer-col footer-contact-info">
              <h5>Visit The Clinic</h5>
              <p>
                📍 <b>Browlicious PMU Clinic</b><br />
                {CLINIC_INFO.address}
              </p>
              <p>
                🕒 <b>Clinic Hours:</b><br />
                {CLINIC_INFO.hours}
              </p>
              <p>
                📞 <b>Call / WhatsApp:</b><br />
                <a href={`tel:${CLINIC_INFO.phoneCall}`}>{CLINIC_INFO.phone}</a>
              </p>
              <a href={CLINIC_INFO.mapUrl} target="_blank" rel="noreferrer" className="btn-luxury-gold" style={{ display: 'inline-flex', padding: '9px 18px', fontSize: '12px', marginTop: '8px' }}>
                Get Directions 📍 <span>↗</span>
              </a>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>© {new Date().getFullYear()} Browlicious | Permanent Makeup Clinic and Academy | Chennai. All Rights Reserved.</span>
            <span>Anna Nagar East, Chennai · No.1 PMU Sanctuary</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={`${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent('Hello Browlicious! I would like to make an enquiry.')}`}
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp-widget"
        aria-label="Chat with Browlicious on WhatsApp"
      >
        <svg viewBox="0 0 32 32">
          <path d="M27.1 4.8A15 15 0 0 0 3.5 22.9L2 30l7.3-1.5A15 15 0 1 0 27.1 4.8Zm-11 24.6a12.3 12.3 0 0 1-6.2-1.7l-.4-.2-4.3.9.9-4.2-.3-.4A12.2 12.2 0 1 1 16.1 29.4Zm6.7-9.2c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.7-.2-1 .2s-1 1.3-1.2 1.6c-.2.3-.5.3-.9.1-2.5-1.2-4.1-2.2-5.8-5-.4-.6.4-.6 1.1-2 .1-.3.1-.6 0-.8-.1-.2-1-2.3-1.3-3.2-.4-.9-.7-.8-1-.8h-.8c-.3 0-.8.1-1.2.6s-1.6 1.6-1.6 3.9 1.6 4.5 1.9 4.8c.2.3 3.2 5 7.8 7 .7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.5Z" />
        </svg>
        <span>WhatsApp Us</span>
      </a>

      {/* Mobile Sticky Bottom Thumb-Zone Bar */}
      <div className="mobile-sticky-bottom-bar">
        <div className="mobile-bar-actions">
          <a href={`tel:${CLINIC_INFO.phoneCall}`} className="mobile-bar-btn mobile-bar-call">
            📞 Call Clinic
          </a>
          <button onClick={() => openBookingFor('Consultation')} className="mobile-bar-btn mobile-bar-book">
            ✨ Free Consultation
          </button>
          <a
            href={`${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent('Hello Browlicious! I would like to make an enquiry.')}`}
            target="_blank"
            rel="noreferrer"
            className="mobile-bar-btn mobile-bar-wa"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>

      {/* Reusable Booking Modal */}
      {bookingOpen && (
        <div className="luxury-modal-backdrop" onClick={() => setBookingOpen(false)}>
          <div className="luxury-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setBookingOpen(false)} aria-label="Close form">
              ✕
            </button>
            <div style={{ padding: '36px' }}>
              <span className="luxury-eyebrow">Direct Clinic Scheduling</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--deep-plum)', marginBottom: '8px' }}>
                Book Your Consultation at Browlicious
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                Select your service and preferred date. We reply immediately via WhatsApp with slot confirmation and directions to Anna Nagar clinic.
              </p>

              {bookingSent ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: '44px', color: '#25d366', marginBottom: '10px' }}>✓</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--deep-plum)' }}>WhatsApp Message Prepared!</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '10px 0 20px' }}>
                    If WhatsApp did not launch automatically, click the button below to send your details directly.
                  </p>
                  <a
                    href={`${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent(`Hello Browlicious! I would like to book ${bookingService} on ${bookingDate} for ${clientName}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-luxury-gold"
                  >
                    Open WhatsApp Chat Now <span>↗</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  <div className="booking-form-row">
                    <div className="form-group">
                      <label>Treatment of Interest *</label>
                      <select
                        value={bookingService}
                        onChange={(e) => setBookingService(e.target.value)}
                        style={{ width: '100%', padding: '12px', border: '1.5px solid var(--border-line)', borderRadius: '8px' }}
                      >
                        {Object.values(INDIVIDUAL_SERVICES).map((s) => (
                          <option key={s.slug} value={s.name}>{s.name} ({s.price})</option>
                        ))}
                        <option value="Browlicious PMU Academy Course">Browlicious PMU Academy Course</option>
                        <option value="General Free Consultation">General Free Consultation</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Preferred Date *</label>
                      <select
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        style={{ width: '100%', padding: '12px', border: '1.5px solid var(--border-line)', borderRadius: '8px' }}
                      >
                        <option value="Today">Today</option>
                        <option value="Tomorrow">Tomorrow</option>
                        <option value="This Friday">This Friday</option>
                        <option value="This Saturday">This Saturday</option>
                        <option value="This Sunday">This Sunday</option>
                        <option value="Next Week">Next Week</option>
                      </select>
                    </div>
                  </div>

                  <div className="booking-form-row">
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Mobile / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 97103 XXXXX"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label>Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label>Any goals, questions or medical notes</label>
                    <textarea
                      rows={2}
                      placeholder="Tell us a little more about your brows, lips or skin goals..."
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button type="button" className="btn-luxury-outline" onClick={() => setBookingOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-luxury-gold">
                      Confirm on WhatsApp 💬 <span>↗</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Timed Consultation Pop-up */}
      {showConsultPopup && (
        <div className="consultation-popup-overlay" onClick={() => setShowConsultPopup(false)}>
          <div className="consultation-popup-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowConsultPopup(false)} aria-label="Close popup">
              ✕
            </button>
            <span className="luxury-eyebrow">Your Next Step</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--deep-plum)', margin: '10px 0' }}>
              Your best features, every single day.
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.6' }}>
              Imagine skipping the brow pencil, lip liner and morning touch-ups. Book your free consultation with Durga at Browlicious Anna Nagar.
            </p>
            <button
              className="btn-luxury-gold"
              style={{ width: '100%', padding: '14px 20px' }}
              onClick={() => { setShowConsultPopup(false); openBookingFor('Free Consultation') }}
            >
              Book a Free Consultation <span>↗</span>
            </button>
            <button
              onClick={() => setShowConsultPopup(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', marginTop: '14px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Continue browsing
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ==========================================================================
   PAGE 1: HOME PAGE
   ========================================================================== */
function HomePage({ navigate, onBook, baPosition, setBaPosition, activeBaTab, setActiveBaTab, lang }) {
  const baSlide = activeBaTab === 'Lips'
    ? { before: ASSETS.testimonialLipsRestImg, after: ASSETS.testimonialLipsResultImg, label: 'Lip Blush & Neutralization' }
    : activeBaTab === 'Eyeliner'
    ? { before: ASSETS.testimonialEyelinerBeforeImg, after: ASSETS.testimonialEyelinerCloseupImg, label: 'Permanent Eyeliner' }
    : { before: ASSETS.browsImg, after: ASSETS.testimonialBrowsResultImg, label: 'Natural Hair-Stroke Microblading' }

  return (
    <>
      {/* Hero Section */}
      <section className="luxury-hero">
        <div className="luxury-shell hero-layout">
          <div className="hero-left">
            <div className="luxury-pill-tag">
              <span className="badge-dot"></span>
              {lang === 'ta' ? 'அண்ணா நகர், சென்னை' : 'Browlicious PMU Clinic & Academy · Chennai'}
            </div>

            <h1 className="hero-headline">
              Permanent makeup that looks like you, <em>only effortlessly polished.</em>
            </h1>

            <p className="hero-subheadline">
              Specialist brows, lips, eyes, scalp and skin restoration at Browlicious, Chennai. Designed around your face, applied with medical-grade precision.
            </p>

            <div className="hero-cta-bar">
              <button className="btn-luxury-primary" onClick={() => onBook('Free Consultation')}>
                Book a Free Consultation <span>↗</span>
              </button>
              <button className="btn-luxury-outline" onClick={() => navigate('/services')}>
                See Our Treatments <span>↓</span>
              </button>
            </div>

            {/* Social Proof Strip */}
            <div className="hero-social-proof">
              <div className="avatar-stack">
                <img src={ASSETS.testimonialBrowsNaturalImg} alt="Client 1" />
                <img src={ASSETS.testimonialLipsResultImg} alt="Client 2" />
                <img src={ASSETS.testimonialBrowsResultImg} alt="Client 3" />
                <div className="avatar-count">5k+</div>
              </div>
              <div className="proof-text">
                <div className="proof-stars">★★★★★</div>
                <b>5,000+ clients treated · 7+ years' experience</b>
                <span>350+ 5-star reviews · 500+ artists trained</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-card">
            <div className="hero-image-frame">
              <img src={ASSETS.heroImg} alt="Browlicious PMU Clinic Artist at Work" />
            </div>

            <div className="hero-floating-glass-card">
              <div className="glass-icon-circle">✦</div>
              <div className="glass-content">
                <h4>Clinical Hygiene Always</h4>
                <p>Single-use needles, sterile set-up and clean treatment room, every time.</p>
              </div>
            </div>

            <div className="hero-badge-top">
              <span className="badge-num">No.1</span>
              <span className="badge-label">PMU Clinic</span>
              <span className="badge-label">Chennai</span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Philosophy Section */}
      <section style={{ padding: '80px 0', background: '#fff', borderBottom: '1px solid var(--border-line)' }}>
        <div className="luxury-shell" style={{ maxWidth: '960px', textAlign: 'center' }}>
          <span className="luxury-eyebrow">Natural-First Beauty</span>
          <h2 className="luxury-title">
            Imagine skipping the brow pencil, <em>the lip liner and morning touch-ups.</em>
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--text-body)', lineHeight: '1.8', margin: '20px auto 30px' }}>
            At Browlicious, permanent makeup (PMU) is never a template. Every design is mapped to your bone structure, skin tone and lifestyle, and built in layers so it heals soft and natural.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button className="btn-luxury-gold" onClick={() => onBook('Consultation')}>
              Book Your Free Consultation <span>↗</span>
            </button>
            <button className="btn-luxury-outline" onClick={() => navigate('/about')}>
              Meet Founder Durga & Our Story <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Why Browlicious - 6 Core Pillars */}
      <section style={{ padding: '90px 0', background: 'var(--sand-bg)', borderBottom: '1px solid var(--border-pink)' }}>
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">Why Choose Us</span>
            <h2 className="luxury-title">
              Why <em>Browlicious</em>
            </h2>
            <p className="luxury-description">
              Six uncompromising reasons why women across Chennai trust Browlicious for their permanent makeup and training.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: '📐',
                title: 'Natural-first design',
                text: 'We enhance your features, we never draw over them. No harsh lines or cookie-cutter templates.'
              },
              {
                icon: '🎨',
                title: 'Custom-blended pigments',
                text: 'Colours are matched to your undertone, not picked from a chart. EU-certified medical formulas.'
              },
              {
                icon: '🛡️',
                title: 'Clinical hygiene',
                text: 'Single-use needles, sterile set-up and a clean treatment room, every single time.'
              },
              {
                icon: '✨',
                title: 'Specialist range',
                text: 'From beauty PMU to scar, vitiligo and areola reconstruction work, all under one roof.'
              },
              {
                icon: '💬',
                title: 'Honest advice',
                text: 'If a treatment is not right for you, or not right yet, we will say so honestly.'
              },
              {
                icon: '🎓',
                title: 'Training you can trust',
                text: 'Our academy teaches the same rigorous, safe methods we use on clients every day.'
              }
            ].map((pillar, i) => (
              <div key={i} className="protocol-box" style={{ padding: '26px' }}>
                <div style={{ fontSize: '26px', marginBottom: '10px' }}>{pillar.icon}</div>
                <h4 style={{ fontSize: '18px', color: 'var(--deep-plum)', marginBottom: '8px' }}>{pillar.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Before & After Slider */}
      <section className="luxury-ba-section">
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">Real Transformations</span>
            <h2 className="luxury-title">
              Slide to Compare: <em>Real Healed Results</em>
            </h2>
            <p className="luxury-description">
              Drag the divider handle to reveal the natural healed results compared with the untreated state.
            </p>
          </div>

          <div className="ba-filter-pills">
            {['Brows', 'Lips', 'Eyeliner'].map((cat) => (
              <button
                key={cat}
                className={`ba-pill ${activeBaTab === cat ? 'active' : ''}`}
                onClick={() => setActiveBaTab(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div
            className="ba-slider-container"
            onMouseMove={(e) => {
              if (e.buttons === 1) {
                const rect = e.currentTarget.getBoundingClientRect()
                const percent = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100))
                setBaPosition(percent)
              }
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) {
                const rect = e.currentTarget.getBoundingClientRect()
                const percent = Math.max(5, Math.min(95, ((e.touches[0].clientX - rect.left) / rect.width) * 100))
                setBaPosition(percent)
              }
            }}
          >
            <div className="ba-image-layer ba-after-layer">
              <img src={baSlide.after} alt={`${baSlide.label} After`} />
              <div className="ba-tag ba-tag-after">Healed After ✨</div>
            </div>
            <div className="ba-image-layer ba-before-layer" style={{ width: `${baPosition}%` }}>
              <img src={baSlide.before} alt={`${baSlide.label} Before`} />
              <div className="ba-tag ba-tag-before">Before Treatment</div>
            </div>
            <div className="ba-handle" style={{ left: `${baPosition}%` }}>
              <div className="ba-handle-button">⇄</div>
            </div>
          </div>
          <div className="ba-caption-card">
            <b>{baSlide.label}</b> — Real Browlicious client result in Chennai
          </div>
        </div>
      </section>

      {/* Featured Treatments Portal */}
      <section style={{ padding: '95px 0', background: '#fff' }}>
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">Explore Treatments</span>
            <h2 className="luxury-title">
              Our Signature <em>PMU Services</em>
            </h2>
            <p className="luxury-description">
              Click any treatment to read its dedicated page with procedure details, pain level, healing timeline and booking button.
            </p>
          </div>

          <div className="services-grid-3col">
            {Object.values(INDIVIDUAL_SERVICES).slice(0, 6).map((service) => (
              <article key={service.slug} className="service-card-luxury">
                <div className="service-card-img-wrap">
                  <img src={service.image} alt={service.name} loading="lazy" />
                  <span className="service-price-tag">{service.price}</span>
                </div>
                <div className="service-card-body">
                  <span className="service-category-tag">{service.category}</span>
                  <h3 className="service-card-title">{service.name}</h3>
                  <p className="service-card-desc">{service.headline}</p>

                  <div className="service-spec-mini">
                    <div className="spec-item">
                      <span>Duration</span>
                      <b>{service.duration}</b>
                    </div>
                    <div className="spec-item">
                      <span>Pain Level</span>
                      <b>{service.painLevel}</b>
                    </div>
                    <div className="spec-item">
                      <span>Healing</span>
                      <b>{service.healingAndLongevity.split(',')[0]}</b>
                    </div>
                  </div>

                  <div className="service-card-actions">
                    <button className="btn-card-book" onClick={() => onBook(service.name)}>
                      Book This Service <span>↗</span>
                    </button>
                    <button className="btn-card-details" onClick={() => navigate(`/services/${service.slug}`)}>
                      Read Full Page →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button className="btn-luxury-outline" onClick={() => navigate('/services')}>
              View All 14 Individual Service Pages <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Closing Banner */}
      <section style={{ padding: '80px 0', background: 'var(--deep-plum)', color: '#fff', textAlign: 'center' }}>
        <div className="luxury-shell" style={{ maxWidth: '780px' }}>
          <span className="luxury-eyebrow" style={{ color: 'var(--gold-metallic)' }}>Your Next Step</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 48px)', color: '#fff', margin: '14px 0 20px' }}>
            Your best features, every single day.
          </h2>
          <p style={{ color: '#f7dbe4', fontSize: '16px', lineHeight: '1.7', marginBottom: '30px' }}>
            Book your free consultation in Anna Nagar East, Chennai. We take the time you need, answer all your questions, and design for the long term.
          </p>
          <button className="btn-luxury-gold" onClick={() => onBook('Free Consultation')} style={{ padding: '16px 36px', fontSize: '14px' }}>
            Book a Free Consultation <span>↗</span>
          </button>
        </div>
      </section>
    </>
  )
}

/* ==========================================================================
   PAGE 2: ABOUT US PAGE
   ========================================================================== */
function AboutPage({ navigate, onBook }) {
  return (
    <div>
      <section className="luxury-page-header">
        <div className="luxury-shell">
          <nav className="breadcrumb-nav">
            <a onClick={() => navigate('/')}>Home</a>
            <span className="breadcrumb-separator">/</span>
            <span>About Us</span>
          </nav>
          <span className="luxury-eyebrow">Our Story & Standards</span>
          <h1 className="page-headline-lg">
            Precision, patience and a <em>very soft touch.</em>
          </h1>
          <p className="page-lead-copy">
            A permanent makeup clinic and academy in Chennai created for people who want thoughtful, natural-looking results designed around their features.
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="luxury-shell">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div>
              <div className="founder-photo-frame" style={{ height: '480px' }}>
                <img src={ASSETS.founderImg} alt="Durga - Founder of Browlicious Chennai" />
              </div>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <b style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-plum)' }}>Durga</b>
                <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>Founder & Master PMU Artist</span>
              </div>
            </div>

            <div>
              <span className="luxury-eyebrow">Meet The Founder</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', color: 'var(--deep-plum)', marginBottom: '20px' }}>
                Why Browlicious Began
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: '1.8', marginBottom: '18px' }}>
                Browlicious began when Durga saw how much a small change — a defined brow, a balanced lip tone, or a restored areola — could change how someone feels in the mirror.
              </p>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: '1.8', marginBottom: '18px' }}>
                After 7+ years in cosmetic and paramedical pigmentation, we built a clinic in Anna Nagar East, Chennai where treatment is calm, unhurried and honest, and an academy that raises the standard for the entire Indian PMU industry.
              </p>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: '1.8', marginBottom: '24px' }}>
                We do not follow trends for the sake of it. We design for the long term, because PMU stays on your face. Every result is planned, mapped and approved by you before the first mark is made.
              </p>

              <button className="btn-luxury-primary" onClick={() => onBook('Consultation with Durga')}>
                Book Consultation with Durga <span>↗</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Credentials */}
      <section style={{ padding: '80px 0', background: 'var(--sand-bg)', borderTop: '1px solid var(--border-pink)' }}>
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">Our Clinical Principles</span>
            <h2 className="luxury-title">
              Our Core <em>Values & Credentials</em>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '50px' }}>
            <div className="protocol-box">
              <h4 style={{ color: 'var(--gold)', fontSize: '18px', marginBottom: '8px' }}>01. Safety First</h4>
              <p>Strict clinical protocol: single-use needles, sterile field, and pre-procedure patch testing.</p>
            </div>
            <div className="protocol-box">
              <h4 style={{ color: 'var(--gold)', fontSize: '18px', marginBottom: '8px' }}>02. Natural Results</h4>
              <p>We work with your natural facial anatomy. Your friends will notice you look rested, not "done".</p>
            </div>
            <div className="protocol-box">
              <h4 style={{ color: 'var(--gold)', fontSize: '18px', marginBottom: '8px' }}>03. Honest Advice</h4>
              <p>If a treatment is not right for you, or not right yet, we will tell you straight away.</p>
            </div>
            <div className="protocol-box">
              <h4 style={{ color: 'var(--gold)', fontSize: '18px', marginBottom: '8px' }}>04. Continuous Learning</h4>
              <p>We constantly update our techniques, pigments, and equipment to international standards.</p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '36px', borderRadius: '16px', border: '1px solid var(--border-pink)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-plum)', marginBottom: '16px' }}>
              Verified Clinic Credentials
            </h3>
            <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', fontSize: '14px', color: 'var(--text-body)' }}>
              <li>✓ Certified Master PMU Artist (Accredited in Dubai & Korea)</li>
              <li>✓ Registered with Chennai local health and municipal authorities</li>
              <li>✓ Fully insured clinic and practitioners</li>
              <li>✓ Certified in Blood-Borne Pathogens & First Aid</li>
              <li>✓ 100% REACH-Compliant, heavy-metal-free European mineral pigments</li>
              <li>✓ Hospital-grade single-use sterile micro-cartridges</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ==========================================================================
   PAGE 3: SERVICES DIRECTORY PAGE
   ========================================================================== */
function ServicesDirectoryPage({ navigate, onBook }) {
  const [selectedGroup, setSelectedGroup] = useState('All')
  const groups = ['All', 'Brows', 'Lips & Eyes', 'Scalp Micropigmentation', 'Paramedical Tattooing']

  const allServices = Object.values(INDIVIDUAL_SERVICES)
  const filtered = selectedGroup === 'All' ? allServices : allServices.filter((s) => s.category === selectedGroup)

  return (
    <div>
      <section className="luxury-page-header">
        <div className="luxury-shell">
          <nav className="breadcrumb-nav">
            <a onClick={() => navigate('/')}>Home</a>
            <span className="breadcrumb-separator">/</span>
            <span>Services</span>
          </nav>
          <span className="luxury-eyebrow">Full Treatment Collection</span>
          <h1 className="page-headline-lg">
            Every service, <em>clearly explained.</em>
          </h1>
          <p className="page-lead-copy">
            Choose a treatment area to explore every Browlicious service. A consultation comes first for all treatments.
          </p>
        </div>
      </section>

      <section style={{ padding: '70px 0 90px', background: '#fff' }}>
        <div className="luxury-shell">
          {/* Category Filter Pills */}
          <div className="ba-filter-pills" style={{ marginBottom: '40px' }}>
            {groups.map((grp) => (
              <button
                key={grp}
                className={`ba-pill ${selectedGroup === grp ? 'active' : ''}`}
                onClick={() => setSelectedGroup(grp)}
              >
                {grp}
              </button>
            ))}
          </div>

          <div className="services-grid-3col">
            {filtered.map((service) => (
              <article key={service.slug} className="service-card-luxury">
                <div className="service-card-img-wrap">
                  <img src={service.image} alt={service.name} loading="lazy" />
                  <span className="service-price-tag">{service.price}</span>
                </div>
                <div className="service-card-body">
                  <span className="service-category-tag">{service.category}</span>
                  <h3 className="service-card-title">{service.name}</h3>
                  <p className="service-card-desc">{service.headline}</p>

                  <div className="service-spec-mini">
                    <div className="spec-item">
                      <span>Duration</span>
                      <b>{service.duration}</b>
                    </div>
                    <div className="spec-item">
                      <span>Pain Level</span>
                      <b>{service.painLevel}</b>
                    </div>
                    <div className="spec-item">
                      <span>Healing</span>
                      <b>{service.healingAndLongevity.split(',')[0]}</b>
                    </div>
                  </div>

                  <div className="service-card-actions">
                    <button className="btn-card-book" onClick={() => onBook(service.name)}>
                      Book This Service <span>↗</span>
                    </button>
                    <button className="btn-card-details" onClick={() => navigate(`/services/${service.slug}`)}>
                      Full Page →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Brow Technique Comparison Table */}
          <div style={{ marginTop: '80px' }}>
            <span className="luxury-eyebrow">Comparison Guide</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'var(--deep-plum)', marginBottom: '14px' }}>
              Which brow technique should I choose?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              Choosing a brow technique can feel complicated. Here is a clear comparison by look, skin type and typical longevity.
            </p>

            <div className="luxury-table-wrap">
              <table className="luxury-table">
                <thead>
                  <tr>
                    <th>Technique</th>
                    <th>Look</th>
                    <th>Best skin type</th>
                    <th>Typical longevity</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {BROW_COMPARISON_TABLE.map((row) => (
                    <tr key={row.technique}>
                      <td><b>{row.technique}</b></td>
                      <td>{row.look}</td>
                      <td>{row.bestSkin}</td>
                      <td>{row.longevity}</td>
                      <td>
                        <button
                          onClick={() => navigate(`/services/${row.slug}`)}
                          style={{ background: 'none', border: 'none', color: 'var(--dusty-pink)', fontWeight: '700', cursor: 'pointer' }}
                        >
                          View Page →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ==========================================================================
   PAGE 4: INDIVIDUAL SERVICE PAGE (Dedicated Dynamic Route)
   ========================================================================== */
function IndividualServicePage({ service, navigate, onBook }) {
  return (
    <div className="service-page-container">
      <section className="luxury-page-header">
        <div className="luxury-shell">
          <nav className="breadcrumb-nav">
            <a onClick={() => navigate('/')}>Home</a>
            <span className="breadcrumb-separator">/</span>
            <a onClick={() => navigate('/services')}>Services</a>
            <span className="breadcrumb-separator">/</span>
            <span>{service.name}</span>
          </nav>
          <span className="luxury-eyebrow">{service.category} · Browlicious Chennai</span>
          <h1 className="page-headline-lg">
            {service.headline}
          </h1>
          <p className="page-lead-copy">
            {service.intro}
          </p>
        </div>
      </section>

      <div className="luxury-shell" style={{ marginTop: '50px' }}>
        <div className="service-page-grid">
          {/* Main Content Column */}
          <div className="service-main-content">
            <h2>Who It's For</h2>
            <div className="service-highlight-box">
              <b>Ideal for:</b> {service.idealFor}
            </div>

            <h2>What to Expect / The Process</h2>
            <p>{service.whatToExpect}</p>

            <h2>Healing and Longevity</h2>
            <p>{service.healingAndLongevity}</p>

            <h2>Who Should Wait / Not Ideal If</h2>
            <div style={{ background: '#fff5f7', border: '1px solid var(--border-pink)', padding: '18px 24px', borderRadius: '8px', marginBottom: '24px' }}>
              <p style={{ margin: 0, color: 'var(--text-body)', fontSize: '14px' }}>
                <b>Caution:</b> {service.notIdealIf}
              </p>
            </div>

            {/* Brow comparison matrix if brow service */}
            {service.showBrowComparison && (
              <div style={{ margin: '40px 0' }}>
                <h3>Which brow technique should I choose?</h3>
                <div className="luxury-table-wrap">
                  <table className="luxury-table">
                    <thead>
                      <tr>
                        <th>Technique</th>
                        <th>Look</th>
                        <th>Best skin type</th>
                        <th>Typical longevity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BROW_COMPARISON_TABLE.map((row) => (
                        <tr key={row.technique}>
                          <td><b>{row.technique}</b></td>
                          <td>{row.look}</td>
                          <td>{row.bestSkin}</td>
                          <td>{row.longevity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <h2>Call to Action</h2>
            <p>
              The best technique is the one that suits your features, bone structure and lifestyle. At Browlicious, we map your shape, test your pigment shade and only start when you approve the design.
            </p>
            <button className="btn-luxury-gold" onClick={() => onBook(service.name)} style={{ padding: '16px 32px' }}>
              {service.cta} <span>↗</span>
            </button>
          </div>

          {/* Sticky Sidebar Info Card */}
          <aside className="service-sidebar-card">
            <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
              <img src={service.image} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--deep-plum)', marginBottom: '14px' }}>
              {service.name}
            </h3>

            <div className="sidebar-spec-row">
              <span>Investment:</span>
              <b>{service.price}</b>
            </div>
            <div className="sidebar-spec-row">
              <span>Duration:</span>
              <b>{service.duration}</b>
            </div>
            <div className="sidebar-spec-row">
              <span>Pain Level:</span>
              <b>{service.painLevel}</b>
            </div>
            <div className="sidebar-spec-row">
              <span>Healing:</span>
              <b>{service.healingAndLongevity.split(',')[0]}</b>
            </div>

            <button
              className="btn-luxury-primary"
              onClick={() => onBook(service.name)}
              style={{ width: '100%', marginTop: '24px' }}
            >
              {service.cta} <span>↗</span>
            </button>

            <span className="seo-meta-pill">
              <b>SEO Title:</b> {service.seoTitle}
            </span>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
   PAGE 5: CLIENT JOURNEY, AFTERCARE & FAQ
   ========================================================================== */
function JourneyAftercarePage({ navigate, onBook }) {
  const [activeFaq, setActiveFaq] = useState(0)

  return (
    <div>
      <section className="luxury-page-header">
        <div className="luxury-shell">
          <nav className="breadcrumb-nav">
            <a onClick={() => navigate('/')}>Home</a>
            <span className="breadcrumb-separator">/</span>
            <span>Client Journey, Aftercare & FAQ</span>
          </nav>
          <span className="luxury-eyebrow">Your Safety & Experience</span>
          <h1 className="page-headline-lg">
            Your PMU Journey, <em>Aftercare & FAQ</em>
          </h1>
          <p className="page-lead-copy">
            A calm, considered process gives you space to ask questions and approve every detail before treatment begins.
          </p>
        </div>
      </section>

      {/* 7-Step Journey */}
      <section style={{ padding: '80px 0', background: '#fff', borderBottom: '1px solid var(--border-line)' }}>
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">The 7 Stages</span>
            <h2 className="luxury-title">Your PMU Journey</h2>
            <p className="luxury-description">From initial consultation to long-term colour maintenance.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {CLIENT_JOURNEY_STEPS.map((step) => (
              <div key={step.step} className="protocol-box" style={{ padding: '24px' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--gold)', fontWeight: 'bold' }}>
                  {step.step}
                </span>
                <h4 style={{ fontSize: '18px', color: 'var(--deep-plum)', margin: '8px 0' }}>{step.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aftercare Protocol */}
      <section style={{ padding: '80px 0', background: 'var(--sand-bg)', borderBottom: '1px solid var(--border-pink)' }}>
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">Healing Guidance</span>
            <h2 className="luxury-title">Aftercare Protocol</h2>
            <p className="luxury-description">The small steps before and after treatment that support a calm, healthy healing process.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div style={{ background: '#fff', padding: '36px', borderRadius: '16px', border: '1px solid var(--border-pink)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--deep-plum)', marginBottom: '16px' }}>
                The First 7 to 10 Days
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-body)' }}>
                <li>✓ Keep the area clean and dry. Gently dab, never rub.</li>
                <li>✓ Apply only the thin layer of medical balm we recommend.</li>
                <li>✓ Skip makeup, steam, saunas, swimming and heavy workouts.</li>
                <li>✓ Avoid direct sun and tanning. Use SPF once healed.</li>
                <li>✓ Do not pick, scratch or peel. Let flakes fall off naturally.</li>
              </ul>
            </div>

            <div style={{ background: '#fff', padding: '36px', borderRadius: '16px', border: '1px solid var(--border-pink)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--deep-plum)', marginBottom: '16px' }}>
                Long-Term Care
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: '1.7', marginBottom: '16px' }}>
                Avoid chemical peels, retinol, lasers and strong exfoliants directly on treated areas, and use SPF daily to keep colour fresh.
              </p>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--deep-plum)', marginTop: '20px', marginBottom: '8px' }}>
                Is PMU right for me?
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                We cannot treat you if you are pregnant or breastfeeding, have active infection, rash or sunburn in the area, are undergoing chemotherapy, or have uncontrolled diabetes or a history of keloid scarring. Always tell us about medications, blood thinners, allergies and recent Botox or filler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="luxury-shell" style={{ maxWidth: '820px' }}>
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">Clear Answers</span>
            <h2 className="luxury-title">Frequently Asked Questions</h2>
          </div>

          <div>
            {CLINIC_FAQS.map((faq, idx) => (
              <div key={idx} className="faq-accordion-item">
                <button
                  className="faq-question-btn"
                  onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
                >
                  <span>{faq.q}</span>
                  <span className="faq-toggle-icon">{activeFaq === idx ? '−' : '+'}</span>
                </button>
                {activeFaq === idx && (
                  <div className="faq-answer-content">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button className="btn-luxury-primary" onClick={() => onBook('General Enquiry')}>
              Bring Your Questions — Book a Free Consultation <span>↗</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ==========================================================================
   PAGE 6: THE ACADEMY PAGE
   ========================================================================== */
function AcademyPage({ navigate, onBook }) {
  return (
    <div>
      <section className="luxury-page-header">
        <div className="luxury-shell">
          <nav className="breadcrumb-nav">
            <a onClick={() => navigate('/')}>Home</a>
            <span className="breadcrumb-separator">/</span>
            <span>The Academy</span>
          </nav>
          <span className="luxury-eyebrow">Browlicious PMU Academy · Chennai</span>
          <h1 className="page-headline-lg">
            Learn permanent makeup from artists <em>who practise it every day.</em>
          </h1>
          <p className="page-lead-copy">
            Professional PMU training in Chennai with small classes, live-model practice and ongoing mentorship.
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="luxury-shell">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
            <div>
              <span className="luxury-eyebrow">Clinical Standards</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '34px', color: 'var(--deep-plum)', marginBottom: '18px' }}>
                Practice. Feedback. Confidence.
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: '1.8', marginBottom: '18px' }}>
                Anyone can watch a video. Becoming a safe, confident PMU artist takes supervised practice, honest feedback and someone to call when a client does not heal as expected.
              </p>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: '1.8', marginBottom: '24px' }}>
                At Browlicious Academy, you train in a real clinic in Anna Nagar, with real clients, alongside the artists who teach you.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href={`${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent('Hello Browlicious Academy! I would like to download the course prospectus and check fee structure.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-luxury-gold"
                >
                  Download the Prospectus <span>↗</span>
                </a>
                <button className="btn-luxury-outline" onClick={() => onBook('Academy Discovery Call')}>
                  Book a Discovery Call
                </button>
              </div>
            </div>

            <div style={{ height: '420px', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
              <img src={ASSETS.academyImg} alt="Browlicious PMU Academy Team" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Why Train With Us */}
      <section style={{ padding: '80px 0', background: 'var(--sand-bg)', borderTop: '1px solid var(--border-pink)' }}>
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">Training You Can Trust</span>
            <h2 className="luxury-title">Why Train With Us</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '50px' }}>
            <div className="protocol-box">
              <h4 style={{ color: 'var(--deep-plum)', fontSize: '17px', marginBottom: '6px' }}>Max 4 Students Per Class</h4>
              <p>One-to-one coaching and personal attention on every stroke.</p>
            </div>
            <div className="protocol-box">
              <h4 style={{ color: 'var(--deep-plum)', fontSize: '17px', marginBottom: '6px' }}>Supervised Live Models</h4>
              <p>Practice on real human skin and features, not just rubber practice pads.</p>
            </div>
            <div className="protocol-box">
              <h4 style={{ color: 'var(--deep-plum)', fontSize: '17px', marginBottom: '6px' }}>Comprehensive Medical Theory</h4>
              <p>Skin anatomy, colorimetry, hygiene, sterilization and contraindications.</p>
            </div>
            <div className="protocol-box">
              <h4 style={{ color: 'var(--deep-plum)', fontSize: '17px', marginBottom: '6px' }}>Professional Starter Kit Included</h4>
              <p>Wireless PMU machine, European pigments, calipers and practice supplies.</p>
            </div>
            <div className="protocol-box">
              <h4 style={{ color: 'var(--deep-plum)', fontSize: '17px', marginBottom: '6px' }}>Accredited Certification</h4>
              <p>Recognized diploma allowing you to start your practice safely.</p>
            </div>
            <div className="protocol-box">
              <h4 style={{ color: 'var(--deep-plum)', fontSize: '17px', marginBottom: '6px' }}>12 Months Mentorship & Business</h4>
              <p>Client retention, pricing, portfolio setup and social media conversion training.</p>
            </div>
          </div>

          {/* Courses Table */}
          <span className="luxury-eyebrow">Curriculum</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', color: 'var(--deep-plum)', marginBottom: '16px' }}>
            Available Academy Courses
          </h2>
          <div className="luxury-table-wrap">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Covers</th>
                  <th>Duration</th>
                  <th>Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ACADEMY_COURSES.map((course) => (
                  <tr key={course.name}>
                    <td><b>{course.name}</b></td>
                    <td>{course.covers}</td>
                    <td>{course.duration}</td>
                    <td><span className="tag" style={{ background: 'var(--dusty-pink-light)', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold' }}>{course.level}</span></td>
                    <td>
                      <button
                        onClick={() => onBook(`Academy: ${course.name}`)}
                        className="btn-card-book"
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                      >
                        Apply Now ↗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Is this for me & Academy FAQ */}
          <div style={{ background: '#fff', padding: '36px', borderRadius: '16px', border: '1px solid var(--border-pink)', marginTop: '40px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--deep-plum)', marginBottom: '10px' }}>
              Is this for me?
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: '1.7', marginBottom: '24px' }}>
              Perfect for beauty therapists, makeup artists, nurses, aestheticians and career changers. No prior experience is needed for our foundation courses.
            </p>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--deep-plum)', marginBottom: '16px' }}>
              Academy FAQ
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div>
                <b>Do I need experience?</b>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>No. Foundation courses start right from the basics of hygiene, anatomy, and mapping.</p>
              </div>
              <div>
                <b>Can I start working straight away?</b>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Our training prepares you to practise safely. Always check your local licensing and insurance requirements first.</p>
              </div>
              <div>
                <b>Do you offer payment plans?</b>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Yes! We offer 0% no-cost EMI payment plans via credit cards and partner financial institutions.</p>
              </div>
              <div>
                <b>Do you supply models?</b>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Yes, supervised live models are provided as part of every practical course.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ==========================================================================
   PAGE 7: BLOG & JOURNAL (With 12-Week Plan & Sample Articles)
   ========================================================================== */
function BlogPage({ navigate, onBook }) {
  const [activeArticle, setActiveArticle] = useState(1)

  return (
    <div>
      <section className="luxury-page-header">
        <div className="luxury-shell">
          <nav className="breadcrumb-nav">
            <a onClick={() => navigate('/')}>Home</a>
            <span className="breadcrumb-separator">/</span>
            <span>Blog & Journal</span>
          </nav>
          <span className="luxury-eyebrow">PMU Knowledge Hub</span>
          <h1 className="page-headline-lg">
            The Browlicious <em>Journal & Editorial Hub</em>
          </h1>
          <p className="page-lead-copy">
            Treatment education, aftercare guides, and notes for the next generation of PMU artists in Chennai.
          </p>
        </div>
      </section>

      {/* Article Selector Tabs */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <div className="luxury-shell">
          <div className="ba-filter-pills" style={{ marginBottom: '30px' }}>
            <button
              className={`ba-pill ${activeArticle === 1 ? 'active' : ''}`}
              onClick={() => setActiveArticle(1)}
            >
              Article 1: Microblading vs Ombre vs Combination Brows
            </button>
            <button
              className={`ba-pill ${activeArticle === 2 ? 'active' : ''}`}
              onClick={() => setActiveArticle(2)}
            >
              Article 2: How to Become a PMU Artist in Chennai
            </button>
            <button
              className={`ba-pill ${activeArticle === 3 ? 'active' : ''}`}
              onClick={() => setActiveArticle(3)}
            >
              12-Week Content Plan & SEO Checklist
            </button>
          </div>

          {/* Article 1 Content */}
          {activeArticle === 1 && (
            <article className="article-reading-container">
              <div className="article-meta-bar">
                <span className="tag">Client Guide</span>
                <span>By Durga · Browlicious Chennai</span>
                <span>Target Keyword: microblading vs ombre brows</span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', color: 'var(--deep-plum)', marginBottom: '16px' }}>
                Microblading vs Ombre vs Combination Brows
              </h1>

              <div className="service-highlight-box">
                <b>Meta Description:</b> Not sure which PMU brow technique to choose? Compare microblading, ombre and combination brows by skin type, look and longevity.
              </div>

              <p>
                Choosing a brow technique can feel like choosing between three languages you do not speak. Here is the plain-English version.
              </p>

              <h2>1. Microblading</h2>
              <p>
                Microblading creates fine, hair-like strokes with a handheld tool. It looks the most natural up close and suits normal to dry skin. The trade-off is that strokes can blur faster on oily skin, so longevity is typically 12 to 18 months.
              </p>

              <h2>2. Ombre Brows</h2>
              <p>
                Ombre brows use tiny dots of pigment for a soft, powdered effect, like brow makeup. They handle oily skin well, last longer (typically 18 to 36 months), and suit anyone who likes a defined, filled-in brow.
              </p>

              <h2>3. Combination Brows</h2>
              <p>
                Combination brows blend both: strokes at the front for realism, shading through the body and tail for depth. They work for most skin types and give a fuller result.
              </p>

              <h2>How to Choose</h2>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: 'var(--text-body)', marginBottom: '24px' }}>
                <li><b>Want a barely-there, natural look?</b> Microblading or combination</li>
                <li><b>Have oily or enlarged-pore skin?</b> Ombre or combination</li>
                <li><b>Love bolder brows?</b> Ombre</li>
                <li><b>Not sure?</b> Book a free consultation and we will assess your skin</li>
              </ul>

              <div className="luxury-table-wrap">
                <table className="luxury-table">
                  <thead>
                    <tr>
                      <th>Technique</th>
                      <th>Look</th>
                      <th>Best skin type</th>
                      <th>Typical longevity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BROW_COMPARISON_TABLE.map((row) => (
                      <tr key={row.technique}>
                        <td><b>{row.technique}</b></td>
                        <td>{row.look}</td>
                        <td>{row.bestSkin}</td>
                        <td>{row.longevity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>
                The best technique is the one that suits your skin, not the one that is trending. At Browlicious we map your brows, test your shade and only start when you approve the design.
              </p>

              <button className="btn-luxury-gold" onClick={() => onBook('Brow Consultation')} style={{ marginTop: '20px' }}>
                Book a Free Brow Consultation <span>↗</span>
              </button>
            </article>
          )}

          {/* Article 2 Content */}
          {activeArticle === 2 && (
            <article className="article-reading-container">
              <div className="article-meta-bar">
                <span className="tag">Academy Guide</span>
                <span>By Durga · Master PMU Instructor</span>
                <span>Target Keyword: become a PMU artist</span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', color: 'var(--deep-plum)', marginBottom: '16px' }}>
                How to Become a PMU Artist in Chennai
              </h1>

              <div className="service-highlight-box">
                <b>Meta Description:</b> A step-by-step guide to starting a career in permanent makeup: training, kit, insurance, portfolio and getting your first clients.
              </div>

              <p>
                Permanent makeup is one of the fastest-growing areas of the beauty industry, but it is also one of the most technical. Here is how to start the right way.
              </p>

              <h2>1. Check your local rules</h2>
              <p>
                Licensing and registration vary by region. Confirm what your council or health authority requires before you train.
              </p>

              <h2>2. Choose the right training</h2>
              <p>
                Look for small classes, live-model practice, theory in skin anatomy and hygiene, and an accredited certificate. Be cautious of very short courses with no supervised practice.
              </p>

              <h2>3. Learn one specialism first</h2>
              <p>
                Many artists start with brows, then add lips, eyeliner and SMP once confident.
              </p>

              <h2>4. Get insured and set up safely</h2>
              <p>
                You will need public liability insurance, sterile single-use supplies and a clean treatment area.
              </p>

              <h2>5. Build a portfolio</h2>
              <p>
                Photograph models with consent, showing before, after and healed results.
              </p>

              <h2>6. Keep learning</h2>
              <p>
                Join mentorship, practise colour theory and refresh your technique every year.
              </p>

              <div style={{ background: 'var(--sand-bg)', padding: '24px', borderRadius: '12px', margin: '24px 0' }}>
                <b style={{ color: 'var(--deep-plum)' }}>What good training includes:</b>
                <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--text-body)' }}>
                  Supervised live models, a clear assessment, post-course mentorship and business training.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <button className="btn-luxury-primary" onClick={() => navigate('/academy')}>
                  Explore Our Academy Courses <span>→</span>
                </button>
                <button className="btn-luxury-gold" onClick={() => onBook('Academy Discovery Call')}>
                  Book a Discovery Call <span>↗</span>
                </button>
              </div>
            </article>
          )}

          {/* Tab 3: 12-Week Editorial Content Plan & SEO Checklist */}
          {activeArticle === 3 && (
            <div className="luxury-shell" style={{ maxWidth: '960px' }}>
              <span className="luxury-eyebrow">Strategic Content Hub</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'var(--deep-plum)', marginBottom: '14px' }}>
                12-Week Content Plan for Browlicious
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                Publish one post a week. Alternate client posts (to book treatments) and academy posts (to fill courses).
              </p>

              <div className="luxury-table-wrap">
                <table className="luxury-table">
                  <thead>
                    <tr>
                      <th>Week</th>
                      <th>Title</th>
                      <th>Audience</th>
                      <th>Target Keyword</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BLOG_EDITORIAL_PLAN.map((plan) => (
                      <tr key={plan.week}>
                        <td><b>Week {plan.week}</b></td>
                        <td>{plan.title}</td>
                        <td>
                          <span style={{
                            background: plan.audience === 'Client' ? 'var(--dusty-pink-light)' : 'var(--gold-light)',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: 'var(--deep-plum)'
                          }}>
                            {plan.audience}
                          </span>
                        </td>
                        <td><code>{plan.keyword}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* SEO Checklist */}
              <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-pink)', marginTop: '40px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-plum)', marginBottom: '16px' }}>
                  Blog SEO Checklist
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--text-body)' }}>
                  <li>✓ Put the main keyword in the title, first paragraph and one subheading</li>
                  <li>✓ Use H2 and H3 headings, short paragraphs and a clear call to action</li>
                  <li>✓ Link each post to the matching service page and the academy page</li>
                  <li>✓ Add alt text to every image and use real healed photos with consent</li>
                  <li>✓ Keep medical claims cautious and avoid guarantees</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

/* ==========================================================================
   PAGE 8: CONTACT PAGE
   ========================================================================== */
function ContactPage({ navigate, onBook }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    treatment: 'Microblading',
    preferredDate: 'Tomorrow',
    message: '',
    consent: false
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.consent) {
      alert('Please fill out all required fields and accept the consent.')
      return
    }

    const text = [
      '✨ *NEW CONTACT ENQUIRY - BROWLICIOUS CHENNAI*',
      '---------------------------------------',
      `👤 *Name:* ${formData.name}`,
      `📞 *Phone:* ${formData.phone}`,
      `📧 *Email:* ${formData.email || 'None'}`,
      `💄 *Treatment / Course:* ${formData.treatment}`,
      `📅 *Preferred Date:* ${formData.preferredDate}`,
      `📝 *Message:* ${formData.message || 'None'}`,
      '---------------------------------------',
      'I consent to health screening and consultation contact.'
    ].join('\n')

    window.open(`${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent(text)}`, '_blank')
    setSubmitted(true)
  }

  return (
    <div>
      <section className="luxury-page-header">
        <div className="luxury-shell">
          <nav className="breadcrumb-nav">
            <a onClick={() => navigate('/')}>Home</a>
            <span className="breadcrumb-separator">/</span>
            <span>Contact</span>
          </nav>
          <span className="luxury-eyebrow">Start A Conversation</span>
          <h1 className="page-headline-lg">
            Let's design the look <em>you will love.</em>
          </h1>
          <p className="page-lead-copy">
            Book your free consultation, ask about the academy or request a callback. We reply within 2 hours.
          </p>
        </div>
      </section>

      <section style={{ padding: '70px 0 90px', background: '#fff' }}>
        <div className="luxury-shell">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px' }}>
            {/* Contact Details Column */}
            <div>
              <span className="luxury-eyebrow">Direct Touchpoints</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'var(--deep-plum)', marginBottom: '20px' }}>
                Visit or Reach Out
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                <div className="protocol-box">
                  <b>📍 Address:</b>
                  <p style={{ marginTop: '4px' }}>{CLINIC_INFO.address}</p>
                  <a href={CLINIC_INFO.mapUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--dusty-pink)', fontWeight: 'bold', fontSize: '12px', display: 'inline-block', marginTop: '6px' }}>
                    Open in Google Maps ↗
                  </a>
                </div>

                <div className="protocol-box">
                  <b>📞 Phone / WhatsApp:</b>
                  <p style={{ marginTop: '4px' }}>
                    <a href={`tel:${CLINIC_INFO.phoneCall}`} style={{ color: 'var(--deep-plum)', fontWeight: 'bold' }}>{CLINIC_INFO.phone}</a>
                  </p>
                  <a href={`${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent('Hello Browlicious!')}`} target="_blank" rel="noreferrer" style={{ color: '#25d366', fontWeight: 'bold', fontSize: '12px', display: 'inline-block', marginTop: '6px' }}>
                    Chat on WhatsApp ↗
                  </a>
                </div>

                <div className="protocol-box">
                  <b>📧 Email:</b>
                  <p style={{ marginTop: '4px' }}>{CLINIC_INFO.email}</p>
                </div>

                <div className="protocol-box">
                  <b>🕒 Opening Hours:</b>
                  <p style={{ marginTop: '4px' }}>{CLINIC_INFO.hours}</p>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form Column */}
            <div style={{ background: 'var(--sand-bg)', padding: '36px', borderRadius: '16px', border: '1px solid var(--border-pink)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--deep-plum)', marginBottom: '8px' }}>
                Send A Message
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Tell us about your goals. We will review suitability and respond promptly.
              </p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <div style={{ fontSize: '40px', color: '#25d366', marginBottom: '8px' }}>✓</div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--deep-plum)' }}>Thank You!</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Your enquiry was transmitted. We will connect with you within 2 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label>Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyadarshini"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="booking-form-row">
                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 97103 XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        placeholder="name@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label>Treatment of Interest</label>
                    <select
                      value={formData.treatment}
                      onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1.5px solid var(--border-line)', borderRadius: '8px' }}
                    >
                      {Object.values(INDIVIDUAL_SERVICES).map((s) => (
                        <option key={s.slug} value={s.name}>{s.name}</option>
                      ))}
                      <option value="Academy Courses">Academy Courses</option>
                      <option value="Other Enquiries">Other Enquiries</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label>Preferred Date</label>
                    <input
                      type="text"
                      placeholder="e.g. This Saturday morning"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '18px' }}>
                    <label>Short Message or Question</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about any skin goals, previous microblading or dates..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '20px' }}>
                    <input
                      type="checkbox"
                      id="consentCheck"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      style={{ marginTop: '4px' }}
                    />
                    <label htmlFor="consentCheck" style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      I agree to health screening and allow Browlicious to contact me regarding my enquiry in accordance with the clinic privacy policy.
                    </label>
                  </div>

                  <button type="submit" className="btn-luxury-primary" style={{ width: '100%' }}>
                    Send Enquiry via WhatsApp <span>↗</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import React, { useState, useEffect } from "react";
import "./luxury-clinic.css";
import { TRANSLATIONS } from "./translations";
import {
  CLINIC_INFO,
  ASSETS,
  INDIVIDUAL_SERVICES,
  BROW_COMPARISON_TABLE,
  ACADEMY_COURSES,
  BLOG_EDITORIAL_PLAN,
  CLIENT_JOURNEY_STEPS,
  CLINIC_FAQS,
} from "./contentData";

// Helper for client-side navigation with URL updates and scroll to top
function useNavigation() {
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname || "/",
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { currentPath, navigate };
}

export function LuxuryApp() {
  const { currentPath, navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("browlicious_lang") || "en";
    } catch (e) {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("browlicious_lang", lang);
    } catch (e) {
      /* ignore storage errors */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Booking Modal State (can be opened from any page or button)
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState("Microblading");
  const [bookingDate, setBookingDate] = useState("Tomorrow");
  const [bookingTime, setBookingTime] = useState("10:30 AM");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [bookingSent, setBookingSent] = useState(false);

  // Before/After Slider State (for Home & Service pages)
  const [baPosition, setBaPosition] = useState(50);
  const [activeBaTab, setActiveBaTab] = useState("Brows");

  // Timed Consultation Pop-up
  const [showConsultPopup, setShowConsultPopup] = useState(false);
  useEffect(() => {
    const seen = sessionStorage.getItem("browlicious_consult_popup_seen");
    if (!seen) {
      const timer = setTimeout(() => {
        setShowConsultPopup(true);
        sessionStorage.setItem("browlicious_consult_popup_seen", "true");
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Lock body scroll and set modal-open class when booking modal or popup is active
  useEffect(() => {
    if (bookingOpen || showConsultPopup) {
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    };
  }, [bookingOpen, showConsultPopup]);

  const openBookingFor = (serviceName) => {
    if (serviceName) setBookingService(serviceName);
    setBookingSent(false);
    setBookingOpen(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert(
        lang === "ta"
          ? "உங்கள் பெயர் மற்றும் தொலைபேசி எண்ணை உள்ளிடவும்."
          : "Please provide your name and phone number.",
      );
      return;
    }

    const message = [
      "✨ *NEW APPOINTMENT ENQUIRY - BROWLICIOUS CHENNAI*",
      "---------------------------------------",
      `👤 *Client Name:* ${clientName}`,
      `📞 *Mobile:* ${clientPhone}`,
      `📧 *Email:* ${clientEmail || "Not provided"}`,
      `💄 *Treatment / Course:* ${bookingService}`,
      `📅 *Preferred Date:* ${bookingDate}`,
      `⏰ *Preferred Time:* ${bookingTime}`,
      `📝 *Notes / Goals:* ${clientNotes || "None"}`,
      "---------------------------------------",
      "Please confirm my booking slot and send clinic details.",
    ].join("\n");

    window.open(
      `${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
    setBookingSent(true);
  };

  // Determine which page component to display based on currentPath
  let PageContent = null;

  if (currentPath === "/" || currentPath === "") {
    PageContent = (
      <HomePage
        navigate={navigate}
        onBook={openBookingFor}
        baPosition={baPosition}
        setBaPosition={setBaPosition}
        activeBaTab={activeBaTab}
        setActiveBaTab={setActiveBaTab}
        lang={lang}
        t={t}
      />
    );
  } else if (currentPath === "/about") {
    PageContent = (
      <AboutPage
        navigate={navigate}
        onBook={openBookingFor}
        t={t}
        lang={lang}
      />
    );
  } else if (currentPath === "/services") {
    PageContent = (
      <ServicesDirectoryPage
        navigate={navigate}
        onBook={openBookingFor}
        t={t}
        lang={lang}
      />
    );
  } else if (currentPath.startsWith("/services/")) {
    const slug = currentPath.replace("/services/", "").trim();
    const serviceData = INDIVIDUAL_SERVICES[slug];
    if (serviceData) {
      PageContent = (
        <IndividualServicePage
          service={serviceData}
          navigate={navigate}
          onBook={openBookingFor}
          t={t}
          lang={lang}
        />
      );
    } else {
      PageContent = (
        <ServicesDirectoryPage
          navigate={navigate}
          onBook={openBookingFor}
          t={t}
          lang={lang}
        />
      );
    }
  } else if (currentPath === "/aftercare" || currentPath === "/journey") {
    PageContent = (
      <JourneyAftercarePage
        navigate={navigate}
        onBook={openBookingFor}
        t={t}
        lang={lang}
      />
    );
  } else if (currentPath === "/academy") {
    PageContent = (
      <AcademyPage
        navigate={navigate}
        onBook={openBookingFor}
        t={t}
        lang={lang}
      />
    );
  } else if (currentPath === "/blog" || currentPath.startsWith("/blog")) {
    PageContent = (
      <BlogPage navigate={navigate} onBook={openBookingFor} t={t} lang={lang} />
    );
  } else if (currentPath === "/contact") {
    PageContent = (
      <ContactPage
        navigate={navigate}
        onBook={openBookingFor}
        t={t}
        lang={lang}
      />
    );
  } else {
    PageContent = (
      <HomePage
        navigate={navigate}
        onBook={openBookingFor}
        baPosition={baPosition}
        setBaPosition={setBaPosition}
        activeBaTab={activeBaTab}
        setActiveBaTab={setActiveBaTab}
        lang={lang}
        t={t}
      />
    );
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
              <span className="sparkle">✦</span> {t.topbar.location}
            </span>
            <span className="topbar-announcement">{t.topbar.announcement}</span>
          </div>

          <div className="topbar-actions">
            <a
              href={`tel:${CLINIC_INFO.phoneCall}`}
              className="topbar-btn topbar-btn-call"
            >
              📞 {t.topbar.callNow}
            </a>
            <a
              href={`${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent("Hello Browlicious! I would like to make an enquiry.")}`}
              target="_blank"
              rel="noreferrer"
              className="topbar-btn topbar-btn-wa"
            >
              💬 {t.topbar.whatsApp}
            </a>
            <button
              onClick={() => openBookingFor("Consultation")}
              className="topbar-btn topbar-btn-book"
            >
              ✨ {t.topbar.bookAppt}
            </button>

            {/* Seamless Segmented Language Switcher */}
            <div
              className="topbar-lang-pill"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                className={`topbar-lang-btn ${lang === "en" ? "active" : ""}`}
                onClick={() => setLang("en")}
                aria-pressed={lang === "en"}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                className={`topbar-lang-btn ${lang === "ta" ? "active" : ""}`}
                onClick={() => setLang("ta")}
                aria-pressed={lang === "ta"}
                title="தமிழுக்கு மாறுக"
              >
                தமிழ்
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ====================================================================
          STICKY MAIN NAVIGATION HEADER
          ==================================================================== */}
      <header className="luxury-navbar">
        <div className="luxury-shell navbar-container">
          <button
            className="brand-wrapper"
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div className="brand-crest">
              <img
                src={ASSETS.pmuClinicLogo}
                alt="Browlicious PMU Clinic Logo"
              />
            </div>
            <div className="brand-text">
              <b>Browlicious</b>
              <span>{t.footer.brandSub}</span>
            </div>
          </button>

          <nav className={`nav-menu ${mobileMenuOpen ? "mobile-open" : ""}`}>
            {mobileMenuOpen && (
              <div className="drawer-lang-card">
                <span className="drawer-lang-label">
                  {lang === "ta" ? "மொழியைத் தேர்வு செய்க" : "Select Language"}
                </span>
                <div className="drawer-lang-toggle">
                  <button
                    type="button"
                    className={`drawer-lang-segment ${lang === "en" ? "active" : ""}`}
                    onClick={() => setLang("en")}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    type="button"
                    className={`drawer-lang-segment ${lang === "ta" ? "active" : ""}`}
                    onClick={() => setLang("ta")}
                  >
                    🇮🇳 தமிழ்
                  </button>
                </div>
              </div>
            )}

            <button
              className={`nav-link ${currentPath === "/" ? "active" : ""}`}
              onClick={() => {
                navigate("/");
                setMobileMenuOpen(false);
              }}
            >
              {t.nav.home}
            </button>
            <button
              className={`nav-link ${currentPath === "/about" ? "active" : ""}`}
              onClick={() => {
                navigate("/about");
                setMobileMenuOpen(false);
              }}
            >
              {t.nav.about}
            </button>
            <button
              className={`nav-link ${currentPath.startsWith("/services") ? "active" : ""}`}
              onClick={() => {
                navigate("/services");
                setMobileMenuOpen(false);
              }}
            >
              {t.nav.services}
            </button>
            <button
              className={`nav-link ${currentPath === "/aftercare" ? "active" : ""}`}
              onClick={() => {
                navigate("/aftercare");
                setMobileMenuOpen(false);
              }}
            >
              {t.nav.journey}
            </button>
            <button
              className={`nav-link ${currentPath === "/academy" ? "active" : ""}`}
              onClick={() => {
                navigate("/academy");
                setMobileMenuOpen(false);
              }}
            >
              {t.nav.academy}
            </button>
            <button
              className={`nav-link ${currentPath === "/blog" ? "active" : ""}`}
              onClick={() => {
                navigate("/blog");
                setMobileMenuOpen(false);
              }}
            >
              {t.nav.blog}
            </button>
            <button
              className={`nav-link ${currentPath === "/contact" ? "active" : ""}`}
              onClick={() => {
                navigate("/contact");
                setMobileMenuOpen(false);
              }}
            >
              {t.nav.contact}
            </button>

            {mobileMenuOpen && (
              <div
                className="mobile-menu-footer"
                style={{
                  marginTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <button
                  className="btn-luxury-gold"
                  style={{
                    width: "100%",
                    padding: "14px",
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openBookingFor("Free Consultation");
                  }}
                >
                  {t.nav.bookConsultation} <span>↗</span>
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}
                >
                  <a
                    href={`tel:${CLINIC_INFO.phoneCall}`}
                    className="topbar-btn topbar-btn-call"
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                  >
                    {t.nav.callClinic}
                  </a>
                  <a
                    href={`${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent("Hello Browlicious!")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="topbar-btn topbar-btn-wa"
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                  >
                    {t.nav.whatsApp}
                  </a>
                </div>
              </div>
            )}
          </nav>

          <div className="nav-cta-group">
            <button
              className="btn-luxury-gold"
              onClick={() => openBookingFor("Free Consultation")}
            >
              {t.nav.bookConsultation} <span>↗</span>
            </button>
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {/* Render Current Individual Page */}
      <main id="main-content">{PageContent}</main>

      {/* ====================================================================
          LUXURY CLINIC FOOTER
          ==================================================================== */}
      <footer className="luxury-footer">
        <div className="luxury-shell">
          <div className="footer-top-grid">
            <div className="footer-col">
              <div className="footer-brand">
                <b>Browlicious</b>
                <span>{t.footer.brandSub}</span>
              </div>
              <p className="footer-about-text">{t.footer.about}</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <a
                  href={CLINIC_INFO.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="topbar-btn topbar-btn-call"
                  style={{ fontSize: "11px", padding: "6px 12px" }}
                >
                  Instagram ↗
                </a>
                <a
                  href={CLINIC_INFO.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="topbar-btn topbar-btn-call"
                  style={{ fontSize: "11px", padding: "6px 12px" }}
                >
                  {lang === "ta" ? "கூகுள் மேப் ↗" : "Google Maps ↗"}
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h5>{t.footer.colTreatments}</h5>
              <ul className="footer-links-list">
                <li>
                  <button
                    onClick={() => navigate("/services/microblading")}
                    className="nav-link"
                  >
                    {lang === "ta" ? "மைக்ரோபிளேடிங்" : "Microblading"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/services/ombre-brows")}
                    className="nav-link"
                  >
                    {lang === "ta"
                      ? "ஓம்ப்ரே பவுடர் புருவம்"
                      : "Ombre (Powder) Brows"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/services/combination-brows")}
                    className="nav-link"
                  >
                    {lang === "ta" ? "காம்பினேஷன் புருவம்" : "Combination Brows"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/services/lip-blush")}
                    className="nav-link"
                  >
                    {lang === "ta" ? "லிப் பிளஷ்" : "Lip Blush"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/services/dark-lip-correction")}
                    className="nav-link"
                  >
                    {lang === "ta"
                      ? "கருமை உதடு நீக்கம்"
                      : "Dark Lip Pigmentation"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/services/eyeliner")}
                    className="nav-link"
                  >
                    {lang === "ta" ? "பர்மனென்ட் ஐலைனர்" : "Permanent Eyeliner"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/services/smp-men")}
                    className="nav-link"
                  >
                    {lang === "ta"
                      ? "ஸ்கால்ப் மைக்ரோபிக்மென்டேஷன்"
                      : "SMP for Men & Women"}
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>{t.footer.colClinic}</h5>
              <ul className="footer-links-list">
                <li>
                  <button
                    onClick={() => navigate("/about")}
                    className="nav-link"
                  >
                    {t.nav.about} & Durga
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/aftercare")}
                    className="nav-link"
                  >
                    {lang === "ta"
                      ? "7-படி சிகிச்சை முறை & FAQ"
                      : "7-Step Journey & FAQ"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/aftercare")}
                    className="nav-link"
                  >
                    {lang === "ta" ? "பராமரிப்பு விதிகள்" : "Aftercare Rules"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/academy")}
                    className="nav-link"
                  >
                    {t.nav.academy}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/blog")}
                    className="nav-link"
                  >
                    {lang === "ta" ? "12-வார அழகு இதழ்" : "12-Week Blog Hub"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/contact")}
                    className="nav-link"
                  >
                    {lang === "ta"
                      ? "தொடர்பு & கிளினிக் முகவரி"
                      : `${t.nav.contact} & Location`}
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-col footer-contact-info">
              <h5>{t.footer.colVisit}</h5>
              <p>
                📍 <b>Browlicious PMU Clinic</b>
                <br />
                {CLINIC_INFO.address}
              </p>
              <p>
                🕒 <b>{t.footer.hoursTitle}</b>
                <br />
                {lang === "ta"
                  ? "திங்கள் - ஞாயிறு: 10:00 AM – 8:00 PM (முன்பதிவு மட்டுமே)"
                  : CLINIC_INFO.hours}
              </p>
              <p>
                📞 <b>{t.footer.phoneTitle}</b>
                <br />
                <a href={`tel:${CLINIC_INFO.phoneCall}`}>{CLINIC_INFO.phone}</a>
              </p>
              <a
                href={CLINIC_INFO.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-luxury-gold"
                style={{
                  display: "inline-flex",
                  padding: "9px 18px",
                  fontSize: "12px",
                  marginTop: "8px",
                }}
              >
                {t.footer.btnDirections}
              </a>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>
              © {new Date().getFullYear()} Browlicious | {t.footer.rights}
            </span>
            <div className="footer-lang-selector">
              <span className="footer-lang-label">
                {lang === "ta" ? "மொழி:" : "Language:"}
              </span>
              <button
                type="button"
                className={`footer-lang-btn ${lang === "en" ? "active" : ""}`}
                onClick={() => setLang("en")}
              >
                English
              </button>
              <span style={{ opacity: 0.35 }}>|</span>
              <button
                type="button"
                className={`footer-lang-btn ${lang === "ta" ? "active" : ""}`}
                onClick={() => setLang("ta")}
              >
                தமிழ்
              </button>
            </div>
            <span>{t.footer.sanctuary}</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Action Button */}
      {!bookingOpen && !showConsultPopup && (
        <a
          href={`${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent("Hello Browlicious! I would like to make an enquiry.")}`}
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
      )}

      {/* Mobile Sticky Bottom Thumb-Zone Bar */}
      {!bookingOpen && !showConsultPopup && (
        <div className="mobile-sticky-bottom-bar">
          <div className="mobile-bar-actions">
            <a
              href={`tel:${CLINIC_INFO.phoneCall}`}
              className="mobile-bar-btn mobile-bar-call"
            >
              {t.bottomBar.call}
            </a>
            <button
              onClick={() => openBookingFor("Consultation")}
              className="mobile-bar-btn mobile-bar-book"
            >
              {t.bottomBar.consult}
            </button>
            <a
              href={`${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent("Hello Browlicious! I would like to make an enquiry.")}`}
              target="_blank"
              rel="noreferrer"
              className="mobile-bar-btn mobile-bar-wa"
            >
              {t.bottomBar.whatsApp}
            </a>
          </div>
        </div>
      )}

      {/* Reusable Booking Modal */}
      {bookingOpen && (
        <div
          className="luxury-modal-backdrop"
          onClick={() => setBookingOpen(false)}
        >
          <div
            className="luxury-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-booking-title"
          >
            <div className="modal-header-bar">
              <div>
                <span
                  className="luxury-eyebrow"
                  style={{ marginBottom: "2px", display: "block" }}
                >
                  {t.bookingModal.eyebrow}
                </span>
                <h2 id="modal-booking-title" className="modal-title-text">
                  {t.bookingModal.title}
                </h2>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setBookingOpen(false)}
                aria-label="Close form"
              >
                ✕
              </button>
            </div>

            <div className="modal-scroll-body">
              <p className="modal-desc-text">{t.bookingModal.desc}</p>

              {bookingSent ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div
                    style={{
                      fontSize: "44px",
                      color: "#25d366",
                      marginBottom: "10px",
                    }}
                  >
                    ✓
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "22px",
                      color: "var(--deep-plum)",
                    }}
                  >
                    {t.bookingModal.sentTitle}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      margin: "10px 0 20px",
                    }}
                  >
                    {t.bookingModal.sentDesc}
                  </p>
                  <a
                    href={`${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent(`Hello Browlicious! I would like to book ${bookingService} on ${bookingDate} for ${clientName}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-luxury-gold"
                  >
                    {t.bookingModal.btnOpenChat}
                  </a>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  <div className="booking-form-row">
                    <div className="form-group">
                      <label>{t.bookingModal.serviceLabel}</label>
                      <select
                        value={bookingService}
                        onChange={(e) => setBookingService(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "1.5px solid var(--border-line)",
                          borderRadius: "8px",
                        }}
                      >
                        {Object.values(INDIVIDUAL_SERVICES).map((s) => (
                          <option key={s.slug} value={s.name}>
                            {s.name} ({s.price})
                          </option>
                        ))}
                        <option value="Browlicious PMU Academy Course">
                          {lang === "ta"
                            ? "பிரௌலிசியஸ் PMU அகாடமி பயிற்சி"
                            : "Browlicious PMU Academy Course"}
                        </option>
                        <option value="General Free Consultation">
                          {lang === "ta"
                            ? "இலவச ஆலோசனைக் கட்டம்"
                            : "General Free Consultation"}
                        </option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>{t.bookingModal.dateLabel}</label>
                      <select
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "1.5px solid var(--border-line)",
                          borderRadius: "8px",
                        }}
                      >
                        <option value="Today">
                          {lang === "ta" ? "இன்று" : "Today"}
                        </option>
                        <option value="Tomorrow">
                          {lang === "ta" ? "நாளை" : "Tomorrow"}
                        </option>
                        <option value="This Friday">
                          {lang === "ta" ? "இந்த வெள்ளி" : "This Friday"}
                        </option>
                        <option value="This Saturday">
                          {lang === "ta" ? "இந்த சனி" : "This Saturday"}
                        </option>
                        <option value="This Sunday">
                          {lang === "ta" ? "இந்த ஞாயிறு" : "This Sunday"}
                        </option>
                        <option value="Next Week">
                          {lang === "ta" ? "அடுத்த வாரம்" : "Next Week"}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="booking-form-row">
                    <div className="form-group">
                      <label>{t.bookingModal.nameLabel}</label>
                      <input
                        type="text"
                        required
                        placeholder={
                          lang === "ta" ? "உங்கள் முழு பெயர்" : "Your full name"
                        }
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.bookingModal.phoneLabel}</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 97103 XXXXX"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: "20px" }}>
                    <label>{t.bookingModal.emailLabel}</label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "24px" }}>
                    <label>{t.bookingModal.notesLabel}</label>
                    <textarea
                      rows={2}
                      placeholder={
                        lang === "ta"
                          ? "உங்கள் புருவம் அல்லது உதடு பற்றிய குறிப்புகள்..."
                          : "Tell us a little more about your brows, lips or skin goals..."
                      }
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                    />
                  </div>

                  <div className="modal-action-row">
                    <button
                      type="button"
                      className="btn-luxury-outline"
                      onClick={() => setBookingOpen(false)}
                    >
                      {t.bookingModal.btnCancel}
                    </button>
                    <button type="submit" className="btn-luxury-gold">
                      {t.bookingModal.btnConfirm}
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
        <div
          className="consultation-popup-overlay"
          onClick={() => setShowConsultPopup(false)}
        >
          <div
            className="consultation-popup-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setShowConsultPopup(false)}
              aria-label="Close popup"
            >
              ✕
            </button>
            <span className="luxury-eyebrow">
              {lang === "ta" ? "உங்கள் அடுத்த படி" : "Your Next Step"}
            </span>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "26px",
                color: "var(--deep-plum)",
                margin: "10px 0",
              }}
            >
              {lang === "ta"
                ? "தினமும் உங்கள் சிறந்த வசீகர தோற்றம்."
                : "Your best features, every single day."}
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginBottom: "20px",
                lineHeight: "1.6",
              }}
            >
              {lang === "ta"
                ? "தினமும் புருவம் பென்சில் மற்றும் உதட்டுச் சாயம் இடும் சிரமத்தை விட்டுவிடுங்கள். பிரௌலிசியஸ் துர்காவிடம் இலவச ஆலோசனை பெறுங்கள்."
                : "Imagine skipping the brow pencil, lip liner and morning touch-ups. Book your free consultation with Durga at Browlicious Anna Nagar."}
            </p>
            <button
              className="btn-luxury-gold"
              style={{ width: "100%", padding: "14px 20px" }}
              onClick={() => {
                setShowConsultPopup(false);
                openBookingFor("Free Consultation");
              }}
            >
              {t.nav.bookConsultation} <span>↗</span>
            </button>
            <button
              onClick={() => setShowConsultPopup(false)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "11px",
                marginTop: "14px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {lang === "ta" ? "தொடர்ந்து பார்க்க" : "Continue browsing"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   PAGE 1: HOME PAGE
   ========================================================================== */
function HomePage({
  navigate,
  onBook,
  baPosition,
  setBaPosition,
  activeBaTab,
  setActiveBaTab,
  lang,
  t,
}) {
  const [selectedBrowTab, setSelectedBrowTab] = useState("microblading");

  const browTechniques = {
    microblading: {
      name: "Microblading",
      price: "₹14,999 (Includes Touch-up)",
      tag: lang === "ta" ? "இயற்கை முடி இழை" : "Natural Hair Strokes",
      headline:
        lang === "ta"
          ? "இயற்கையான மெல்லிய முடி இழை வடிவம்"
          : "Fine hair-stroke brows that look like your own",
      idealFor:
        lang === "ta"
          ? "மெல்லிய, இடைவெளி உள்ள புருவங்கள் கொண்ட சாதாரண மற்றும் உலர் சருமத்திற்கு உகந்தது."
          : "Normal to dry skin, thin or gappy brows, and anyone who wants a soft, realistic finish with no makeup look.",
      healedLook:
        lang === "ta"
          ? "இயற்கை முடி இழைகள் போன்ற அதிநுட்பமான தோற்றம்."
          : "Ultra-fine, realistic hair strokes following your natural brow growth pattern.",
      bestSkin: lang === "ta" ? "சாதாரண முதல் உலர் சருமம்" : "Normal to Dry Skin",
      longevity: lang === "ta" ? "12 முதல் 18 மாதங்கள்" : "12 to 18 Months",
      slug: "microblading",
      image: ASSETS.testimonialBrowsNaturalImg,
    },
    "ombre-brows": {
      name: "Ombre (Powder) Brows",
      price: "₹16,999 (Includes Touch-up)",
      tag: lang === "ta" ? "பவுடர் கிரேடியன்ட்" : "Soft Powder Gradient",
      headline:
        lang === "ta"
          ? "மென்மையான பவுடர் மேக்கப் புருவ தோற்றம்"
          : "Soft, brushed-on definition like brow makeup that never fades overnight",
      idealFor:
        lang === "ta"
          ? "எண்ணெய் பசை அல்லது கலவை சருமம் உள்ளவர்களுக்கும், எப்போதும் மேக்கப் போன்ற தோற்றத்தை விரும்புபவர்களுக்கும் ஏற்றது."
          : "Oily or combination skin, mature skin, and anyone who loves a defined, softly filled-in brow look.",
      healedLook:
        lang === "ta"
          ? "முன்புறம் லேசாகவும் பின்பகுதி அடர்த்தியாகவும் இருக்கும் பவுடர் கிரேடியன்ட்."
          : "Soft powdered gradient — lighter at the front, gently defined through the tail without harsh edges.",
      bestSkin:
        lang === "ta" ? "எண்ணெய் அல்லது கலவை சருமம்" : "Oily to Combination Skin",
      longevity: lang === "ta" ? "18 முதல் 36 மாதங்கள்" : "18 to 36 Months",
      slug: "ombre-brows",
      image: ASSETS.testimonialBrowsResultImg,
    },
    "combination-brows": {
      name: "Combination Brows",
      price: "₹18,999 (Includes Touch-up)",
      tag:
        lang === "ta" ? "ஹைபிரிட் (ஸ்ட்ரோக் + நிழல்)" : "Hybrid (Strokes + Shading)",
      headline:
        lang === "ta"
          ? "முடி இழை + பவுடர் நிழல் — இரண்டின் சிறந்த சங்கமம்"
          : "Strokes for realism. Shading for depth. The best of both.",
      idealFor:
        lang === "ta"
          ? "அனைத்து தோல் வகைகளுக்கும், குறைந்த புருவம் மற்றும் மெல்லிய வால் பகுதி உள்ளவர்களுக்கும் மிகவும் பிடித்தமான சிகிச்சை."
          : "Almost every skin type, brows with gaps or thin tails, and anyone who wants realistic front strokes with full body definition.",
      healedLook:
        lang === "ta"
          ? "முன்புறம் இயற்கை முடி இழைகளும் நடுவிலும் வால் பகுதியிலும் மென்மையான நிழலும்."
          : "Delicate micro-strokes at the bulb with soft, airy powder shading through the arch and tail.",
      bestSkin:
        lang === "ta" ? "அனைத்து தோல் வகைகளும்" : "Most Skin Types (Universal)",
      longevity: lang === "ta" ? "18 முதல் 24 மாதங்கள்" : "18 to 24 Months",
      slug: "combination-brows",
      image: ASSETS.browTreatmentImg,
    },
  };
  const activeBrow =
    browTechniques[selectedBrowTab] || browTechniques.microblading;
  const baSlide =
    activeBaTab === "Lips"
      ? {
          before: ASSETS.testimonialLipsRestImg,
          after: ASSETS.testimonialLipsResultImg,
          label:
            lang === "ta"
              ? "லிப் பிளஷ் & நியூட்ராலைசேஷன்"
              : "Lip Blush & Neutralization",
        }
      : activeBaTab === "Eyeliner"
        ? {
            before: ASSETS.testimonialEyelinerBeforeImg,
            after: ASSETS.testimonialEyelinerCloseupImg,
            label: lang === "ta" ? "பர்மனென்ட் ஐலைனர்" : "Permanent Eyeliner",
          }
        : {
            before: ASSETS.browsImg,
            after: ASSETS.testimonialBrowsResultImg,
            label:
              lang === "ta"
                ? "இயற்கையான ஹேர்-ஸ்ட்ரோக் மைக்ரோபிளேடிங்"
                : "Natural Hair-Stroke Microblading",
          };

  return (
    <>
      {/* Hero Section */}
      <section className="luxury-hero">
        <div className="luxury-shell hero-layout">
          <div className="hero-left">
            <div className="luxury-pill-tag">
              <span className="badge-dot"></span>
              {t.hero.tag}
            </div>

            <h1 className="hero-headline">
              {t.hero.headlineStart}
              <em>{t.hero.headlineEm}</em>
            </h1>

            <p className="hero-subheadline">{t.hero.subheadline}</p>

            <div className="hero-cta-bar">
              <button
                className="btn-luxury-primary"
                onClick={() => onBook("Free Consultation")}
              >
                {t.hero.btnConsultation} <span>↗</span>
              </button>
              <button
                className="btn-luxury-outline"
                onClick={() => navigate("/services")}
              >
                {t.hero.btnTreatments} <span>↓</span>
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
                <b>{t.hero.socialProof1}</b>
                <span>{t.hero.socialProof2}</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-card">
            <div className="hero-image-frame">
              <img
                src={ASSETS.heroImg}
                alt="Browlicious PMU Clinic Artist at Work"
              />
            </div>

            <div className="hero-floating-glass-card">
              <div className="glass-icon-circle">✦</div>
              <div className="glass-content">
                <h4>{t.hero.hygieneTitle}</h4>
                <p>{t.hero.hygieneDesc}</p>
              </div>
            </div>

            <div className="hero-badge-top">
              <span className="badge-num">{t.hero.badgeNum}</span>
              <span className="badge-label">{t.hero.badgeLabel1}</span>
              <span className="badge-label">{t.hero.badgeLabel2}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Philosophy Section */}
      <section
        style={{
          padding: "80px 0",
          background: "#fff",
          borderBottom: "1px solid var(--border-line)",
        }}
      >
        <div
          className="luxury-shell"
          style={{ maxWidth: "960px", textAlign: "center" }}
        >
          <span className="luxury-eyebrow">{t.philosophy.eyebrow}</span>
          <h2 className="luxury-title">
            {t.philosophy.titleStart}
            <em>{t.philosophy.titleEm}</em>
          </h2>
          <p
            style={{
              fontSize: "17px",
              color: "var(--text-body)",
              lineHeight: "1.8",
              margin: "20px auto 30px",
            }}
          >
            {t.philosophy.desc}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn-luxury-gold"
              onClick={() => onBook("Consultation")}
            >
              {t.philosophy.btnConsultation} <span>↗</span>
            </button>
            <button
              className="btn-luxury-outline"
              onClick={() => navigate("/about")}
            >
              {t.philosophy.btnStory} <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Clinic Founder & Master PMU Artist Spotlight */}
      <section className="home-founder-section">
        <div className="luxury-shell">
          <div className="home-founder-grid">
            <div className="founder-spotlight-photo">
              <span className="founder-exp-pill">
                ★ 8+ Years Master Specialist
              </span>
              <div className="founder-photo-frame" style={{ height: "460px" }}>
                <img
                  src={ASSETS.founderImg}
                  alt="Durga - Founder of Browlicious PMU Clinic Chennai"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                />
              </div>
            </div>

            <div className="founder-spotlight-content">
              <span className="luxury-eyebrow">{t.homeFounder.eyebrow}</span>
              <h2 className="luxury-title" style={{ marginBottom: "6px" }}>
                {t.homeFounder.title}
              </h2>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "var(--dusty-pink)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  display: "block",
                  marginBottom: "16px",
                }}
              >
                {t.homeFounder.role}
              </span>

              <div className="founder-quote-box">"{t.homeFounder.quote}"</div>

              <div className="founder-stats-grid">
                <div className="founder-stat-item">
                  <b>{t.homeFounder.stat1}</b>
                  <span>{t.homeFounder.stat1Label}</span>
                </div>
                <div className="founder-stat-item">
                  <b>{t.homeFounder.stat2}</b>
                  <span>{t.homeFounder.stat2Label}</span>
                </div>
                <div className="founder-stat-item">
                  <b>{t.homeFounder.stat3}</b>
                  <span>{t.homeFounder.stat3Label}</span>
                </div>
                <div className="founder-stat-item">
                  <b>{t.homeFounder.stat4}</b>
                  <span>{t.homeFounder.stat4Label}</span>
                </div>
              </div>

              <ul className="founder-checklist">
                <li>{t.homeFounder.cred1}</li>
                <li>{t.homeFounder.cred2}</li>
                <li>{t.homeFounder.cred3}</li>
                <li>{t.homeFounder.cred4}</li>
              </ul>

              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <button
                  className="btn-luxury-gold"
                  onClick={() => onBook("Consultation with Durga")}
                >
                  {t.homeFounder.btnBook}
                </button>
                <button
                  className="btn-luxury-outline"
                  onClick={() => navigate("/about")}
                >
                  {t.homeFounder.btnStory}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Browlicious - 6 Core Pillars */}
      <section
        style={{
          padding: "90px 0",
          background: "var(--sand-bg)",
          borderBottom: "1px solid var(--border-pink)",
        }}
      >
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">{t.pillars.eyebrow}</span>
            <h2 className="luxury-title">
              {t.pillars.titleStart}
              <em>{t.pillars.titleEm}</em>
            </h2>
            <p className="luxury-description">{t.pillars.desc}</p>
          </div>

          <div className="home-pillars-grid">
            {t.pillars.items.map((pillar, i) => (
              <div key={i} className="protocol-box" style={{ padding: "26px" }}>
                <div style={{ fontSize: "26px", marginBottom: "10px" }}>
                  {pillar.icon}
                </div>
                <h4
                  style={{
                    fontSize: "18px",
                    color: "var(--deep-plum)",
                    marginBottom: "8px",
                  }}
                >
                  {pillar.title}
                </h4>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    lineHeight: "1.6",
                  }}
                >
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Before & After Slider */}
      <section className="luxury-ba-section">
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">{t.beforeAfter.eyebrow}</span>
            <h2 className="luxury-title">{t.beforeAfter.title}</h2>
            <p className="luxury-description">{t.beforeAfter.desc}</p>
          </div>

          <div className="ba-filter-pills">
            {[
              { key: "Brows", label: t.beforeAfter.tabBrows },
              { key: "Lips", label: t.beforeAfter.tabLips },
              { key: "Eyeliner", label: t.beforeAfter.tabEyeliner },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`ba-pill ${activeBaTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveBaTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className="ba-slider-container"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = Math.max(
                5,
                Math.min(95, ((e.clientX - rect.left) / rect.width) * 100),
              );
              setBaPosition(percent);
            }}
            onMouseMove={(e) => {
              if (e.buttons === 1) {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = Math.max(
                  5,
                  Math.min(95, ((e.clientX - rect.left) / rect.width) * 100),
                );
                setBaPosition(percent);
              }
            }}
            onTouchStart={(e) => {
              if (e.touches[0]) {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = Math.max(
                  5,
                  Math.min(
                    95,
                    ((e.touches[0].clientX - rect.left) / rect.width) * 100,
                  ),
                );
                setBaPosition(percent);
              }
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = Math.max(
                  5,
                  Math.min(
                    95,
                    ((e.touches[0].clientX - rect.left) / rect.width) * 100,
                  ),
                );
                setBaPosition(percent);
              }
            }}
          >
            <div className="ba-image-layer ba-after-layer">
              <img src={baSlide.after} alt={`${baSlide.label} After`} />
              <div className="ba-tag ba-tag-after">
                {t.beforeAfter.labelAfter}
              </div>
            </div>
            <div
              className="ba-image-layer ba-before-layer"
              style={{ clipPath: `inset(0 ${100 - baPosition}% 0 0)` }}
            >
              <img src={baSlide.before} alt={`${baSlide.label} Before`} />
              <div className="ba-tag ba-tag-before">
                {t.beforeAfter.labelBefore}
              </div>
            </div>
            <div className="ba-handle" style={{ left: `${baPosition}%` }}>
              <div className="ba-handle-button">⇄</div>
            </div>
          </div>
          <div className="ba-caption-card">
            <b>{baSlide.label}</b> — {t.beforeAfter.caption}
          </div>
        </div>
      </section>

      {/* Featured Treatments Portal */}
      <section style={{ padding: "95px 0", background: "#fff" }}>
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">{t.featuredServices.eyebrow}</span>
            <h2 className="luxury-title">
              {t.featuredServices.titleStart}
              <em>{t.featuredServices.titleEm}</em>
            </h2>
            <p className="luxury-description">{t.featuredServices.desc}</p>
          </div>

          <div className="services-grid-3col">
            {Object.values(INDIVIDUAL_SERVICES)
              .slice(0, 6)
              .map((service) => (
                <article key={service.slug} className="service-card-luxury">
                  <div className="service-card-img-wrap">
                    <img
                      src={service.image}
                      alt={service.name}
                      loading="lazy"
                    />
                    <span className="service-price-tag">{service.price}</span>
                  </div>
                  <div className="service-card-body">
                    <span className="service-category-tag">
                      {service.category}
                    </span>
                    <h3 className="service-card-title">{service.name}</h3>
                    <p className="service-card-desc">{service.headline}</p>

                    <div className="service-spec-mini">
                      <div className="spec-item">
                        <span>{t.servicesPage.durationLabel}</span>
                        <b>{service.duration}</b>
                      </div>
                      <div className="spec-item">
                        <span>{t.servicesPage.painLabel}</span>
                        <b>{service.painLevel}</b>
                      </div>
                      <div className="spec-item">
                        <span>{t.servicesPage.healingLabel}</span>
                        <b>{service.healingAndLongevity.split(",")[0]}</b>
                      </div>
                    </div>

                    <div className="service-card-actions">
                      <button
                        className="btn-card-book"
                        onClick={() => onBook(service.name)}
                      >
                        {t.featuredServices.btnBook}
                      </button>
                      <button
                        className="btn-card-details"
                        onClick={() => navigate(`/services/${service.slug}`)}
                      >
                        {t.featuredServices.btnDetails}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button
              className="btn-luxury-outline"
              onClick={() => navigate("/services")}
            >
              {t.servicesPage.viewAllBtn} <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Brow Technique Decision Guide */}
      <section className="home-brow-guide">
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">{t.browGuide.eyebrow}</span>
            <h2 className="luxury-title">{t.browGuide.title}</h2>
            <p className="luxury-description">{t.browGuide.desc}</p>
          </div>

          <div className="brow-technique-tabs">
            <button
              className={`brow-tab-btn ${selectedBrowTab === "microblading" ? "active" : ""}`}
              onClick={() => setSelectedBrowTab("microblading")}
            >
              {t.browGuide.tabMicro}
            </button>
            <button
              className={`brow-tab-btn ${selectedBrowTab === "ombre-brows" ? "active" : ""}`}
              onClick={() => setSelectedBrowTab("ombre-brows")}
            >
              {t.browGuide.tabOmbre}
            </button>
            <button
              className={`brow-tab-btn ${selectedBrowTab === "combination-brows" ? "active" : ""}`}
              onClick={() => setSelectedBrowTab("combination-brows")}
            >
              {t.browGuide.tabCombo}
            </button>
          </div>

          <div className="brow-highlight-card">
            <div className="brow-highlight-body">
              <span className="brow-highlight-tag">{activeBrow.tag}</span>
              <h3 className="brow-highlight-title">{activeBrow.name}</h3>
              <p className="brow-highlight-headline">{activeBrow.headline}</p>

              <div className="brow-specs-table">
                <div className="brow-spec-cell">
                  <span>{t.browGuide.skinLabel}</span>
                  <b>{activeBrow.bestSkin}</b>
                </div>
                <div className="brow-spec-cell">
                  <span>{t.browGuide.longevityLabel}</span>
                  <b>{activeBrow.longevity}</b>
                </div>
                <div
                  className="brow-spec-cell"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <span>{t.browGuide.idealLabel}</span>
                  <b
                    style={{
                      fontWeight: "normal",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      color: "var(--text-body)",
                    }}
                  >
                    {activeBrow.idealFor}
                  </b>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <button
                  className="btn-luxury-gold"
                  onClick={() => onBook(activeBrow.name)}
                >
                  {t.browGuide.btnBookThis}
                </button>
                <button
                  className="btn-luxury-outline"
                  onClick={() => navigate(`/services/${activeBrow.slug}`)}
                >
                  {t.featuredServices.btnDetails}
                </button>
              </div>
            </div>

            <div className="brow-highlight-image">
              <img src={activeBrow.image} alt={activeBrow.name} />
              <div className="brow-price-overlay">
                <span>{t.browGuide.priceLabel}</span>
                <b>{activeBrow.price}</b>
              </div>
            </div>
          </div>

          {/* Full Side-by-Side Comparison Table */}
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <h4
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "20px",
                color: "var(--deep-plum)",
              }}
            >
              {t.browGuide.matrixTitle}
            </h4>
          </div>
          <div className="luxury-table-wrap">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>{t.browGuide.colTechnique}</th>
                  <th>{t.browGuide.colLook}</th>
                  <th>{t.browGuide.colSkin}</th>
                  <th>{t.browGuide.colLongevity}</th>
                  <th>{lang === "ta" ? "முன்பதிவு" : "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {BROW_COMPARISON_TABLE.map((row) => (
                  <tr key={row.slug}>
                    <td>
                      <b style={{ color: "var(--deep-plum)" }}>
                        {row.technique}
                      </b>
                    </td>
                    <td>{row.look}</td>
                    <td>
                      <span className="badge-pill-table">{row.bestSkin}</span>
                    </td>
                    <td>{row.longevity}</td>
                    <td>
                      <button
                        className="btn-luxury-gold"
                        style={{ padding: "7px 14px", fontSize: "11px" }}
                        onClick={() => onBook(row.technique)}
                      >
                        {t.featuredServices.btnBook}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7-Step PMU Journey Section */}
      <section className="home-journey-section">
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">{t.homeJourney.eyebrow}</span>
            <h2 className="luxury-title">{t.homeJourney.title}</h2>
            <p className="luxury-description">{t.homeJourney.desc}</p>
          </div>

          <div className="journey-step-grid">
            {CLIENT_JOURNEY_STEPS.map((s) => (
              <div key={s.step} className="journey-step-card">
                <span className="step-num-pill">{s.step}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              className="btn-luxury-outline"
              onClick={() => navigate("/aftercare")}
            >
              {t.homeJourney.btnJourneyFull}
            </button>
          </div>
        </div>
      </section>

      {/* Clinical Hygiene & Peace of Mind Assurance Strip */}
      <section className="home-safety-strip">
        <div className="luxury-shell">
          <div className="safety-grid-4col">
            <div className="safety-card">
              <div className="safety-icon-circle">🛡️</div>
              <h4>{t.safetyStrip.badge1Title}</h4>
              <p>{t.safetyStrip.badge1Desc}</p>
            </div>
            <div className="safety-card">
              <div className="safety-icon-circle">🎨</div>
              <h4>{t.safetyStrip.badge2Title}</h4>
              <p>{t.safetyStrip.badge2Desc}</p>
            </div>
            <div className="safety-card">
              <div className="safety-icon-circle">📐</div>
              <h4>{t.safetyStrip.badge3Title}</h4>
              <p>{t.safetyStrip.badge3Desc}</p>
            </div>
            <div className="safety-card">
              <div className="safety-icon-circle">💎</div>
              <h4>{t.safetyStrip.badge4Title}</h4>
              <p>{t.safetyStrip.badge4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Banner */}
      <section
        style={{
          padding: "80px 0",
          background: "var(--deep-plum)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div className="luxury-shell" style={{ maxWidth: "780px" }}>
          <span
            className="luxury-eyebrow"
            style={{ color: "var(--gold-metallic)" }}
          >
            {lang === "ta" ? "உங்கள் அடுத்த படி" : "Your Next Step"}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(32px, 4vw, 48px)",
              color: "#fff",
              margin: "14px 0 20px",
            }}
          >
            {lang === "ta"
              ? "தினமும் உங்கள் சிறந்த வசீகர தோற்றம்."
              : "Your best features, every single day."}
          </h2>
          <p
            style={{
              color: "#f7dbe4",
              fontSize: "16px",
              lineHeight: "1.7",
              marginBottom: "30px",
            }}
          >
            {lang === "ta"
              ? "சென்னை அண்ணா நகர் கிழக்கு கிளினிக்கில் இலவச ஆலோசனை பெறவும். முழுமையாகப் பேசி உங்களுக்கேற்ற நீண்டகால அழகுத் திட்டத்தை வடிவமைக்கிறோம்."
              : "Book your free consultation in Anna Nagar East, Chennai. We take the time you need, answer all your questions, and design for the long term."}
          </p>
          <button
            className="btn-luxury-gold"
            onClick={() => onBook("Free Consultation")}
            style={{ padding: "16px 36px", fontSize: "14px" }}
          >
            {t.hero.btnConsultation} <span>↗</span>
          </button>
        </div>
      </section>
    </>
  );
}

function AboutPage({ navigate, onBook, t, lang }) {
  return (
    <div>
      <section className="luxury-page-header">
        <div className="luxury-shell">
          <nav className="breadcrumb-nav">
            <a onClick={() => navigate("/")}>{t.nav.home}</a>
            <span className="breadcrumb-separator">/</span>
            <span>{t.about.breadcrumb}</span>
          </nav>
          <span className="luxury-eyebrow">{t.about.eyebrow}</span>
          <h1 className="page-headline-lg">
            {t.about.titleStart}
            <em>{t.about.titleEm}</em>
          </h1>
          <p className="page-lead-copy">{t.about.lead}</p>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div className="luxury-shell">
          <div className="about-founder-grid">
            <div>
              <div className="founder-photo-frame" style={{ height: "480px" }}>
                <img
                  src={ASSETS.founderImg}
                  alt="Durga - Founder of Browlicious Chennai"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <b
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "20px",
                    color: "var(--deep-plum)",
                  }}
                >
                  {t.about.founderName}
                </b>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                  }}
                >
                  {t.about.founderRole}
                </span>
              </div>
            </div>

            <div>
              <span className="luxury-eyebrow">
                {lang === "ta" ? "நிறுவனரை சந்தியுங்கள்" : "Meet The Founder"}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "36px",
                  color: "var(--deep-plum)",
                  marginBottom: "20px",
                }}
              >
                {t.about.storyTitle}
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-body)",
                  lineHeight: "1.8",
                  marginBottom: "18px",
                }}
              >
                {t.about.story1}
              </p>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-body)",
                  lineHeight: "1.8",
                  marginBottom: "18px",
                }}
              >
                {t.about.story2}
              </p>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-body)",
                  lineHeight: "1.8",
                  marginBottom: "24px",
                }}
              >
                {t.about.story3}
              </p>

              <button
                className="btn-luxury-primary"
                onClick={() => onBook("Consultation with Durga")}
              >
                {t.about.btnBookDurga}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Credentials */}
      <section
        style={{
          padding: "80px 0",
          background: "var(--sand-bg)",
          borderTop: "1px solid var(--border-pink)",
        }}
      >
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">{t.about.valuesEyebrow}</span>
            <h2 className="luxury-title">
              {t.about.valuesTitleStart}
              <em>{t.about.valuesTitleEm}</em>
            </h2>
          </div>

          <div className="protocols-grid-2x2">
            <div className="protocol-box">
              <h4
                style={{
                  color: "var(--gold)",
                  fontSize: "18px",
                  marginBottom: "8px",
                }}
              >
                {lang === "ta" ? "01. பாதுகாப்பு முதன்மை" : "01. Safety First"}
              </h4>
              <p>
                {lang === "ta"
                  ? "கடுமையான மருத்துவ நடைமுறை: ஒருமுறை மட்டுமே பயன்படுத்தும் ஊசிகள் மற்றும் முன்கூட்டிய ஒவ்வாமை பரிசோதனை."
                  : "Strict clinical protocol: single-use needles, sterile field, and pre-procedure patch testing."}
              </p>
            </div>
            <div className="protocol-box">
              <h4
                style={{
                  color: "var(--gold)",
                  fontSize: "18px",
                  marginBottom: "8px",
                }}
              >
                {lang === "ta" ? "02. தனிப்பயன் வரைபடம்" : "02. Custom Mapping"}
              </h4>
              <p>
                {lang === "ta"
                  ? "ஸ்டென்சில்கள் கிடையாது. உங்கள் முக எலும்பு அமைப்பு மற்றும் புன்னகைக்கு ஏற்ப அளவிடப்பட்டு வடிவமைக்கப்படுகிறது."
                  : "No stencils. Every arch, liner, and curve is measured and mapped to your unique facial bone structure."}
              </p>
            </div>
            <div className="protocol-box">
              <h4
                style={{
                  color: "var(--gold)",
                  fontSize: "18px",
                  marginBottom: "8px",
                }}
              >
                {lang === "ta"
                  ? "03. EU-சான்றளிக்கப்பட்ட நிறமிகள்"
                  : "03. EU-Certified Pigments"}
              </h4>
              <p>
                {lang === "ta"
                  ? "ஹைபோஅலர்ஜெனிக், நிலையான நிறமிகள் நீலமாகவோ சாம்பலாகவோ மாறாமல் அழகாக குணமாகும்."
                  : "Hypoallergenic, stable pigments that do not turn ash, blue or salmon pink as they fade."}
              </p>
            </div>
            <div className="protocol-box">
              <h4
                style={{
                  color: "var(--gold)",
                  fontSize: "18px",
                  marginBottom: "8px",
                }}
              >
                {lang === "ta"
                  ? "04. முழுமையான வழிகாட்டல்"
                  : "04. Long-Term Mentorship"}
              </h4>
              <p>
                {lang === "ta"
                  ? "அகாடமி மாணவர்களுக்கு வாழ்நாள் வழிகாட்டல் மற்றும் கிளினிக் வாடிக்கையாளர்களுக்கு முழுமையான பராமரிப்பு உதவி."
                  : "Lifetime advisory for academy graduates and ongoing healing support for every clinic client."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServicesDirectoryPage({ navigate, onBook, t, lang }) {
  const [selectedGroup, setSelectedGroup] = useState("All");
  const groups = [
    { key: "All", label: t.servicesPage.allTab },
    { key: "Brows", label: t.servicesPage.browsTab },
    { key: "Lips & Eyes", label: t.servicesPage.lipsEyesTab },
    { key: "Scalp Micropigmentation", label: t.servicesPage.smpTab },
    { key: "Paramedical Tattooing", label: t.servicesPage.paramedicalTab },
  ];

  const allServices = Object.values(INDIVIDUAL_SERVICES);
  const filtered =
    selectedGroup === "All"
      ? allServices
      : allServices.filter((s) => s.category === selectedGroup);

  return (
    <div>
      <section className="luxury-page-header">
        <div className="luxury-shell">
          <nav className="breadcrumb-nav">
            <a onClick={() => navigate("/")}>{t.nav.home}</a>
            <span className="breadcrumb-separator">/</span>
            <span>{t.servicesPage.breadcrumb}</span>
          </nav>
          <span className="luxury-eyebrow">{t.servicesPage.eyebrow}</span>
          <h1 className="page-headline-lg">
            {t.servicesPage.titleStart}
            <em>{t.servicesPage.titleEm}</em>
          </h1>
          <p className="page-lead-copy">{t.servicesPage.lead}</p>
        </div>
      </section>

      <section style={{ padding: "70px 0 90px", background: "#fff" }}>
        <div className="luxury-shell">
          {/* Category Filter Pills */}
          <div className="ba-filter-pills" style={{ marginBottom: "40px" }}>
            {groups.map((grp) => (
              <button
                key={grp.key}
                className={`ba-pill ${selectedGroup === grp.key ? "active" : ""}`}
                onClick={() => setSelectedGroup(grp.key)}
              >
                {grp.label}
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
                  <span className="service-category-tag">
                    {service.category}
                  </span>
                  <h3 className="service-card-title">{service.name}</h3>
                  <p className="service-card-desc">{service.headline}</p>

                  <div className="service-spec-mini">
                    <div className="spec-item">
                      <span>{t.servicesPage.durationLabel}</span>
                      <b>{service.duration}</b>
                    </div>
                    <div className="spec-item">
                      <span>{t.servicesPage.painLabel}</span>
                      <b>{service.painLevel}</b>
                    </div>
                    <div className="spec-item">
                      <span>{t.servicesPage.healingLabel}</span>
                      <b>{service.healingAndLongevity.split(",")[0]}</b>
                    </div>
                  </div>

                  <div className="service-card-actions">
                    <button
                      className="btn-card-book"
                      onClick={() => onBook(service.name)}
                    >
                      {t.servicesPage.bookBtn} <span>↗</span>
                    </button>
                    <button
                      className="btn-card-details"
                      onClick={() => navigate(`/services/${service.slug}`)}
                    >
                      {t.servicesPage.detailsBtn} →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Brow Technique Comparison Table */}
          <div style={{ marginTop: "80px" }}>
            <span className="luxury-eyebrow">
              {lang === "ta" ? "ஒப்பீட்டு வழிகாட்டி" : "Comparison Guide"}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "32px",
                color: "var(--deep-plum)",
                marginBottom: "14px",
              }}
            >
              {t.servicesPage.tableTitle}
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              {lang === "ta"
                ? "புருவ முறையைத் தேர்ந்தெடுப்பது குழப்பமாக இருக்கலாம். தோற்றம், சருமப் பொருத்தம் மற்றும் நீடிக்கும் காலத்தின் ஒப்பீடு இதோ."
                : "Choosing a brow technique can feel complicated. Here is a clear comparison by look, skin type and typical longevity."}
            </p>

            <div className="luxury-table-wrap">
              <table className="luxury-table">
                <thead>
                  <tr>
                    <th>{t.servicesPage.thTechnique}</th>
                    <th>{t.servicesPage.thLook}</th>
                    <th>{t.servicesPage.thSkin}</th>
                    <th>{t.servicesPage.thLongevity}</th>
                    <th>{lang === "ta" ? "விவரங்கள்" : "Details"}</th>
                  </tr>
                </thead>
                <tbody>
                  {BROW_COMPARISON_TABLE.map((row) => (
                    <tr key={row.technique}>
                      <td>
                        <b>{row.technique}</b>
                      </td>
                      <td>{row.look}</td>
                      <td>{row.bestSkin}</td>
                      <td>{row.longevity}</td>
                      <td>
                        <button
                          onClick={() => navigate(`/services/${row.slug}`)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--dusty-pink)",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                        >
                          {t.servicesPage.detailsBtn} →
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
  );
}

function IndividualServicePage({ service, navigate, onBook, t, lang }) {
  return (
    <div className="service-page-container">
      <section className="luxury-page-header">
        <div className="luxury-shell">
          <nav className="breadcrumb-nav">
            <a onClick={() => navigate("/")}>
              {t.individualService.breadcrumbHome}
            </a>
            <span className="breadcrumb-separator">/</span>
            <a onClick={() => navigate("/services")}>
              {t.individualService.breadcrumbServices}
            </a>
            <span className="breadcrumb-separator">/</span>
            <span>{service.name}</span>
          </nav>
          <span className="luxury-eyebrow">
            {service.category} · {t.individualService.clinicSub}
          </span>
          <h1 className="page-headline-lg">{service.headline}</h1>
          <p className="page-lead-copy">{service.intro}</p>
        </div>
      </section>

      <div className="luxury-shell" style={{ marginTop: "50px" }}>
        <div className="service-page-grid">
          {/* Main Content Column */}
          <div className="service-main-content">
            <h2>{t.individualService.whoItsFor}</h2>
            <div className="service-highlight-box">
              <b>{t.individualService.idealFor}</b> {service.idealFor}
            </div>

            <h2>{t.individualService.whatToExpect}</h2>
            <p>{service.whatToExpect}</p>

            <h2>{t.individualService.healingAndLongevity}</h2>
            <p>{service.healingAndLongevity}</p>

            <h2>{t.individualService.whoShouldWait}</h2>
            <div
              style={{
                background: "#fff5f7",
                border: "1px solid var(--border-pink)",
                padding: "18px 24px",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "var(--text-body)",
                  fontSize: "14px",
                }}
              >
                <b>{t.individualService.caution}</b> {service.notIdealIf}
              </p>
            </div>

            {/* Brow comparison matrix if brow service */}
            {service.showBrowComparison && (
              <div style={{ margin: "40px 0" }}>
                <h3>{t.servicesPage.tableTitle}</h3>
                <div className="luxury-table-wrap">
                  <table className="luxury-table">
                    <thead>
                      <tr>
                        <th>{t.servicesPage.thTechnique}</th>
                        <th>{t.servicesPage.thLook}</th>
                        <th>{t.servicesPage.thSkin}</th>
                        <th>{t.servicesPage.thLongevity}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BROW_COMPARISON_TABLE.map((row) => (
                        <tr key={row.technique}>
                          <td>
                            <b>{row.technique}</b>
                          </td>
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

            <h2>{t.individualService.ctaTitle}</h2>
            <p>
              {lang === "ta"
                ? "சிறந்த அழகு முறை என்பது உங்கள் முக அமைப்பிற்கும் வாழ்க்கை முறைக்கும் முழுமையாகப் பொருந்துவதே ஆகும். பிரௌலிசியஸில், உங்கள் முக அமைப்பை அளவிட்டு, நிறமிகளைப் பரிசோதித்து, உங்கள் ஒப்புதலுக்குப் பின்னரே சிகிச்சையைத் தொடங்குகிறோம்."
                : "The best technique is the one that suits your features, bone structure and lifestyle. At Browlicious, we map your shape, test your pigment shade and only start when you approve the design."}
            </p>
            <button
              className="btn-luxury-gold"
              onClick={() => onBook(service.name)}
              style={{ padding: "16px 32px" }}
            >
              {t.individualService.bookThisService} <span>↗</span>
            </button>
          </div>

          {/* Sticky Sidebar Info Card */}
          <aside className="service-sidebar-card">
            <div
              style={{
                height: "220px",
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "20px",
              }}
            >
              <img
                src={service.image}
                alt={service.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "22px",
                color: "var(--deep-plum)",
                marginBottom: "14px",
              }}
            >
              {service.name}
            </h3>

            <div className="sidebar-spec-row">
              <span>{lang === "ta" ? "கட்டணம்:" : "Investment:"}</span>
              <b>{service.price}</b>
            </div>
            <div className="sidebar-spec-row">
              <span>{t.individualService.durationLabel}:</span>
              <b>{service.duration}</b>
            </div>
            <div className="sidebar-spec-row">
              <span>{t.individualService.painLabel}:</span>
              <b>{service.painLevel}</b>
            </div>
            <div className="sidebar-spec-row">
              <span>{t.individualService.healingLabel}:</span>
              <b>{service.healingAndLongevity.split(",")[0]}</b>
            </div>

            <button
              className="btn-luxury-primary"
              onClick={() => onBook(service.name)}
              style={{ width: "100%", marginTop: "24px" }}
            >
              {t.individualService.bookThisService} <span>↗</span>
            </button>

            <span className="seo-meta-pill">
              <b>SEO:</b> {service.seoTitle}
            </span>
          </aside>
        </div>
      </div>
    </div>
  );
}

function JourneyAftercarePage({ navigate, onBook, t, lang }) {
  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <div>
      <section className="luxury-page-header">
        <div className="luxury-shell">
          <nav className="breadcrumb-nav">
            <a onClick={() => navigate("/")}>{t.nav.home}</a>
            <span className="breadcrumb-separator">/</span>
            <span>{t.journey.breadcrumb}</span>
          </nav>
          <span className="luxury-eyebrow">{t.journey.eyebrow}</span>
          <h1 className="page-headline-lg">
            {t.journey.titleStart}
            <em>{t.journey.titleEm}</em>
          </h1>
          <p className="page-lead-copy">{t.journey.lead}</p>
        </div>
      </section>

      {/* 7-Step Journey */}
      <section
        style={{
          padding: "80px 0",
          background: "#fff",
          borderBottom: "1px solid var(--border-line)",
        }}
      >
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">{t.journey.stagesEyebrow}</span>
            <h2 className="luxury-title">{t.journey.stagesTitle}</h2>
            <p className="luxury-description">{t.journey.stagesDesc}</p>
          </div>

          <div className="journey-cards-grid">
            {CLIENT_JOURNEY_STEPS.map((step) => (
              <div
                key={step.step}
                className="protocol-box"
                style={{ padding: "24px" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "24px",
                    color: "var(--gold)",
                    fontWeight: "bold",
                  }}
                >
                  {step.step}
                </span>
                <h4
                  style={{
                    fontSize: "18px",
                    color: "var(--deep-plum)",
                    margin: "8px 0",
                  }}
                >
                  {step.title}
                </h4>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aftercare Protocol */}
      <section
        style={{
          padding: "80px 0",
          background: "var(--sand-bg)",
          borderBottom: "1px solid var(--border-pink)",
        }}
      >
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">{t.journey.aftercareEyebrow}</span>
            <h2 className="luxury-title">{t.journey.aftercareTitle}</h2>
            <p className="luxury-description">{t.journey.aftercareDesc}</p>
          </div>

          <div className="aftercare-grid-2col">
            <div className="credentials-card-box">
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "22px",
                  color: "var(--deep-plum)",
                  marginBottom: "16px",
                }}
              >
                {t.journey.firstDaysTitle}
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  fontSize: "14px",
                  color: "var(--text-body)",
                }}
              >
                {lang === "ta" ? (
                  <>
                    <li>
                      ✓ சிகிச்சை பெற்ற பகுதியை சுத்தமாகவும் உலர்வாகவும் வைத்திருக்கவும்.
                      எப்போதும் மென்மையாக ஒத்தி எடுக்கவும், தேய்க்க வேண்டாம்.
                    </li>
                    <li>
                      ✓ நாங்கள் பரிந்துரைக்கும் மெல்லிய மருத்துவ பாம் மட்டுமே பூசவும்.
                    </li>
                    <li>
                      ✓ மேக்கப், நீராவி, சானா, நீச்சல் மற்றும் கடுமையான உடற்பயிற்சிகளைத்
                      தவிர்க்கவும்.
                    </li>
                    <li>
                      ✓ நேரடி வெயிலைத் தவிர்க்கவும். குணமாகிய பின் தினமும் சன்ஸ்கிரீன்
                      (SPF) பயன்படுத்தவும்.
                    </li>
                    <li>
                      ✓ செதில்களைக் கிள்ளவோ அல்லது உரிக்கவோ வேண்டாம். அவை இயற்கையாக
                      உதிரட்டும்.
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      ✓ Keep the area clean and dry. Gently dab, never rub.
                    </li>
                    <li>
                      ✓ Apply only the thin layer of medical balm we recommend.
                    </li>
                    <li>
                      ✓ Skip makeup, steam, saunas, swimming and heavy workouts.
                    </li>
                    <li>
                      ✓ Avoid direct sun and tanning. Use SPF once healed.
                    </li>
                    <li>
                      ✓ Do not pick, scratch or peel. Let flakes fall off
                      naturally.
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="credentials-card-box">
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "22px",
                  color: "var(--deep-plum)",
                  marginBottom: "16px",
                }}
              >
                {t.journey.longTermTitle}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-body)",
                  lineHeight: "1.7",
                  marginBottom: "16px",
                }}
              >
                {t.journey.longTermDesc}
              </p>
              <h4
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "18px",
                  color: "var(--deep-plum)",
                  marginTop: "20px",
                  marginBottom: "8px",
                }}
              >
                {t.journey.isForMeTitle}
              </h4>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  lineHeight: "1.6",
                }}
              >
                {t.journey.isForMeDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div className="luxury-shell" style={{ maxWidth: "820px" }}>
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">{t.journey.faqEyebrow}</span>
            <h2 className="luxury-title">{t.journey.faqTitle}</h2>
          </div>

          <div>
            {CLINIC_FAQS.map((faq, idx) => (
              <div key={idx} className="faq-accordion-item">
                <button
                  className="faq-question-btn"
                  onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
                >
                  <span>{faq.q}</span>
                  <span className="faq-toggle-icon">
                    {activeFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="faq-answer-content">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button
              className="btn-luxury-primary"
              onClick={() => onBook("General Enquiry")}
            >
              {lang === "ta"
                ? "உங்கள் கேள்விகளுடன் இலவச ஆலோசனை பெறவும் ↗"
                : "Bring Your Questions — Book a Free Consultation ↗"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function AcademyPage({ navigate, onBook, t, lang }) {
  return (
    <div>
      <section className="luxury-page-header">
        <div className="luxury-shell">
          <nav className="breadcrumb-nav">
            <a onClick={() => navigate("/")}>{t.nav.home}</a>
            <span className="breadcrumb-separator">/</span>
            <span>{t.academy.breadcrumb}</span>
          </nav>
          <span className="luxury-eyebrow">{t.academy.eyebrow}</span>
          <h1 className="page-headline-lg">
            {t.academy.titleStart}
            <em>{t.academy.titleEm}</em>
          </h1>
          <p className="page-lead-copy">{t.academy.lead}</p>
        </div>
      </section>

      {/* Clinical Standards */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">{t.academy.standardsEyebrow}</span>
            <h2 className="luxury-title">{t.academy.standardsTitle}</h2>
          </div>

          <div style={{ maxWidth: "860px", margin: "0 auto 40px" }}>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.8",
                color: "var(--text-body)",
                marginBottom: "20px",
              }}
            >
              {t.academy.standardsP1}
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.8",
                color: "var(--text-body)",
              }}
            >
              {t.academy.standardsP2}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <a
              href={CLINIC_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-luxury-gold"
            >
              {t.academy.btnProspectus}
            </a>
            <button
              className="btn-luxury-outline"
              onClick={() => onBook("Academy Discovery Call")}
            >
              {t.academy.btnDiscovery} <span>↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section
        style={{
          padding: "90px 0",
          background: "var(--sand-bg)",
          borderTop: "1px solid var(--border-pink)",
        }}
      >
        <div className="luxury-shell">
          <div className="luxury-section-head">
            <span className="luxury-eyebrow">{t.academy.whyTrainEyebrow}</span>
            <h2 className="luxury-title">{t.academy.coursesTitle}</h2>
          </div>

          <div className="services-grid-3col">
            {ACADEMY_COURSES.map((course) => (
              <div key={course.slug} className="service-card-luxury">
                <div className="service-card-img-wrap">
                  <img src={course.image} alt={course.name} />
                  <span className="service-price-tag">{course.investment}</span>
                </div>
                <div className="service-card-body">
                  <span className="service-category-tag">
                    {course.duration}
                  </span>
                  <h3 className="service-card-title">{course.name}</h3>
                  <p className="service-card-desc">{course.target}</p>

                  <div
                    style={{
                      background: "var(--dusty-pink-subtle)",
                      padding: "14px",
                      borderRadius: "8px",
                      margin: "16px 0",
                      fontSize: "12px",
                      color: "var(--deep-plum)",
                    }}
                  >
                    <b>{lang === "ta" ? "பாடத்திட்டம்:" : "Curriculum:"}</b>{" "}
                    {course.curriculum}
                  </div>

                  <div className="service-card-actions">
                    <button
                      className="btn-card-book"
                      onClick={() => onBook(`Course: ${course.name}`)}
                    >
                      {t.academy.applyNow}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="protocol-box"
            style={{
              maxWidth: "800px",
              margin: "60px auto 0",
              padding: "30px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "22px",
                color: "var(--deep-plum)",
                marginBottom: "10px",
              }}
            >
              {t.academy.isForMeTitle}
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-body)",
                lineHeight: "1.7",
              }}
            >
              {t.academy.isForMeDesc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function BlogPage({ navigate, onBook, t, lang }) {
  const [activeArticle, setActiveArticle] = useState(1);

  return (
    <div>
      <section className="luxury-page-header">
        <div className="luxury-shell">
          <nav className="breadcrumb-nav">
            <a onClick={() => navigate("/")}>{t.nav.home}</a>
            <span className="breadcrumb-separator">/</span>
            <span>{t.blogPage.breadcrumb}</span>
          </nav>
          <span className="luxury-eyebrow">{t.blogPage.eyebrow}</span>
          <h1 className="page-headline-lg">
            {t.blogPage.titleStart}
            <em>{t.blogPage.titleEm}</em>
          </h1>
          <p className="page-lead-copy">{t.blogPage.lead}</p>
        </div>
      </section>

      {/* Article Selector Tabs */}
      <section style={{ padding: "60px 0", background: "#fff" }}>
        <div className="luxury-shell">
          <div className="ba-filter-pills" style={{ marginBottom: "30px" }}>
            <button
              className={`ba-pill ${activeArticle === 1 ? "active" : ""}`}
              onClick={() => setActiveArticle(1)}
            >
              {t.blogPage.tab1}
            </button>
            <button
              className={`ba-pill ${activeArticle === 2 ? "active" : ""}`}
              onClick={() => setActiveArticle(2)}
            >
              {t.blogPage.tab2}
            </button>
            <button
              className={`ba-pill ${activeArticle === 3 ? "active" : ""}`}
              onClick={() => setActiveArticle(3)}
            >
              {t.blogPage.tab3}
            </button>
          </div>

          {/* Article 1 Content */}
          {activeArticle === 1 && (
            <article className="article-reading-container">
              <div className="article-meta-bar">
                <span className="tag">
                  {lang === "ta" ? "வழிகாட்டி" : "Client Guide"}
                </span>
                <span>By Durga · Browlicious Chennai</span>
                <span>Keyword: microblading vs ombre brows</span>
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "36px",
                  color: "var(--deep-plum)",
                  marginBottom: "16px",
                }}
              >
                Microblading vs Ombre vs Combination Brows
              </h1>

              <div className="service-highlight-box">
                <b>Meta Description:</b> Not sure which PMU brow technique to
                choose? Compare microblading, ombre and combination brows by
                skin type, look and longevity.
              </div>

              <p>
                Choosing a brow technique can feel like choosing between three
                languages you do not speak. Here is the plain-English version.
              </p>

              <h2>1. Microblading</h2>
              <p>
                Microblading creates fine, hair-like strokes with a handheld
                blade. It is ideal for normal to dry skin and gives the most
                natural, subtle look. Longevity is typically 12 to 18 months.
              </p>

              <h2>2. Ombre / Powder Brows</h2>
              <p>
                Applied with a digital machine in soft pixelated layers, ombre
                brows look like softly filled brow powder. Excellent for oily
                and mature skin types. Lasts 2 to 3 years.
              </p>

              <h2>3. Combination Brows</h2>
              <p>
                Hair strokes at the front with soft shading through the body and
                tail. The most versatile technique for clients wanting natural
                definition with density.
              </p>

              <div style={{ marginTop: "40px" }}>
                <button
                  className="btn-luxury-gold"
                  onClick={() => onBook("Brow Consultation")}
                >
                  {t.hero.btnConsultation} <span>↗</span>
                </button>
              </div>
            </article>
          )}

          {/* Article 2 Content */}
          {activeArticle === 2 && (
            <article className="article-reading-container">
              <div className="article-meta-bar">
                <span className="tag">
                  {lang === "ta" ? "தொழில் வழிகாட்டி" : "Career Guide"}
                </span>
                <span>By Durga · Browlicious Chennai</span>
                <span>Keyword: how to become a pmu artist in chennai</span>
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "36px",
                  color: "var(--deep-plum)",
                  marginBottom: "16px",
                }}
              >
                How to Become a PMU Artist in Chennai: Step-by-Step
              </h1>

              <p>
                Permanent makeup is one of the fastest-growing aesthetics
                careers in India. Here is Durga's realistic roadmap to entering
                the industry safely and successfully.
              </p>

              <h2>Step 1: Build Foundational Bloodborne Pathogen Knowledge</h2>
              <p>
                Clinical hygiene, sterilization, cross-contamination prevention
                and medical consultation ethics come before drawing hair
                strokes.
              </p>

              <h2>Step 2: Train with Live Models Under Direct Supervision</h2>
              <p>
                Latex skin practice is only the first step. Browlicious Academy
                ensures every student works on verified live human models under
                the direct eye of master artists.
              </p>

              <h2>Step 3: Invest in High-Grade Medical Pigments & Needles</h2>
              <p>
                Cheap pigments turn orange or blue. We teach pigment chemistry,
                undertone matching and EU-compliant pigment selection.
              </p>

              <div style={{ marginTop: "40px" }}>
                <button
                  className="btn-luxury-gold"
                  onClick={() => onBook("Academy Enquiry")}
                >
                  {t.academy.btnDiscovery} <span>↗</span>
                </button>
              </div>
            </article>
          )}

          {/* Article 3 Content */}
          {activeArticle === 3 && (
            <div className="editorial-plan-container">
              <span className="luxury-eyebrow">Local SEO Strategy</span>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "28px",
                  color: "var(--deep-plum)",
                  marginBottom: "14px",
                }}
              >
                12-Week Blog Editorial Calendar
              </h2>
              <div className="luxury-table-wrap">
                <table className="luxury-table">
                  <thead>
                    <tr>
                      <th>Week</th>
                      <th>Topic</th>
                      <th>Target Chennai Keyword</th>
                      <th>Intent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BLOG_EDITORIAL_PLAN.map((plan) => (
                      <tr key={plan.week}>
                        <td>
                          <b>Week {plan.week}</b>
                        </td>
                        <td>{plan.topic}</td>
                        <td>
                          <code>{plan.kw}</code>
                        </td>
                        <td>
                          <span className="service-category-tag">
                            {plan.intent}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ContactPage({ navigate, onBook, t, lang }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    treatment: "Microblading",
    preferredDate: "Tomorrow",
    message: "",
    consent: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.consent) {
      alert(
        lang === "ta"
          ? "அனைத்து தேவையான விவரங்களை நிரப்பி ஒப்புதல் அளியுங்கள்."
          : "Please fill out all required fields and accept the consent.",
      );
      return;
    }

    const text = [
      "✨ *NEW CONTACT ENQUIRY - BROWLICIOUS CHENNAI*",
      "---------------------------------------",
      `👤 *Name:* ${formData.name}`,
      `📞 *Mobile:* ${formData.phone}`,
      `📧 *Email:* ${formData.email || "Not provided"}`,
      `💄 *Service:* ${formData.treatment}`,
      `📅 *Preferred Date:* ${formData.preferredDate}`,
      `📝 *Note:* ${formData.message || "None"}`,
      "---------------------------------------",
      "Transmitted from Browlicious Website.",
    ].join("\n");

    window.open(
      `${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
    setSubmitted(true);
  };

  return (
    <div>
      <section className="luxury-page-header">
        <div className="luxury-shell">
          <nav className="breadcrumb-nav">
            <a onClick={() => navigate("/")}>{t.nav.home}</a>
            <span className="breadcrumb-separator">/</span>
            <span>{t.contact.breadcrumb}</span>
          </nav>
          <span className="luxury-eyebrow">{t.contact.eyebrow}</span>
          <h1 className="page-headline-lg">
            {t.contact.titleStart}
            <em>{t.contact.titleEm}</em>
          </h1>
          <p className="page-lead-copy">{t.contact.lead}</p>
        </div>
      </section>

      <section style={{ padding: "80px 0 100px", background: "#fff" }}>
        <div className="luxury-shell">
          <div className="contact-grid-2col">
            {/* Direct Info */}
            <div className="credentials-card-box">
              <span className="luxury-eyebrow">{t.contact.directEyebrow}</span>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "30px",
                  color: "var(--deep-plum)",
                  marginBottom: "24px",
                }}
              >
                {t.contact.directTitle}
              </h2>

              <div style={{ marginBottom: "20px" }}>
                <b>{t.contact.addressLabel}</b>
                <p style={{ margin: "4px 0 8px", color: "var(--text-body)" }}>
                  Browlicious PMU Clinic
                  <br />
                  {CLINIC_INFO.address}
                </p>
                <a
                  href={CLINIC_INFO.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "var(--dusty-pink)",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                >
                  {t.contact.mapsLink}
                </a>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <b>{t.contact.phoneLabel}</b>
                <p style={{ margin: "4px 0 8px" }}>
                  <a
                    href={`tel:${CLINIC_INFO.phoneCall}`}
                    style={{
                      color: "var(--deep-plum)",
                      fontSize: "16px",
                      fontWeight: "700",
                      textDecoration: "none",
                    }}
                  >
                    {CLINIC_INFO.phone}
                  </a>
                </p>
                <a
                  href={CLINIC_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "var(--dusty-pink)",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                >
                  {t.contact.waLink}
                </a>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <b>{t.contact.emailLabel}</b>
                <p style={{ margin: "4px 0", color: "var(--text-body)" }}>
                  {CLINIC_INFO.email}
                </p>
              </div>

              <div>
                <b>{t.contact.hoursLabel}</b>
                <p style={{ margin: "4px 0", color: "var(--text-body)" }}>
                  {lang === "ta"
                    ? "திங்கள் - ஞாயிறு: 10:00 AM – 8:00 PM (முன்பதிவு மட்டுமே)"
                    : CLINIC_INFO.hours}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="credentials-card-box">
              <span className="luxury-eyebrow">
                {lang === "ta" ? "நேரடி முன்பதிவு" : "Direct Enquiry"}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "30px",
                  color: "var(--deep-plum)",
                  marginBottom: "8px",
                }}
              >
                {t.contact.formTitle}
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  marginBottom: "24px",
                }}
              >
                {t.contact.formDesc}
              </p>

              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div
                    style={{
                      fontSize: "48px",
                      color: "#25d366",
                      marginBottom: "12px",
                    }}
                  >
                    ✓
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "24px",
                      color: "var(--deep-plum)",
                    }}
                  >
                    {t.contact.thankYouTitle}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-muted)",
                      marginTop: "8px",
                    }}
                  >
                    {t.contact.thankYouDesc}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="booking-form-row">
                    <div className="form-group">
                      <label>{t.contact.nameLabel}</label>
                      <input
                        type="text"
                        required
                        placeholder={
                          lang === "ta" ? "உங்கள் பெயர்" : "Your full name"
                        }
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.contact.phoneLabelInput}</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 97103 XXXXX"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: "16px" }}>
                    <label>{t.contact.emailLabelInput}</label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="booking-form-row">
                    <div className="form-group">
                      <label>{t.contact.treatmentLabel}</label>
                      <select
                        value={formData.treatment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            treatment: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "1.5px solid var(--border-line)",
                          borderRadius: "8px",
                        }}
                      >
                        {Object.values(INDIVIDUAL_SERVICES).map((s) => (
                          <option key={s.slug} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                        <option value="Academy Course Enquiry">
                          {lang === "ta"
                            ? "அகாடமி பயிற்சி விவரம்"
                            : "Academy Course Enquiry"}
                        </option>
                        <option value="General Free Consultation">
                          {lang === "ta"
                            ? "இலவச ஆலோசனைக் கட்டம்"
                            : "General Free Consultation"}
                        </option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>{t.contact.dateLabel}</label>
                      <select
                        value={formData.preferredDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredDate: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "1.5px solid var(--border-line)",
                          borderRadius: "8px",
                        }}
                      >
                        <option value="Today">
                          {lang === "ta" ? "இன்று" : "Today"}
                        </option>
                        <option value="Tomorrow">
                          {lang === "ta" ? "நாளை" : "Tomorrow"}
                        </option>
                        <option value="This Weekend">
                          {lang === "ta" ? "இந்த வார இறுதி" : "This Weekend"}
                        </option>
                        <option value="Next Week">
                          {lang === "ta" ? "அடுத்த வாரம்" : "Next Week"}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: "16px" }}>
                    <label>{t.contact.notesLabel}</label>
                    <textarea
                      rows={3}
                      placeholder={
                        lang === "ta"
                          ? "உங்கள் கேள்விகள் அல்லது விருப்பங்களை இங்கு பகிரவும்..."
                          : "Share anything about your brows, skin history or training goals..."
                      }
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "24px",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="consent"
                      required
                      checked={formData.consent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          consent: e.target.checked,
                        })
                      }
                      style={{ marginTop: "4px" }}
                    />
                    <label
                      htmlFor="consent"
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        lineHeight: "1.5",
                      }}
                    >
                      {lang === "ta"
                        ? "கிளினிக் சந்திப்பை உறுதிப்படுத்த வாட்ஸ்அப் அல்லது தொலைபேசி மூலம் என்னை தொடர்பு கொள்ள சம்மதிக்கிறேன்."
                        : "I consent to Browlicious contacting me via WhatsApp or phone to confirm appointment availability and answer questions."}
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn-luxury-gold"
                    style={{ width: "100%", padding: "14px" }}
                  >
                    {t.contact.btnSubmit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

/* ── Colors matching KH-UIA original ── */
const C = {
  blue: '#0066B3', blueDark: '#004A82', blueDarker: '#002E5A', blueLight: '#E8F4FD',
  gold: '#D4A84B', white: '#FFFFFF', offWhite: '#F8F9FA',
  g100: '#F1F3F5', g200: '#E9ECEF', g300: '#DEE2E6',
  g500: '#6C757D', g700: '#495057', g900: '#212529',
  red: '#CC3333',
}
const ff = "'Open Sans', sans-serif"
const fm = "'Montserrat', sans-serif"

/* ── Animated counter ── */
function Counter({ end, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const ran = useRef(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true
        const t0 = Date.now()
        const tick = () => { const p = Math.min((Date.now() - t0) / 2000, 1); setVal(Math.floor(p * end)); if (p < 1) requestAnimationFrame(tick) }
        tick()
      }
    }, { threshold: 0.3 })
    o.observe(el); return () => o.disconnect()
  }, [end])
  return <span ref={ref}>{val.toLocaleString('de-DE')}{suffix}</span>
}

/* ── Reveal on scroll ── */
function R({ children, delay = 0, style = {} }) {
  const ref = useRef(null); const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect() } }, { threshold: 0.08 })
    o.observe(el); return () => o.disconnect()
  }, [])
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(28px)', transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`, ...style }}>{children}</div>
}

/* ══════════════ TOPBAR ══════════════ */
function TopBar() {
  return (
    <div style={{ background: C.blueDarker, color: 'rgba(255,255,255,.8)', fontSize: 12, padding: '8px 0', letterSpacing: '.3px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontFamily: ff }}>Keren Hajessod — Vereinigte Israel Aktion Österreich | Wien</span>
        <span style={{ fontFamily: ff }}>
          <a href="mailto:kh-austria@kh-uia.org.il" style={{ color: 'rgba(255,255,255,.9)', textDecoration: 'none' }}>kh-austria@kh-uia.org.il</a>
          <span style={{ margin: '0 10px', opacity: .4 }}>|</span>
          <a href="tel:+431535536630" style={{ color: 'rgba(255,255,255,.9)', textDecoration: 'none' }}>+43-1-535 536 630</a>
        </span>
      </div>
    </div>
  )
}

/* ══════════════ NAVBAR ══════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const go = useCallback((id) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }, [])
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h)
  }, [])

  const linkStyle = { fontFamily: fm, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: C.g700, background: 'none', border: 'none', padding: '10px 12px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color .2s' }

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 1000, background: '#fff', borderBottom: `1px solid ${C.g200}`, boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,.07)' : 'none', transition: 'box-shadow .3s' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {/* Logo */}
        <div onClick={() => go('top')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'serif' }}>קה</div>
          <div>
            <div style={{ fontFamily: fm, fontWeight: 700, fontSize: 13, color: C.blueDark, letterSpacing: .5, lineHeight: 1.2 }}>KEREN HAJESSOD</div>
            <div style={{ fontFamily: fm, fontSize: 9, color: C.gold, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>Österreich</div>
          </div>
        </div>
        {/* Desktop links */}
        <div className="kh-desk-nav" style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {[['top','Startseite'],['impact','Wirkung'],['shavim','Shavim'],['projects','Projekte'],['about','Über Uns'],['news','Aktuelles']].map(([id,l]) => (
            <button key={id} style={linkStyle} onClick={() => go(id)} onMouseEnter={e => e.target.style.color = C.blue} onMouseLeave={e => e.target.style.color = C.g700}>{l}</button>
          ))}
        </div>
        {/* Donate CTA */}
        <button className="kh-desk-nav" onClick={() => go('donate')} style={{ fontFamily: fm, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, background: C.blue, color: '#fff', border: 'none', borderRadius: 4, padding: '11px 24px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background .2s' }} onMouseEnter={e => e.target.style.background = C.blueDark} onMouseLeave={e => e.target.style.background = C.blue}>Jetzt Spenden</button>
        {/* Hamburger */}
        <button className="kh-mob-btn" onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', color: C.g700, cursor: 'pointer', padding: 8 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">{open ? <path d="M18 6L6 18M6 6l12 12" /> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}</svg>
        </button>
      </div>
      {/* Mobile */}
      {open && (
        <div className="kh-mob-menu" style={{ background: '#fff', borderTop: `1px solid ${C.g200}`, padding: '12px 24px 20px' }}>
          {[['top','Startseite'],['impact','Wirkung'],['shavim','Shavim'],['projects','Projekte'],['about','Über Uns'],['news','Aktuelles']].map(([id,l]) => (
            <button key={id} onClick={() => go(id)} style={{ display: 'block', width: '100%', textAlign: 'left', fontFamily: fm, fontWeight: 600, fontSize: 14, textTransform: 'uppercase', background: 'none', border: 'none', color: C.g700, padding: '12px 0', cursor: 'pointer', borderBottom: `1px solid ${C.g100}` }}>{l}</button>
          ))}
          <button onClick={() => go('donate')} style={{ display: 'block', width: '100%', textAlign: 'center', fontFamily: fm, fontWeight: 700, fontSize: 14, textTransform: 'uppercase', background: C.blue, color: '#fff', border: 'none', borderRadius: 4, padding: 14, cursor: 'pointer', marginTop: 12 }}>JETZT SPENDEN</button>
        </div>
      )}
    </nav>
  )
}

/* ══════════════ HERO ══════════════ */
function Hero() {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <section id="top" style={{ position: 'relative', minHeight: '82vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#002E5A' }}>
      {/* Vimeo video background like kh-uia.org.il */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        <iframe
          src="https://player.vimeo.com/video/903567693?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
          style={{ position: 'absolute', top: '50%', left: '50%', width: '177.78vh', minWidth: '100%', height: '100vh', minHeight: '100%', transform: 'translate(-50%,-50%)', border: 'none' }}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
      {/* Light overlay for text readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,30,60,.35)', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 680, padding: '130px 24px 110px', marginLeft: 'max(24px, calc((100vw - 1200px)/2 + 24px))' }}>
        <R><div style={{ display: 'inline-block', background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 50, padding: '8px 20px', fontFamily: fm, fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: 1, marginBottom: 24 }}>🇦🇹 Österreich — Wien</div></R>
        <R delay={.12}><h1 style={{ fontFamily: fm, fontWeight: 800, fontSize: 'clamp(34px,6vw,62px)', lineHeight: 1.1, color: '#fff', marginBottom: 22 }}>Für die Menschen<br />Israels</h1></R>
        <R delay={.25}><p style={{ fontFamily: ff, fontSize: 'clamp(15px,2vw,18px)', lineHeight: 1.75, color: 'rgba(255,255,255,.85)', marginBottom: 32, maxWidth: 540 }}>Keren Hajessod – Vereinigte Israel Aktion ist seit 1920 die weltweit führende Spendenorganisation für den Staat Israel und seine Menschen.</p></R>
        <R delay={.38}><div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <button onClick={() => go('donate')} style={{ fontFamily: fm, fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, background: C.gold, color: '#fff', border: 'none', borderRadius: 4, padding: '15px 36px', cursor: 'pointer', transition: 'background .2s' }}>Jetzt Spenden</button>
          <button onClick={() => go('shavim')} style={{ fontFamily: fm, fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,.45)', borderRadius: 4, padding: '13px 32px', cursor: 'pointer', transition: 'all .2s' }}>Projekt Shavim</button>
        </div></R>
      </div>
      {/* Emergency banner */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4, background: C.red, color: '#fff', padding: '13px 24px', fontSize: 14, fontFamily: ff }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <strong>SHAVIM — Hilfe für Reservisten:</strong>&nbsp;Unterstützen Sie die psychologische Betreuung israelischer Soldaten.&nbsp;
          <button onClick={() => go('shavim')} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', fontSize: 14, fontFamily: ff }}>Mehr erfahren →</button>
        </div>
      </div>
    </section>
  )
}

/* ══════════════ IMPACT NUMBERS ══════════════ */
function Impact() {
  return (
    <section id="impact" style={{ background: C.blueDarker, padding: '56px 0', color: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <R><h2 style={{ fontFamily: fm, fontWeight: 700, fontSize: 'clamp(22px,3vw,32px)', color: '#fff', textAlign: 'center', marginBottom: 32 }}>Ihre Spende wirkt</h2></R>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 28 }}>
          {[{ n: 18000, s: '+', l: 'Olim 2025 begrüßt', i: '✈️' },{ n: 45, s: '', l: 'Kampagnen weltweit', i: '🌍' },{ n: 900, s: '+', l: 'Gemeinden gegründet', i: '🏘️' },{ n: 105, s: '', l: 'Jahre im Dienst', i: '🕊️' }].map((s, i) => (
            <R key={i} delay={i * .1}><div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 34, marginBottom: 6 }}>{s.i}</div>
              <div style={{ fontFamily: fm, fontWeight: 800, fontSize: 'clamp(26px,4vw,44px)', color: C.gold }}><Counter end={s.n} suffix={s.s} /></div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', marginTop: 4 }}>{s.l}</div>
            </div></R>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════ SHAVIM ══════════════ */
function Shavim() {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <section id="shavim" style={{ padding: '80px 0', background: C.offWhite }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 44, alignItems: 'center' }}>
        <R>
          <div style={{ height: 440, borderRadius: 8, backgroundImage: 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 18, left: 18, background: C.blue, color: '#fff', fontFamily: fm, fontWeight: 700, fontSize: 10, letterSpacing: 2, padding: '7px 14px', borderRadius: 4 }}>HAUPTPROJEKT ÖSTERREICH</div>
          </div>
        </R>
        <R delay={.12}>
          <div style={{ fontFamily: fm, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: C.blue, marginBottom: 10 }}>Projekt Shavim — Zurück nach Hause</div>
          <h2 style={{ fontFamily: fm, fontWeight: 700, fontSize: 'clamp(22px,3.5vw,32px)', color: C.g900, marginBottom: 18, lineHeight: 1.25 }}>Psychologische Unterstützung für israelische Reservisten</h2>
          <p style={{ fontFamily: ff, fontSize: 15, lineHeight: 1.8, color: C.g700, marginBottom: 14 }}>Der längste Krieg in der Geschichte Israels hat nicht nur physische Opfer gefordert. Über <strong style={{ color: C.g900 }}>50.000 Soldaten</strong> werden bis 2030 voraussichtlich an PTBS leiden.</p>
          <p style={{ fontFamily: ff, fontSize: 15, lineHeight: 1.8, color: C.g700, marginBottom: 20 }}>Shavim stärkt die mentale Resilienz von Reservisten und ihren Familien durch evidenzbasierte Gruppentherapie, Naturaktivitäten und ganzheitliche Methoden.</p>
          <div style={{ display: 'flex', gap: 18, margin: '22px 0', flexWrap: 'wrap' }}>
            {[['93%','Reintegration'],['89%','Zurück zur Arbeit'],['98%','Zufriedenheit']].map(([n,l],i) => (
              <div key={i} style={{ textAlign: 'center', flex: 1, minWidth: 80 }}>
                <div style={{ fontFamily: fm, fontWeight: 800, fontSize: 30, color: C.blue }}>{n}</div>
                <div style={{ fontSize: 11, color: C.g500, letterSpacing: .3 }}>{l}</div>
              </div>
            ))}
          </div>
          <blockquote style={{ borderLeft: `4px solid ${C.gold}`, padding: '14px 0 14px 18px', margin: '22px 0', fontStyle: 'italic', fontSize: 16, color: C.g900, lineHeight: 1.55, fontFamily: ff }}>
            „Shavim hat mein Leben gerettet."
            <cite style={{ fontStyle: 'normal', fontSize: 13, color: C.gold, display: 'block', marginTop: 8 }}>— Rafael, 32, Reservist, nach 320 Tagen in Gaza</cite>
          </blockquote>
          <button onClick={() => go('donate')} style={{ fontFamily: fm, fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, background: C.blue, color: '#fff', border: 'none', borderRadius: 4, padding: '14px 32px', cursor: 'pointer' }}>Für Shavim spenden</button>
        </R>
      </div>
    </section>
  )
}

/* ══════════════ PROJECTS ══════════════ */
function Projects() {
  const items = [
    { t: 'Alija & Absorption', d: 'Unterstützung für Juden weltweit bei der Einwanderung und Integration in die israelische Gesellschaft.', img: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=600&q=80', c: '#0066B3' },
    { t: 'Amigour – Wohnen im Alter', d: 'Bezahlbarer Wohnraum für ältere Bürger Israels, darunter Holocaust-Überlebende.', img: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&q=80', c: '#2E8B57' },
    { t: 'Jugenddörfer', d: 'Sichere Bildungseinrichtungen für gefährdete Jugendliche mit professioneller Betreuung.', img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80', c: '#8B4C9E' },
    { t: 'Youth Futures', d: 'Mentoring für benachteiligte Kinder in Israels Peripherie — für gleiche Chancen.', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80', c: '#E07C24' },
    { t: 'NET@ High-Tech', d: 'Technologie-Ausbildung als Brücke in Israels High-Tech-Sektor.', img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80', c: '#2CAAA8' },
    { t: 'Nothilfe & Sicherheit', d: 'Sofortige humanitäre Unterstützung in Krisenzeiten.', img: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80', c: '#CC3333' },
  ]
  return (
    <section id="projects" style={{ padding: '80px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <R>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontFamily: fm, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: C.blue, marginBottom: 10 }}>Unsere Projekte verändern Leben</div>
            <h2 style={{ fontFamily: fm, fontWeight: 700, fontSize: 'clamp(24px,4vw,36px)', color: C.g900, marginBottom: 14 }}>So wirkt Ihre Spende</h2>
            <p style={{ fontFamily: ff, fontSize: 16, color: C.g500, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>Keren Hajessod unterstützt nationale Prioritäten für die Menschen Israels.</p>
          </div>
        </R>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 22 }}>
          {items.map((p, i) => (
            <R key={i} delay={i * .07}>
              <div style={{ borderRadius: 8, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,.06)', transition: 'transform .3s, box-shadow .3s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,.06)' }}>
                <div style={{ height: 190, backgroundImage: `url(${p.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(transparent 35%, ${p.c}dd 100%)` }} />
                  <h3 style={{ position: 'absolute', bottom: 14, left: 16, right: 16, fontFamily: fm, fontWeight: 700, fontSize: 17, color: '#fff', zIndex: 2 }}>{p.t}</h3>
                </div>
                <div style={{ padding: '18px 18px 20px' }}>
                  <p style={{ fontFamily: ff, fontSize: 14, lineHeight: 1.7, color: C.g500, marginBottom: 10 }}>{p.d}</p>
                  <span style={{ fontFamily: fm, fontSize: 12, fontWeight: 700, color: p.c, cursor: 'pointer' }}>Mehr erfahren →</span>
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════ VIDEO ══════════════ */
function Video() {
  return (
    <section style={{ padding: '80px 0', background: C.g100 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <R><div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: fm, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: C.blue, marginBottom: 10 }}>Sehen Sie unsere Wirkung</div>
          <h2 style={{ fontFamily: fm, fontWeight: 700, fontSize: 'clamp(24px,4vw,34px)', color: C.g900 }}>So haben Sie geholfen</h2>
        </div></R>
        <R delay={.12}><div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 8, overflow: 'hidden', boxShadow: '0 8px 36px rgba(0,0,0,.1)', background: '#000' }}>
          <iframe
            src="https://player.vimeo.com/video/903567693?byline=0&title=0&portrait=0&loop=1"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Keren Hayesod — For The People of Israel"
          />
        </div></R>
      </div>
    </section>
  )
}

/* ══════════════ ABOUT ══════════════ */
function About() {
  return (
    <section id="about" style={{ padding: '80px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 44, alignItems: 'start' }}>
        <R>
          <div style={{ fontFamily: fm, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: C.blue, marginBottom: 10 }}>Über Keren Hajessod Österreich</div>
          <h2 style={{ fontFamily: fm, fontWeight: 700, fontSize: 'clamp(22px,3.5vw,32px)', color: C.g900, marginBottom: 18, lineHeight: 1.25 }}>Eine Brücke zwischen Wien und Israel</h2>
          <p style={{ fontFamily: ff, fontSize: 15, lineHeight: 1.8, color: C.g700, marginBottom: 14 }}>Keren Hajessod – Vereinigte Israel Aktion wurde 1920 auf dem Zionistischen Weltkongress in London gegründet und ist eine der vier nationalen Institutionen des Staates Israel.</p>
          <p style={{ fontFamily: ff, fontSize: 15, lineHeight: 1.8, color: C.g700, marginBottom: 14 }}>Als österreichische Vertretung setzen wir uns für die nationalen Prioritäten Israels ein: Alija, Stärkung benachteiligter Gemeinden, Jugendförderung und Nothilfe.</p>
          <p style={{ fontFamily: ff, fontSize: 15, lineHeight: 1.8, color: C.g700, marginBottom: 24 }}>Aktuell ist <strong style={{ color: C.blue }}>Shavim</strong> — die psychologische Betreuung von Reservisten — unser Schwerpunkt in Österreich.</p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['1920','Gegründet'],['45+','Länder'],['900+','Gemeinden']].map(([n,l],i) => (
              <div key={i} style={{ textAlign: 'center', flex: 1, minWidth: 75 }}>
                <div style={{ fontFamily: fm, fontWeight: 800, fontSize: 26, color: C.blue }}>{n}</div>
                <div style={{ fontSize: 11, color: C.g500 }}>{l}</div>
              </div>
            ))}
          </div>
        </R>
        <R delay={.12}>
          <div style={{ height: 300, borderRadius: 8, backgroundImage: 'url(https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div style={{ marginTop: 18, background: C.blueLight, borderRadius: 8, padding: 22, borderLeft: `4px solid ${C.blue}` }}>
            <h4 style={{ fontFamily: fm, fontSize: 15, color: C.blueDark, marginBottom: 10 }}>Kontakt Wien</h4>
            <p style={{ fontFamily: ff, fontSize: 14, lineHeight: 1.7, color: C.g700, marginBottom: 6 }}><strong style={{ color: C.g900 }}>Rafi Heumann</strong> — Landesvertreter Österreich</p>
            <p style={{ fontFamily: ff, fontSize: 14, lineHeight: 1.7, color: C.g700 }}><a href="mailto:kh-austria@kh-uia.org.il" style={{ color: C.blue, fontWeight: 600, textDecoration: 'none' }}>kh-austria@kh-uia.org.il</a><br />+43-1-535 536 630</p>
          </div>
        </R>
      </div>
    </section>
  )
}

/* ══════════════ NEWS ══════════════ */
function News() {
  const items = [
    { date: 'März 2025', t: 'Ehrung für Karl Nehammer', d: 'Der ehemalige Bundeskanzler wurde vom EJC, Keren Hayesod und der IKG Wien mit dem Schofar ausgezeichnet.', tag: 'Wien' },
    { date: 'März 2026', t: 'Operation Roaring Lion', d: 'Keren Hayesod mobilisiert globale Unterstützung für Israels aktuelle Sicherheitslage.', tag: 'Israel' },
    { date: 'Laufend', t: 'Shavim wächst', d: 'Bis Mitte 2026 soll die Kapazität um 40% steigen und dreimal so viele Soldaten erreichen.', tag: 'Shavim' },
    { date: '2025', t: '18.000+ Olim begrüßt', d: 'Über 18.000 Juden aus aller Welt wanderten 2025 nach Israel ein.', tag: 'Alija' },
  ]
  return (
    <section id="news" style={{ padding: '80px 0', background: C.offWhite }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <R><div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontFamily: fm, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: C.blue, marginBottom: 10 }}>Aktuelles</div>
          <h2 style={{ fontFamily: fm, fontWeight: 700, fontSize: 'clamp(24px,4vw,34px)', color: C.g900 }}>Neuigkeiten & Veranstaltungen</h2>
        </div></R>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {items.map((n, i) => (
            <R key={i} delay={i * .08}>
              <div style={{ background: '#fff', borderRadius: 8, padding: 22, boxShadow: '0 1px 10px rgba(0,0,0,.04)', borderTop: `3px solid ${C.blue}`, transition: 'transform .3s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}>
                <span style={{ display: 'inline-block', fontFamily: fm, fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#fff', background: C.blue, padding: '3px 9px', borderRadius: 3, marginBottom: 10 }}>{n.tag}</span>
                <div style={{ fontFamily: ff, fontSize: 11, color: C.g500, marginBottom: 7 }}>{n.date}</div>
                <h3 style={{ fontFamily: fm, fontSize: 15, fontWeight: 700, color: C.g900, marginBottom: 8, lineHeight: 1.3 }}>{n.t}</h3>
                <p style={{ fontFamily: ff, fontSize: 13, lineHeight: 1.6, color: C.g500, marginBottom: 10 }}>{n.d}</p>
                <span style={{ fontFamily: fm, fontSize: 12, fontWeight: 700, color: C.blue, cursor: 'pointer' }}>Weiterlesen →</span>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════ DONATE ══════════════ */
function Donate() {
  const [amt, setAmt] = useState(100)
  const [custom, setCustom] = useState('')
  const [proj, setProj] = useState('shavim')
  const projs = [{ id: 'shavim', n: 'Shavim – Reservisten' },{ id: 'aliya', n: 'Alija & Absorption' },{ id: 'youth', n: 'Jugenddörfer' },{ id: 'emergency', n: 'Nothilfe' },{ id: 'general', n: 'Allgemeine Spende' }]

  return (
    <section id="donate" style={{ padding: '80px 0', background: C.blueDarker, position: 'relative' }}>
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <R><h2 style={{ fontFamily: fm, fontWeight: 800, fontSize: 'clamp(26px,4vw,38px)', color: '#fff', marginBottom: 14 }}>Ihre Spende verändert Leben</h2></R>
        <R delay={.1}><p style={{ fontFamily: ff, fontSize: 16, color: 'rgba(255,255,255,.72)', marginBottom: 32, lineHeight: 1.7 }}>Jeder Beitrag stärkt die Menschen Israels. Spenden sind steuerlich absetzbar.</p></R>
        <R delay={.18}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 'clamp(24px,4vw,36px)', textAlign: 'left', boxShadow: '0 16px 52px rgba(0,0,0,.2)' }}>
            {/* Project */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontFamily: fm, fontWeight: 700, fontSize: 13, color: C.g900, marginBottom: 9 }}>Projekt wählen</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {projs.map(p => (
                  <button key={p.id} onClick={() => setProj(p.id)} style={{ fontFamily: ff, fontSize: 12, padding: '8px 14px', borderRadius: 6, border: proj===p.id ? `2px solid ${C.blue}` : `1px solid ${C.g300}`, background: proj===p.id ? C.blueLight : '#fff', color: proj===p.id ? C.blue : C.g700, fontWeight: proj===p.id ? 600 : 400, cursor: 'pointer', transition: 'all .2s' }}>{p.n}</button>
                ))}
              </div>
            </div>
            {/* Amount */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontFamily: fm, fontWeight: 700, fontSize: 13, color: C.g900, marginBottom: 9 }}>Betrag (€)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[36,72,100,180,360,1000].map(a => (
                  <button key={a} onClick={() => { setAmt(a); setCustom('') }} style={{ fontFamily: fm, fontWeight: 600, fontSize: 15, padding: '12px 18px', borderRadius: 6, border: amt===a&&!custom ? `2px solid ${C.gold}` : `1px solid ${C.g300}`, background: amt===a&&!custom ? 'rgba(212,168,75,.08)' : '#fff', color: C.g900, cursor: 'pointer', minWidth: 72, transition: 'all .2s' }}>€{a}</button>
                ))}
              </div>
              <input type="number" placeholder="Anderer Betrag..." value={custom} onChange={e => { setCustom(e.target.value); setAmt(0) }} style={{ width: '100%', marginTop: 9, padding: '12px 14px', fontFamily: ff, fontSize: 14, border: `1px solid ${C.g300}`, borderRadius: 6, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            {/* Bank */}
            <div style={{ background: C.g100, borderRadius: 6, padding: 16, marginBottom: 18, fontFamily: ff, fontSize: 13, lineHeight: 1.8, color: C.g700 }}>
              <strong style={{ color: C.g900 }}>Banküberweisung:</strong><br />
              Keren Hajessod Österreich<br />
              IBAN: AT XX XXXX XXXX XXXX XXXX<br />
              BIC: BAWAATWWXXX
            </div>
            {/* Submit */}
            <button onClick={() => alert(`Vielen Dank für Ihre Spende von €${custom || amt}!\n\nIn der Produktion erfolgt hier die Weiterleitung zum Zahlungsdienstleister.`)} style={{ width: '100%', fontFamily: fm, fontWeight: 700, fontSize: 16, letterSpacing: 1, background: C.blue, color: '#fff', border: 'none', borderRadius: 6, padding: 17, cursor: 'pointer', transition: 'background .2s' }}>
              {custom ? `€${custom}` : `€${amt}`} Spenden
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 22, marginTop: 14, fontFamily: ff, fontSize: 13, color: C.g500 }}>
              <span>💳 Kreditkarte</span><span>🅿️ PayPal</span><span>🏦 Überweisung</span>
            </div>
            <p style={{ fontFamily: ff, fontSize: 11, color: C.g500, textAlign: 'center', marginTop: 10 }}>Sichere, verschlüsselte Abwicklung. Sie erhalten eine Spendenbestätigung.</p>
          </div>
        </R>
      </div>
    </section>
  )
}

/* ══════════════ PARTNERS ══════════════ */
function Partners() {
  return (
    <section style={{ padding: '36px 0', background: C.g100, borderTop: `1px solid ${C.g200}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: fm, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: C.g500, marginBottom: 16 }}>Keren Hajessod Weltweit</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          {[['Keren Hayesod International','https://www.kh-uia.org.il'],['Deutschland','https://keren-hayesod.de'],['Schweiz','https://kerenhajessod.ch'],['Jewish Agency','https://www.jewishagency.org']].map(([n,u],i) => (
            <a key={i} href={u} target="_blank" rel="noopener noreferrer" style={{ fontFamily: fm, fontSize: 12, fontWeight: 600, color: C.blue, padding: '7px 14px', borderRadius: 4, textDecoration: 'none', transition: 'background .2s' }}
              onMouseEnter={e => e.target.style.background = C.blueLight}
              onMouseLeave={e => e.target.style.background = 'transparent'}>{n}</a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════ FOOTER ══════════════ */
function Footer() {
  return (
    <footer style={{ background: C.blueDarker, color: 'rgba(255,255,255,.7)', padding: '52px 0 0', fontFamily: ff }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, paddingBottom: 36 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, color: '#fff' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: 'serif' }}>קה</div>
            <div><strong style={{ fontFamily: fm, fontSize: 13 }}>Keren Hajessod</strong><br /><span style={{ fontSize: 11, opacity: .7 }}>Vereinigte Israel Aktion</span></div>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7 }}>Seit 1920 die weltweit führende Spendenorganisation für Israel. Nationale Institution in über 45 Ländern.</p>
        </div>
        <div>
          <h4 style={{ fontFamily: fm, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: C.gold, marginBottom: 14 }}>Projekte</h4>
          {['Shavim','Alija','Amigour','Jugenddörfer','Youth Futures','NET@','Nothilfe'].map((l,i) => <div key={i} style={{ fontSize: 13, marginBottom: 8, cursor: 'pointer', transition: 'color .2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color=''}>{l}</div>)}
        </div>
        <div>
          <h4 style={{ fontFamily: fm, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: C.gold, marginBottom: 14 }}>Kontakt Wien</h4>
          <p style={{ fontSize: 13, lineHeight: 1.7 }}><a href="mailto:kh-austria@kh-uia.org.il" style={{ color: C.gold, textDecoration: 'none' }}>kh-austria@kh-uia.org.il</a><br />+43-1-535 536 630</p>
          <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 14 }}><strong style={{ color: 'rgba(255,255,255,.9)' }}>Hauptsitz Israel</strong><br />48 King George St.<br />Jerusalem 9426218</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', padding: '18px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 11, color: 'rgba(255,255,255,.3)' }}>
          <span>© {new Date().getFullYear()} Keren Hajessod — Vereinigte Israel Aktion Österreich</span>
          <span style={{ display: 'flex', gap: 18 }}><span style={{ cursor: 'pointer' }}>Datenschutz</span><span style={{ cursor: 'pointer' }}>Impressum</span></span>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════ MAIN ═══════════════════ */
export default function KHAustriaV2() {
  return (
    <div style={{ WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Montserrat:wght@400;600;700;800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{font-family:'Open Sans',sans-serif;background:#fff}
        ::selection{background:${C.blue};color:#fff}
        input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}
        input[type=number]{-moz-appearance:textfield}
        @media(max-width:960px){
          .kh-desk-nav{display:none!important}
          .kh-mob-btn{display:block!important}
        }
        @media(min-width:961px){
          .kh-mob-menu{display:none!important}
        }
      `}</style>
      <TopBar />
      <Navbar />
      <Hero />
      <Impact />
      <Shavim />
      <Projects />
      <Video />
      <About />
      <News />
      <Donate />
      <Partners />
      <Footer />
    </div>
  )
}

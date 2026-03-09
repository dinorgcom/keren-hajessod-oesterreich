import './globals.css'

export const metadata = {
  title: 'Keren Hajessod Österreich — Für die Menschen Israels',
  description: 'Keren Hajessod Österreich – Vereinigte Israel Aktion Wien. Unterstützen Sie Israel durch Spenden für Shavim, Alija, Jugendprojekte und humanitäre Hilfe.',
  openGraph: {
    title: 'Keren Hajessod Österreich — Für die Menschen Israels',
    description: 'Seit 1920 die führende weltweite Spendenorganisation für den Staat Israel.',
    type: 'website',
  },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}

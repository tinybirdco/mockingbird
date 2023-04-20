import '@/globals.css'
import localFont from 'next/font/local'
import { Inter } from 'next/font/google'
import type { AppProps } from 'next/app'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const iAWriterDuospaceBoldItalic = localFont({
  src: './ia-writer-duospace.bolditalic.otf',
  variable: '--font-ia-writer',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`${inter.variable} ${iAWriterDuospaceBoldItalic.variable}`}
    >
      <Component {...pageProps} />
    </main>
  )
}

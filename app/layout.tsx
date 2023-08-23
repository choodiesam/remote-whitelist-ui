import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UI Remote whitelist uMod plugin',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} container mx-auto m-10 flex flex-col gap-8 text-stone-800`}>
        <nav className='flex gap-6 items-end'>
          <Link href={"/"} className='font-bold text-lg text-stone-600'>Remote Whitelist</Link>
          <Link href={"/whitelists"}>owned whitelists</Link>
          <Link href={"/profile"}>profile</Link>
        </nav>
        {children}
        <ToastContainer limit={3} autoClose={3000} />
      </body>
    </html>
  )
}

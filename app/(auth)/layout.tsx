import Logo from '@/components/logo'
import ThemeSwitcher from '@/components/theme-switcher'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className='flex flex-col min-h-screen min-w-full bg-background max-h-screen'>
        <nav className='flex justify-between items-center border-b border-border h-[60px] px-4 py-2'>
            <Logo/>
            <div className='flex gap-x-4 items-center'>
                <ThemeSwitcher/>
            </div>
        </nav>
        <main className='flex w-full flex-grow h-full items-center justify-center'>
            {children}
        </main>
    </div>
  )
}

export default Layout
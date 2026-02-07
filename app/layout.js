import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata = {
  title: '财富管理仪表盘',
  description: '个人财富数据实时估值',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-light-bg dark:bg-dark-bg text-gray-900 dark:text-white min-h-screen">
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

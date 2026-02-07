import './globals.css'

export const metadata = {
  title: '财富管理仪表盘',
  description: '个人财富数据实时估值',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="bg-dark-bg text-white min-h-screen">{children}</body>
    </html>
  )
}

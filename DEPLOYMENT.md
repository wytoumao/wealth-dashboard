# 部署总结

## 项目信息
- **项目名称**: wealth-dashboard
- **GitHub 仓库**: https://github.com/wytoumao/wealth-dashboard
- **Vercel 项目**: wealth-dashboard

## 部署地址
- **生产环境**: https://wealth-dashboard-six.vercel.app/
- **Vercel URL**: https://wealth-dashboard-wytoumaos-projects.vercel.app

## 技术栈
- Next.js 14.2
- React 18.3
- Tailwind CSS 3.4
- Chart.js 4.4
- react-chartjs-2 5.2

## 功能清单
✅ 总资产卡片展示（CNY，带日期）
✅ 资产分布饼图（五大类）
✅ 资产明细列表（按类别分组）
✅ 目标 vs 实际配置对比（带状态指示）
✅ 实时价格更新（BTC/ETH/SOL，通过 CoinGecko API）
✅ 深色主题
✅ 响应式设计（手机友好）
✅ 中文界面

## 配置
- 汇率 USD/CNY: 6.95
- 黄金价格: ¥1150/克

## 资产数据（1.28 快照）
### 加密货币
- 稳定币: $101,283
- 现货: $38,152 (70% BTC, 20% ETH, 10% SOL)

### 美股
- SP500: $7,279
- QQQ: $9,860
- 其他: $4,113

### 现金（人民币）
- 工商银行: ¥306,492.39（非流动）
- 中国银行: ¥21,073.51（贷款账户）
- 公积金: ¥76,795.54

### 黄金
- 现货: 135克

## 总资产
¥1,676,386.09

## 部署状态
✅ GitHub 仓库创建成功
✅ 代码推送成功
✅ Vercel 项目创建成功
✅ 首次部署成功
✅ jsconfig.json 路径别名配置
✅ ssoProtection 设置为 null（公开访问）
✅ 生产环境可访问

## 本地开发
```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

## 构建
```bash
npm run build
```

## 部署时间
2026-02-07 07:50 UTC

## 注意事项
1. 实时价格通过 CoinGecko 免费 API 获取，每分钟更新一次
2. 黄金价格使用配置的固定值（¥1150/克）
3. 加密货币现货按比例分配（70% BTC, 20% ETH, 10% SOL）
4. 目标配置: 加密20%, 美股50-60%, 黄金10%, 现金10-15%
5. 深色主题，响应式设计，适配移动端

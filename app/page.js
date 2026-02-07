'use client';

import { useState, useEffect } from 'react';
import AssetChart from '@/components/AssetChart';
import AssetList from '@/components/AssetList';
import TargetComparison from '@/components/TargetComparison';

export default function Home() {
  const [prices, setPrices] = useState({
    btc: null,
    eth: null,
    sol: null,
    gold: null,
  });

  const [assets, setAssets] = useState(null);

  // 配置区
  const config = {
    usdToCny: 6.95,
    goldPriceCny: 1150, // 每克
  };

  // 基础资产数据（快照）
  const baseAssets = {
    crypto: {
      stablecoin: 101283, // USD
      spot: 38152, // USD (70% BTC, 20% ETH, 10% SOL)
    },
    stocks: {
      sp500: 7279, // USD
      qqq: 9860, // USD
      other: 4113, // USD
      cash: 0,
    },
    cashCny: {
      icbc: 306492.39, // 非流动
      boc: 21073.51, // 贷款账户
      providentFund: 76795.54,
    },
    gold: {
      grams: 135,
    },
  };

  // 获取实时价格
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // 使用 CoinGecko 免费 API
        const cryptoRes = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd'
        );
        const cryptoData = await cryptoRes.json();

        setPrices({
          btc: cryptoData.bitcoin?.usd || null,
          eth: cryptoData.ethereum?.usd || null,
          sol: cryptoData.solana?.usd || null,
          gold: config.goldPriceCny, // 使用配置的黄金价格
        });
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // 每分钟更新
    return () => clearInterval(interval);
  }, []);

  // 计算资产
  useEffect(() => {
    if (!prices.btc || !prices.eth || !prices.sol) {
      // 使用快照数据
      const cryptoValueCny = (baseAssets.crypto.stablecoin + baseAssets.crypto.spot) * config.usdToCny;
      const stocksValueCny = (baseAssets.stocks.sp500 + baseAssets.stocks.qqq + baseAssets.stocks.other) * config.usdToCny;
      const cashCnyValue = baseAssets.cashCny.icbc + baseAssets.cashCny.boc + baseAssets.cashCny.providentFund;
      const stablecoinValueCny = baseAssets.crypto.stablecoin * config.usdToCny;
      const goldValueCny = baseAssets.gold.grams * config.goldPriceCny;

      const total = cryptoValueCny + stocksValueCny + cashCnyValue + goldValueCny;

      setAssets({
        categories: [
          { name: '加密货币', value: cryptoValueCny, color: '#f59e0b' },
          { name: '美股', value: stocksValueCny, color: '#3b82f6' },
          { name: '现金（人民币）', value: cashCnyValue, color: '#10b981' },
          { name: '现金（投资/稳定币）', value: stablecoinValueCny, color: '#8b5cf6' },
          { name: '黄金', value: goldValueCny, color: '#fbbf24' },
        ],
        details: [
          { category: '加密货币', name: '稳定币', amount: `$${baseAssets.crypto.stablecoin.toLocaleString()}`, value: baseAssets.crypto.stablecoin * config.usdToCny },
          { category: '加密货币', name: '现货 (BTC/ETH/SOL)', amount: `$${baseAssets.crypto.spot.toLocaleString()}`, value: baseAssets.crypto.spot * config.usdToCny },
          { category: '美股', name: 'SP500', amount: `$${baseAssets.stocks.sp500.toLocaleString()}`, value: baseAssets.stocks.sp500 * config.usdToCny },
          { category: '美股', name: 'QQQ', amount: `$${baseAssets.stocks.qqq.toLocaleString()}`, value: baseAssets.stocks.qqq * config.usdToCny },
          { category: '美股', name: '其他', amount: `$${baseAssets.stocks.other.toLocaleString()}`, value: baseAssets.stocks.other * config.usdToCny },
          { category: '现金（人民币）', name: '工商银行', amount: '非流动', value: baseAssets.cashCny.icbc },
          { category: '现金（人民币）', name: '中国银行', amount: '贷款账户', value: baseAssets.cashCny.boc },
          { category: '现金（人民币）', name: '公积金', amount: '', value: baseAssets.cashCny.providentFund },
          { category: '黄金', name: '现货', amount: `${baseAssets.gold.grams}克`, value: goldValueCny },
        ],
        total,
        lastUpdate: new Date().toLocaleString('zh-CN'),
      });
      return;
    }

    // 使用实时价格计算
    const btcAmount = baseAssets.crypto.spot * 0.7 / prices.btc;
    const ethAmount = baseAssets.crypto.spot * 0.2 / prices.eth;
    const solAmount = baseAssets.crypto.spot * 0.1 / prices.sol;

    const cryptoSpotValue = (btcAmount * prices.btc + ethAmount * prices.eth + solAmount * prices.sol) * config.usdToCny;
    const stablecoinValue = baseAssets.crypto.stablecoin * config.usdToCny;
    const cryptoValueCny = cryptoSpotValue + stablecoinValue;
    
    const stocksValueCny = (baseAssets.stocks.sp500 + baseAssets.stocks.qqq + baseAssets.stocks.other) * config.usdToCny;
    const cashCnyValue = baseAssets.cashCny.icbc + baseAssets.cashCny.boc + baseAssets.cashCny.providentFund;
    const goldValueCny = baseAssets.gold.grams * prices.gold;

    const total = cryptoValueCny + stocksValueCny + cashCnyValue + goldValueCny;

    setAssets({
      categories: [
        { name: '加密货币', value: cryptoValueCny, color: '#f59e0b' },
        { name: '美股', value: stocksValueCny, color: '#3b82f6' },
        { name: '现金（人民币）', value: cashCnyValue, color: '#10b981' },
        { name: '现金（投资/稳定币）', value: stablecoinValue, color: '#8b5cf6' },
        { name: '黄金', value: goldValueCny, color: '#fbbf24' },
      ],
      details: [
        { category: '加密货币', name: '稳定币', amount: `$${baseAssets.crypto.stablecoin.toLocaleString()}`, value: stablecoinValue },
        { category: '加密货币', name: `BTC (${btcAmount.toFixed(4)})`, amount: `$${prices.btc.toLocaleString()}`, value: btcAmount * prices.btc * config.usdToCny },
        { category: '加密货币', name: `ETH (${ethAmount.toFixed(4)})`, amount: `$${prices.eth.toLocaleString()}`, value: ethAmount * prices.eth * config.usdToCny },
        { category: '加密货币', name: `SOL (${solAmount.toFixed(4)})`, amount: `$${prices.sol.toLocaleString()}`, value: solAmount * prices.sol * config.usdToCny },
        { category: '美股', name: 'SP500', amount: `$${baseAssets.stocks.sp500.toLocaleString()}`, value: baseAssets.stocks.sp500 * config.usdToCny },
        { category: '美股', name: 'QQQ', amount: `$${baseAssets.stocks.qqq.toLocaleString()}`, value: baseAssets.stocks.qqq * config.usdToCny },
        { category: '美股', name: '其他', amount: `$${baseAssets.stocks.other.toLocaleString()}`, value: baseAssets.stocks.other * config.usdToCny },
        { category: '现金（人民币）', name: '工商银行', amount: '非流动', value: baseAssets.cashCny.icbc },
        { category: '现金（人民币）', name: '中国银行', amount: '贷款账户', value: baseAssets.cashCny.boc },
        { category: '现金（人民币）', name: '公积金', amount: '', value: baseAssets.cashCny.providentFund },
        { category: '黄金', name: '现货', amount: `${baseAssets.gold.grams}克 @ ¥${prices.gold}/克`, value: goldValueCny },
      ],
      total,
      lastUpdate: new Date().toLocaleString('zh-CN'),
    });
  }, [prices]);

  if (!assets) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">加载中...</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">财富管理仪表盘</h1>
      
      {/* 总资产卡片 */}
      <div className="bg-dark-card rounded-lg p-6 mb-6 border border-dark-border">
        <div className="text-gray-400 text-sm mb-2">总资产</div>
        <div className="text-4xl font-bold text-green-400">
          ¥{assets.total.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-gray-500 text-sm mt-2">
          更新时间: {assets.lastUpdate}
        </div>
      </div>

      {/* 资产分布和目标对比 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AssetChart categories={assets.categories} total={assets.total} />
        <TargetComparison categories={assets.categories} total={assets.total} />
      </div>

      {/* 资产明细 */}
      <AssetList details={assets.details} />
    </main>
  );
}

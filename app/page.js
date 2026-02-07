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

  // 基础资产数据（精确持仓）
  const baseAssets = {
    crypto: {
      stablecoin: 101283, // USD
      btc: 0.4, // BTC 数量
      eth: 2.35, // ETH 数量（wbETH 质押形式）
      sol: 23, // SOL 数量（bbSOL 质押形式）
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
      // 加载中，暂不显示
      return;
    }

    // 使用实时价格计算（精确持仓数量）
    const btcAmount = baseAssets.crypto.btc;
    const ethAmount = baseAssets.crypto.eth;
    const solAmount = baseAssets.crypto.sol;

    const btcValueUsd = btcAmount * prices.btc;
    const ethValueUsd = ethAmount * prices.eth;
    const solValueUsd = solAmount * prices.sol;
    const cryptoSpotValue = (btcValueUsd + ethValueUsd + solValueUsd) * config.usdToCny;
    
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
        { category: '加密货币', name: `BTC`, amount: `${btcAmount} 枚 @ $${prices.btc.toLocaleString()}`, value: btcValueUsd * config.usdToCny },
        { category: '加密货币', name: `ETH (wbETH)`, amount: `${ethAmount} 枚 @ $${prices.eth.toLocaleString()}`, value: ethValueUsd * config.usdToCny },
        { category: '加密货币', name: `SOL (bbSOL)`, amount: `${solAmount} 枚 @ $${prices.sol.toLocaleString()}`, value: solValueUsd * config.usdToCny },
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

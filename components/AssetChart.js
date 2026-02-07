'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AssetChart({ categories, total }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // 检测当前主题
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    // 监听主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);

  const data = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        data: categories.map(c => c.value),
        backgroundColor: categories.map(c => c.color),
        borderColor: isDark ? '#131825' : '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#9ca3af' : '#4b5563',
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ¥${value.toLocaleString('zh-CN', { minimumFractionDigits: 2 })} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border shadow-sm">
      <h2 className="text-xl font-semibold mb-4">资产分布</h2>
      <div className="max-w-md mx-auto">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

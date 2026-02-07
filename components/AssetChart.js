'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AssetChart({ categories, total }) {
  const data = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        data: categories.map(c => c.value),
        backgroundColor: categories.map(c => c.color),
        borderColor: '#131825',
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
          color: '#9ca3af',
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
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
      <h2 className="text-xl font-semibold mb-4">资产分布</h2>
      <div className="max-w-md mx-auto">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

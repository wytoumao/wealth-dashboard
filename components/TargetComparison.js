export default function TargetComparison({ categories, total }) {
  // 目标配置
  const targets = {
    '加密货币': { min: 20, max: 20 },
    '美股': { min: 50, max: 60 },
    '现金（人民币）': { min: 10, max: 15 },
    '现金（投资/稳定币）': { min: 0, max: 0 }, // 不计入目标
    '黄金': { min: 10, max: 10 },
  };

  const comparisons = categories.map(cat => {
    const actual = (cat.value / total) * 100;
    const target = targets[cat.name];
    
    let status = 'normal';
    if (target && target.min > 0) {
      if (actual < target.min) {
        status = 'low';
      } else if (actual > target.max) {
        status = 'high';
      } else {
        status = 'good';
      }
    }

    return {
      name: cat.name,
      actual: actual.toFixed(1),
      target: target && target.min > 0 ? `${target.min}${target.max !== target.min ? '-' + target.max : ''}%` : '-',
      status,
      color: cat.color,
    };
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'low': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return '✓';
      case 'low': return '↓';
      case 'high': return '↑';
      default: return '';
    }
  };

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
      <h2 className="text-xl font-semibold mb-4">目标 vs 实际</h2>
      <div className="space-y-4">
        {comparisons.map((item) => (
          <div key={item.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-semibold ${getStatusColor(item.status)}`}>
                  {item.actual}%
                </span>
                <span className="text-gray-500 text-sm">
                  目标: {item.target}
                </span>
                <span className={`text-lg ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                </span>
              </div>
            </div>
            {/* 进度条 */}
            <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${Math.min(item.actual, 100)}%`,
                  backgroundColor: item.color,
                  opacity: item.status === 'good' ? 1 : 0.7,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-dark-border">
        <div className="text-sm text-gray-400 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span> 达标
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">↓</span> 低于目标
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-400">↑</span> 高于目标
          </div>
        </div>
      </div>
    </div>
  );
}

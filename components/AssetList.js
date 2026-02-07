export default function AssetList({ details }) {
  // 按类别分组
  const grouped = details.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
      <h2 className="text-xl font-semibold mb-4">资产明细</h2>
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-medium text-gray-300 mb-3 border-b border-dark-border pb-2">
              {category}
            </h3>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 px-3 hover:bg-dark-bg rounded transition-colors">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.amount && (
                      <div className="text-sm text-gray-400">{item.amount}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-400">
                      ¥{item.value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

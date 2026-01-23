import React from "react";

const PlatformUsageChart = () => {
  const data = [
    { name: 'Selenium', value: 65, color: 'bg-blue-500' },
    { name: 'Jest', value: 58, color: 'bg-indigo-500' },
    { name: 'Postman', value: 54, color: 'bg-orange-500' },
    { name: 'Cypress', value: 47, color: 'bg-emerald-500' },
    { name: 'Pytest', value: 45, color: 'bg-green-500' },
    { name: 'Playwright', value: 42, color: 'bg-purple-500' },
    { name: 'Appium', value: 36, color: 'bg-pink-500' },
    { name: 'JMeter', value: 30, color: 'bg-yellow-500' },
  ];


  return (
    <div className="mb-10 bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📊 Industry Platform Usage (Testing & Automation)
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Popular platforms used by testers & QA engineers worldwide
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">{item.name}</span>
              <span className="text-slate-400">{item.value}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className={`${item.color} h-3 rounded-full transition-all duration-700`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-slate-500">
        * Based on aggregated industry surveys and community reports (for guidance only)
      </div>
    </div>
  );
};

export default PlatformUsageChart;
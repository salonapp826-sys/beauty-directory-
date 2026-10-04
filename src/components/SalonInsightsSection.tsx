import { useState, useMemo } from 'react';
import { Order } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface SalonInsightsSectionProps {
  orders: Order[];
}

const COLORS = ['#8e004b', '#0150d6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

export function SalonInsightsSection({ orders = [] }: SalonInsightsSectionProps) {
  const [timeFilter, setTimeFilter] = useState<'ALL' | '2026' | '2025'>('ALL');

  // Filter orders based on time range if needed
  const filteredOrders = useMemo(() => {
    if (timeFilter === 'ALL') return orders;
    return orders.filter((o) => {
      const yearStr = new Date(o.date).getFullYear().toString();
      return yearStr === timeFilter || o.date.includes(timeFilter);
    });
  }, [orders, timeFilter]);

  // 1. Monthly Spend Trend Data
  const monthlySpendData = useMemo(() => {
    const monthMap: Record<string, number> = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };
    const monthKeys = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    filteredOrders.forEach((order) => {
      let mKey = 'Jul'; // default fallback
      const dateObj = new Date(order.date);
      if (!isNaN(dateObj.getTime())) {
        const mIndex = dateObj.getMonth();
        mKey = monthKeys[mIndex];
      } else {
        const lower = order.date.toLowerCase();
        for (const mk of monthKeys) {
          if (lower.includes(mk.toLowerCase())) {
            mKey = mk;
            break;
          }
        }
      }
      monthMap[mKey] = (monthMap[mKey] || 0) + (order.total || 0);
    });

    return monthKeys.map((month) => ({
      month,
      spend: monthMap[month],
    }));
  }, [filteredOrders]);

  // 2. Top-Purchased Products Pie Chart Data
  const productShareData = useMemo(() => {
    const productMap: Record<string, { name: string; quantity: number; spend: number }> = {};

    filteredOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const pName = item.product?.name || 'Unknown Product';
        if (!productMap[pName]) {
          productMap[pName] = { name: pName, quantity: 0, spend: 0 };
        }
        productMap[pName].quantity += item.quantity;
        productMap[pName].spend += item.selectedTierPrice * item.quantity;
      });
    });

    const sortedProducts = Object.values(productMap).sort((a, b) => b.quantity - a.quantity);

    const topProducts = sortedProducts.slice(0, 5);
    const restProducts = sortedProducts.slice(5);

    const result = topProducts.map((p) => ({
      name: p.name.length > 20 ? p.name.substring(0, 18) + '...' : p.name,
      fullName: p.name,
      value: p.quantity,
      spend: p.spend,
    }));

    if (restProducts.length > 0) {
      const restQty = restProducts.reduce((sum, p) => sum + p.quantity, 0);
      const restSpend = restProducts.reduce((sum, p) => sum + p.spend, 0);
      result.push({
        name: 'Other Products',
        fullName: 'Other Products',
        value: restQty,
        spend: restSpend,
      });
    }

    return result;
  }, [filteredOrders]);

  const totalSpendAll = filteredOrders.reduce((acc, o) => acc + o.total, 0);
  const totalItemsCount = filteredOrders.reduce(
    (acc, o) => acc + o.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );
  const avgOrderValue = filteredOrders.length > 0 ? Math.round(totalSpendAll / filteredOrders.length) : 0;

  return (
    <div id="salon-insights-section" className="bg-white rounded-2xl border border-[#E8E8E8] p-6 md:p-8 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E8]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">analytics</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1c1b1b]">Salon Spend & Product Insights</h2>
              <p className="text-xs text-[#594047]">
                Advanced analytics on monthly wholesale expenditure and top-purchased inventory
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#F0EDEC] p-1 rounded-xl">
          {(['ALL', '2026', '2025'] as const).map((yr) => (
            <button
              key={yr}
              onClick={() => setTimeFilter(yr)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeFilter === yr
                  ? 'bg-white text-[#8e004b] shadow-2xs'
                  : 'text-[#594047] hover:text-[#1c1b1b]'
              }`}
            >
              {yr === 'ALL' ? 'All Time' : yr}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#fdf8f8] border border-[#E8E8E8] p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#594047]">Total Wholesale Spend</span>
            <h4 className="text-xl font-extrabold text-[#8e004b] mt-0.5">
              ₹{totalSpendAll.toLocaleString('en-IN')}
            </h4>
          </div>
          <span className="material-symbols-outlined text-2xl text-[#8e004b]/60">payments</span>
        </div>

        <div className="bg-[#fdf8f8] border border-[#E8E8E8] p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#594047]">Average Order Value (AOV)</span>
            <h4 className="text-xl font-extrabold text-[#1c1b1b] mt-0.5">
              ₹{avgOrderValue.toLocaleString('en-IN')}
            </h4>
          </div>
          <span className="material-symbols-outlined text-2xl text-[#0150d6]/60">receipt</span>
        </div>

        <div className="bg-[#fdf8f8] border border-[#E8E8E8] p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#594047]">Total Units Procured</span>
            <h4 className="text-xl font-extrabold text-[#1c1b1b] mt-0.5">
              {totalItemsCount} Units
            </h4>
          </div>
          <span className="material-symbols-outlined text-2xl text-emerald-700/60">inventory_2</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Monthly Spend Trend Line Chart */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#1c1b1b]">Monthly Spend Trend</h3>
              <p className="text-[11px] text-[#594047]">Procurement expenditure across months</p>
            </div>
            <span className="text-xs font-bold bg-[#FDE7F3] text-[#8e004b] px-2.5 py-1 rounded-full">
              Line Analysis
            </span>
          </div>

          <div className="w-full h-72">
            {monthlySpendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySpendData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Spend']}
                    contentStyle={{
                      backgroundColor: '#1c1b1b',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="spend"
                    name="Spend (₹)"
                    stroke="#8e004b"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#8e004b', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, fill: '#b90064' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                No monthly spend data available for this range.
              </div>
            )}
          </div>
        </div>

        {/* Top-Purchased Products Pie Chart */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#1c1b1b]">Top-Purchased Product Share</h3>
              <p className="text-[11px] text-[#594047]">Quantity distribution by item</p>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-[#0150d6] px-2.5 py-1 rounded-full">
              Distribution
            </span>
          </div>

          <div className="w-full h-72 flex items-center justify-center">
            {productShareData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {productShareData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any, item: any) => [
                      `${value} units (₹${item.payload.spend.toLocaleString('en-IN')})`,
                      item.payload.fullName || name,
                    ]}
                    contentStyle={{
                      backgroundColor: '#1c1b1b',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                No product purchase history available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

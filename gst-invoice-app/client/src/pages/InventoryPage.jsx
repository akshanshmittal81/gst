import React, { useEffect, useState } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import { formatCurrency } from '../utils/invoiceUtils';
import { Package, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function InventoryPage() {
  const { invoices, fetchInvoices } = useInvoices();
  const [allInvoices, setAllInvoices] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [activeTab, setActiveTab] = useState('item');

  useEffect(() => { fetchInvoices({ limit: 1000, page: 1 }); }, []);
  useEffect(() => { setAllInvoices(invoices); }, [invoices]);

  const filtered = allInvoices.filter(inv => {
    if (!inv.invoiceDate) return false;
    const d = new Date(inv.invoiceDate);
    const monthMatch = selectedMonth ? (d.getMonth() + 1) === Number(selectedMonth) : true;
    const yearMatch = selectedYear ? d.getFullYear() === Number(selectedYear) : true;
    return monthMatch && yearMatch;
  });

  const itemWise = Object.values(
    filtered.flatMap(inv => (inv.items || []).map(item => ({ ...item, invoiceDate: inv.invoiceDate }))).reduce((acc, item) => {
      const key = item.name || 'Unknown';
      if (!acc[key]) acc[key] = { name: key, hsn: item.hsn || '-', uom: item.unit || 'Nos', gstPct: item.gstPct || 0, qtySold: 0, taxable: 0, gst: 0, total: 0 };
      const base = (Number(item.qty) || 0) * (Number(item.rate) || 0);
      const gst = (base * (Number(item.gstPct) || 0)) / 100;
      acc[key].qtySold += Number(item.qty) || 0;
      acc[key].taxable += base;
      acc[key].gst += gst;
      acc[key].total += base + gst;
      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total);

  const hsnWise = Object.values(
    filtered.flatMap(inv => inv.items || []).reduce((acc, item) => {
      const key = item.hsn || 'No HSN';
      if (!acc[key]) acc[key] = { hsn: key, qtySold: 0, taxable: 0, gst: 0, total: 0 };
      const base = (Number(item.qty) || 0) * (Number(item.rate) || 0);
      const gst = (base * (Number(item.gstPct) || 0)) / 100;
      acc[key].qtySold += Number(item.qty) || 0;
      acc[key].taxable += base;
      acc[key].gst += gst;
      acc[key].total += base + gst;
      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total);

  const totalSold = itemWise.reduce((s, r) => s + r.total, 0);
  const totalQty = itemWise.reduce((s, r) => s + r.qtySold, 0);
  const totalTax = itemWise.reduce((s, r) => s + r.gst, 0);

  const months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ];
  const years = ['2023', '2024', '2025', '2026'];

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const itemRows = [['#', 'Item Name', 'HSN', 'UOM', 'GST %', 'Qty Sold', 'Taxable Amt', 'Total GST', 'Grand Total']];
    itemWise.forEach((r, i) => itemRows.push([i+1, r.name, r.hsn, r.uom, r.gstPct+'%', r.qtySold, r.taxable, r.gst, r.total]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(itemRows), 'Item-wise Sales');
    const hsnRows = [['#', 'HSN/SAC', 'Qty Sold', 'Taxable Amt', 'Total GST', 'Grand Total']];
    hsnWise.forEach((r, i) => hsnRows.push([i+1, r.hsn, r.qtySold, r.taxable, r.gst, r.total]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(hsnRows), 'HSN-wise Sales');
    XLSX.writeFile(wb, `Inventory_Report_${selectedMonth || 'All'}_${selectedYear || 'All'}.xlsx`);
  };

  const thS = { padding: '10px 12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'white', background: '#1c1c18', textAlign: 'left', whiteSpace: 'nowrap' };
  const tdS = (right = false) => ({ padding: '9px 12px', fontSize: '13px', borderBottom: '1px solid #e8e8e0', textAlign: right ? 'right' : 'left', fontFamily: right ? 'monospace' : 'inherit' });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-ink-100 flex items-center gap-2">
            <Package size={22} /> Inventory / Sales Report
          </h1>
          <p className="text-sm text-ink-400 mt-1">Item-wise aur HSN-wise kitna bikaa — sab ek jagah</p>
        </div>
        <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: '#16a34a', color: 'white', border: 'none', cursor: 'pointer' }}>
          <Download size={16} /> Export Excel
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {[
          { label: 'Total Sales Value', value: formatCurrency(totalSold), color: '#1c1c18' },
          { label: 'Total Qty Sold', value: totalQty + ' units', color: '#2563eb' },
          { label: 'Total Tax Collected', value: formatCurrency(totalTax), color: '#d97706' },
        ].map(c => (
          <div key={c.label} className="card p-4">
            <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{c.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-4 flex gap-4 items-center">
        <div>
          <label className="label">Month</label>
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="input w-40">
            <option value="">All Months</option>
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Year</label>
          <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="input w-32">
            <option value="">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="ml-auto text-sm text-ink-400">
          Showing <strong className="text-ink-700 dark:text-ink-200">{filtered.length}</strong> invoices
        </div>
      </div>

      <div className="flex gap-2 border-b border-ink-100 dark:border-ink-800">
        {[['item','Item-wise Sales'],['hsn','HSN-wise Sales']].map(([k,l]) => (
          <button key={k} onClick={() => setActiveTab(k)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${activeTab === k ? 'border-ink-800 dark:border-amber-500 text-ink-800 dark:text-amber-400' : 'border-transparent text-ink-400 hover:text-ink-600'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {activeTab === 'item' && (
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                {['#','Item Name','HSN','UOM','GST %','Qty Sold','Taxable Amt','Total GST','Grand Total'].map((h,i) => (
                  <th key={h} style={{ ...thS, textAlign: i >= 5 ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {itemWise.length === 0
                  ? <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#888' }}>No data found</td></tr>
                  : itemWise.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#f9f9f7' }}>
                      <td style={tdS()}>{i+1}</td>
                      <td style={{ ...tdS(), fontWeight: 600 }}>{row.name}</td>
                      <td style={{ ...tdS(), fontFamily: 'monospace', color: '#6e6e60' }}>{row.hsn}</td>
                      <td style={tdS()}>{row.uom}</td>
                      <td style={{ ...tdS(true), fontWeight: 600 }}>{row.gstPct}%</td>
                      <td style={{ ...tdS(true), fontWeight: 700, color: '#2563eb' }}>{row.qtySold}</td>
                      <td style={tdS(true)}>{formatCurrency(row.taxable)}</td>
                      <td style={{ ...tdS(true), color: '#d97706' }}>{formatCurrency(row.gst)}</td>
                      <td style={{ ...tdS(true), fontWeight: 700 }}>{formatCurrency(row.total)}</td>
                    </tr>
                  ))}
              </tbody>
              {itemWise.length > 0 && (
                <tfoot><tr style={{ background: '#1c1c18', color: 'white' }}>
                  <td colSpan={5} style={{ padding: '10px 12px', fontWeight: 700, fontSize: 12 }}>TOTAL</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{totalQty}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{formatCurrency(itemWise.reduce((s,r)=>s+r.taxable,0))}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{formatCurrency(totalTax)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{formatCurrency(totalSold)}</td>
                </tr></tfoot>
              )}
            </table>
          </div>
        )}

        {activeTab === 'hsn' && (
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                {['#','HSN/SAC','Qty Sold','Taxable Amt','Total GST','Grand Total'].map((h,i) => (
                  <th key={h} style={{ ...thS, textAlign: i >= 2 ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {hsnWise.length === 0
                  ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#888' }}>No data found</td></tr>
                  : hsnWise.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#f9f9f7' }}>
                      <td style={tdS()}>{i+1}</td>
                      <td style={{ ...tdS(), fontFamily: 'monospace', fontWeight: 600 }}>{row.hsn}</td>
                      <td style={{ ...tdS(true), fontWeight: 700, color: '#2563eb' }}>{row.qtySold}</td>
                      <td style={tdS(true)}>{formatCurrency(row.taxable)}</td>
                      <td style={{ ...tdS(true), color: '#d97706' }}>{formatCurrency(row.gst)}</td>
                      <td style={{ ...tdS(true), fontWeight: 700 }}>{formatCurrency(row.total)}</td>
                    </tr>
                  ))}
              </tbody>
              {hsnWise.length > 0 && (
                <tfoot><tr style={{ background: '#1c1c18', color: 'white' }}>
                  <td colSpan={2} style={{ padding: '10px 12px', fontWeight: 700, fontSize: 12 }}>TOTAL</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{totalQty}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{formatCurrency(hsnWise.reduce((s,r)=>s+r.taxable,0))}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{formatCurrency(totalTax)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{formatCurrency(totalSold)}</td>
                </tr></tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

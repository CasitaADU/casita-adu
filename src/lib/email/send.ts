import { getResend, FROM_EMAIL, ADMIN_EMAIL } from './resend';
import {
  welcomeEmail,
  followUpDay1,
  followUpDay3,
  followUpDay7,
  adminNewLeadEmail,
} from './templates';

// Send immediate welcome email to the lead + notification to admin
export async function sendWelcomeSequence(lead: {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
}) {
  try {
    // 1. Instant welcome email to the lead
    const welcome = welcomeEmail(lead.first_name);
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: lead.email,
      subject: welcome.subject,
      html: welcome.html,
    });

    // 2. Admin notification
    const adminNotif = adminNewLeadEmail(lead);
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: adminNotif.subject,
      html: adminNotif.html,
    });

    // 3. Schedule follow-up emails
    // Day 1 follow-up
    const day1 = followUpDay1(lead.first_name);
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: lead.email,
      subject: day1.subject,
      html: day1.html,
      scheduledAt: getScheduledDate(1),
    });

    // Day 3 follow-up
    const day3 = followUpDay3(lead.first_name);
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: lead.email,
      subject: day3.subject,
      html: day3.html,
      scheduledAt: getScheduledDate(3),
    });

    // Day 7 follow-up
    const day7 = followUpDay7(lead.first_name);
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: lead.email,
      subject: day7.subject,
      html: day7.html,
      scheduledAt: getScheduledDate(7),
    });

    console.log(`Email sequence initiated for ${lead.email}`);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

function getScheduledDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(10, 0, 0, 0); // Send at 10 AM
  return date.toISOString();
}

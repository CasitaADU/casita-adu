import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = 'Casita <onboarding@resend.dev>';
export const ADMIN_EMAIL = 'info@casitaadu.com';

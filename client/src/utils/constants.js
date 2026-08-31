/**
 * Application Constants
 */

export const ROLES = {
  ADMIN: 'admin',
  PATIENT: 'patient',
};

export const APPOINTMENT_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  RESCHEDULED: 'rescheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUSES = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  REFUNDED: 'refunded',
};

export const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
];

export const SERVICES_LIST = [
  'General Consultation',
  'Nadi Pariksha',
  'Panchkarma',
  'Twacha Rog Chikitsa',
  'Joint Pain Treatment',
];

export const STORAGE_KEYS = {
  TOKEN: 'token',
  ROLE: 'role',
};

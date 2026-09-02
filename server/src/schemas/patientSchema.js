const { z } = require('zod');

const registerPatientSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    mobile: z.string().min(10, 'Mobile must be at least 10 digits'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    gender: z.enum(['Male', 'Female', 'Other', 'select-gender']).optional(),
    dob: z.string().optional(),
    address: z.string().optional(),
    profilePhoto: z.string().optional(),
    healthConditions: z.string().optional(),
    currentMedications: z.string().optional(),
    consultationType: z.string().optional(),
    referredBy: z.string().optional(),
    msg91AccessToken: z.string().optional(),
    token: z.string().optional(),
  }),
});

const loginPatientSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Email or Mobile is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

module.exports = {
  registerPatientSchema,
  loginPatientSchema,
};

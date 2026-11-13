import crypto from 'crypto';

/**
 * Generates an elegant order reference code, e.g. MOD-202611-A89F3
 */
export const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `MOD-${dateStr}-${randomSuffix}`;
};


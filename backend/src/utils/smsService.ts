import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TERMII_API_KEY = process.env.TERMII_API_KEY || '';
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || 'RENISA';
const TERMII_BASE_URL = process.env.TERMII_BASE_URL || 'https://api.ng.termii.com';

export const sendSMS = async (to: string, message: string): Promise<boolean> => {
  try {
    const phone = to.replace(/^\+/, '').replace(/^0/, '234');
    const response = await axios.post(`${TERMII_BASE_URL}/api/sms/send`, {
      to: phone,
      from: TERMII_SENDER_ID,
      sms: message,
      type: 'plain',
      channel: 'generic',
      api_key: TERMII_API_KEY,
    });
    return response.data?.code === 'ok' || response.status === 200;
  } catch (err) {
    console.error('SMS send error:', err);
    return false;
  }
};

export const sendBulkSMS = async (phones: string[], message: string): Promise<void> => {
  const normalized = phones.map(p => p.replace(/^\+/, '').replace(/^0/, '234'));
  try {
    await axios.post(`${TERMII_BASE_URL}/api/sms/send/bulk`, {
      to: normalized,
      from: TERMII_SENDER_ID,
      sms: message,
      type: 'plain',
      channel: 'generic',
      api_key: TERMII_API_KEY,
    });
  } catch (err) {
    console.error('Bulk SMS send error:', err);
  }
};

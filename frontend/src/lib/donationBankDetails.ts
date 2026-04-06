/** Shown on public donation page for manual bank transfer (override via env). */
export function getPublicDonationBankDetails() {
  return {
    bankName: process.env.NEXT_PUBLIC_RENISA_BANK_NAME || 'Your bank name',
    accountName: process.env.NEXT_PUBLIC_RENISA_ACCOUNT_NAME || 'RETIRED NIGERIAN SPORTS MEN AND WOMEN ASSOCIATION',
    accountNumber: process.env.NEXT_PUBLIC_RENISA_ACCOUNT_NUMBER || '0000000000',
  }
}

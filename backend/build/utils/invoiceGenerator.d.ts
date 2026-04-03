interface DonationInvoiceData {
    invoiceNumber: string;
    donorName: string;
    donorEmail?: string;
    donorAddress?: string;
    donationTypeName: string;
    amount: number;
    currency?: string;
    dueDate?: Date;
    issuedDate?: Date;
    paymentLink?: string;
}
export declare const generateDonationInvoice: (donationData: DonationInvoiceData, outputPath: string) => Promise<string>;
export {};
//# sourceMappingURL=invoiceGenerator.d.ts.map
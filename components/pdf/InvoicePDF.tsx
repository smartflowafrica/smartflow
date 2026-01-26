import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#111',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {},
    headerRight: {},
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 10,
        color: '#666',
        marginTop: 4,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingVertical: 8,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#111',
    },
    colDescription: {
        width: '60%',
        paddingLeft: 8,
    },
    colAmount: {
        width: '40%',
        paddingRight: 8,
        textAlign: 'right',
    },
    totalRow: {
        flexDirection: 'row',
        marginTop: 10,
        paddingVertical: 8,
    },
    totalLabel: {
        width: '60%',
        textAlign: 'right',
        paddingRight: 10,
        fontSize: 12,
        fontWeight: 'bold',
    },
    totalAmount: {
        width: '40%',
        textAlign: 'right',
        fontSize: 12,
        fontWeight: 'bold',
        paddingRight: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        color: 'grey',
        fontSize: 10,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 10,
    },
    paymentInfo: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#F9F9F9',
        borderRadius: 4,
    },
    paymentTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    paymentText: {
        fontSize: 10,
        marginBottom: 2,
    },
});

interface InvoicePDFProps {
    invoiceData: {
        id: string;
        date: string;
        customerName: string;
        customerEmail?: string;
        businessName: string;
        description: string;
        amount: number;
        paymentLink: string;
        logoUrl?: string;
        bankDetails?: {
            bankName?: string;
            accountNumber?: string;
            accountName?: string;
        };
        isReceipt?: boolean;
        status?: string;
        paymentMethod?: string;
    };
}

const InvoicePDF = ({ invoiceData }: InvoicePDFProps) => {
    const hasBankDetails = invoiceData.bankDetails?.bankName && invoiceData.bankDetails?.accountNumber;
    const isPaid = invoiceData.isReceipt || invoiceData.status === 'PAID';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* PAID Stamp */}
                {isPaid && (
                    <View style={{
                        position: 'absolute',
                        top: 200,
                        left: '30%',
                        transform: 'rotate(-25deg)',
                        borderWidth: 5,
                        borderColor: '#22c55e', // Green
                        padding: 10,
                        opacity: 0.3,
                        zIndex: -1
                    }}>
                        <Text style={{
                            color: '#22c55e',
                            fontSize: 80,
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>{invoiceData.paymentMethod ? 'PAID' : 'PAID'}</Text>
                        {/* Could put method here but might be too long. Sticking to PAID */}
                    </View>
                )}

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        {invoiceData.logoUrl ? (
                            <Image
                                src={invoiceData.logoUrl}
                                style={{ width: 100, marginBottom: 10, objectFit: 'contain' }}
                            />
                        ) : (
                            <Text style={styles.title}>{invoiceData.businessName}</Text>
                        )}

                        <Text style={styles.title}>
                            {isPaid ? `RECEIPT - ${invoiceData.paymentMethod || 'PAID'}` : 'INVOICE'}
                        </Text>
                        <Text style={styles.subtitle}>#{invoiceData.id.slice(0, 8).toUpperCase()}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={{ fontSize: 10 }}>Date: {invoiceData.date}</Text>
                        {/* Render name here too if logo is used, for clarity? Or keep minimal. Keeping minimal for now. */}
                        {invoiceData.logoUrl && <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{invoiceData.businessName}</Text>}
                    </View>
                </View>

                {/* Customer Info */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Bill To:</Text>
                    <Text style={{ fontSize: 14 }}>{invoiceData.customerName}</Text>
                    <Text style={{ fontSize: 10 }}>{invoiceData.customerEmail}</Text>
                </View>

                {/* Table Header */}
                <View style={styles.headerRow}>
                    <Text style={[styles.colDescription, { fontWeight: 'bold' }]}>Description</Text>
                    <Text style={[styles.colAmount, { fontWeight: 'bold' }]}>Amount</Text>
                </View>

                {/* Table Content */}
                <View style={styles.row}>
                    <Text style={styles.colDescription}>{invoiceData.description}</Text>
                    <Text style={styles.colAmount}>NGN {invoiceData.amount.toLocaleString()}</Text>
                </View>

                {/* Total */}
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Due:</Text>
                    <Text style={styles.totalAmount}>NGN {invoiceData.amount.toLocaleString()}</Text>
                </View>

                {/* Payment Info */}
                <View style={styles.paymentInfo}>
                    <Text style={styles.paymentTitle}>Payment Instructions</Text>

                    {/* Bank Transfer Details */}
                    {hasBankDetails && (
                        <View style={{ marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                            <Text style={[styles.paymentText, { fontWeight: 'bold' }]}>Bank Transfer:</Text>
                            <Text style={styles.paymentText}>Bank: {invoiceData.bankDetails?.bankName}</Text>
                            <Text style={styles.paymentText}>Account Number: {invoiceData.bankDetails?.accountNumber}</Text>
                            <Text style={styles.paymentText}>Account Name: {invoiceData.bankDetails?.accountName}</Text>
                        </View>
                    )}

                    <Text style={styles.paymentText}>Online Payment:</Text>
                    <Text style={[styles.paymentText, { color: 'blue', textDecoration: 'underline' }]}>
                        {invoiceData.paymentLink}
                    </Text>
                    <Text style={{ fontSize: 8, color: '#666', marginTop: 5 }}>
                        Thank you for your business!
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Generated by SmartFlow Africa</Text>
                </View>
            </Page>
        </Document>
    )
};

export default InvoicePDF;

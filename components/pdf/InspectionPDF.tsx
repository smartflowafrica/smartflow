import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#334155'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 20
    },
    logoStr: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a'
    },
    logoImg: {
        width: 60,
        height: 60,
        objectFit: 'contain'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4
    },
    subtitle: {
        fontSize: 10,
        color: '#64748b'
    },
    section: {
        marginTop: 15,
        marginBottom: 10
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0f172a',
        backgroundColor: '#f1f5f9',
        padding: 6,
        marginBottom: 8,
        borderRadius: 4
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // Gap is not supported in all versions, using margin on items instead
    },
    itemCard: {
        width: '48%',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
        marginRight: '2%'
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        alignItems: 'center'
    },
    itemName: {
        fontSize: 10,
        fontWeight: 'bold'
    },
    statusBadge: {
        fontSize: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontWeight: 'bold'
    },
    statusGood: {
        backgroundColor: '#dcfce7',
        color: '#166534'
    },
    statusFair: {
        backgroundColor: '#fef9c3',
        color: '#854d0e'
    },
    statusBad: {
        backgroundColor: '#fee2e2',
        color: '#991b1b'
    },
    note: {
        fontSize: 9,
        color: '#64748b',
        fontStyle: 'italic',
        marginTop: 2
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
        fontSize: 8,
        color: '#94a3b8'
    }
});

interface InspectionPDFProps {
    data: {
        id: string;
        date: string;
        businessName: string;
        customerName: string;
        vehicle: string; // Make Model Year - Plate
        logoUrl?: string;
        items: Array<{
            category: string;
            name: string;
            status: 'GOOD' | 'FAIR' | 'BAD';
            note?: string;
        }>;
        mechanicNotes?: string;
    };
}

export default function InspectionPDF({ data }: InspectionPDFProps) {
    // Group items by category
    const categories = data.items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof data.items>);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        {data.logoUrl ? (
                            <Image src={data.logoUrl} style={styles.logoImg} />
                        ) : (
                            <Text style={styles.logoStr}>{data.businessName}</Text>
                        )}
                        <Text style={{ fontSize: 9, marginTop: 4, color: '#64748b' }}>
                            {data.businessName}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.title}>Vehicle Inspection Report</Text>
                        <Text style={styles.subtitle}>Ref: {data.id.slice(-6).toUpperCase()}</Text>
                        <Text style={styles.subtitle}>Date: {data.date}</Text>
                    </View>
                </View>

                {/* Vehicle & Customer Info */}
                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    <View style={{ width: '50%' }}>
                        <Text style={{ fontSize: 9, color: '#64748b', marginBottom: 2 }}>Customer</Text>
                        <Text style={{ fontWeight: 'bold' }}>{data.customerName}</Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={{ fontSize: 9, color: '#64748b', marginBottom: 2 }}>Vehicle</Text>
                        <Text style={{ fontWeight: 'bold' }}>{data.vehicle}</Text>
                    </View>
                </View>

                {/* Summary Stats */}
                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    <View style={{ flex: 1, padding: 8, backgroundColor: '#dcfce7', borderRadius: 4, alignItems: 'center', marginRight: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#166534' }}>
                            {data.items.filter(i => i.status === 'GOOD').length}
                        </Text>
                        <Text style={{ fontSize: 8, color: '#166534' }}>PASSED</Text>
                    </View>
                    <View style={{ flex: 1, padding: 8, backgroundColor: '#fef9c3', borderRadius: 4, alignItems: 'center', marginRight: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#854d0e' }}>
                            {data.items.filter(i => i.status === 'FAIR').length}
                        </Text>
                        <Text style={{ fontSize: 8, color: '#854d0e' }}>WARNING</Text>
                    </View>
                    <View style={{ flex: 1, padding: 8, backgroundColor: '#fee2e2', borderRadius: 4, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#991b1b' }}>
                            {data.items.filter(i => i.status === 'BAD').length}
                        </Text>
                        <Text style={{ fontSize: 8, color: '#991b1b' }}>FAILED</Text>
                    </View>
                </View>

                {/* Checklist Categories */}
                {Object.entries(categories).map(([category, items]) => (
                    <View key={category} style={styles.section}>
                        <Text style={styles.sectionTitle}>{category}</Text>
                        <View style={styles.grid}>
                            {items.map((item, idx) => (
                                <View key={idx} style={styles.itemCard}>
                                    <View style={styles.itemHeader}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={[
                                            styles.statusBadge,
                                            item.status === 'GOOD' ? styles.statusGood :
                                                item.status === 'FAIR' ? styles.statusFair : styles.statusBad
                                        ]}>
                                            {item.status}
                                        </Text>
                                    </View>
                                    {item.note && (
                                        <Text style={styles.note}>{item.note}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Mechanic Notes */}
                {data.mechanicNotes && (
                    <View style={[styles.section, { marginTop: 20 }]}>
                        <Text style={styles.sectionTitle}>Mechanic Recommendations</Text>
                        <Text style={{ lineHeight: 1.5 }}>{data.mechanicNotes}</Text>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Generated by SmartFlow Africa • {data.businessName}</Text>
                </View>
            </Page>
        </Document>
    );
}

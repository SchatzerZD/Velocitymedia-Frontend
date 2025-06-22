<script setup>
import { ref } from 'vue'
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.vfs

</script>

<template>
    <div v-if="pdfUrl" class="pdf-modal">
        <iframe :src="pdfUrl" width="600px" height="600px" style="border: none;"></iframe>
    </div>
</template>

<script>

export default {
    props: ['invoice'],
    data() {
        return {
            pdfUrl: null
        }
    },

    mounted() {
        let invoice = this.invoice
        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            content: [
                { text: 'Faktura', style: 'header' },
                { text: `Fakturanummer: ${invoice.invoiceNumber}` },
                { text: `Dato: ${invoice.issueDate}` },
                { text: `Kunde: ${invoice.customer.name}` },
                {
                    text: `Adresse: ${invoice.customer.address.streetAddress}, ${invoice.customer.address.postCode} ${invoice.customer.address.city}`
                },
                { text: '\n' },
                {
                    table: {
                        widths: ['*', 'auto', 'auto', 'auto'],
                        body: [
                            ['Beskrivelse', 'Antall', 'Pris', 'Total'],
                            [
                                invoice.lines[0].description,
                                invoice.lines[0].quantity,
                                invoice.lines[0].unitPrice / 100 + ' NOK',
                                invoice.lines[0].grossInNok / 100 + ' NOK'
                            ]
                        ]
                    }
                },
                { text: '\n' },
                { text: `Totalt å betale: ${invoice.grossInNok / 100} NOK`, bold: true }
            ],
            styles: {
                header: {
                    fontSize: 24,
                    bold: true,
                    margin: [0, 0, 0, 20]
                },
                tableText: {
                    fontSize: 12
                }
            }

        }

        pdfMake.createPdf(docDefinition).getBlob((blob) => {
            this.pdfUrl = URL.createObjectURL(blob)
        })
    }
}

</script>

<style scoped>
.btn {
    background-color: #3aaaff;
    color: white;
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.btn:hover {
    background-color: #1e88e5;
}
</style>

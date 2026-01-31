// lib/invoice/invoice-generator.ts
import PDFDocument from "pdfkit"

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface InvoiceData {
  invoiceNumber: string
  date: Date
  dueDate?: Date
  customer: {
    name: string
    email: string
    address?: string
  }
  items: InvoiceItem[]
  subtotal: number
  discount?: {
    description: string
    amount: number
  }
  tax?: {
    rate: number
    amount: number
  }
  total: number
  currency: string
  paymentMethod?: string
  transactionId?: string
  notes?: string
}

interface CompanyInfo {
  name: string
  address: string
  email: string
  phone?: string
  website?: string
  logo?: string
  taxId?: string
}

const defaultCompanyInfo: CompanyInfo = {
  name: "VistraTV",
  address: "123 Streaming Street, 75001 Paris, France",
  email: "billing@vistratv.com",
  phone: "+33 1 23 45 67 89",
  website: "www.vistratv.com",
  taxId: "FR12345678901",
}

export async function generateInvoicePDF(
  data: InvoiceData,
  companyInfo: CompanyInfo = defaultCompanyInfo
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" })
      const chunks: Buffer[] = []

      doc.on("data", (chunk) => chunks.push(chunk))
      doc.on("end", () => resolve(Buffer.concat(chunks)))
      doc.on("error", reject)

      // En-tête
      doc.fontSize(24).fillColor("#00d4ff").text(companyInfo.name, 50, 50)
      doc.fontSize(10).fillColor("#666")
      doc.text(companyInfo.address, 50, 80)
      doc.text(`Email: ${companyInfo.email}`, 50, 95)
      if (companyInfo.phone) doc.text(`Tél: ${companyInfo.phone}`, 50, 110)
      if (companyInfo.taxId) doc.text(`TVA: ${companyInfo.taxId}`, 50, 125)

      // Titre facture
      doc.fontSize(28).fillColor("#1a1147").text("FACTURE", 400, 50, { align: "right" })
      doc.fontSize(12).fillColor("#666")
      doc.text(`N° ${data.invoiceNumber}`, 400, 85, { align: "right" })
      doc.text(`Date: ${data.date.toLocaleDateString("fr-FR")}`, 400, 100, { align: "right" })
      if (data.dueDate) {
        doc.text(`Échéance: ${data.dueDate.toLocaleDateString("fr-FR")}`, 400, 115, { align: "right" })
      }

      // Ligne de séparation
      doc.moveTo(50, 150).lineTo(550, 150).stroke("#e0e0e0")

      // Informations client
      doc.fontSize(12).fillColor("#1a1147").text("Facturé à:", 50, 170)
      doc.fontSize(11).fillColor("#333")
      doc.text(data.customer.name, 50, 190)
      doc.text(data.customer.email, 50, 205)
      if (data.customer.address) {
        doc.text(data.customer.address, 50, 220, { width: 200 })
      }

      // Tableau des articles
      const tableTop = 280
      const tableHeaders = ["Description", "Qté", "Prix unit.", "Total"]
      const columnWidths = [280, 50, 80, 80]
      let xPos = 50

      // En-tête du tableau
      doc.rect(50, tableTop - 5, 500, 25).fill("#1a1147")
      doc.fontSize(10).fillColor("#fff")
      tableHeaders.forEach((header, i) => {
        doc.text(header, xPos + 5, tableTop, { width: columnWidths[i] - 10 })
        xPos += columnWidths[i]
      })

      // Lignes du tableau
      let yPos = tableTop + 30
      doc.fillColor("#333")

      data.items.forEach((item, index) => {
        xPos = 50
        const bgColor = index % 2 === 0 ? "#f9f9f9" : "#fff"
        doc.rect(50, yPos - 5, 500, 25).fill(bgColor)
        doc.fillColor("#333")

        doc.text(item.description, xPos + 5, yPos, { width: columnWidths[0] - 10 })
        xPos += columnWidths[0]
        doc.text(String(item.quantity), xPos + 5, yPos, { width: columnWidths[1] - 10 })
        xPos += columnWidths[1]
        doc.text(`${item.unitPrice.toFixed(2)} ${data.currency}`, xPos + 5, yPos, {
          width: columnWidths[2] - 10,
        })
        xPos += columnWidths[2]
        doc.text(`${item.total.toFixed(2)} ${data.currency}`, xPos + 5, yPos, {
          width: columnWidths[3] - 10,
        })

        yPos += 25
      })

      // Totaux
      const totalsX = 380
      yPos += 20

      // Sous-total
      doc.fontSize(10).fillColor("#666")
      doc.text("Sous-total:", totalsX, yPos)
      doc.text(`${data.subtotal.toFixed(2)} ${data.currency}`, totalsX + 100, yPos, { align: "right" })
      yPos += 20

      // Remise
      if (data.discount) {
        doc.text(`Remise (${data.discount.description}):`, totalsX, yPos)
        doc.fillColor("#e94b87").text(`-${data.discount.amount.toFixed(2)} ${data.currency}`, totalsX + 100, yPos, {
          align: "right",
        })
        doc.fillColor("#666")
        yPos += 20
      }

      // TVA
      if (data.tax) {
        doc.text(`TVA (${data.tax.rate}%):`, totalsX, yPos)
        doc.text(`${data.tax.amount.toFixed(2)} ${data.currency}`, totalsX + 100, yPos, { align: "right" })
        yPos += 20
      }

      // Total
      doc.rect(totalsX - 10, yPos - 5, 180, 30).fill("#1a1147")
      doc.fontSize(12).fillColor("#fff")
      doc.text("TOTAL:", totalsX, yPos + 3)
      doc.text(`${data.total.toFixed(2)} ${data.currency}`, totalsX + 100, yPos + 3, { align: "right" })

      yPos += 50

      // Informations de paiement
      if (data.paymentMethod || data.transactionId) {
        doc.fontSize(10).fillColor("#666")
        doc.text("Informations de paiement:", 50, yPos)
        yPos += 15
        doc.fillColor("#333")
        if (data.paymentMethod) doc.text(`Méthode: ${data.paymentMethod}`, 50, yPos)
        yPos += 15
        if (data.transactionId) doc.text(`Transaction: ${data.transactionId}`, 50, yPos)
        yPos += 30
      }

      // Notes
      if (data.notes) {
        doc.fontSize(10).fillColor("#666")
        doc.text("Notes:", 50, yPos)
        yPos += 15
        doc.fillColor("#333").text(data.notes, 50, yPos, { width: 500 })
      }

      // Pied de page
      const footerY = 750
      doc.fontSize(8).fillColor("#999")
      doc.text("Merci pour votre confiance!", 50, footerY, { align: "center", width: 500 })
      doc.text(`${companyInfo.website} | ${companyInfo.email}`, 50, footerY + 15, { align: "center", width: 500 })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

// Générer un numéro de facture unique
export function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `INV-${year}${month}-${random}`
}

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generateBookingPDF = (
  booking,
  payment
) => {

  const doc = new jsPDF()

  const pageWidth = doc.internal.pageSize.getWidth()

  /*
   * =================================
   * HEADER
   * =================================
   */

  doc.setFillColor(23, 32, 51)

  doc.rect(
    0,
    0,
    pageWidth,
    42,
    'F'
  )

  doc.setTextColor(255, 255, 255)

  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')

  doc.text(
    'TRAVEL & TOURISM',
    20,
    18
  )

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  doc.text(
    'Booking Confirmation',
    20,
    27
  )

  doc.text(
    `Booking #${booking.id}`,
    pageWidth - 20,
    22,
    {
      align: 'right'
    }
  )


  /*
   * =================================
   * SUCCESS MESSAGE
   * =================================
   */

  doc.setTextColor(22, 163, 74)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')

  doc.text(
    'Booking Confirmed',
    20,
    60
  )

  doc.setTextColor(100, 116, 139)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  doc.text(
    'Your travel booking has been successfully created.',
    20,
    68
  )


  /*
   * =================================
   * BOOKING INFORMATION
   * =================================
   */

  doc.setTextColor(23, 32, 51)

  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')

  doc.text(
    'Booking Information',
    20,
    86
  )

  const bookingDate = booking.bookingDate
    ? new Date(
        `${booking.bookingDate}T00:00:00`
      ).toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      )
    : '-'

  const travelDate = booking.travelDate
    ? new Date(
        `${booking.travelDate}T00:00:00`
      ).toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      )
    : '-'

  const bookingTime = booking.bookingTime
    ? booking.bookingTime.substring(0, 5)
    : '-'

  autoTable(doc, {
    startY: 92,

    head: [
      [
        'Field',
        'Details'
      ]
    ],

    body: [
      [
        'Booking ID',
        `#${booking.id}`
      ],
      [
        'Booking Date',
        bookingDate
      ],
      [
        'Booking Time',
        bookingTime
      ],
      [
        'Booking Status',
        booking.status
      ]
    ],

    theme: 'grid',

    styles: {
      fontSize: 10,
      cellPadding: 6,
      textColor: [23, 32, 51]
    },

    headStyles: {
      fillColor: [23, 32, 51],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    }
  })


  /*
   * =================================
   * CUSTOMER INFORMATION
   * =================================
   */

  let currentY =
    doc.lastAutoTable.finalY + 18

  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')

  doc.text(
    'Customer Information',
    20,
    currentY
  )

  autoTable(doc, {
    startY: currentY + 6,

    head: [
      [
        'Field',
        'Details'
      ]
    ],

    body: [
      [
        'Customer Name',
        booking.userName || '-'
      ],
      [
        'Email',
        booking.userEmail || '-'
      ]
    ],

    theme: 'grid',

    styles: {
      fontSize: 10,
      cellPadding: 6,
      textColor: [23, 32, 51]
    },

    headStyles: {
      fillColor: [23, 32, 51],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    }
  })


  /*
   * =================================
   * PACKAGE INFORMATION
   * =================================
   */

  currentY =
    doc.lastAutoTable.finalY + 18

  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')

  doc.text(
    'Travel Package',
    20,
    currentY
  )

  autoTable(doc, {
    startY: currentY + 6,

    head: [
      [
        'Field',
        'Details'
      ]
    ],

    body: [
      [
        'Package Name',
        booking.packageName || '-'
      ],
      [
        'Destination',
        booking.destination || '-'
      ],
      [
        'Travel Date',
        travelDate
      ],
      [
        'Duration',
        `${booking.durationDays || 0} days`
      ],
      [
        'Total Amount',
        `Rs. ${Number(
          booking.price || 0
        ).toLocaleString('en-IN')}`
      ]
    ],

    theme: 'grid',

    styles: {
      fontSize: 10,
      cellPadding: 6,
      textColor: [23, 32, 51]
    },

    headStyles: {
      fillColor: [23, 32, 51],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    }
  })


    /*
   * =================================
   * PAYMENT INFORMATION
   * =================================
   */

  currentY =
    doc.lastAutoTable.finalY + 18

  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')

  doc.text(
    'Payment Information',
    20,
    currentY
  )


  autoTable(doc, {

    startY: currentY + 6,

    head: [
      [
        'Field',
        'Details'
      ]
    ],

    body: [

      [
        'Payment Method',
        payment?.paymentMethod || '-'
      ],

      [
        'Transaction ID',
        payment?.transactionId || '-'
      ],

      [
        'Payment Status',
        payment?.status || '-'
      ],

      [
        'Amount Paid',
        `Rs. ${Number(
          payment?.amount || booking.price || 0
        ).toLocaleString('en-IN')}`
      ]

    ],

    theme: 'grid',

    styles: {
      fontSize: 10,
      cellPadding: 6,
      textColor: [23, 32, 51]
    },

    headStyles: {
      fillColor: [23, 32, 51],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    }

  })


  /*
   * =================================
   * FOOTER
   * =================================
   */

  const pageHeight =
    doc.internal.pageSize.getHeight()

  doc.setDrawColor(226, 232, 240)

  doc.line(
    20,
    pageHeight - 30,
    pageWidth - 20,
    pageHeight - 30
  )

  doc.setTextColor(100, 116, 139)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')

  doc.text(
    'Thank you for choosing Travel & Tourism.',
    20,
    pageHeight - 20
  )

  doc.text(
    'This is a computer-generated booking confirmation.',
    pageWidth - 20,
    pageHeight - 20,
    {
      align: 'right'
    }
  )


  /*
   * =================================
   * DOWNLOAD
   * =================================
   */

  doc.save(
    `Travel-Booking-Confirmation-${booking.id}.pdf`
  )
}

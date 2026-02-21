const PDFDocument = require('pdfkit');

const generateVehicleReportPDF = (data, stream) => {
    const doc = new PDFDocument();
    doc.pipe(stream);

    doc.fontSize(25).text('FleetFlow - Vehicle Report', { align: 'center' });
    doc.moveDown();

    data.forEach((v) => {
        doc.fontSize(14).text(`Vehicle: ${v.name} (${v.licensePlate})`);
        doc.fontSize(10).text(`ROI: ${v.roi}%`);
        doc.fontSize(10).text(`Fuel Efficiency: ${v.fuelEfficiency} KM/L`);
        doc.fontSize(10).text(`Total Revenue: $${v.totalRevenue}`);
        doc.fontSize(10).text(`Total Cost: $${v.totalCost}`);
        doc.moveDown();
    });

    doc.end();
};

module.exports = { generateVehicleReportPDF };

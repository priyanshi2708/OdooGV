const { createObjectCsvWriter } = require('csv-writer');

const generateVehicleCSV = async (data, filePath) => {
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'name', title: 'Vehicle Name' },
            { id: 'licensePlate', title: 'License Plate' },
            { id: 'roi', title: 'ROI (%)' },
            { id: 'fuelEfficiency', title: 'Fuel Efficiency (KM/L)' },
            { id: 'totalRevenue', title: 'Total Revenue ($)' },
            { id: 'totalCost', title: 'Total Cost ($)' },
        ]
    });

    await csvWriter.writeRecords(data);
};

module.exports = { generateVehicleCSV };

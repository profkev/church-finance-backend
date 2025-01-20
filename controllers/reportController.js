const Income = require('../models/Income');
const Expenditure = require('../models/Expenditure');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');


// Fetch report data for income and expenditure
exports.getReports = async (req, res) => {
  try {
    const { type, filter, month, year } = req.query;

    if (!type || (type !== 'income' && type !== 'expenditure')) {
      return res.status(400).json({ message: 'Invalid type. Use income or expenditure.' });
    }

    let records = type === 'income'
      ? await Income.find().populate('votehead', 'name')
      : await Expenditure.find().populate('category', 'name');

    if (filter === 'monthly' && month && year) {
      records = records.filter((record) => {
        const recordDate = new Date(record.createdAt);
        return (
          recordDate.getMonth() + 1 === parseInt(month) &&
          recordDate.getFullYear() === parseInt(year)
        );
      });
    }

    res.status(200).json({ records });
  } catch (error) {
    console.error('Error fetching reports:', error.message);
    res.status(500).json({ message: 'Failed to fetch reports. Please try again later.' });
  }
};

// Fetch aggregated data for reports
exports.getAggregatedReports = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type || (type !== 'income' && type !== 'expenditure')) {
      return res.status(400).json({ message: 'Invalid type. Use income or expenditure.' });
    }

    let aggregatedData = type === 'income'
      ? await Income.aggregate([
          { $group: { _id: '$votehead', totalAmount: { $sum: '$amount' } } },
          { $lookup: { from: 'voteheads', localField: '_id', foreignField: '_id', as: 'votehead' } },
          { $unwind: '$votehead' },
          { $project: { name: '$votehead.name', totalAmount: 1 } },
        ])
      : await Expenditure.aggregate([
          { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } },
          { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
          { $unwind: '$category' },
          { $project: { name: '$category.name', totalAmount: 1 } },
        ]);

    res.status(200).json({ aggregatedData });
  } catch (error) {
    console.error('Error fetching aggregated reports:', error.message);
    res.status(500).json({ message: 'Failed to fetch aggregated reports.' });
  }
};

// Download data as Excel
exports.downloadOriginalData = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type || (type !== 'income' && type !== 'expenditure')) {
      return res.status(400).json({ message: 'Invalid type. Use income or expenditure.' });
    }

    const records = type === 'income'
      ? await Income.find().populate('votehead', 'name')
      : await Expenditure.find().populate('category', 'name');

    if (records.length === 0) {
      return res.status(404).json({ message: `No ${type} records found to download.` });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${type} Report`);
    const isIncome = type === 'income';

    // Define worksheet columns
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 30 },
      { header: isIncome ? 'Votehead' : 'Category', key: 'name', width: 25 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];

    // Add data rows to the worksheet
    records.forEach((record) => {
      worksheet.addRow({
        _id: record._id,
        name: record[isIncome ? 'votehead' : 'category']?.name || 'N/A',
        amount: record.amount,
        description: record.description,
        year: record.year,
        createdAt: record.createdAt.toISOString(),
      });
    });

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_original_data.xlsx`);

    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error downloading original data:', error.message);
    res.status(500).json({ message: 'Failed to download original data.' });
  }
};


// Download data as PDF
exports.downloadOriginalPDF = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type || (type !== 'income' && type !== 'expenditure')) {
      return res.status(400).json({ message: 'Invalid type. Use income or expenditure.' });
    }

    const records = type === 'income'
      ? await Income.find().populate('votehead', 'name')
      : await Expenditure.find().populate('category', 'name');

    if (records.length === 0) {
      return res.status(404).json({ message: `No ${type} records found to download.` });
    }

    const doc = new PDFDocument();
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${type}_original_data.pdf`);
      res.send(pdfBuffer);
    });

    doc.fontSize(16).text(`${type.charAt(0).toUpperCase() + type.slice(1)} Original Data`, { align: 'center' });
    doc.moveDown();

    records.forEach((record) => {
      doc.fontSize(12).text(`ID: ${record._id}`);
      doc.text(`${type === 'income' ? 'Votehead' : 'Category'}: ${record[type === 'income' ? 'votehead' : 'category']?.name || 'N/A'}`);
      doc.text(`Amount: ${record.amount}`);
      doc.text(`Description: ${record.description}`);
      doc.text(`Year: ${record.year}`);
      doc.text(`Created At: ${record.createdAt}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Error downloading original PDF:', error.message);
    res.status(500).json({ message: 'Failed to download original PDF.' });
  }
};

exports.downloadCombinedData = async (req, res) => {
  try {
    const { type, month, year } = req.query;
    const validTypes = ['income', 'expenditure'];

    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ message: `Invalid type. Allowed values: ${validTypes.join(', ')}` });
    }

    // Fetch aggregated data
    const aggregatedData = await getAggregatedData(type, month, year); // Assume this function is implemented

    if (!aggregatedData || aggregatedData.length === 0) {
      return res.status(404).json({ message: 'No data available for the selected filters.' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${type} Combined Report`);

    // Set headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Total Amount', key: 'totalAmount', width: 15 },
    ];

    // Add data
    aggregatedData.forEach((item) => {
      worksheet.addRow({
        name: item.name,
        totalAmount: item.totalAmount,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_combined_data.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error downloading combined data:', error.message);
    res.status(500).json({ message: 'Failed to download combined data.' });
  }
};



exports.downloadCombinedPDF = async (req, res) => {
  try {
    const { type, month, year } = req.query;

    // Validate type
    const validTypes = ['income', 'expenditure'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ message: `Invalid type. Allowed values: ${validTypes.join(', ')}` });
    }

    // Build aggregation pipeline
    const matchStage = {};
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      matchStage.createdAt = { $gte: startDate, $lte: endDate };
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: type === 'income' ? '$votehead' : '$category',
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: type === 'income' ? 'voteheads' : 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'name',
        },
      },
      { $unwind: '$name' },
      { $project: { name: '$name.name', totalAmount: 1 } },
    ];

    const model = type === 'income' ? Income : Expenditure;
    const aggregatedData = await model.aggregate(pipeline);

    if (!aggregatedData || aggregatedData.length === 0) {
      return res.status(404).json({ message: 'No data found for the selected criteria.' });
    }

    // Generate PDF
    const doc = new PDFDocument();
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${type}_combined_data.pdf`);
      res.send(pdfBuffer);
    });

    // Write PDF content
    doc.fontSize(16).text(`${type.charAt(0).toUpperCase() + type.slice(1)} Combined Data`, { align: 'center' });
    doc.moveDown();

    aggregatedData.forEach((record, index) => {
      doc.fontSize(12).text(`${index + 1}. Name: ${record.name}`);
      doc.text(`Total Amount: ${record.totalAmount}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Error downloading combined PDF:', error.message);
    res.status(500).json({ message: 'Failed to download combined PDF.' });
  }
};

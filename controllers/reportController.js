const Income = require('../models/Income');
const Expenditure = require('../models/Expenditure');
const PDFDocument = require('pdfkit');


exports.getSummary = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const incomes = await Income.aggregate([
      { $match: { year: parseInt(year) } },
      { $group: { _id: "$votehead", total: { $sum: "$amount" } } },
    ]);

    const expenditures = await Expenditure.aggregate([
      { $match: { year: parseInt(year) } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    const totalIncome = incomes.reduce((sum, item) => sum + item.total, 0);
    const totalExpenditure = expenditures.reduce((sum, item) => sum + item.total, 0);

    res.status(200).json({
      incomes,
      expenditures,
      totalIncome,
      totalExpenditure,
      balance: totalIncome - totalExpenditure,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getDetailedReport = async (req, res) => {
    try {
      const year = req.query.year || new Date().getFullYear();
  
      const incomes = await Income.aggregate([
        { $match: { year: parseInt(year) } },
        { $group: { _id: "$votehead", total: { $sum: "$amount" } } },
      ]);
  
      const expenditures = await Expenditure.aggregate([
        { $match: { year: parseInt(year) } },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
      ]);
  
      res.status(200).json({ year, incomes, expenditures });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.exportReportToPDF = async (req, res) => {
    try {
      const year = req.query.year || new Date().getFullYear();
      const incomes = await Income.find({ year });
      const expenditures = await Expenditure.find({ year });
  
      const doc = new PDFDocument();
      const filename = `report-${year}.pdf`;
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  
      doc.pipe(res);
  
      doc.fontSize(16).text(`Financial Report - ${year}`, { align: 'center' });
      doc.moveDown();
  
      doc.fontSize(14).text('Income:', { underline: true });
      incomes.forEach((income) => {
        doc.text(`- ${income.votehead}: ${income.amount}`);
      });
  
      doc.moveDown();
      doc.text('Expenditure:', { underline: true });
      expenditures.forEach((expense) => {
        doc.text(`- ${expense.category}: ${expense.amount}`);
      });
  
      doc.end();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
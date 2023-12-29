const express = require('express');
const app = express();
const bodypaser = require("body-parser");
const path = require("path");
const ExcelJS = require('exceljs');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodypaser.json());
app.use(express.urlencoded({ extended: false }));



app.get('/',(req,res) =>{
    res.render('index');
})

let sheetCreated = false;

const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet('Sheet 1');

if (!sheetCreated) {
  sheet.addRow(['ID', 'Name', 'Email', 'Completed']);
  sheetCreated = true;
}

app.get('/scanned/:id/:name/:email', async (req, res) => {
  const { id, name, email } = req.params;

  try {
    sheet.addRow([id, name, email, true]);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=scannedData.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error creating Excel file:', error);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = app;
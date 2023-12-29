const XLSX = require('xlsx');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Specify the path to your Excel file
const excelFilePath = path.join(__dirname, 'participants.xlsx');

// Read the Excel file
const workbook = XLSX.readFile(excelFilePath);

// Get the names of all sheets in the Excel file
const sheetNames = workbook.SheetNames;

// Choose the sheet you want to read (assuming the first sheet in this example)
const selectedSheet = workbook.Sheets[sheetNames[0]];

// Convert the sheet to a JSON object
const jsonData = XLSX.utils.sheet_to_json(selectedSheet);

// Process each row in the Excel data
jsonData.forEach(async (row) => {
  // Extract relevant data
  const rollNumber = row['RollNumber'];
  const fullName = row['FullName'];
  const email = row['Emailaddress'];

  // Combine data into a string
  const dataString = `RollNo: ${rollNumber}\nName: ${fullName}\nEmail: ${email}`;

  // Generate QR code
  const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(dataString));

  // Specify the folder where you want to save the QR code images
  const outputFolder = path.join(__dirname, 'output');

  // Ensure the output folder exists
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  // Specify the file name (using the email address)
  const fileName = `${email}.jpeg`;

  // Specify the full path for saving the image
  const filePath = path.join(outputFolder, fileName);

  // Write the QR code image to the file
  fs.writeFileSync(filePath, qrCodeBuffer);

  console.log(`QR code generated and saved for ${fullName} (${email})`);
});

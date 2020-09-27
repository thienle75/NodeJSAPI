const fs = require("fs");
let month = new Array();
month[0] = "january";
month[1] = "february";
month[2] = "march";
month[3] = "april";
month[4] = "may";
month[5] = "june";
month[6] = "july";
month[7] = "august";
month[8] = "september";
month[9] = "october";
month[10] = "november";
month[11] = "december";
let invoice = {};
let count = 0, totaldueline=0, totalline = 0,taxline = 0,vendorline = 0;

const uidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const checkInvoiceDate = (inputString) => month.some((i) => (inputString.toLowerCase().includes(i))?true: false)

const parseInvoice = (file) => {
  fs.readFileSync(file, 'utf-8').split(/\r?\n/).forEach((line) => {
  if (checkInvoiceDate(line) && (line.length < 20)){
    invoice['invoiceDate'] = line;
    vendorline = count;
  }
  if ((line === 'Tax 0%') || (line === 'GST 13%')){
    taxline = count;
  }
  if (line === 'Total'){
    totalline = count;
  }
  if (line === 'Total Due'){
    totaldueline = count;
  }
  if(count === (vendorline +2)){
    invoice['vendorName'] = line;
  }
  if (count === (totalline + 2)){
    invoice['total'] = line;
  }
  if (count === (totaldueline + 2)){
    invoice['totalDue'] = line;
  }
  if(count === (totaldueline + 3)){
    invoice['currency'] = line
  }
  if (count === (taxline + 2)){
    invoice['taxAmount'] = line
  }
  count++
})
invoice['processingStatus']='Open'
invoice['id']=uidv4()
return invoice
}
module.exports = {
    parseInvoice : parseInvoice
}

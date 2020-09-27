const fs = require("fs");
let obj = {
    table: []
  };
const insertInvoice = (invoice) => {  
  
  fs.exists('data/data.json', (exists) => {
    if (exists) { 
        fs.readFile('data/data.json', 'utf8', (err, data) => {
        if (err){
            console.log(err);
            return false;
        } else {
        obj = JSON.parse(data); //now it an object
        obj.table.push(invoice); //add some data
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('data/data.json', json, 'utf8',  (err) =>{
            if (err) throw err;
            console.log('complete');
            }); // write it back 
        return true;    
        }
        });
    } else {
        obj.table.push(invoice)
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('data/data.json', json, 'utf8',  (err) =>{
            if (err) throw err;
            console.log('complete');
        });
        return true; 
    }
  })
}

const findInvoiceById = (invoiceId) => {
    fs.exists('data/data.json', (exists) => {
        if (exists){
            fs.readFile('data/data.json', 'utf8', (err, data) => {
                if (err){
                    console.log(err);
                    return false;
                } else {
                obj = JSON.parse(data); //now it an object
                return obj.table.filter( invoice => (invoice.id === invoiceId) )
                }
            });
        }
    })
}

module.exports = {
    insertInvoice : insertInvoice,
    findInvoiceById : findInvoiceById
}
const express = require('express');
const multer  = require('multer');
const { Poppler } = require('node-poppler');
const parse = require('./parse');
const invoice = require('./invoice');
const app = express();
const port = 3000;

const poppler = new Poppler();
const options = {
	firstPageToConvert: 1,
	lastPageToConvert: 2
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //Retains the original file name
  }
})
const upload = multer({ storage: storage })

app.get('/', (req, res) => res.send('Hello Hubdoc!'));

app.post('/upload', upload.single('file'), (req, res, next) => {

  // req.file is the uploaded file
  // req.body will hold the text fields, if there were any
  // e.g. req.body.email should have the email address
  poppler.pdfToText(options, req.file.path).then((res) => {
    console.log(req.body)
    pdffileName = req.file.path;
    txtfileName = pdffileName.replace("pdf","txt");
    let invObj = parse.parseInvoice(txtfileName);
    invObj['uploadedBy'] = req.body.email;
    invObj['uploadTimeStamp'] = Date.now();
    invObj['filesize'] = req.file.size;
    invoice.insertInvoice(invObj);
    console.log(invObj)
    res.send({id: invObj.id});
    res.sendStatus(200);
  });

})
app.get('/:id', function(req, res) {
  var id = req.params.id;
  res.send(invoice.findInvoiceById(id))
  res.sendStatus(200)
});

const server = app.listen(port, () => console.log(`Hubdoc Intake listening on port ${port}!`))

module.exports = {
  app,
  server
};

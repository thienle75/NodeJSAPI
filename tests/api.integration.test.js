const supertest = require('supertest');
const fs = require("fs");
let testFilePath = null;
const filePath = `${__dirname}/testFiles/test.pdf`;
describe('API Tests', () => {
  let server;
  let request;
  let testFilePath = null;
  const filePath = "${}"
  before(() => {
    const api = require('../index');
    server = api.server;
    request = supertest(api.app);
  });

  after(() => {
    server.close();
  });

  it('The api works!', async () => {
    await request.get('/')
      .expect(200);
  });
  describe('POST /upload - upload a new invoice file', () => {
    const filePath = `${__dirname}/invoices/HubdocInvoice1.pdf`;
  
    // Upload first test file to upload folder
    it('should upload the invoice test file to upload', () => 
      // Test if the test file is exist
      fs.exists(filePath)
        .then((exists) => {
          if (!exists) throw new Error('file does not exist'); 
          return request
            .post('/upload')
             // Attach the file with key 'file' which is corresponding to your endpoint setting. 
            .attach('file', filePath)
            .then((res) => {
              const id = res.body;
              expect(id).not.eq(undefined);
            })
            .catch(err => console.log(err));
        })
    )
  })
  it('should get the invoice information by id', async () =>{
    await request.get('/4ebf8274-c81c-4a92-90fe-7dffa527360c')
    .expect(200)
    
  })
});


  
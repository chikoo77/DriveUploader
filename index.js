const { google } = require("googleapis");
const fs = require("fs");
const key = require("./cred.json"); //JSON config file path
require("dotenv").config();

const drive = google.drive("v3");
const jwtClient = new google.auth.JWT( //JSON config file values
  key.client_email,
  key,
  key.private_key,
  "https://www.googleapis.com/auth/drive",
  process.env.user_email //Impersonation for G Suite users only || null, for service account Drive
);

jwtClient.authorize((err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  uploadFiles(); //You can use another method below
});

function listFiles() {
  drive.files.list({ auth: jwtClient }, (listErr, res) => {
    if (listErr) {
      console.log(listErr);
      return;
    }
    res.data.files.map(file => {
      console.log(`${file.name} (${file.mimeType})`);
    });
  });
}

function uploadFiles() {
  let fileMetadata = {
    name: "test.txt" //Your file name
  };

  let media = {
    mimeType: "text/plain", //Your file mimeType
    body: fs.createReadStream("./files/test.txt") //Your file path
  };

  drive.files.create(
    {
      auth: jwtClient,
      resource: fileMetadata,
      media,
      fields: "id"
    },
    (err, file) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`Uploaded file: ${file.data.id}`);
    }
  );
}

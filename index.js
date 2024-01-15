import express from 'express';
import aws from 'aws-sdk';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';



dotenv.config();

//env variables
const aws_secret_key = process.env.AWS_SECRET_ACCESS_KEY;
const aws_access_key = process.env.AWS_ACCESS_KEY_ID;


//AWS Configs
aws.config.update({
    secretAccessKey: aws_secret_key,
    accessKeyId: aws_access_key,
    signatureVersion: 'v4',
    region: 'us-east-1'

});

const s3 = new aws.S3({
    params: {
        Bucket: 'hermes-email-logos',
        signatureVersion: 'v4',
        region: 'us-east-1'
    }
});


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const upload_profile = multer();
app.use(upload_profile.any());



app.post('/api/logo_upload', async (req, res) => {
    let files = req.files
    let id = req.body.id

        let params = {
            Bucket: 'hermes-email-logos',
            Key: 'companyLogo_'+files[0].originalname,
            Body: files[0].buffer
        };
        let response = await s3.upload(params).promise();

        let image_destination = response.Location;

        return res.json({image_destination:image_destination, id:id})

    })



app.listen(4000, function () {
    console.log('Example app listening on port ' + 4000);
})





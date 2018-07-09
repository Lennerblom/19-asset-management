![CF](https://camo.githubusercontent.com/70edab54bba80edb7493cad3135e9606781cbb6b/687474703a2f2f692e696d6775722e636f6d2f377635415363382e706e67) Image Uploads w/ AWS S3
===
Heroku URL: https://awsUpload-lab19.herokuapp.com

### Requirements
* created an AWS account
* created an AWS Access Key and Secret
add the Access Key and Secret to your .env file
* created a new model that represents a file type that you want to store on AWS S3
ex: .mp3, .mp4, .png, etc
* created a test that uploads one of these files to your route
* used multer to parse the file upload request
* used the aws-sdk to assist with uploading
* created user, profile, and image models, with relational connections
* combined your API, Auth, and Upload modules into a single application
* Following a sign-in (or OAuth creation), created a profile model entry, connected to the user id
* Following the upload of an image, created a new record in the image collection, connected to the profile
* Using populate, returned a user's full profile AND a list of all images they've uploaded as a JSON object


#### Tests
* `POST` - **200** - test that the upload worked and a resource object is returned
  * Example: using postman `POST` `http://localhost:3000/upload` pass user credentials or access token(type: `Bearer token`) recieved from instagram server using webserver. 
  * send `{img: image file, title: filename}` as part of request body
  * output looks like `{
    "url": "https://401-lab-storage.s3.amazonaws.com/9a36a80fba3ff281f9fe69cd0c29449c.aws-3.jpg"
}`

* `DELETE` - **204** - test to ensure the object was deleted from s3
  * Example: using postman `POST` `http://localhost:3000/remove/${image's awsKey}`. pass user credentials or access token(type: `Bearer token`) recieved from instagram server using webserver. 

### Sample .env file
PORT = 3000
MONGODB_URI = mongodb://localhost/aws
INSTAGRAM_CLIENT_ID = 
INSTAGRAM_CLIENT_SECRET = 
API_URL = http://localhost:3000
CLIENT_URL=http://localhost:8080
AWS_BUCKET = 401-lab-storage
AWS_ACCESS_KEY_ID = 
AWS_SECRET_ACCESS_KEY = 
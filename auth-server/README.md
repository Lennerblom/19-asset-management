![cf](http://i.imgur.com/7v5ASc8.png) OAuth
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

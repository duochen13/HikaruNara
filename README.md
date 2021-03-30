[Click to Try](http://p2-front-end.s3-website-us-east-1.amazonaws.com/)

Install
```
npm install
```

Run
```
cd Voice-Controlled-Photo-Album
rm package-lock.json (if it exists)
npm run build
npm start   
(localhost:3000)
```

Deploy
```
npm run build
yarn deploy
(if failed, try aws configure then redeploy)
```

Files
```
src/App.js
controllers/search_photo.js
controllers/sign_s3.js
```

Others
```
cd HikaruNara/backend/controller
touch .env
AWSAccessKeyId=""
AWSSecretKey=""
Bucket=""
```

Screenshot
![alt text](https://github.com/duochen13/Voice-Controlled-Photo-Album/blob/main/search_demo_0.jpg?raw=true)
![alt text](https://github.com/duochen13/Voice-Controlled-Photo-Album/blob/main/upload_demo_0.jpg?raw=true)


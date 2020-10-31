# QuickWork
Server host various API end points for authenticating users and then sending mail to any particular one.

# Guide 
After cloning this respository open the file 'credentials.js' and replace the variables with your own credentials. To obtain credentials goto "https://www.console.developers.goole.com" and set up your OAuth client, then enable Gmail API and set up your API key.

Now, open the terminal and type following command

```bash
npm start
```
This will start the nodemon server. Now for using API's type the following URL's in the addresss bar of your browser.
- For authentication:
```
http://localhost:8080/signin
```
- To send mails:
```
http://localhost:8080/mail?raw={message}
```
This message should be base64 encoded and should follow the Gmail API's guide for headers and body seperation. For reference look into following example of message body in plain text
```
From: YourMail@gmail.com
To: RecieversMail@gmail.com
Subject: Subject of the mail

Message goes here..
```
To encode this message to base64 encoding one can refer: "https://www.freeformatter.com/"


**Note**: *API's don't follow REST architecture just to ensure easy API calls from browser without the need of POSTMAN *
require('./passport.js');
const fs = require('fs');
const express = require('express');
const passport = require('passport');
const fetch = require('node-fetch');
const {USER_ID, API_KEY } = require('./credetials');

let raw = null;
const extractParams = (req, res, next) => {
    raw = req.query.raw;
    return next();
}

const PORT = 8080;
const app = express();
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('HelloWorld!');
});
app.get('/signin', 
    passport.authenticate('google', {scope: ['openid', 'profile', 'email']})
);
app.get('/mail',
    extractParams,
    passport.authenticate('google', {scope: ['openid', 'profile', 'email', 'https://www.googleapis.com/auth/gmail.send']})
);
app.get('/failed',
    (res, req) => {
        res.send('Failed!');
    }
);
// callback for both API end points
app.get('/callback',
    passport.authenticate('google', {failureRedirect: '/failed'}),
    (req, res) => {
        if(raw){
            // Gmail api call
            const url =`https://gmail.googleapis.com/gmail/v1/users/${USER_ID}/messages/send?key=${API_KEY}`;
            const params = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${req.user.accessToken}`
                },
                body: JSON.stringify({'raw': raw})
            }
            raw = null;
            fetch(url, params)
            .then((resp) => { 
                console.log(resp);
                res.send('Check your mail')
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            })
        } else {
            // Find or create user in db
            fs.readFile('./db.json', (err, data) => {
                if(err) throw err;
                let users = JSON.parse(data);

                let flag = true;
                for(let i=0; i<users.length; i++){
                    if(users[i].sub == req.user.profile._json.sub){
                        flag = false;
                        console.log(users[i]);
                        break;
                    }
                }
                if(flag){
                    users.push(req.user.profile._json);
                    fs.writeFile('./db.json', JSON.stringify(users, null, '\t'), err => {
                        if(err) throw err;
                    });
                    console.log(req.user.profile.displayName);
                }
            });
            res.send('Welcome ' + req.user.profile.displayName);
        }
    }
);

app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`);
});

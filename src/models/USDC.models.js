const fetch = require('node-fetch');
require('dotenv').config();
const { uuidv4 } = require('../utils/transaction.tools');
const sessionStorage = require('sessionstorage-for-nodejs');
const { decode } = require('jwt-decode');
const bcrypt = require('bcrypt');
const ip = require('ip');

const circleApiPayments = `${process.env.CIRCLE_API}/payments`;
const apiKey = process.env.CIRCLE_API_KEY;
const publicEncrypt = `${process.env.CIRCLE_API}/encryption/public`



const hashID = bcrypt.hashSync(decode(sessionStorage.tokenId)._id,10);
console.log(hashID);


async function publicEncryption(){

    const options= {
        method:'GET',
        headers:{
            Accept:"application/json",
            Authorization: `Bearer ${apiKey}`
        }
    };


    const data = await fetch(publicEncrypt, options)
                .then(res => res.json())
                .then(json=> {
                    console.log(json)
                })
                .catch(err => console.log('Encryption Error:' + err));
    
                



                

    return data
}

publicEncryption()




async function createPayment(){
    console.log('Paying for USDC');
    const options = {
        method: 'POST',
        headers:{
            Accept: 'application/json',
            'Content-Type':'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body:JSON.stringify({
            metadata: {
                email: decode(sessionStorage(token).email),
                phoneNumber: placeHolder,
                ipAddress: placeHolder,
                sessionId: hashID
            },
            amount:{
                amount: placeholder,
                currency: 'USD'
            },
            autoCapture:true,
            source:{
                type:'card'
            },
            verification:'cvv',
            keyId: placeHolder,
            description: placeHolder,
            idempotencyKey: uuidv4()
            

        })
    };
    const response = await fetch(circleApiPayments,{
        
    })
}
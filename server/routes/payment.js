const { user, course, paid_course, Sequelize } = require('../models');
const uuid = require('uuid/v4');
const axios = require('axios');
const paytmChecksum = require('../utils/checksum');
const Paytm = require('paytm-pg-node-sdk');
module.exports = () => {
    let exp = {};
    let Op = Sequelize.Op;
    exp.buyCourse = async (req, res) => {
        try {
            let bought = await paid_course.findOne({
                where: {
                    user_id: req.user.id, 
                    course_id: req.body.course_id
                }
            });
            if(bought && bought.txn_status == 'TXN_SUCCESS')
                return res.status(400).send('Course already bought');
            if(bought && bought.txn_status == 'PENDING')
                return res.status(400).send('Waiting for Payment Confirmation');
            let courseObj = await course.findOne({
                where: { id: req.body.course_id }
            });
            if(!courseObj)
                return res.status(400).send('Course does not exist');
            let orderId = uuid();
            console.log('Order id generated: ' + orderId);
            let paymentObj = await paid_course.upsert({
                course_id: courseObj.id,
                user_id: req.user.id,
                order_id: orderId,
                txn_status: 'INITIATED'
            });
            var paytmParams = {
                'MID': process.env.MERCH_ID,
                'WEBSITE': 'WEBSTAGING',
                'INDUSTRY_TYPE_ID': 'Retail',
                'CHANNEL_ID': 'WEB',
                'ORDER_ID': orderId,
                'CUST_ID': req.user.cust_id,
                'MOBILE_NO': req.user.phone,
                'EMAIL': req.user.email,
                'TXN_AMOUNT': courseObj.price,
                'CALLBACK_URL': 'http://localhost:5000/paytmresponse'
            };
            paytmChecksum.genchecksum(paytmParams, process.env.MERCH_KEY, (err, checksum) => {
                console.log("Checksum generated: " + checksum);
                let url = 'https://securegw-stage.paytm.in/order/process';
                let form = '';
                for(let i in paytmParams)
                    form += '<input type="hidden" name="' + i + '"value="' + paytmParams[i] + '">';
                form += '<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">';
                let html = '<html><head><title>Course Payment Checkout</title></head><body><center><h1>Payment is being processed. Please do not refresh or leave page</h1></center><form method="post" action="' + url + '" name="paytm">' + form + '</form><script type="text/javascript">document.paytm.submit();</script></body></html>';
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(html);
                return res.end();
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send(err);
        }
    }

    exp.paytmResponse = async (req, res) => {
        let paymentObj = await paid_course.findOne({
            where: {order_id: req.body.ORDERID}
        });
        if(!paymentObj)
            return res.status(400).send('Invalid order id');
        let paytmParams = {};
        let checksum = '';
        for(key in req.body){
            if(key === 'CHECKSUMHASH')
                checksum = req.body[key];
            else
                paytmParams[key] = req.body[key];
        }
        let verifyChecksum = paytmChecksum.verifychecksum(paytmParams, process.env.MERCH_KEY, checksum);
        if(!verifyChecksum)
            return res.status(400).send('Checksum mismatch');
        await paid_course.update({txn_status: req.body.STATUS}, {
            where: {order_id: req.body.ORDERID}
        });
        if(req.body.STATUS === 'TXN_SUCCESS')
            return res.status(200).send('Transaction successful');
        else if(req.body.STATUS === 'TXN_FAILURE')
            return res.status(400).send('Transaction failed');
    }
    // exp.buyCourse = async (req, res) => {
    //     try {
    //         let bought = await paid_course.findOne({
    //             where: {
    //                 user_id: req.user.id, 
    //                 course_id: req.body.course_id
    //             }
    //         });
    //         if(bought)
    //             return res.status(400).send('Course already bought');
    //         let courseObj = await course.findOne({
    //             where: { id: req.body.course_id }
    //         });
    //         if(!courseObj)
    //             return res.status(400).send('Course does not exist');
    //         let orderId = uuid();
    //         console.log('Order id generated: ' + orderId);
    //         let userObj = await user.findOne({
    //             where: {id: req.user.id }
    //         });
    //         if(!user.cust_id){
    //             let custId = uuid();
    //             await user.update({cust_id: custId}, {
    //                 where: {id: userObj.id}
    //             });
    //             userObj.cust_id = custId;
    //             console.log('Cust id generated: ' + userObj.cust_id);
    //         }
    //         let paymentObj = await paid_course.create({
    //             course_id: courseObj.id,
    //             user_id: userObj.id,
    //             order_id: orderId,
    //             txn_status: 'INITIATED'
    //         });
    //         Paytm.MerchantProperties.initialize(Paytm.LibraryConstants.STAGING_ENVIRONMENT, process.env.MERCH_ID, process.env.MERCH_KEY, 'WEBSTAGING');
    //         let channelId = Paytm.EChannelId.WEB;
    //         console.log(courseObj.price.toString());
    //         let txnAmount = Paytm.Money.constructWithCurrencyAndValue(Paytm.EnumCurrency.INR, courseObj.price.toString());
    //         let userInfo = new Paytm.UserInfo(userObj.cust_id); 
    //         userInfo.setEmail(userObj.email);
    //         userInfo.setFirstName(userObj.first_name);
    //         userInfo.setLastName(userObj.last_name);
    //         userInfo.setMobile(userObj.phone);
    //         let paymentDetailBuilder = new Paytm.PaymentDetailBuilder(channelId, orderId, txnAmount, userInfo);
    //         let paymentDetail = paymentDetailBuilder.build();
    //         let response = await Paytm.Payment.createTxnToken(paymentDetail);
    //         console.log(orderId);
    //         let readTimeout = 80000;
    //         let paymentStatusDetailBuilder = new Paytm.PaymentStatusDetailBuilder(orderId);
    //         let paymentStatusDetail = paymentStatusDetailBuilder.setReadTimeout(readTimeout).build();
    //         response = await Paytm.Payment.getPaymentStatus(paymentStatusDetail);
    //         console.log(response);
    //         return res.status(200).send(response);
    //     } catch (err) {
    //         console.log(err);
    //         return res.status(500).send(err);
    //     }
    // }
    return exp;
}
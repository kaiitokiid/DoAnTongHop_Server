const crypto = require('crypto');

const constants = require('../constants');
const Order = require('../models/Order');
const Category = require('../models/Category');

module.exports = Object.freeze({

    createTransaction: function (req, res) {
        const { userId, username, phoneNumber, address, shops, products, kindOfTransaction, totalPrice } = req.body;
        let momoStatus = 0;

        let productsData = products;
        if (kindOfTransaction == 0) {
            momoStatus = 1;
        }


        var partnerCode = "MOMO9TRL20210606";
        var accessKey = "vbvATqKiIbaG6dAA";
        var secretkey = "KsndNcFPGInwwlxs3iSHrb4vWMUHGh8B";
        var requestId = partnerCode + new Date().getTime();
        var orderId = requestId;
        var orderInfo = "Thanh toán đơn hàng bằng Ví Momo";
        var redirectUrl = "http://localhost:3000/payment";
        var ipnUrl = "http://localhost:3000/payment";
        // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
        var amount = totalPrice;
        var requestType = "captureWallet"
        var extraData = ""; //pass empty value if your merchant does not have stores

        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

        var signature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
            lang: 'en'
        });

        const data = shops.map((shopId) => {
            let products = productsData.filter(product => product.shopId === shopId)

            let totalPrice = products.reduce((total, item) => {
                return total + item.salePrice * item.quantity
            }, 0)
            let shopName = products[0].shopName;

            return {
                userId,
                username,
                phoneNumber,
                shopId,
                shopName,
                address,
                products,
                kindOfTransaction,
                totalPrice,
                momoId: orderId,
                momoStatus,
            }
        })

        Order.insertMany(data)
            .then((data) => {
                if (kindOfTransaction == 1) {
                    const https = require('https');
                    const options = {
                        hostname: 'test-payment.momo.vn',
                        port: 443,
                        path: '/v2/gateway/api/create',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(requestBody)
                        }
                    }
                    //Send the request and get the response
                    const reqsponse = https.request(options, ress => {
                        console.log(`Status: ${ress.statusCode}`);
                        console.log(`Headers: ${JSON.stringify(ress.headers)}`);
                        ress.setEncoding('utf8');
                        ress.on('data', (body) => {
                            console.log('Body: ');
                            console.log(body);
                            console.log('payUrl: ');
                            console.log(JSON.parse(body).payUrl);

                            res.json({
                                isSuccess: true,
                                url: JSON.parse(body).payUrl
                            });
                        });
                        ress.on('end', () => {
                            console.log('No more data in response.');
                        });
                    })

                    reqsponse.on('error', (e) => {
                        console.log(`problem with request: ${e.message}`);
                    });
                    // write data to request body
                    console.log("Sending....")
                    reqsponse.write(requestBody);
                    reqsponse.end();
                }
                else {
                    return res.json({
                        isSuccess: true,
                        message: "Đặt hàng thành công!"
                    })
                }
            })
            .catch(err => {
                console.log(err);
                return res.json({
                    isSuccess: false,
                    message: "Thanh toán có thất bại!"
                });
            })


    },

    saveTransaction: function (req, res) {

        const momoId = req.body.momoId;

        Order.updateMany({ momoId }, { momoStatus: 1 })
            .then(data => {
                return res.json({
                    isSuccess: true,
                    message: "Update đơn hàng thành công!"
                });
            })
            .catch(err => {
                console.log(err);
                return res.json({
                    isSuccess: false,
                    message: "Update đơn hàng thất bại!"
                });
            })
    },

    getTurnover: function (req, res) {
        const id = req.params.id;

        const keyword = !req.query.keyword ? '' : req.query.keyword.toLocaleLowerCase();
        const minPrice = !req.query.minPrice || req.query.minPrice < 0 ? 0 : parseInt(req.query.minPrice);
        const maxPrice = !req.query.maxPrice || req.query.maxPrice < 0 ? 0 : parseInt(req.query.maxPrice);
        const priceOrder = !req.query.priceOrder ? 0 : parseInt(req.query.priceOrder);
        let kindOfTransaction = !req.query.kindOfTransaction ? 0 : 1;
        let status = !req.query.status ? '' : 1;
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        const page = !req.query.page || req.query.page < 1 ? 1 : parseInt(req.query.page);
        let pageSize = !req.query.pageSize || req.query.pageSize < 1 ? 10 : parseInt(req.query.pageSize);

        let totalPage;
        let firstItem;
        let lastItem;

        firstItem = page === 1 ? 0 : (page - 1) * pageSize;
        lastItem = page === 1 ? pageSize - 1 : page * pageSize - 1;
        // console.log('firstItem: ', firstItem, 'lastItem: ', lastItem);

        const skipNumber = (page - 1) * pageSize;

        Order.find({
            shopId: id,
            createdAt: {
                $gte: new Date(startDate),
            },
            updatedAt: {
                $lte: new Date(endDate),
            },
        })
            .sort({ createdAt: -1 })
            .then(data => {
                // console.log(data);
                // Search
                if (keyword) {
                    // console.log("keyword");
                    data = data.filter((item) => {
                        let id = item._id.toHexString();
                        let username = item.username;

                        return username.toLowerCase().includes(keyword)
                            || id.toLowerCase().includes(keyword)
                    });
                    // console.log(data);
                }

                // Filter
                if (minPrice && maxPrice && maxPrice >= minPrice) {
                    // console.log("min && max");
                    data = data.filter((item) => {
                        return item.totalPrice >= minPrice && item.totalPrice <= maxPrice;
                    });
                    // console.log(data);

                }
                if (minPrice && maxPrice == false) {
                    // console.log("max == false");
                    data = data.filter((item) => {
                        return item.totalPrice >= minPrice;
                    });
                    // console.log(data);
                }
                if (minPrice == false && maxPrice) {
                    // console.log("min == false");
                    data = data.filter((item) => {
                        return item.totalPrice <= maxPrice;
                    });
                    // console.log(data);

                }

                if (kindOfTransaction) {
                    kindOfTransaction = req.query.kindOfTransaction;
                    // console.log("category");
                    data = data.filter((item) => {
                        return item.kindOfTransaction == kindOfTransaction;
                    });
                    // console.log(data);
                }

                if (priceOrder > 0) {
                    // console.log("priceOrder > 0");
                    data = data.sort((a, b) => {
                        return a.totalPrice - b.totalPrice
                    });
                    // console.log(data);
                }
                else if (priceOrder < 0) {
                    // console.log("priceOrder < 0");
                    data = data.sort((a, b) => {
                        return b.totalPrice - a.totalPrice
                    });
                    // console.log(data);
                }

                if (status) {
                    status = req.query.status;
                    // console.log("status");
                    data = data.filter((item) => {
                        return item.status == status;
                    });
                    // console.log(data);
                }
                return data;
            })
            // filter qua page
            .then(data => {
                totalPage = Math.ceil(data.length / pageSize);
                data = data.filter((item, index) => {
                    return index >= firstItem && index <= lastItem ? item : '';
                })

                const turnover = data.reduce((total, item) => {
                    return total + item.totalPrice
                }, 0)

                return res.json({
                    isSuccess: true,
                    data,
                    turnover,
                    totalPage
                });
            })
            .then(data => {
                res.json({
                    isSuccess: true,
                    data,
                    totalPage
                })
            })
            .catch(err => {
                console.log(err);
                res.json({
                    isSuccess: false,
                    message: 'Không tìm thấy đơn hàng nào!'
                })
            })

    },
});
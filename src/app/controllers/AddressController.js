const userModule = require('../modules/user.module');
const Address = require('../models/Address');


class AddressController {

    // [POST] /add
    add(req, res, next) {
        // userModule.register(req, res, "user");
        console.log(req.body);
        const address = Address(req.body);
        address.save()
            .then(data => {
                console.log(data);
                res.json("oke");
            })
            .catch(err => {
                console.log(err);
                res.json("not oke");
            })
    }

    // [POST] /add
    test(req, res, next) {
        console.log(req.body);
        const address = Address(req.body);
        address.save()
            .then(data => {
                console.log(data);
                res.json("oke");
            })
            .catch(err => {
                console.log(err);
                res.json("not oke");
            })
    }
}

module.exports = new AddressController();

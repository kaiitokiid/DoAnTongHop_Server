const userModule = require('../modules/user.module');

class SiteController {

    // [POST] /
    index(req, res, next) { 
        return res.json({ 
            text: req.text,
            image: req.image,
            message: "res"
        })
    }
}

module.exports = new SiteController();

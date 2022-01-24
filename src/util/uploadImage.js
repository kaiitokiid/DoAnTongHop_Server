const { cloudinary } = require('../config/cloudinary');

import constants from '../../constants'
import User from '../models/User'
import Product from '../models/Product'

module.exports ={
    uploadUserImage: (id, file) => {
        try {
            const uploadResponse = await cloudinary.uploader.upload(file, {
                upload_preset: 'users',
            })
            .then(result => {
                let imageData = {
                    imagePath: result.public_id,
                    title: 'avatar'
                }
                User.updateOne(id, {images: imageData})
            })
        } catch (err) {
            res.status(500).json(constants.ERROR.SERVER);
        }
    },

    uploadProductImage: (id, file) => {
        try {
            const uploadResponse = await cloudinary.uploader.upload(file, {
                upload_preset: 'products',
            })
            .then(result => {
                let imageData = {
                    imagePath: result.public_id,
                    title: 'avatar',
                    isDefault: true
                }
                Product.updateOne(id, {images: imageData})
            })
        } catch (err) {
            res.status(500).json(constants.ERROR.SERVER);
        }
    },
};
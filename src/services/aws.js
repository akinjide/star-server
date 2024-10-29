const http = require('http')
const config = require('config')
const uuid = require('uuid')
const S3 = require('aws-sdk/clients/s3')
const passport = require('passport')
const logger = require('../logger')
const {
    isAuthorized,
    isAuthenticated,
    isPermitted,
    isLessThanTwoAuthorized,
    isLessThanThreeAuthorized,
    isEqualAuthorized,
    roles
} = require('../hooks/policy')
const { handleError, handleSuccess } = require('../hooks/http')
const validation = require('../hooks/validation')

const fileFormat = (mime) => {
    if (mime) {
        const [, format] = mime.split('/');
        return '.' + format;
    }

    return '';
};

module.exports = (app, options) => {
    const s3Cfg = config.get('s3')
    const s3 = new S3({
        apiVersion: '2006-03-01',
        accessKeyId: s3Cfg.accessKeyId,
        secretAccessKey: s3Cfg.secretAccessKey,
        region: s3Cfg.region
    })

    app.get('/aws/upload', validation.aws.upload, isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { id } = req.user
        const { content_type, upload_type } = req.query
        const format = fileFormat(content_type)

        if (!format) {
            return 'unknown file format'
        }

        const key = uuid.v4() + format
        const params = {
            Bucket: s3Cfg.bucket,
            Key: `${upload_type}/${id}/${key}`,
            Expires: s3Cfg.expiresInSec,
            ContentType: content_type,

            // This ACL makes the uploaded object publicly readable.
            ACL: 'public-read'
        }

        s3.getSignedUrl('putObject', params, (err, result) => {
            if (err) {
                return handleError(err, req, res)
            }

            return handleSuccess(req, res, null, {
                key,
                content_type,
                ...result,
            })
        })
    })

    app.delete('/aws/delete', validation.aws.delete, isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { path } = req.body
        const params = {
            Bucket: s3Cfg.bucket,
            Key: path
        }

        s3.headObject(params, (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            return s3.deleteObject(params, (err, b) => {
                if (err) {
                    return handleError(err, req, res)
                }

                return handleSuccess(req, res, null, b)
            })
        })
    })
}

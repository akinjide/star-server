const { createLogger, format, transports } = require('winston')
const flattenRequest = format((info, opts) => {
    if (info.req) {
        const {
            headers,
            httpVersion,
            url,
            method,
            params,
            query,
        } = info.req

        return {
            ...info,
            req: {
                headers,
                httpVersion,
                url,
                method,
                params,
                query,
            }
        }
    }

    return info;
});

module.exports = createLogger({
    level: 'info',
    format: format.combine(
        flattenRequest(),
        format.json()
    ),
    transports: [new transports.Console()]
})

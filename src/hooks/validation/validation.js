module.exports = (o, schema, done) => {
    const { error, value } = schema.validate(o);

    if (error) {
        return done(error, false, null)
    }

    done(null, true, value)
}

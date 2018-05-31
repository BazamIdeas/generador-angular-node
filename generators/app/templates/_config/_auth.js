module.exports = {
    production: {
        enabled: true,
        secretKey: process.env.SECRET_KEY,
        exp: {
            unit: "days",
            qty: 7
        }
    },
    development: {
        enabled: true,
        secretKey: process.env.SECRET_KEY,
        exp: {
            unit: "days",
            qty: 7
        }
    }
}
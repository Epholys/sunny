module.exports = {

    sunny: {
        /* Which port this nodejs application use. */
        port: 3000,
        /* The base directory served by the application. */
        base_dir: '/relative/path/to/dir'
    },

    /* Session middleware parameters. */
    sess: {
        cookie: {
            secure: true /* WARNING: needs SSL configured */
        },
        name: 'connect.sid.funny',
        proxy: true,     /* Trusts the reverse proxy */
        resave: false,
        saveUninitialized: false,
        secret: 'your passphrase here'
    },

    user: {
        username: 'yourUsername',
        hashed_passwd: 'Hashed Password', /* This string must be your password hashed by bcrypt */
	    key: 'Base32 Encoded OTP Key'     /* Secret OTP key base32 encoded */
    }
    
}

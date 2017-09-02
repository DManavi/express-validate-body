/**
 * Express/Connect validate body
 */

// load AJV
const Ajv = require("ajv");

// load defaults
const defaults = require("defaults");

// default options
const defaultOptions = {

    store: require("./store-local.js"),

    statusCode: 400,

    statusMessage: "Bad Request"
};

/**
 * Validate request body
 * @param {Object} body Request body
 * @param {Object} schema JSON schema
 * @param {Object} options Module options
 */
const validateBody = (body, schema, options) => {

    return new Promise((resolve, reject) => {

        try {

            // create new instance of the AJV
            const ajv = new Ajv();

            // validate body
            const result = ajv.validate(schema, body);

            // if validation failed
            if (!result) {

                // create new error
                const err = new Error("Request body is not valid");

                // attach status code to the error
                err.statusCode = options.statusCode;

                // if status message defined
                if (options.statusMessage) {

                    // attach status message to the error
                    err.statusMessage = options.statusMessage;
                }

                // attach errors text to the msg property of the error
                err.msg = ajv.errorsText;

                // attach error details to the details property of the error
                err.details = ajv.errors;

                // throw exception
                throw err;
            }

            // resolve the promise
            resolve();
        }
        catch (err) {

            // reject the promise
            return reject(err);
        }
    });
};

/**
 * Create new schema validator
 * @param {Object|String} schema Schema id or a valid JSON schema
 * @param {Object} options Configuration options
 * @return {Function} Express/Connect middleware
 */
module.exports = (schema, options) => {

    // provided schema should be an object or a string
    if (!(typeof schema === typeof '' || typeof schema === typeof {})) {

        throw new Error(`Provided schema type (${typeof schema}) is not acceptable. I only accept string and object.`);
    }

    // merge options with default options
    options = defaults(options, defaultOptions);

    return (req, res, next) => {

        try {

            // if provided schema is a path or id
            if (typeof schema === typeof '') {

                // load schema
                options.store.load(schema)
                    .then((s) => {

                        // validate body
                        validateBody(req.body, s)
                            .then(() => next())
                            .catch((err) => next(err));

                    }).catch((err) => next(err));
            }
            else {

                // validate body
                validateBody(req.body, schema)
                    .then(() => next())
                    .catch((err) => next(err));
            }
        }
        catch (err) {

            // call next middleware with error
            return next(err);
        }
    };
};
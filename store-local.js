/**
 * Local storage provider
 */

/**
 * Load an schema from local disk
 * @param {String} schemaPath Schema path
 * @return {Object} Loaded schema
 */
module.exports.load = (schemaPath) => {

    return new Promise((resolve, reject) => {

        try {

            // load requested schema
            const schema = require(schemaPath);

            // resolve the schema
            return resolve(schema);
        }
        catch (err) {

            // reject the promise
            return reject(err);
        }
    });
};
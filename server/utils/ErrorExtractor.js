//extracts validation error messages from a Mongoose ValidationError object
function extractValidationErrors(err) {
    const errors = {};
    if (err.name === 'ValidationError') {
        for (const field in err.errors) {
            if (err.errors.hasOwnProperty(field)) {
                errors[field] = err.errors[field].message;
            }
        }
    }
    return errors;
}
export default extractValidationErrors;


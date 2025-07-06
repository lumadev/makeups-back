/**
 * Validates required fields in an object.
 *
 * @param {Object} data - The object to validate (e.g., req.body).
 * @param {Object} requiredFields - Keys and human-readable names of required fields. Example: { name: 'Name' }.
 * @returns {string|null} - Returns an error message if a field is missing, or null if all required fields are present.
 */
function validateFields(data, requiredFields) {
  for (const field in requiredFields) {
    if (!data[field]) {
      return `O campo ${requiredFields[field]} é obrigatório`;
    }
  }
  return null;
}

export { validateFields }
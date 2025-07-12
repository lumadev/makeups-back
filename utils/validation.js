/**
 * Validates required fields in an object.
 *
 * @param {Object} data - The object to validate (e.g., req.body).
 * @param {Object} requiredFields - Keys and human-readable names of required fields. Example: { name: 'Name' }.
 * @returns {string|null} - Returns an error message if a field is missing, or null if all required fields are present.
 */
function errorFieldsRequired(data, requiredFields) {
  for (const field in requiredFields) {
    if (!data[field]) {
      return `O campo ${requiredFields[field]} é obrigatório`;
    }
  }
  return null;
}

/**
 * Validates date fields in an object.
 * 
 * @param {*} date 
 * @returns {string|null} - Returns an error message if a field has invalid date
 */
function errorsDate(data, dateFields) {
  for (const field in dateFields) {
    const fieldValue = data[field];

    if (!validateDate(fieldValue)) {
      return `O campo ${dateFields[field]} é inválido`;
    }
  }
  return null
}

/**
 * @param {String} date 
 * @returns {Boolean} if date is valid
 */
function validateDate(date) {
  const dateVar = new Date(date);

  if (isNaN(dateVar.getTime())) {
    return true
  }
  return false
}

export { errorFieldsRequired, errorsDate, validateDate }
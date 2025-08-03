import { getMakeupById } from '../services/makeupService.js'
import { getStudentById } from '../services/studentService.js'
import { errorFieldsRequired, errorsDate, validateDate } from '../utils/validations.js'

const requiredFields = {
  studentId: 'Estudante',
  dateOld: 'Data Antiga'
}

const dateOldField = {
  dateOld: 'Data Antiga'
}

/**
 * Validate dateReplacement.
 * 
 * @param {*} date 
 * @returns {string|null} - Returns an error message if dateReplacement is invalid
 */
function errorDateReplacement(data) {
  const isOpenDate = data.isOpenDate
  const dateReplacement = data.dateReplacement

  // only validate if the makeup class does not have an open date
  if (isOpenDate) return null

  if (!dateReplacement) {
    return `O campo data de reposição é obrigatório`
  }

  if (!validateDate(dateReplacement)) {
    return `O campo data de reposição é inválido`
  }
  return null
}

async function validatePost(req, res, next) {
  const errorRequired = errorFieldsRequired(req.body, requiredFields)
  if (errorRequired) {
    return res.status(400).json({ error: errorRequired })
  }

  const errorDate = errorsDate(req.body, dateOldField)
  if (errorDate) {
    return res.status(400).json({ error: errorDate })
  }

  const errorDateReplacementVar = errorDateReplacement(req.body)
  if (errorDateReplacementVar) {
    return res.status(400).json({ error: errorDateReplacementVar })
  }

  const { studentId } = req.body

  const student = await getStudentById(studentId)
  if (!student) {
    return res.status(404).json({ error: 'Aluno não encontrado' })
  }
  req.student = student

  next()
}

async function validatePut(req, res, next) {
  const makeupId = Number(req.params.id)

  const makeup = await getMakeupById(makeupId)
  if (!makeup) {
    return res.status(404).json({ error: 'Reposição não encontrada' })
  }
  req.makeup = makeup

  const { studentId, dateOld } = req.body

  if (dateOld && !validateDate(dateOld)) {
    return res.status(400).json({ error: 'Data antiga inválida' })
  }

  const errorDateReplacementVar = errorDateReplacement(req.body)
  if (errorDateReplacementVar) {
    return res.status(400).json({ error: errorDateReplacementVar })
  }

  if (studentId) {
    const studentUpdated = await getStudentById(studentId)
    if (!studentUpdated) {
      return res.status(404).json({ error: 'Aluno não encontrado' })
    }
    req.studentUpdated = studentUpdated
  }

  next()
}

async function validateDelete(req, res, next) {
  const makeupId = Number(req.params.id)

  const makeup = await getMakeupById(makeupId)
  if (!makeup) {
    return res.status(404).json({ error: 'Reposição não encontrada' })
  }

  next()
}

export { validatePost, validatePut, validateDelete }

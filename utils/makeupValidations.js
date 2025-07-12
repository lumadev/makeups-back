import { getMakeupById } from '../services/makeupService.js';
import { getStudentById } from '../services/studentService.js';
import { errorFieldsRequired, errorsDate, validateDate } from '../utils/validation.js';

const requiredFields = {
  studentId: 'Estudante',
  dateOld: 'Data Antiga',
  dateReplacement: 'Data Nova',
};

const dateFields = {
  dateOld: 'Data Antiga',
  dateReplacement: 'Data Nova',
};

async function validatePost(req, res, next) {
  const errorRequired = errorFieldsRequired(req.body, requiredFields);
  if (errorRequired) {
    return res.status(400).json({ error: errorRequired });
  }

  const errorDate = errorsDate(req.body, dateFields);
  if (errorDate) {
    return res.status(400).json({ error: errorDate });
  }

  const { studentId } = req.body;

  const student = await getStudentById(studentId);
  if (!student) {
    return res.status(404).json({ error: 'Aluno não encontrado' });
  }
  req.student = student

  next();
}

async function validatePut(req, res, next) {
  const makeupId = Number(req.params.id);

  const makeup = await getMakeupById(makeupId);
  if (!makeup) {
    return res.status(404).json({ error: 'Reposição não encontrada' });
  }
  req.makeup = makeup

  const { studentId, dateOld, dateReplacement } = req.body;

  console.log(dateOld)
  console.log(dateReplacement)

  if (dateOld && !validateDate(dateOld)) {
    return res.status(400).json({ error: 'Data antiga inválida' });
  }

  if (dateReplacement && !validateDate(dateReplacement)) {
    return res.status(400).json({ error: 'Data de reposição inválida' });
  }

  if (studentId) {
    const studentUpdated = await getStudentById(studentId);
    if (!studentUpdated) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    req.studentUpdated = studentUpdated
  }

  next();
}

async function validateDelete(req, res, next) {
  const makeupId = Number(req.params.id);

  const makeup = await getMakeupById(makeupId);
  if (!makeup) {
    return res.status(404).json({ error: 'Reposição não encontrada' });
  }

  next();
}

export { validatePost, validatePut, validateDelete };

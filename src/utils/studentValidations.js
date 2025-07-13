import { errorFieldsRequired, checkMaxLengths } from './validations.js';
import { getStudentById } from '../services/studentService.js';

const requiredFields = {
  name: 'Nome',
  phone: 'Telefone',
  email: 'Email',
};

const maxLengths = {
  name: 100,
  phone: 20,
  email: 254,
};

function validatePost(req, res, next) {
  const error = errorFieldsRequired(req.body, requiredFields);
  if (error) {
    return res.status(400).json({ error });
  }
  const lengthError = checkMaxLengths(req.body, maxLengths);
  if (lengthError) {
    return res.status(400).json({ error: lengthError });
  }
  next();
}

async function validatePut(req, res, next) {
  const error = errorFieldsRequired(req.body, requiredFields);
  if (error) {
    return res.status(400).json({ error });
  }
  const lengthError = checkMaxLengths(req.body, maxLengths);
  if (lengthError) {
    return res.status(400).json({ error: lengthError });
  }

  const studentId = Number(req.params.id);

  const student = await getStudentById(studentId);
  if (!student) {
    return res.status(404).json({ error: 'Aluno não encontrado' });
  }
  next();
}

async function validateDelete(req, res, next) {
  const studentId = Number(req.params.id);

  const student = await getStudentById(studentId);
  if (!student) {
    return res.status(404).json({ error: 'Aluno não encontrado' });
  }
  next();
}

export { validatePost, validatePut, validateDelete }
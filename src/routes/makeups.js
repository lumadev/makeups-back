import { getAllMakeups } from '../services/makeupService.js';
import { validatePost, validatePut, validateDelete } from '../utils/makeupValidations.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

import express from 'express'
import db from '../../db.js'

const router = express.Router()

router.use(verifyToken);

router.get('/', async (req, res) => {
  const makeups = await getAllMakeups();
  res.json(makeups)
})

router.post('/', validatePost, async (req, res) => {
  await db.read()
  
  const { studentId, dateOld, dateReplacement } = req.body

  const newMakeup = {
    id: Date.now(),
    studentId,
    // get student from makeupValidations
    studentName: req.student.name,
    dateOld,
    dateReplacement
  }
  await db.read()

  db.data.reposicoes = db.data.reposicoes || []
  db.data.reposicoes.push(newMakeup)

  await db.write()

  res.status(201).json(newMakeup)
})

router.put('/:id', validatePut, async (req, res) => {
  const { id } = req.params;
  const { studentId, dateOld, dateReplacement } = req.body;

  // get makeup from makeupValidations
  const makeup = req.makeup

  // Search for student updated name
  let updatedStudentName = makeup.studentName;

  if (studentId) {
    updatedStudentName = req.studentUpdated.name;
  }

  const updatedMakeup = {
    ...makeup,
    studentId: studentId ?? makeup.studentId,
    studentName: updatedStudentName,
    dateOld: dateOld ?? makeup.dateOld,
    dateReplacement: dateReplacement === undefined ? makeup.dateReplacement : dateReplacement,
  };

  await db.read();

  const makeupIndex = db.data.reposicoes.findIndex(r => String(r.id) === String(id));
  db.data.reposicoes[makeupIndex] = updatedMakeup;
  
  await db.write();

  res.json(updatedMakeup);
});

router.delete('/:id', validateDelete, async (req, res) => {
  const makeupId = Number(req.params.id)

  await db.read()
  db.data.reposicoes = db.data.reposicoes || []

  const index = db.data.reposicoes.findIndex(makeup => makeup.id === makeupId)
  db.data.reposicoes.splice(index, 1)

  await db.write()

  res.status(200).json({ message: 'Reposição removida com sucesso' })
})

export default router
import { getAllMakeups } from '../services/makeupService.js';
import { validatePost, validatePut, validateDelete } from '../utils/makeupValidations.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

import express from 'express'
import { initDB } from '../db/db.js'

const router = express.Router()

router.use(verifyToken);

router.get('/', async (req, res) => {
  const makeups = await getAllMakeups();
  res.json(makeups)
})

router.post('/', validatePost, async (req, res) => {
  const db = await initDB()
  
  const { studentId, dateOld, dateReplacement, isOpenDate } = req.body

  const newMakeup = {
    id: Date.now(),
    studentId,
    studentName: req.student.name, // get student from makeupValidations
    dateOld,
    dateReplacement,
    isOpenDate: isOpenDate ?? false,
  }

  await db.read()

  db.data.reposicoes = db.data.reposicoes || []
  db.data.reposicoes.unshift(newMakeup)

  await db.write()

  res.status(201).json(newMakeup)
})

router.put('/:id', validatePut, async (req, res) => {
  const db = await initDB()

  const { id } = req.params;
  const { studentId, dateOld, dateReplacement, isOpenDate } = req.body;

  // get makeup from makeupValidations
  const makeup = req.makeup

  let updatedStudentName = makeup.studentName;

  if (studentId) {
    // get studentUpdated from makeupValidations
    updatedStudentName = req.studentUpdated.name;
  }

  const updatedMakeup = {
    ...makeup,
    studentId: studentId ?? makeup.studentId,
    studentName: updatedStudentName,
    dateOld: dateOld ?? makeup.dateOld,
    dateReplacement: dateReplacement === undefined ? makeup.dateReplacement : dateReplacement,
    isOpenDate: isOpenDate === undefined ? makeup.isOpenDate : isOpenDate,
  };

  await db.read();

  const makeupIndex = db.data.reposicoes.findIndex(r => String(r.id) === String(id));
  db.data.reposicoes[makeupIndex] = updatedMakeup;
  
  await db.write();

  res.json(updatedMakeup);
});

router.delete('/:id', validateDelete, async (req, res) => {
  const db = await initDB()
  const makeupId = Number(req.params.id)

  await db.read()
  db.data.reposicoes = db.data.reposicoes || []

  const index = db.data.reposicoes.findIndex(makeup => makeup.id === makeupId)
  db.data.reposicoes.splice(index, 1)

  await db.write()

  res.status(200).json({ message: 'Reposição removida com sucesso' })
})

export default router
import { getAllMakeups, getMakeupById } from '../services/makeupService.js';
import { getStudentById } from '../services/studentService.js';
import { validateFields } from '../utils/validation.js';

import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const makeups = await getAllMakeups();
  res.json(makeups)
})

router.post('/', async (req, res) => {
  const requiredFields = {
    studentId: 'Estudante',
    dateOld: 'Data Antiga',
    dateReplacement: 'Data Nova',
  }

  const error = validateFields(req.body, requiredFields);
  if (error) return res.status(400).json({ error });

  const { studentId, dateOld, dateReplacement } = req.body

  // Search student by id
  const student = await getStudentById(studentId);
  if (!student) {
    return res.status(404).json({ error: 'Aluno não encontrado' })
  }

  const newMakeup = {
    id: Date.now(),
    studentId,
    studentName: student.name,
    dateOld,
    dateReplacement
  }
  await db.read()

  db.data.reposicoes = db.data.reposicoes || []
  db.data.reposicoes.push(newMakeup)

  await db.write()

  res.status(201).json(newMakeup)
})

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { studentId, dateOld, dateReplacement } = req.body;

  const makeup = await getMakeupById(id);
  if (!makeup) {
    return res.status(404).json({ error: 'Reposição não encontrada' });
  }

  // Search for student updated name
  let updatedStudentName = makeup.studentName;

  if (studentId) {
    const studentUpdated = await getStudentById(studentId);
    if (!studentUpdated) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    updatedStudentName = studentUpdated.name;
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

router.delete('/:id', async (req, res) => {
  const makeupId = Number(req.params.id)

  const makeup = await getMakeupById(makeupId);
  if (!makeup) {
    return res.status(404).json({ error: 'Reposição não encontrada' });
  }

  await db.read()
  db.data.reposicoes = db.data.reposicoes || []

  const index = db.data.reposicoes.findIndex(makeup => makeup.id === makeupId)
  db.data.reposicoes.splice(index, 1)

  await db.write()

  res.status(200).json({ message: 'Reposição removida com sucesso' })
})

export default router
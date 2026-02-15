import { getMakeupDoneById } from './makeupsDoneService.js'

async function validateDelete(req, res, next) {
  const makeupId = Number(req.params.id)

  const makeup = await getMakeupDoneById(makeupId)
  if (!makeup) {
    return res.status(404).json({ error: 'Reposição não encontrada' })
  }

  next()
}

export {
  validateDelete
}

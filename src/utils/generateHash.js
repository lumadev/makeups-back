import bcrypt from "bcrypt"

const hashPassword = async (plainPassword) => {
  const saltRounds = 12
  return await bcrypt.hash(plainPassword, saltRounds)
}

const run = async () => {
  const senhaOriginal = "passtest"

  // eslint-disable-next-line
  const senhaHash = await hashPassword(senhaOriginal)
}

run()

import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const pnpmCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: true })

  if (res.status !== 0) {
    console.error(`\n❌ Erro ao executar: ${cmd} ${args.join(' ')}`)
    if (res.error) {
      console.error('Erro interno:', res.error)
    }
    if (res.stderr) {
      console.error('stderr:', res.stderr.toString())
    }
    return false
  }

  return true
}

function runCapture(cmd, args) {
  const res = spawnSync(cmd, args, { encoding: 'utf8', shell: true })

  if (res.status !== 0) {
    console.error(`\n❌ Erro ao executar: ${cmd} ${args.join(' ')}`)
    if (res.error) {
      console.error('Erro interno:', res.error)
    }
    if (res.stderr) {
      console.error('stderr:', res.stderr)
    }
  }

  return { ok: res.status === 0, stdout: res.stdout || '', stderr: res.stderr || '' }
}

function majorOf(v) {
  if (!v) return 0
  const s = String(v).replace(/^[~^><= ]+/, '')
  const m = s.match(/^(\d+)/)
  return m ? Number(m[1]) : 0
}

function updatePackageJson(depsToUpdate) {
  const pkgPath = resolve(process.cwd(), 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

  for (const { name, latest, type } of depsToUpdate) {
    const range = `^${latest}`
    if (type === 'dependencies' && pkg.dependencies?.[name] !== undefined) {
      pkg.dependencies[name] = range
    } else if (type === 'devDependencies' && pkg.devDependencies?.[name] !== undefined) {
      pkg.devDependencies[name] = range
    }
  }

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
}

function main() {
  const u1 = run(pnpmCmd, ['update'])
  if (!u1) return

  const { ok, stdout } = runCapture(pnpmCmd, ['outdated', '--json'])
  if (!ok) return

  let data
  try {
    data = JSON.parse(stdout || '{}')
  } catch (err) {
    console.error('❌ Erro ao fazer parse do JSON:', err)
    return
  }

  const depsToUpdate = []
  for (const [name, info] of Object.entries(data)) {
    const curM = majorOf(info.current)
    const latM = majorOf(info.latest)
    if (latM > curM) {
      depsToUpdate.push({ name, latest: info.latest, type: info.dependencyType })
    }
  }

  if (depsToUpdate.length > 0) {
    updatePackageJson(depsToUpdate)
    const allowScripts = process.env.UPDATE_LIBS_ALLOW_SCRIPTS === 'true'
    const installArgs = allowScripts ? ['install'] : ['install', '--ignore-scripts']

    const u2 = run(pnpmCmd, installArgs)
    if (!u2) return
  }
}

main()

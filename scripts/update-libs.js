import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const pnpmCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: false })
  return res.status === 0
}

function runCapture(cmd, args) {
  const res = spawnSync(cmd, args, { encoding: 'utf8', shell: false })
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
    if (type === 'dependencies' && pkg.dependencies && pkg.dependencies[name] !== undefined) {
      pkg.dependencies[name] = range
    } else if (type === 'devDependencies' && pkg.devDependencies && pkg.devDependencies[name] !== undefined) {
      pkg.devDependencies[name] = range
    }
  }
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
}

function main() {
  const u1 = run(pnpmCmd, ['update'])
  if (!u1) process.exit(1)

  const { stdout } = runCapture(pnpmCmd, ['outdated', '--json'])
  let data = {}
  try {
    data = JSON.parse(stdout || '{}')
  } catch {
    data = {}
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
    if (!u2) process.exit(1)
  }
}

main()

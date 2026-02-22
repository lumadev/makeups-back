import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const pnpmCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

/** Blocklisted keys to avoid prototype pollution when writing to package.json */
const FORBIDDEN_NAMES = new Set(['__proto__', 'constructor', 'prototype'])

/** Semver-like: at least major, optional minor/patch, optional prerelease/build. No quotes, newlines, or path chars. */
const SAFE_VERSION = /^[0-9]+(\.[0-9]+)*(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/

function isSafePackageName(name) {
  if (typeof name !== 'string' || name.length === 0 || name.length > 214) return false
  if (FORBIDDEN_NAMES.has(name)) return false
  for (let i = 0; i < name.length; i++) {
    const code = name.charCodeAt(i)
    if (code <= 0x1f || code === 0x7f) return false
  }
  if (name.includes('..') || name.includes('\\')) return false
  return true
}

function isSafeVersion(version) {
  return typeof version === 'string' && version.length <= 64 && SAFE_VERSION.test(version)
}

/** Uses shell on Windows so pnpm.cmd resolves; cmd/args are script-controlled (no user input). */
function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' })

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
  const res = spawnSync(cmd, args, { encoding: 'utf8', shell: process.platform === 'win32' })

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

function getDependencyType(pkg, name) {
  if (pkg.dependencies?.[name] !== undefined) return 'dependencies'
  if (pkg.devDependencies?.[name] !== undefined) return 'devDependencies'
  return 'dependencies'
}

function updatePackageJson(depsToUpdate, pkg) {
  const pkgPath = resolve(process.cwd(), 'package.json')

  for (const { name, latest, type } of depsToUpdate) {
    const range = `^${latest}`
    const section = type === 'devDependencies' ? pkg.devDependencies : pkg.dependencies
    if (section?.[name] !== undefined) {
      section[name] = range
    }
  }

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
}

function main() {
  if (!run(pnpmCmd, ['update'])) return

  const { stdout } = runCapture(pnpmCmd, ['outdated', '--format', 'json'])
  const out = (stdout || '').trim()
  if (!out) {
    console.error('❌ pnpm outdated não retornou saída.')
    return
  }

  let data
  try {
    data = JSON.parse(out)
  } catch(err) {
    console.error('❌ Erro ao fazer parse do JSON:', err)
    return
  }

  if (typeof data !== 'object' || data === null) {
    console.error('❌ Saída de pnpm outdated não é um objeto JSON.')
    return
  }

  const pkgPath = resolve(process.cwd(), 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

  const depsToUpdate = []
  for (const [name, info] of Object.entries(data)) {
    if (!info?.latest) continue
    if (!isSafePackageName(name) || !isSafeVersion(info.latest)) {
      console.warn(`⚠️ Ignorando entrada inválida: name=${JSON.stringify(name)}, latest=${JSON.stringify(info?.latest)}`)
      continue
    }
    const type = info.dependencyType || getDependencyType(pkg, name)
    if (type !== 'dependencies' && type !== 'devDependencies') continue
    depsToUpdate.push({ name, latest: info.latest, type })
  }

  if (depsToUpdate.length > 0) {
    console.log(`\n📦 Atualizando ${depsToUpdate.length} dependência(s) no package.json…`)
    updatePackageJson(depsToUpdate, pkg)
    const allowScripts = process.env.UPDATE_LIBS_ALLOW_SCRIPTS === 'true'
    const installArgs = allowScripts ? ['install'] : ['install', '--ignore-scripts']
    if (!run(pnpmCmd, installArgs)) return
    console.log('\n✅ Atualização concluída.')
  } else {
    console.log('\n✅ Nenhuma dependência desatualizada.')
  }
}

main()

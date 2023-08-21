export function createCjsBinding(
  localName: string,
  pkgName: string,
  idents: string[],
): string {
  return `// prettier-ignore
/* eslint-disable */
/* auto-generated by NAPI-RS */

const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let loadError = null

const isMusl = () => {
  let musl = false
  if (process.platform === 'linux') {
    musl = isMuslFromFilesystem()
    if (musl === null) {
      musl = isMuslFromReport()
    }
    if (musl === null) {
      musl = isMuslFromChildProcess()
    }
  }
  return musl
}

const isFileMusl = (f) => f.includes('libc.musl-') || f.includes('ld-musl-')

const isMuslFromFilesystem = () => {
  try {
    return readFileSync('/usr/bin/ldd', 'utf-8').includes('musl')
  } catch {
    return null
  }
}

const isMuslFromReport = () => {
  const report = typeof process.report.getReport === 'function' ? process.report.getReport() : null
  if (!report) {
    return null
  }
  if (report.header && report.header.glibcVersionRuntime) {
    return false
  }
  if (Array.isArray(report.sharedObjects)) {
    if (report.sharedObjects.some(isFileMusl)) {
      return true
    }
  }
  return false
}

const isMuslFromChildProcess = () => {
  try {
    return require('child_process').execSync('ldd --version', { encoding: 'utf8' }).includes('musl')
  } catch (e) {
    // If we reach this case, we don't know if the system is musl or not, so is better to just fallback to false
    return false
  }
}

switch (platform) {
  case 'android':
    switch (arch) {
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, '${localName}.android-arm64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./${localName}.android-arm64.node')
          } else {
            nativeBinding = require('${pkgName}-android-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm':
        localFileExisted = existsSync(join(__dirname, '${localName}.android-arm-eabi.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./${localName}.android-arm-eabi.node')
          } else {
            nativeBinding = require('${pkgName}-android-arm-eabi')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(\`Unsupported architecture on Android \${arch}\`)
    }
    break
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(
          join(__dirname, '${localName}.win32-x64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./${localName}.win32-x64-msvc.node')
          } else {
            nativeBinding = require('${pkgName}-win32-x64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'ia32':
        localFileExisted = existsSync(
          join(__dirname, '${localName}.win32-ia32-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./${localName}.win32-ia32-msvc.node')
          } else {
            nativeBinding = require('${pkgName}-win32-ia32-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, '${localName}.win32-arm64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./${localName}.win32-arm64-msvc.node')
          } else {
            nativeBinding = require('${pkgName}-win32-arm64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(\`Unsupported architecture on Windows: \${arch}\`)
    }
    break
  case 'darwin':
    localFileExisted = existsSync(join(__dirname, '${localName}.darwin-universal.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./${localName}.darwin-universal.node')
      } else {
        nativeBinding = require('${pkgName}-darwin-universal')
      }
      break
    } catch {}
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(__dirname, '${localName}.darwin-x64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./${localName}.darwin-x64.node')
          } else {
            nativeBinding = require('${pkgName}-darwin-x64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, '${localName}.darwin-arm64.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./${localName}.darwin-arm64.node')
          } else {
            nativeBinding = require('${pkgName}-darwin-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(\`Unsupported architecture on macOS: \${arch}\`)
    }
    break
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(\`Unsupported architecture on FreeBSD: \${arch}\`)
    }
    localFileExisted = existsSync(join(__dirname, '${localName}.freebsd-x64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./${localName}.freebsd-x64.node')
      } else {
        nativeBinding = require('${pkgName}-freebsd-x64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'linux':
    switch (arch) {
      case 'x64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, '${localName}.linux-x64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./${localName}.linux-x64-musl.node')
            } else {
              nativeBinding = require('${pkgName}-linux-x64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, '${localName}.linux-x64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./${localName}.linux-x64-gnu.node')
            } else {
              nativeBinding = require('${pkgName}-linux-x64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, '${localName}.linux-arm64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./${localName}.linux-arm64-musl.node')
            } else {
              nativeBinding = require('${pkgName}-linux-arm64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, '${localName}.linux-arm64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./${localName}.linux-arm64-gnu.node')
            } else {
              nativeBinding = require('${pkgName}-linux-arm64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm':
        localFileExisted = existsSync(
          join(__dirname, '${localName}.linux-arm-gnueabihf.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./${localName}.linux-arm-gnueabihf.node')
          } else {
            nativeBinding = require('${pkgName}-linux-arm-gnueabihf')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(\`Unsupported architecture on Linux: \${arch}\`)
    }
    break
  default:
    throw new Error(\`Unsupported OS: \${platform}, architecture: \${arch}\`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(\`Failed to load native binding\`)
}

${idents
  .map((ident) => `module.exports.${ident} = binding.${ident}`)
  .join('\n')}
`
}

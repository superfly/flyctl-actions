import * as core from '@actions/core'

export const VERSION = core.getInput('version')

export const ARCHITECTURE = (() => {
  const arch = process.arch
  switch (arch) {
    case 'arm64': {
      return 'arm64'
    }
    case 'x64': {
      return 'x86_64'
    }
    default: {
      throw new Error(arch)
    }
  }
})()

export const PLATFORM = (() => {
  const platform = process.platform
  switch (platform) {
    case 'darwin': {
      return 'macOS'
    }
    case 'linux': {
      return 'Linux'
    }
    case 'win32': {
      return 'Windows'
    }
    default: {
      throw new Error(platform)
    }
  }
})()

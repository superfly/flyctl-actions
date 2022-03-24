import * as core from '@actions/core'
import * as http from '@actions/http-client'
import * as toolCache from '@actions/tool-cache'

const client = new http.HttpClient('setup-flyctl')

async function run() {
  // Get user-specified version to install (defaults to "latest")
  const version = core.getInput('version')

  // Resolve the version to a specific download via the Fly API
  const {url, resolvedVersion} = await resolveVersion(version)

  // Install the resolved version if necessary
  const toolPath = toolCache.find('flyctl', resolvedVersion)
  if (toolPath) {
    core.addPath(toolPath)
  } else {
    core.info(`Downloading flyctl ${resolvedVersion} from ${url}...`)
    await installFlyctl(url, resolvedVersion)
  }

  core.info(`flyctl ${resolvedVersion} is installed`)
}

async function resolveVersion(version: string) {
  const os = process.platform
  const arch = process.arch === 'x64' ? 'amd64' : process.arch
  const res = await client.get(`https://api.fly.io/app/flyctl_releases/${os}/${arch}/${version}`)
  const body = await res.readBody()
  if (!res.message.statusCode || res.message.statusCode >= 400) throw new Error(body)
  const matches = body.match(/superfly\/flyctl\/releases\/download\/v(\d+\.\d+\.\d+)/)
  const resolvedVersion = matches ? matches[1] : version
  return {url: body, resolvedVersion}
}

async function installFlyctl(url: string, resolvedVersion: string) {
  const tarPath = await toolCache.downloadTool(url)
  const extractedPath = await toolCache.extractTar(tarPath)
  const cachedPath = await toolCache.cacheDir(extractedPath, 'flyctl', resolvedVersion)
  core.addPath(cachedPath)
}

run().catch((error) => {
  if (error instanceof Error) {
    core.setFailed(error.message)
  } else {
    core.setFailed(`${error}`)
  }
})

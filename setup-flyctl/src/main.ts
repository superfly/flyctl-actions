import * as core from "@actions/core";
import * as http from "@actions/http-client";
import * as toolCache from "@actions/tool-cache";
import { ARCHITECTURE, PLATFORM, VERSION } from "./constants.js";

const client = new http.HttpClient("setup-flyctl", [], {
  allowRetries: true,
  maxRetries: 3,
});

async function run() {
  // Resolve the version to a specific download via the Fly API
  const { url, resolvedVersion } = await resolveVersion(VERSION);

  // Install the resolved version if necessary
  const toolPath = toolCache.find("flyctl", resolvedVersion, ARCHITECTURE);
  if (toolPath) {
    core.addPath(toolPath);
  } else {
    await installFlyctl(url, resolvedVersion);
  }
}

async function resolveVersion(version: string) {
  const res = await client.get(
    `https://api.fly.io/app/flyctl_releases/${PLATFORM}/${ARCHITECTURE}/${version}`,
  );
  const body = await res.readBody();
  if (!res.message.statusCode || res.message.statusCode >= 400)
    throw new Error(body);
  const matches = body.match(
    /superfly\/flyctl\/releases\/download\/v(\d+\.\d+\.\d+)/,
  );
  const resolvedVersion = matches?.[1] ? matches[1] : version;
  return { url: body, resolvedVersion };
}

async function installFlyctl(url: string, resolvedVersion: string) {
  const downloadedPath = await toolCache.downloadTool(url);
  core.info(`Acquired ${resolvedVersion} from ${url}`);
  const extractedPath =
    PLATFORM === "Windows"
      ? await toolCache.extractZip(downloadedPath)
      : await toolCache.extractTar(downloadedPath);
  const cachedPath = await toolCache.cacheDir(
    extractedPath,
    "flyctl",
    resolvedVersion,
    ARCHITECTURE,
  );
  core.info(`Successfully cached flyctl to ${cachedPath}`);
  core.addPath(cachedPath);
  core.info("Added flyctl to the path");
}

run().catch((error) => {
  if (error instanceof Error) {
    core.setFailed(error.message);
  } else {
    core.setFailed(`${error}`);
  }
});

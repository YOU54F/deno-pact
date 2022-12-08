import { ensureFile } from "https://deno.land/std/fs/ensure_file.ts";
import { gunzipFile } from "https://deno.land/x/compress@v0.4.4/gzip/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import {
  libraryFilename,
  DenoPact,
  PACT_FFI_LOCATION,
  PACT_FFI_VERSION
} from "./denoPact.ts";

async function downloadFile(src: string, dest: string) {
  if (!(src.startsWith("http://") || src.startsWith("https://"))) {
    throw new TypeError("URL must start with be http:// or https://");
  }
  const resp = await fetch(src);
  if (!resp.ok) {
    throw new Deno.errors.BadResource(
      `Request failed with status ${resp.status}`
    );
  } else if (!resp.body) {
    throw new Deno.errors.UnexpectedEof(
      `The download url ${src} doesn't contain a file to download`
    );
  } else if (resp.status === 404) {
    throw new Deno.errors.NotFound(
      `The requested url "${src}" could not be found`
    );
  }
  await ensureFile(dest);
  const file = await Deno.open(dest, { write: true, create: true });
  await resp.body.pipeTo(file.writable);
  // Deno.close(file.rid)
}

export const detectFfiDownloadForPlatform = (ffiVersion = PACT_FFI_VERSION) => {
  const platform = Deno.build.os + "-" + Deno.build.arch;
  console.log(platform);
  let filename;
  switch (platform) {
    case "darwin-aarch64":
      filename = "libpact_ffi-osx-aarch64-apple-darwin.dylib.gz";
      break;
    case "darwin-x86_64":
      filename = "libpact_ffi-osx-x86_64.dylib.gz";
      break;
    case "linux-aarch64":
      filename = "libpact_ffi-linux-aarch64.so.gz";
      break;
    case "linux-x86_64":
      filename = "libpact_ffi-linux-x86_64.so.gz";
      break;
    default:
      if (platform.includes("windows")) {
        filename = "pact_ffi-windows-x86_64.dll.gz";
        break;
      }
      `We do not have a binary for your platform ${platform}`;
      break;
  }
  const ffiLibDownloadLocation = `https://github.com/pact-foundation/pact-reference/releases/download/libpact_ffi-${ffiVersion}/${filename}`;
  const ffiHeaderDownloadLocation = `https://github.com/pact-foundation/pact-reference/releases/download/libpact_ffi-${ffiVersion}/pact.h`;
  console.log(ffiLibDownloadLocation);
  return { ffiLibDownloadLocation, ffiHeaderDownloadLocation };
};

export const downloadFileAndExtract = async (args: {
  fileLocation: string;
  pathToWrite: string;
}) => {
  const { fileLocation, pathToWrite } = args;
  await downloadFile(fileLocation, path.join(pathToWrite, "tmp.gz"));
  await gunzipFile(
    path.join(pathToWrite, "tmp.gz"),
    path.join(pathToWrite, libraryFilename)
  );
  Deno.removeSync(path.join(pathToWrite, "tmp.gz"));
  const fileNames: string[] = [];
  for await (const dirEntry of Deno.readDir(pathToWrite)) {
    if (dirEntry.isFile) {
      fileNames.push(dirEntry.name);
    }
  }
  console.log(fileNames);
};

export const downloadFfiForPlatform = async (ffiVersion = PACT_FFI_VERSION) => {
  const locs = detectFfiDownloadForPlatform(ffiVersion);
  const exists = await checkIfFfiExists(libraryFilename);
  if (!exists.pactFfiLib) {
    console.log("downloading", locs.ffiLibDownloadLocation);
    await downloadFileAndExtract({
      fileLocation: locs.ffiLibDownloadLocation,
      pathToWrite: PACT_FFI_LOCATION
    });
  } else {
    console.log("pact ffi library exists");
  }
  if (!exists.pactFfiHeaders) {
    console.log("downloading", locs.ffiHeaderDownloadLocation);
    await downloadFile(
      locs.ffiHeaderDownloadLocation,
      path.join(PACT_FFI_LOCATION, "pact.h")
    );
  } else {
    console.log("pact header files exist");
  }
  return;
};

const checkIfFfiExists = async (libraryFilename: string) => {
  let pactFfiLib;
  let pactFfiHeaders;
  try {
    pactFfiLib = await Deno.stat(path.join(PACT_FFI_LOCATION, libraryFilename));
  } catch (e) {
    if (e instanceof Deno.errors.NotFound)
      console.error("ffi lib does not exist, will download", libraryFilename);
  }
  try {
    pactFfiHeaders = await Deno.stat(path.join(PACT_FFI_LOCATION, "pact.h"));
  } catch (e) {
    if (e instanceof Deno.errors.NotFound)
      console.error("ffi header file does not exist, will download");
  }

  return { pactFfiLib, pactFfiHeaders };
};

const flags = parse(Deno.args, {
  boolean: ["run", "cli"]
});
if (flags.run) {
  await downloadFfiForPlatform().then(() => {
    if (Deno.build.os !== "windows") {
      console.log(new DenoPact().getPactFfiVersion());
    }
  });
}

export const detectStandaloneCliDownloadForPlatform = (
  ffiVersion = PACT_FFI_VERSION
) => {
  const platform = Deno.build.os + "-" + Deno.build.arch;
  console.log(platform);
  let filename;
  switch (platform) {
    case "darwin-aarch64":
      filename = "libpact_ffi-osx-aarch64-apple-darwin.dylib.gz";
      break;
    case "darwin-x86_64":
      filename = "libpact_ffi-osx-x86_64.dylib.gz";
      break;
    case "linux-aarch64":
      filename = "libpact_ffi-linux-aarch64.so.gz";
      break;
    case "linux-x86_64":
      filename = "libpact_ffi-linux-x86_64.so.gz";
      break;
    default:
      if (platform.includes("windows")) {
        filename = "pact_ffi-windows-x86_64.dll.gz";
        break;
      }
      `We do not have a binary for your platform ${platform}`;
      break;
  }
  const ffiLibDownloadLocation = `https://github.com/pact-foundation/pact-reference/releases/download/libpact_ffi-${ffiVersion}/${filename}`;
  const ffiHeaderDownloadLocation = `https://github.com/pact-foundation/pact-reference/releases/download/libpact_ffi-${ffiVersion}/pact.h`;
  console.log(ffiLibDownloadLocation);
  return { ffiLibDownloadLocation, ffiHeaderDownloadLocation };
};

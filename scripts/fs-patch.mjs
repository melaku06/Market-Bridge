import * as fs from "node:fs";

const originalReaddir = fs.readdir;
const originalReaddirSync = fs.readdirSync;

const patchedReaddir = function (path, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = undefined;
  }
  let retries = 30;
  const attempt = () => {
    originalReaddir.call(fs, path, options, (err, result) => {
      if (err && err.code === "EAGAIN" && retries > 0) {
        retries--;
        setTimeout(attempt, 1);
      } else {
        callback(err, result);
      }
    });
  };
  attempt();
};

const patchedReaddirSync = function (path, options) {
  for (let i = 0; i < 50; i++) {
    try {
      return originalReaddirSync.call(fs, path, options);
    } catch (err) {
      if (err.code === "EAGAIN" && i < 49) {
        const start = Date.now();
        while (Date.now() - start < 1) {}
      } else {
        throw err;
      }
    }
  }
};

fs.readdir = patchedReaddir;
fs.readdirSync = patchedReaddirSync;

const fs = require("fs");

const origReaddir = fs.readdir;
const origReaddirSync = fs.readdirSync;

fs.readdir = function (path, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = undefined;
  }
  const attempt = (retries) => {
    origReaddir.call(fs, path, options, (err, result) => {
      if (err && err.code === "EAGAIN" && retries > 0) {
        setTimeout(() => attempt(retries - 1), 5);
      } else {
        callback(err, result);
      }
    });
  };
  attempt(10);
};

fs.readdirSync = function (path, options) {
  for (let i = 0; i < 20; i++) {
    try {
      return origReaddirSync.call(fs, path, options);
    } catch (err) {
      if (err.code === "EAGAIN" && i < 19) {
        const start = Date.now();
        while (Date.now() - start < 2) {}
      } else {
        throw err;
      }
    }
  }
};

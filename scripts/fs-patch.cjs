const fs = require("node:fs");
const { promises: fsp } = require("node:fs");

// Patch callback-based readdir
const origReaddir = fs.readdir;
fs.readdir = function (path, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = undefined;
  }
  let retries = 50;
  const attempt = () => {
    origReaddir.call(fs, path, options, (err, result) => {
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

// Patch sync readdir
const origReaddirSync = fs.readdirSync;
fs.readdirSync = function (path, options) {
  for (let i = 0; i < 50; i++) {
    try {
      return origReaddirSync.call(fs, path, options);
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

// Patch promises.readdir
const origReaddirPromise = fsp.readdir;
fsp.readdir = async function (path, options) {
  for (let i = 0; i < 50; i++) {
    try {
      return await origReaddirPromise.call(fsp, path, options);
    } catch (err) {
      if (err.code === "EAGAIN" && i < 49) {
        await new Promise((resolve) => setTimeout(resolve, 1));
      } else {
        throw err;
      }
    }
  }
};

// Patch promises.opendir
const origOpendirPromise = fsp.opendir;
fsp.opendir = async function (path, options) {
  for (let i = 0; i < 50; i++) {
    try {
      return await origOpendirPromise.call(fsp, path, options);
    } catch (err) {
      if (err.code === "EAGAIN" && i < 49) {
        await new Promise((resolve) => setTimeout(resolve, 1));
      } else {
        throw err;
      }
    }
  }
};

// Patch Dir.prototype async iterator (this is where EAGAIN actually occurs)
const Dir = fs.Dir;
if (Dir && Dir.prototype) {
  const origAsyncIterator = Dir.prototype[Symbol.asyncIterator];
  if (origAsyncIterator) {
    Dir.prototype[Symbol.asyncIterator] = function () {
      const iterator = origAsyncIterator.call(this);
      const origNext = iterator.next;
      iterator.next = async function () {
        for (let i = 0; i < 50; i++) {
          try {
            return await origNext.call(this);
          } catch (err) {
            if (err.code === "EAGAIN" && i < 49) {
              await new Promise((resolve) => setTimeout(resolve, 1));
            } else {
              throw err;
            }
          }
        }
      };
      return iterator;
    };
  }

  // Also patch Dir.prototype.read (callback-based)
  const origRead = Dir.prototype.read;
  if (origRead) {
    Dir.prototype.read = function (callback) {
      let retries = 50;
      const attempt = () => {
        origRead.call(this, (err, dirent) => {
          if (err && err.code === "EAGAIN" && retries > 0) {
            retries--;
            setTimeout(attempt, 1);
          } else {
            callback(err, dirent);
          }
        });
      };
      attempt();
    };
  }

  // Also patch Dir.prototype.readSync
  const origReadSync = Dir.prototype.readSync;
  if (origReadSync) {
    Dir.prototype.readSync = function () {
      for (let i = 0; i < 50; i++) {
        try {
          return origReadSync.call(this);
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
  }
}

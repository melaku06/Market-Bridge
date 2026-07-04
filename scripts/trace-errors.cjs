const origError = global.Error;
const errorFiles = new Set();

// Hook into process to catch uncaught errors
process.on('uncaughtException', (err) => {
  if (err && err.code === 'EAGAIN') {
    console.error('[CAUGHT] EAGAIN error:', err.stack || err.message);
  }
});

// Patch fs.promises.opendir to trace
const fsp = require('fs/promises');
const origOpendir = fsp.opendir;
fsp.opendir = async function(...args) {
  try {
    return await origOpendir.apply(this, args);
  } catch (err) {
    if (err.code === 'EAGAIN') {
      console.error('[TRACE] EAGAIN from opendir:', args[0], '\n', err.stack);
    }
    throw err;
  }
};

// Also patch the Dir.prototype[Symbol.asyncIterator]
const Dir = require('fs').Dir;
if (Dir && Dir.prototype) {
  const origAsyncIterator = Dir.prototype[Symbol.asyncIterator];
  if (origAsyncIterator) {
    Dir.prototype[Symbol.asyncIterator] = function() {
      const iterator = origAsyncIterator.call(this);
      const origNext = iterator.next;
      iterator.next = async function() {
        try {
          return await origNext.call(this);
        } catch (err) {
          if (err.code === 'EAGAIN') {
            console.error('[TRACE] EAGAIN from Dir asyncIterator:', err.stack);
          }
          throw err;
        }
      };
      return iterator;
    };
  }
}

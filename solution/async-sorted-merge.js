"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {
  return new Promise(async (resolve, reject) => {
    try {
      const logEntries = [];

      for (let i = 0; i < logSources.length; i++) {
        const log = await logSources[i].popAsync();
        if (log) {
          logEntries.push({ log, index: i });
        }
      }

      logEntries.sort((a, b) => a.log.date - b.log.date);

      while (logEntries.length > 0) {
        const { log, index } = logEntries.shift();

        printer.print(log);

        const nextLog = await logSources[index].popAsync();

        if (nextLog) {
          let i = 0;

          while (
            i < logEntries.length &&
            logEntries[i].log.date < nextLog.date
          ) {
            i++;
          }
          logEntries.splice(i, 0, { log: nextLog, index });
        }
      }
      resolve(printer.done());
    } catch (err) {
      reject(err);
    }
  });
};

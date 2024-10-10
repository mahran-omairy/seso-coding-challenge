"use strict";

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const logEntries = [];

  for (let i = 0; i < logSources.length; i++) {
    const log = logSources[i].pop();
    if (log) {
      logEntries.push({ log, index: i });
    }
  }

  logEntries.sort((a, b) => a.log.date - b.log.date);

  while (logEntries.length > 0) {
    const { log, index } = logEntries.shift();

    printer.print(log);

    const nextLog = logSources[index].pop();

    if (nextLog) {
      let i = 0;

      while (i < logEntries.length && logEntries[i].log.date < nextLog.date) {
        i++;
      }
      logEntries.splice(i, 0, { log: nextLog, index });
    }
  }
  printer.done();
};

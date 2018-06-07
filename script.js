import { request, writeFile, log } from "./utils";

class Task {
  constructor() {
    this._mode = "promise";
    this._outputPath = null;
  }

  set mode(mode) {
    this._mode = mode;
  }

  set outputPath(path) {
    this._outputPath = path;
  }

  buildApiUrl(sessionId, page = 1) {
    return `/sessions/${sessionId}/commands/${page}`;
  }

  runInPromiseMode(sessionIds) {
    let task = new Promise(resolve => resolve(log("Start ...")));
    sessionIds.forEach(sessionId => {
      task = task
        .then(() =>
          log(`Fetching commands for session with ID ${sessionId}`)
        )
        .then(() => request(this.buildApiUrl(sessionId)))
        .catch(err => {
          log(`>>Failed to load commands`);
          throw err;
        })
        .then(command => {
          const { currentPage, totalPages, data } = command;
          log(
            `>>Found ${totalPages} ${
              totalPages === 1 ? "page" : "pages"
            } of commands`
          );
          const commandList = [
            {
              page: 1,
              data
            }
          ];
          let childTask = new Promise(resolve =>
            resolve(log(`>>>>Commands on page 1 loaded`))
          );
          for (let page = currentPage + 1; page <= totalPages; page++)
            childTask = childTask
              .then(() => request(this.buildApiUrl(sessionId, page)))
              .then(command => {
                log(`>>>>Commands on page ${page} loaded`);
                return commandList.push({
                  page,
                  data: command.data
                });
              })
              .catch(err =>
                log(`>>>>Commands on page ${page} failed to load`)
              );
          return childTask.then(() => commandList);
        })
        .then(commandList => {
          const data = this.buildData(sessionId, commandList);
          log(">>Data received! Start writing to file");
          return writeFile(this._outputPath, data)
            .then(() => log(">>Finish writing to file"))
            .catch(err => {
              log(">>Failed to write record to file");
              throw err;
            });
        })
        .catch(err => log(`>>Task failed!`))
        .then(() => log(">>Task completed!"));
    });

    task.then(() => log("Finish!"));
  }

  async runInAwaitAsyncMode(sessionIds) {
    log("Start...");
    for (let i = 0; i < sessionIds.length; i++) {
      try {
        log(`Fetching commands for session with ID ${sessionIds[i]}`);
        let command = null;
        try {
          command = await request(this.buildApiUrl(sessionId));
          const { currentPage, totalPages, data } = command;
          log(
            `>>Found ${totalPages} ${
              totalPages === 1 ? "page" : "pages"
            } of commands`
          );
        } catch (error) {
          log(`>>Failed to load commands`);
          throw error;
        }
        const commandList = [
          {
            page: 1,
            data
          }
        ];
        log(`>>>>Commands on page 1 loaded`);
        for (let page = currentPage + 1; page <= totalPages; page++)
          try {
            command = await request(this.buildApiUrl(sessionId, page));
            commandList.push({
              page,
              data: command.data
            });
            log(`>>>>Commands on page ${page} loaded`);
          } catch (error) {
            log(`>>>>Commands on page ${page} failed to load`);
          }
        const data = this.buildData(sessionIds[i], commandList);
        log(">>Data received! Start writing to file");
        try {
          await writeFile(this._outputPath, data);
          log(">>Finish writing to file");
        } catch (error) {
          log(">>Failed to write record to file");
          throw error;
        }
        log(`>>Task completed!`);
      } catch (error) {
        log(`>>Task failed!`);
      }
    }
  }

  buildData(sessionId, commandList) {
    let docs = `SessionId: ${sessionId}\n${commandList.length} ${
      commandList.length > 1 ? "pages" : "page"
    } of commands found:\n`;
    commandList.forEach(command => {
      docs += `   Page ${command.page}\n`;
      command.data.forEach((record, index) => {
        docs += `       ${index + 1}.\n`;
        docs += `        id = ${record.id}\n`;
        docs += `        data url = ${record.data.url}\n`;
        docs += `        created at = ${record.createdAt}\n`;
        docs += `        ended at = ${record.endedAt}\n`;
      });
    });
    return docs;
  }

  run(sessionIds) {
    return this._mode === "promise"
      ? this.runInPromiseMode(sessionIds)
      : this.runInAwaitAsyncMode(sessionIds);
  }
}

export default new Task();

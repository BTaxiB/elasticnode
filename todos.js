/**
 * List of methods:
 * load() - indexing api from url!
 * search() -> looks for ID, on success prints header + data + footer in index.html ( for testing purposes)
 * get() -> get row by ID, on success prints header + data + footer in index.html (for testing purposes)
 * bulkIndex() -> indexing whole API (as I understood u need to index it so you can query it)
 * search, get, create, update, delete - data manipulation
 */

 const https = require('https')
class Todos {
    constructor(db, url, fs) {
        this.db = db;
        this.fs = fs
        this.source_url = url;
        this.https = https;
        this.index = 'todos';
        this.type = 'task';
    }

    //indexing API
    async  load() {
        this.https.get(this.source_url, (res) => {
            let body = "";
            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", () => {
                try {
                    let json = JSON.parse(body);
                    this.db.bulkIndex(this.index, this.type, json);
                    // console.log(json)

                    // do something with JSON
                } catch (error) {
                    console.error(error.message);
                };
            });
        }).on("error", (error) => {
            console.error(error.message);
        });
    }

    //search in api
    async  search(id) {
        this.fs.read('header.html', (response) => {
            this.fs.write('index.html', response)
        });
        await this.db.search(id, this.index, (response) => {
            const data = JSON.parse(JSON.stringify(response.hits.hits));

            let chunk = data.map(hit => hit._source)

            const title = chunk.map(c => c.title)
            const completed = chunk.map(c => c.completed)
            const id = chunk.map(c => c.id)

            let html = ` <div class=${completed ? "text-success" : "text-danger"}>
                <h1>Task name: ${title}/${id}</td>
                    <button type="button" class="${completed ? "btn btn-success" : "btn btn-danger"} w-100">${completed ? "Completed" : "Not Completed"}</button>
              </div>`

            this.fs.append('index.html', html);
            this.fs.read('footer.html', (response) => {
                this.fs.append('index.html', response);
            });
            console.log(`Task id: ${id}`)
            console.log(`Task title: ${title}`)
            console.log(`Task completed: ${completed}`)
            console.log('Check localhost:8081/index.html for results!')
        })
    };

    //get one row
    async  get(id) {
        this.fs.read('header.html', (response) => {
            this.fs.write('index.html', response)
        });
        await this.db.get(id, this.index, (response) => {
            if (response.found) {
                const data = JSON.parse(JSON.stringify(response));
                const chunk = data._source;

                const title = chunk.title
                const completed = chunk.completed
                const id = chunk.id

                let html = ` <div class=${completed ? "text-success" : "text-danger"}>
                    <h1>Task name: ${title}/${id}</td>
                        <button type="button" class="${completed ? "btn btn-success" : "btn btn-danger"} w-100">${completed ? "Completed" : "Not Completed"}</button>
                  </div>`

                
                this.fs.append('index.html', html);
                this.fs.read('footer.html', (response) => {
                    this.fs.append('index.html', response);
                });
                console.log(`Task id: ${id}`)
                console.log(`Task title: ${title}`)
                console.log(`Task completed: ${completed}`)
                console.log('Check localhost:8081/index.html for results!')
            } else {
                console.log("No data found!")
            }
        })
    }

    //insert row
    async  create(id, data) {
        await this.db.create(id, this.index, this.type, data)
        console.log(`Created row ID: ${id}!`)
    }

    //update row
    async  update(id, data) {
        await this.db.update(id, this.index, this.type, data)
        console.log(`Updated row ID: ${id}!`)
    }

    //delete row
    async  delete(id) {
        await this.db.delete(id, this.index)
        console.log(`Deleted row ID: ${id}!`)
    }
}


module.exports = Todos
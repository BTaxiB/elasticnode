const elasticearch = require('elasticsearch');
const fs = require('fs');

/**
 * List of methods:
 * ping() - checks if connected
 * createIndex() -> self-explanatory
 * bulkIndex() -> indexing whole API (as I understood u need to index it so you can query it)
 * search, get, create, update, delete - data manipulation
 */
class elasticDB {
    constructor(host) {
        this.host = host;
        this.client = new elasticearch.Client({
            host: `localhost:${this.host}`,
            log: 'trace',
            apiVersion: '7.2',
        });
        this.ping();
    }

    ping() {
        this.client.ping({
            requestTimeout: 30000,
        }, function (error) {
            if (error) {
                console.error('elasticsearch cluster is down!');
            } else {
                console.log('All is well');
            }
        });
    }

    // async createIndex(indexName) {
    //     return await this.client.indices.create({
    //         index: indexName
    //     });
    // }

    bulkIndex(index, type, data) {
        let bulkBody = [];

        data.forEach(item => {
            bulkBody.push({
                index: {
                    _index: index,
                    _type: type,
                    _id: item.id
                }
            });
            bulkBody.push(item);

        })

        this.client.bulk({ body: bulkBody })
            .then(response => {
                console.log('here');
                let errorCount = 0;
                response.items.forEach(item => {
                    if (item.index && item.index.error) {
                        console.log(++errorCount, item.index.error);
                    }
                });
                console.log(
                    `Successfully indexed ${data.length - errorCount}
                     out of ${data.length} items`
                );
            })
            .catch(console.err);

    }
    async search(id, index, callback) {
        this.client.search({
            index: index,
            body: {
                query: {
                    match: {
                        id: id
                    }
                },
            }
        }, (error, response) => {
            if (error) console.log(error)
            callback(response)
        });

    }

    async update(id, index, type, body) {
        await this.client.update({
            index: index,
            type: type,
            id: id,
            body: { 
                doc: { 
                    body 
                } }
        })
    }


    async get(id, index, callback) {
        await this.client.get({
            index: index,
            id: id
        }, function (error, response) {
            if (error) console.log(error)
            // console.log(response)
            callback(response)
        })
    }

    async create(id, index, type, body) {
        await this.client.create({
            index: index,
            type: type,
            id: id,
            body: body
        });
    }

    async delete(id, index) {
        await this.client.delete({
            index: index,
            id: id
        });
    }

    indices() {
        const indices = function indices() {
            return this.client.cat.indices({ v: true })
                .then(console.log)
                .catch(err => console.error(`Error connecting to the es client: ${err}`));
        };
    }

}

module.exports = elasticDB;

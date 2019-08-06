const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const createPhantomPool = require('phantom-pool')
let resourceWait  = 15000
let maxRenderWait = 30000
let count         = 0
let forcedRenderTimeout
let renderTimeout


class Prints {
    constructor() {
        this.prints = [];
        this.pool = createPhantomPool({
            max: 12,
            min: 2,
            // how long a resource can stay idle in pool before being removed
            idleTimeoutMillis: 30000, 
            // maximum number of times an individual resource can be reused before being destroyed; set to 0 to disable
            maxUses: 50,
            // function to validate an instance prior to use; see https://github.com/coopernurse/node-pool#createpool
            validator: () => Promise.resolve(true),
            // validate resource before borrowing; required for `maxUses and `validator`
            testOnBorrow: true,
            // For all opts, see opts at https://github.com/coopernurse/node-pool#createpool
            phantomArgs: [['--ignore-ssl-errors=true', '--load-images=true'], {
                logLevel: 'debug',
            }],
        })

    }

    dataLoaded(page) {
        return new Promise(resolve => {
            let elapsedTime = 0;
            const refreshId2 = setInterval(async() => {
                let loaded = await page.evaluate(function () {
                    return document.getElementById("is_products_loaded").value
                })
                //console.log('====================================='+loaded)
                if ((loaded == 'complete')||(elapsedTime == 24)){
                    clearInterval(refreshId2)
                    resolve('resolve')
                    return true
                }
                elapsedTime = elapsedTime + 2;
            }, 2000);
        })
    }


     print(url, name){

        this.pool.use(async (instance) => {
            const page = await instance.createPage()
            const status = await page.open(url,
                { operation: 'GET' })

            if (status !== 'success') {
                throw new Error('cannot '+url)
            }
            // TODO need to resole recursive promise
            await this.dataLoaded(page)
            
            const screenshot = await page.render( (this.public_path +name), {quality: 100, format: 'jpeg'});
            
            this.printed = this.printed+1
            return 'done'
        }).then((content) => {
            console.log(content)
        })
    }
 

    async get(id, params) {
        const print = this.prints.find(print => print.id === parseInt(id, 10));
        
        if(!print) {
            throw new Error(`Message with id ${id} not found`);
        }
        
        return print;
    }

    async create(data, params) {

        this.urls = [];
        this.currentId = 0;
        this.printed = 0;
        this.urls = data.urls
        this.public_path = data.public_path

        for (var i = 0, len = this.urls.length; i < len; i++)
            this.print(this.urls[i].url, this.urls[i].save_path)

        //this.pool.drain().then(() => this.pool.clear())

        return 'All printed';
    }
}

const app = express(feathers());

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.configure(express.rest());

// a new instance of our class
app.use('prints', new Prints());

// nicer errors
app.use(express.errorHandler());

// server on port 3030
const server = app.listen(3030);

// Use the service to create a new print on the server
app.service('prints').create({
    text: 'Hello from the Printing Server'
});

server.on('listening', () => console.log('Feathers REST API started'));

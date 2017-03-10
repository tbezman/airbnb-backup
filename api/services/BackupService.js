let AirBnbService = require('./AirBnbService');
let wkhtmltopdf = require('wkhtmltopdf');
let exec = require('exec');
let fs = require('fs');
let request = require('request');

module.exports = {
    download(uri, filename){
        return new Promise((resolve, reject) => {
            request.head(uri, function (err, res, body) {
                request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
                    resolve(filename);
                });
            });
        });
    },

    createPDF(room, host) {
        return Promise.all([AirBnbService.getListingInfo(room), AirBnbService.getHostInfo(host)]).then(values => {
            [room, host] = values;

            return this.renderRoomToPDF(room.id);
        });
    },

    renderPageToPDF(url)
    {
        return new Promise((resolve, reject) => {
            let output = guid() + '.pdf';
            wkhtmltopdf(url, {dpi: 100}, () => {
                resolve(output);
            }).pipe(fs.createWriteStream(output));
        });
    },

    renderRoomToPDF(room)
    {
        return new Promise((resolve, reject) => {
            AirBnbService.getListingInfo(room).then(room => {
                let promises = [this.renderPageToPDF('https://www.airbnb.com/rooms/' + room.id)];

                room.picture_urls.forEach(photo => {
                    let id = guid();

                    promises.push(this.download(photo, id));
                });

                return Promise.all(promises)
                    .then(files => {
                        let all = files.join(' ');
                        let final = './assets/' + guid() + '.pdf';

                        let cmd = 'convert ' + all + ' ' + final;

                        exec(cmd, (err, out, code) => {
                            files.forEach(file => {
                                fs.unlink(file);
                            })

                            resolve(final);
                        });
                    })
            });
        });
    }
}
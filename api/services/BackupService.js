let AirBnbService = require('./AirBnbService');
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
        return new Promise((resolve, reject) => {
            Promise.all([AirBnbService.getListingInfo(room), AirBnbService.getHostInfo(host)]).then(values => {
                [room, host] = values;

                this.renderRoomToPDF(room.id).then();

                resolve({room, host});
            });
        });
    },

    renderRoomToPDF(room) {
        return AirBnbService.getListingInfo(room).then(room => {
            return Promise.all(room.picture_urls.map(photo => {
                let id = guid();

                return this.download(photo, id);
            })).then(images => {
                images.forEach(image => {
                    fs.unlink(image);
                })
            })
        });
    }
}
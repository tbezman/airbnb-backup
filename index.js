let fs = require('fs');
let request = require('request');
let wkhtmltopdf = require('wkhtmltopdf');
let axios = require('axios');
let exec = require('child_process').exec;


let url = 'https://www.airbnb.com/rooms/744971';

function getListingInfo(id) {
    return axios.get('https://api.airbnb.com/v2/listings/' + id + '?client_id=3092nxybyb0otqw18e8nh5nty&locale=en-US&currency=USD&_format=v1_legacy_for_p3&_source=mobile_p3&number_of_guests=1');
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

var download = function (uri, filename) {
    return new Promise((resolve, reject) => {
        request.head(uri, function (err, res, body) {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
                resolve(filename)
            });
        });
    });
};

// URL
wkhtmltopdf(url, {pageSize: 'letter'}, () => {
    console.log("Finished Getting Out.pdfl");
    let id = url.split('/').pop();

    getListingInfo(id).then(response => {
        let data = response.data;
        let photos = data.listing.picture_urls


        Promise.all(photos.map(photo => {
            let photoID = guid() + '.jpg';

            return download(photo, photoID);
        })).then(values => {
            let files = values.join(' ');
            let cmd = 'convert out.pdf ' + files + ' final.pdf';
            console.log(cmd);

            exec(cmd, () => {
                exec('rm ' + files);
            });
        });
    });
})
    .pipe(fs.createWriteStream('out.pdf'));


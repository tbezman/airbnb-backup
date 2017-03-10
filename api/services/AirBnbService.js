let axios = require('axios');

module.exports = {
    getListingInfo(id) {
        return axios.get('https://api.airbnb.com/v2/listings/' + id + '?client_id=3092nxybyb0otqw18e8nh5nty&locale=en-US&currency=USD&_format=v1_legacy_for_p3&_source=mobile_p3&number_of_guests=1')
            .then(success => success.data.listing);
    },

    getHostInfo(id) {
        return axios.get('https://api.airbnb.com/v2/users/' + id + '?client_id=3092nxybyb0otqw18e8nh5nty&_format=v1_legacy_show')
            .then(success => success.data.user);
    }
}

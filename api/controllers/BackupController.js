let BackupService = require('../services/BackupService');
let fs = require('fs');

/**
 * BackupController
 *
 * @description :: Server-side logic for managing Backups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    createBackup: function (req, res) {
        BackupService.createPDF(req.param('room'), req.param('host')).then(backup => {
            res.attachment(backup);

            fs.createReadStream(backup).pipe(res);

            fs.unlink(backup);
        });
    }
}

let BackupService = require('../services/BackupService');

/**
 * BackupController
 *
 * @description :: Server-side logic for managing Backups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    createBackup: function (req, res) {
        BackupService.createPDF(req.param('room'), req.param('host')).then(backup => {
            res.ok(backup);
        });
    }
}

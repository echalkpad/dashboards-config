/**
 * Created by Quentin on 1/6/2016.
 */

var express = require("express"),
    router = express.Router(),
    widget = require('./widget');

router.post("/expressNeed", function(req,res) {
    var body = req.body;
    console.log(body);
    if(body == undefined || body.needs == undefined) {
        res.send(422)
    } else {
        widget.findCorrespondingWidget(body.needs, function (response) {
            if (response == undefined) {
                res.send(422);
            } else {
                res.send(response);
            }
        });
    }
});

module.exports = router;
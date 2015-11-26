var express = require("express"),
    router = express.Router();

/**
 * Route of the campus :
 */

router.get("/:campus", function (req, res) {
	res.send("Welcome on the SmartCampus API, for more : /" + req.params.campus +"/sensors");
});

router.get("/:campus/sensors", function(req, res) {
    // TODO : list of all the sensor directly contained by this container
    res.send("List of all the sensors");
});

router.get("/:campus/sensors/:sensor", function(req,res) {
   res.send("You are in the campus : " + req.params.campus +  " with the sensor : " + req.params.sensor);
});


/**
 * Route of the buildings
 */

router.get("/:campus/buildings", function(req,res) {
   // TODO :  list of direct child containers URI (e.g. buildings of the campus)
    res.send("list of all the buildings of the campus");
});

router.get("/:campus/buildings/:building", function(req,res) {
   res.send("You are in the campus : " + req.params.campus + " and in the building : " + req.params.building);
});

router.get("/:campus/buildings/:building/sensors", function(req, res) {
   // TODO : list of all the sensors
    res.send("list of all the sensors of the buildings");
});

router.get("/:campus/buildings/:building/sensors/:sensor", function(req, res) {
    res.send("You are in the campus : " + req.params.campus + " in the building " + req.params.building + " in the sensor " + req.params.sensor);
});


/**
 * Route of the floors
 */

router.get("/:campus/buildings/:building/floors" , function(req,res) {
    // TODO : list of direct child containers URI (e.g. floors of the building)
});

router.get("/:campus/buildings/:building/floors/:floorNumber",function(req,res) {
   res.send("You are in the campus : " + req.params.campus + " in the building " + req.params.building
   + " in the floor number " + req.params.floorNumber)
});

router.get("/:campus/buildings/:building/floors/:floorNumber/sensors", function(req,res) {
    // TODO : 	-> list of sensor URI directly contained by this container
    res.send("list of all the sensors of the floots");
});

router.get("/:campus/buildings/:building/floors/:floorNumber/sensors/:sensor", function(req,res) {
    res.send("You are in the campus : " + req.params.campus + " in the building " + req.params.building
        + " in the floor number " + req.params.floorNumber + " with the sensor " + req.params.sensor);
});


/**
 * Route of the areas
 */

router.get("/:campus/buildings/:building/floors/:floorNumber/areas",function(req,res) {
    // TODO :  list of direct child containers URI (e.g. areas of the floor)
    res.send("list of all the areas of the floors");
});

router.get("/:campus/buildings/:building/floors/:floorNumber/areas/:areaId",function(req,res) {
    res.send("You are in the campus : " + req.params.campus + " in the building " + req.params.building
        + " in the floor number " + req.params.floorNumber + " in the area " + req.params.areaId);
});

router.get("/:campus/buildings/:building/floors/:floorNumber/areas/:areaId/sensors",function(req,res) {
    res.send("Yop");
});

router.get("/:campus/buildings/:building/floors/:floorNumber/areas/:areaId/sensors/:sensor",function(req,res) {
    res.send("You are in the campus : " + req.params.campus + " in the building " + req.params.building
        + " in the floor number " + req.params.floorNumber + " in the area " + req.params.areaId + " in the sensor : "
        + req.params.sensor);
});


/**
 * Route of the rooms
 */

router.get("/:campus/buildings/:building/floors/:floorNumber/areas/:areaId/rooms",function(req,res) {
    // TODO : list of direct child containers URI (e.g. areas of the floor)
    res.send("List of all the areas of the floor");
});

router.get("/:campus/buildings/:building/floors/:floorNumber/areas/:areaId/rooms/:roomId", function(req, res) {
    res.send("You are in the campus : " + req.params.campus + " in the building " + req.params.building
        + " in the floor number " + req.params.floorNumber + " in the area " + req.params.areaId + " in the room : "
        + req.params.roomId);
});

router.get("/:campus/buildings/:building/floors/:floorNumber/areas/:areaId/rooms/:roomId/sensors", function(req, res) {
    // TODO : list of sensor URI directly contained by this container
    res.send("list of sensor URI directly contained in the room");
});


router.get("/:campus/buildings/:building/floors/:floorNumber/areas/:areaId/rooms/:roomId/sensors/:sensor", function(req, res) {
    res.send("You are in the campus : " + req.params.campus + " in the building " + req.params.building
        + " in the floor number " + req.params.floorNumber + " in the area " + req.params.areaId + " in the room : "
        + req.params.roomId + " in the sensor " + req.params.sensor);
});




module.exports = router;
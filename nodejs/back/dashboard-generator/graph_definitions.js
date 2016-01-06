/**
 * @author Marc Karassev
 */

"use strict";

class YAxisType {

	constructor (name, minValue, maxValue, unit, plotLine, approxType) {
		this._name = name;
		this._minValue = minValue;
		this._maxValue = maxValue;
		this._unit = unit;
		this._plotLine = plotLine;
		this._approxType = approxType;
	}

	get name () { return this._name }
	get minValue () { return this._minValue }
	get maxValue () { return this._maxValue }
	get unit () { return this._unit }
	get plotLine () { return this._plotLine }
	get approxType() { return this._approxType }
}

var PERCENT = new YAxisType("percent", 0, 100, "%", undefined, "average"),
	NUMBER = new YAxisType("number", 0, undefined, undefined, undefined, "sum"),
	TEMPERATURE = new YAxisType("temperature", undefined, undefined, undefined,
		{
			value: 0,
			color: "red",
			dashStyle: "shortdash",
			width: 2,
			label: {"text": "0°C"}
		},
		"average"),
	DECIBEL = new YAxisType("decibel", 0, "undefined", "db",
		{
			value: 45,
			color: "red",
			dashStyle: "shortdash",
			width: 2,
			label: {"text": "Noise threshold"}
		},
		undefined);

var YAXIS_TYPES = {
	percent: PERCENT,
	number: NUMBER,
	temperature: TEMPERATURE,
	decibel: DECIBEL
};

var YAXIS_TYPES_ARRAY = [PERCENT, NUMBER, TEMPERATURE, DECIBEL]

function getYAxisType(type) {
	for (var i in YAXIS_TYPES_ARRAY) {
		if (YAXIS_TYPES_ARRAY[i].name == type) {
			return YAXIS_TYPES_ARRAY[i];
		}
	}
	return undefined;
}

function copyYAxisTypeProperties(type, target) {
	if (type.minValue != undefined) target.minValue = type.minValue;
	else target.minValue = "undefined";
	if (type.maxValue != undefined) target.maxValue = type.maxValue;
	else target.maxValue = "undefined";
	if (type.unit) target.unit = type.unit;
	if (type.plotLine) target.plotLine = type.plotLine;
}

class GraphType {

	constructor (name, grpPixelNb) {
		this._name = name;
		this._grpPixelNb = grpPixelNb;
	}

	get name() { return this._name; }
	get grpPixelNb() { return this._grpPixelNb; }
}

var LINE = new GraphType("line", 5),
	COLUMN = new GraphType("column", 50),
	SCATTER_PLOT = new GraphType("scatterPlot", undefined);

var GRAPH_TYPES = {
	line: LINE,
	column: COLUMN,
	scatterPlot: SCATTER_PLOT
}

function getGraphType(type) {
	for (var property in GRAPH_TYPES) {
		if (property == type) {
			return GRAPH_TYPES[property];
		}
	}
}

// Exports

exports.YAXIS_TYPES = YAXIS_TYPES;
exports.getYAxisType = getYAxisType;
exports.copyYAxisTypeProperties = copyYAxisTypeProperties;

exports.GRAPH_TYPES = GRAPH_TYPES;
exports.getGraphType = getGraphType;
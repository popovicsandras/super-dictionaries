var Service = require('./Service');
var config = require('config');
var express = require('express');

new Service(config).start(express());

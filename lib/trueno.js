#!/usr/bin/env node
"use strict";

/**
 * @author Victor O. Santos Uceta
 * Entry point of the CLI. This executes all principal commands.
 */

let cli = require('commander');
let pkg = require("../package.json");

cli.version(pkg.version)
.usage("<cmd>")
.command('start    [flags..]', 'Launch TruenoDB')
.command('stop     [flags..]', 'Stop TruenodDB')
.command('setup    [flags..]', 'Setup TruenoDB(download and setup all components')
.command('console  [flags..]', 'Launch the TruenoDB administrative CLI console and traversal REPL')
.command('check    [flags..]', 'Check TruenoDB status')
.on('--help', function () {
  console.log('  Example:');
  console.log('');
  console.log('    $ trueno start');
  console.log('');
})
.parse(process.argv);
"use strict";

/**
 * @author Miguel Rivera Mediavilla
 * @description Console for TruenoDB
 * @module console/lib/console-entry
 * @see console/lib/actions
 */

const vorpal = require('vorpal')();
const Actions = require('./actions');

/** The console class */
class Console {

    /**
     * Create a ConsoleEntry Object.
     * @param {object} [param= {}] - Parameter with default value of object {}.
     */
    constructor(param = {}) {

        /* Set command line arguments */
        this._host = param.host || 'localhost';
        this._port = param.port || 8000;

    }

    /**
     * Initializes and launch the console.
     */
    init() {

        /* New Actions Instance */
        let actions = new Actions({vorpal: vorpal});

        /* Setup action array */
        let actionsArray = [
            {
                cmd: 'clear',
                action: actions.clear.bind(actions),
                options: [['-a, --all', 'Clear all at once'], ['-o, --other', 'Other command']],
                desc: 'Clear the console.'
            },
            {
                cmd: 'create <graphName>',
                action: actions.createGraph.bind(actions),
                options: [['-d, --directed', 'Set the graph as directed'], ['-y, --dynamic', 'Set graph as dynamic']],
                desc: 'Creates a new graph in the database.'
            },
            {
                cmd: 'delete <graphName>',
                action: actions.deleteGraph.bind(actions),
                desc: 'Deletes the specified graph in the database.'
            },
            {
                cmd: 'list [graphname]',
                action: actions.listGraph.bind(actions),
                options: [['-v, --vertices', 'List vertices of the specified graph.'], ['-e, --edges', 'List edges of the specified graph']],
                desc: 'Lists all graphs in the database. Optionally list vertices and/or edges of a graph.'
            },
            {
                cmd: 'modify <graphmame>',
                action: actions.modifyGraph.bind(actions),
                options: [['-v, --vertex', 'Modify the specified vertex.'], ['-e, --edge', 'Modify the specified edge.']],
                desc: 'Modifies a graph or part of a graph.'
            },
            {
                cmd: 'status',
                action: actions.showStatus.bind(actions),
                desc: 'Query the status of the graph database cluster.'
            }
        ];

        /* Delimiter and show CLI console */
        vorpal.delimiter('trueno ○-○').show();

        /* RPL mode command. Here we bind a function (RPL) to an Vorpal object
         in order to use this object inside the RPL function. */
        vorpal
            .mode('repl')
            .delimiter('repl>')
            .action(Actions.REPL.bind(actions));

        /* Add all other console commands */
        actionsArray.forEach((command)=> {
            let c = vorpal.command(command.cmd);
            c.description(command.desc);
            c.action(command.action);

            /* Set options, opt[0] are the flags, opt[1] is the description of the flag */
            if(command.hasOwnProperty("options")) {
                command.options.forEach((opt)=> {
                    c.option(opt[0], opt[1]);
                });
            }
        });

    }
}

/* exporting the module */
module.exports = Console;
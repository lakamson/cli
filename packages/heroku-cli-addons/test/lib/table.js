'use strict';

let _table = require('../../lib/table');
let expect = require('chai').expect;

function stripIndents(str) {
    return str.replace(/\A\n|^\s+|\s+$/mg, '');
}

function expectOutput(actual, expected) {
    return expect(stripIndents(actual)).to.equal(stripIndents(expected));
}

function table(data, options) {
    let out = '';
    options = (options || {});
    options.printLine = function(str) {
        out += str + '\n';
    };

    _table(data, options);

    return out;
}

describe('table()', function() {
    it('takes simple data', function() {
        let out = table([{Name: 'Jane Doe', Country: 'Australia'},
                         {Name: 'Bob Smith', Country: 'USA'}]);

        expectOutput(out, `
                     Name       Country
                     ─────────  ─────────
                     Jane Doe   Australia
                     Bob Smith  USA`);
    });

    it('takes a simple column list', function() {
        let out = table([{Name: 'Jane Doe', Country: 'Australia'},
                         {Name: 'Bob Smith', Country: 'USA'}],

                        {columns: ['Name']});
        expectOutput(out, `
                     Name
                     ─────────
                     Jane Doe
                     Bob Smith`);
    });

    it('takes a specific column key list', function() {
        let out = table([{n: 'Jane Doe', c: 'Australia'},
                         {n: 'Bob Smith', c: 'USA'}],

                        {columns: [{key: 'n'},
                                   {key: 'c'}]});

        expectOutput(out, `
                     n          c
                     ─────────  ─────────
                     Jane Doe   Australia
                     Bob Smith  USA`);
    });

    it('lets header names be customized', function() {
        let out = table([{n: 'Jane Doe', c: 'Australia'},
                         {n: 'Bob Smith', c: 'USA'}],

                        {columns: [{key: 'n', label: 'Name'},
                                   {key: 'c', label: 'Country'}]});

        expectOutput(out, `
                     Name       Country
                     ─────────  ─────────
                     Jane Doe   Australia
                     Bob Smith  USA`);
    });

    it('takes custom column separator', function() {
        let out = table([{Name: 'Jane Doe', Country: 'Australia'},
                         {Name: 'Bob Smith', Country: 'USA'}],

                        {colSep: ' | '});

        expectOutput(out, `
                     Name      | Country
                     ───────── | ─────────
                     Jane Doe  | Australia
                     Bob Smith | USA`);
    });

    it('takes custom column formatters', function() {
        function initials(name) {
            return name.match(/\b\w/g).join('. ') + '.';
        }

        function highlight(str) {
            return `[[${str.toUpperCase()}]]`;
        }

        let out = table([{Name: 'Jane Doe', Country: 'Australia'},
                         {Name: 'Bob Smith', Country: 'USA'}],

                        {columns: [{key: 'Name'},
                                   {key: 'Name', label: 'Initials', formatter: initials},
                                   {key: 'Country', formatter: highlight}]});

        expectOutput(out, `
                     Name       Initials  Country
                     ─────────  ────────  ─────────────
                     Jane Doe   J. D.     [[AUSTRALIA]]
                     Bob Smith  B. S.     [[USA]]`);
    });
});

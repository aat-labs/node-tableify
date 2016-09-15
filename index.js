"use strict";

module.exports = tableify;

function tableify(obj, columns, parents) {
    var buf = [];
    var type = typeof obj;
    var cols;

    parents = parents || [];

    if (type !== 'object' || obj == null || obj == undefined) {
    }
    else if (~parents.indexOf(obj)) {
        return "[Circular]";
    }
    else {
        parents.push(obj);
    }

    if (Array.isArray(obj)) {
        if (typeof obj[0] === 'object') {
            buf.push('||');

            //loop through every object and get unique keys
            var keys = {};
            obj.forEach(function (o) {
                if (typeof o === 'object' && !Array.isArray(o)) {
                    Object.keys(o).forEach(function (k) {
                        keys[k] = true;
                    });
                }
            });

            cols = Object.keys(keys);

            cols.forEach(function (key) {
                buf.push( key, '||');
            });

            buf.push('\n');

            obj.forEach(function (record) {
                // buf.push('<tr>');
                buf.push(tableify(record, cols, parents));
                buf.push('| \n');
            });
        }
        else {
            cols = [];

            obj.forEach(function (val, ix) {
                cols.push(ix);
                buf.push('|', tableify(val, cols, parents), ' | \n');
            });
        }

    }
    else if (obj && typeof obj === 'object' && !Array.isArray(obj) && !(obj instanceof Date)) {
        if (!columns) {
            buf.push('||');

            Object.keys(obj).forEach(function (key) {
                buf.push('' + getClass(obj[key]) + '>', key,  '|', tableify(obj[key], false, parents), ' | \n');
            });

        }
        else {
            columns.forEach(function (key) {
                if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                    buf.push('|', tableify(obj[key], false, parents));
                }
                else {
                    buf.push('|', tableify(obj[key], columns, parents));
                }
            });
        }
    }
    else {
        buf.push(obj);
    }

    if (type !== 'object' || obj == null || obj == undefined) {
    }
    else {
        parents.pop(obj);
    }

    return buf.join('');
}

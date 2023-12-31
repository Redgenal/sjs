import { _ as __assign, a as __rest, b as __awaiter, c as __generator, d as createNanoEvents, e as __spreadArray } from './common-ba25e019.js';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var proto = {exports: {}};

var indexMinimal = {};

var minimal$1 = {};

var aspromise;
var hasRequiredAspromise;

function requireAspromise () {
	if (hasRequiredAspromise) return aspromise;
	hasRequiredAspromise = 1;
	aspromise = asPromise;

	/**
	 * Callback as used by {@link util.asPromise}.
	 * @typedef asPromiseCallback
	 * @type {function}
	 * @param {Error|null} error Error, if any
	 * @param {...*} params Additional arguments
	 * @returns {undefined}
	 */

	/**
	 * Returns a promise from a node-style callback function.
	 * @memberof util
	 * @param {asPromiseCallback} fn Function to call
	 * @param {*} ctx Function context
	 * @param {...*} params Function arguments
	 * @returns {Promise<*>} Promisified function
	 */
	function asPromise(fn, ctx/*, varargs */) {
	    var params  = new Array(arguments.length - 1),
	        offset  = 0,
	        index   = 2,
	        pending = true;
	    while (index < arguments.length)
	        params[offset++] = arguments[index++];
	    return new Promise(function executor(resolve, reject) {
	        params[offset] = function callback(err/*, varargs */) {
	            if (pending) {
	                pending = false;
	                if (err)
	                    reject(err);
	                else {
	                    var params = new Array(arguments.length - 1),
	                        offset = 0;
	                    while (offset < params.length)
	                        params[offset++] = arguments[offset];
	                    resolve.apply(null, params);
	                }
	            }
	        };
	        try {
	            fn.apply(ctx || null, params);
	        } catch (err) {
	            if (pending) {
	                pending = false;
	                reject(err);
	            }
	        }
	    });
	}
	return aspromise;
}

var base64 = {};

var hasRequiredBase64;

function requireBase64 () {
	if (hasRequiredBase64) return base64;
	hasRequiredBase64 = 1;
	(function (exports) {

		/**
		 * A minimal base64 implementation for number arrays.
		 * @memberof util
		 * @namespace
		 */
		var base64 = exports;

		/**
		 * Calculates the byte length of a base64 encoded string.
		 * @param {string} string Base64 encoded string
		 * @returns {number} Byte length
		 */
		base64.length = function length(string) {
		    var p = string.length;
		    if (!p)
		        return 0;
		    var n = 0;
		    while (--p % 4 > 1 && string.charAt(p) === "=")
		        ++n;
		    return Math.ceil(string.length * 3) / 4 - n;
		};

		// Base64 encoding table
		var b64 = new Array(64);

		// Base64 decoding table
		var s64 = new Array(123);

		// 65..90, 97..122, 48..57, 43, 47
		for (var i = 0; i < 64;)
		    s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;

		/**
		 * Encodes a buffer to a base64 encoded string.
		 * @param {Uint8Array} buffer Source buffer
		 * @param {number} start Source start
		 * @param {number} end Source end
		 * @returns {string} Base64 encoded string
		 */
		base64.encode = function encode(buffer, start, end) {
		    var parts = null,
		        chunk = [];
		    var i = 0, // output index
		        j = 0, // goto index
		        t;     // temporary
		    while (start < end) {
		        var b = buffer[start++];
		        switch (j) {
		            case 0:
		                chunk[i++] = b64[b >> 2];
		                t = (b & 3) << 4;
		                j = 1;
		                break;
		            case 1:
		                chunk[i++] = b64[t | b >> 4];
		                t = (b & 15) << 2;
		                j = 2;
		                break;
		            case 2:
		                chunk[i++] = b64[t | b >> 6];
		                chunk[i++] = b64[b & 63];
		                j = 0;
		                break;
		        }
		        if (i > 8191) {
		            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
		            i = 0;
		        }
		    }
		    if (j) {
		        chunk[i++] = b64[t];
		        chunk[i++] = 61;
		        if (j === 1)
		            chunk[i++] = 61;
		    }
		    if (parts) {
		        if (i)
		            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
		        return parts.join("");
		    }
		    return String.fromCharCode.apply(String, chunk.slice(0, i));
		};

		var invalidEncoding = "invalid encoding";

		/**
		 * Decodes a base64 encoded string to a buffer.
		 * @param {string} string Source string
		 * @param {Uint8Array} buffer Destination buffer
		 * @param {number} offset Destination offset
		 * @returns {number} Number of bytes written
		 * @throws {Error} If encoding is invalid
		 */
		base64.decode = function decode(string, buffer, offset) {
		    var start = offset;
		    var j = 0, // goto index
		        t;     // temporary
		    for (var i = 0; i < string.length;) {
		        var c = string.charCodeAt(i++);
		        if (c === 61 && j > 1)
		            break;
		        if ((c = s64[c]) === undefined)
		            throw Error(invalidEncoding);
		        switch (j) {
		            case 0:
		                t = c;
		                j = 1;
		                break;
		            case 1:
		                buffer[offset++] = t << 2 | (c & 48) >> 4;
		                t = c;
		                j = 2;
		                break;
		            case 2:
		                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
		                t = c;
		                j = 3;
		                break;
		            case 3:
		                buffer[offset++] = (t & 3) << 6 | c;
		                j = 0;
		                break;
		        }
		    }
		    if (j === 1)
		        throw Error(invalidEncoding);
		    return offset - start;
		};

		/**
		 * Tests if the specified string appears to be base64 encoded.
		 * @param {string} string String to test
		 * @returns {boolean} `true` if probably base64 encoded, otherwise false
		 */
		base64.test = function test(string) {
		    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
		}; 
	} (base64));
	return base64;
}

var eventemitter;
var hasRequiredEventemitter;

function requireEventemitter () {
	if (hasRequiredEventemitter) return eventemitter;
	hasRequiredEventemitter = 1;
	eventemitter = EventEmitter;

	/**
	 * Constructs a new event emitter instance.
	 * @classdesc A minimal event emitter.
	 * @memberof util
	 * @constructor
	 */
	function EventEmitter() {

	    /**
	     * Registered listeners.
	     * @type {Object.<string,*>}
	     * @private
	     */
	    this._listeners = {};
	}

	/**
	 * Registers an event listener.
	 * @param {string} evt Event name
	 * @param {function} fn Listener
	 * @param {*} [ctx] Listener context
	 * @returns {util.EventEmitter} `this`
	 */
	EventEmitter.prototype.on = function on(evt, fn, ctx) {
	    (this._listeners[evt] || (this._listeners[evt] = [])).push({
	        fn  : fn,
	        ctx : ctx || this
	    });
	    return this;
	};

	/**
	 * Removes an event listener or any matching listeners if arguments are omitted.
	 * @param {string} [evt] Event name. Removes all listeners if omitted.
	 * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
	 * @returns {util.EventEmitter} `this`
	 */
	EventEmitter.prototype.off = function off(evt, fn) {
	    if (evt === undefined)
	        this._listeners = {};
	    else {
	        if (fn === undefined)
	            this._listeners[evt] = [];
	        else {
	            var listeners = this._listeners[evt];
	            for (var i = 0; i < listeners.length;)
	                if (listeners[i].fn === fn)
	                    listeners.splice(i, 1);
	                else
	                    ++i;
	        }
	    }
	    return this;
	};

	/**
	 * Emits an event by calling its listeners with the specified arguments.
	 * @param {string} evt Event name
	 * @param {...*} args Arguments
	 * @returns {util.EventEmitter} `this`
	 */
	EventEmitter.prototype.emit = function emit(evt) {
	    var listeners = this._listeners[evt];
	    if (listeners) {
	        var args = [],
	            i = 1;
	        for (; i < arguments.length;)
	            args.push(arguments[i++]);
	        for (i = 0; i < listeners.length;)
	            listeners[i].fn.apply(listeners[i++].ctx, args);
	    }
	    return this;
	};
	return eventemitter;
}

var float;
var hasRequiredFloat;

function requireFloat () {
	if (hasRequiredFloat) return float;
	hasRequiredFloat = 1;

	float = factory(factory);

	/**
	 * Reads / writes floats / doubles from / to buffers.
	 * @name util.float
	 * @namespace
	 */

	/**
	 * Writes a 32 bit float to a buffer using little endian byte order.
	 * @name util.float.writeFloatLE
	 * @function
	 * @param {number} val Value to write
	 * @param {Uint8Array} buf Target buffer
	 * @param {number} pos Target buffer offset
	 * @returns {undefined}
	 */

	/**
	 * Writes a 32 bit float to a buffer using big endian byte order.
	 * @name util.float.writeFloatBE
	 * @function
	 * @param {number} val Value to write
	 * @param {Uint8Array} buf Target buffer
	 * @param {number} pos Target buffer offset
	 * @returns {undefined}
	 */

	/**
	 * Reads a 32 bit float from a buffer using little endian byte order.
	 * @name util.float.readFloatLE
	 * @function
	 * @param {Uint8Array} buf Source buffer
	 * @param {number} pos Source buffer offset
	 * @returns {number} Value read
	 */

	/**
	 * Reads a 32 bit float from a buffer using big endian byte order.
	 * @name util.float.readFloatBE
	 * @function
	 * @param {Uint8Array} buf Source buffer
	 * @param {number} pos Source buffer offset
	 * @returns {number} Value read
	 */

	/**
	 * Writes a 64 bit double to a buffer using little endian byte order.
	 * @name util.float.writeDoubleLE
	 * @function
	 * @param {number} val Value to write
	 * @param {Uint8Array} buf Target buffer
	 * @param {number} pos Target buffer offset
	 * @returns {undefined}
	 */

	/**
	 * Writes a 64 bit double to a buffer using big endian byte order.
	 * @name util.float.writeDoubleBE
	 * @function
	 * @param {number} val Value to write
	 * @param {Uint8Array} buf Target buffer
	 * @param {number} pos Target buffer offset
	 * @returns {undefined}
	 */

	/**
	 * Reads a 64 bit double from a buffer using little endian byte order.
	 * @name util.float.readDoubleLE
	 * @function
	 * @param {Uint8Array} buf Source buffer
	 * @param {number} pos Source buffer offset
	 * @returns {number} Value read
	 */

	/**
	 * Reads a 64 bit double from a buffer using big endian byte order.
	 * @name util.float.readDoubleBE
	 * @function
	 * @param {Uint8Array} buf Source buffer
	 * @param {number} pos Source buffer offset
	 * @returns {number} Value read
	 */

	// Factory function for the purpose of node-based testing in modified global environments
	function factory(exports) {

	    // float: typed array
	    if (typeof Float32Array !== "undefined") (function() {

	        var f32 = new Float32Array([ -0 ]),
	            f8b = new Uint8Array(f32.buffer),
	            le  = f8b[3] === 128;

	        function writeFloat_f32_cpy(val, buf, pos) {
	            f32[0] = val;
	            buf[pos    ] = f8b[0];
	            buf[pos + 1] = f8b[1];
	            buf[pos + 2] = f8b[2];
	            buf[pos + 3] = f8b[3];
	        }

	        function writeFloat_f32_rev(val, buf, pos) {
	            f32[0] = val;
	            buf[pos    ] = f8b[3];
	            buf[pos + 1] = f8b[2];
	            buf[pos + 2] = f8b[1];
	            buf[pos + 3] = f8b[0];
	        }

	        /* istanbul ignore next */
	        exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
	        /* istanbul ignore next */
	        exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;

	        function readFloat_f32_cpy(buf, pos) {
	            f8b[0] = buf[pos    ];
	            f8b[1] = buf[pos + 1];
	            f8b[2] = buf[pos + 2];
	            f8b[3] = buf[pos + 3];
	            return f32[0];
	        }

	        function readFloat_f32_rev(buf, pos) {
	            f8b[3] = buf[pos    ];
	            f8b[2] = buf[pos + 1];
	            f8b[1] = buf[pos + 2];
	            f8b[0] = buf[pos + 3];
	            return f32[0];
	        }

	        /* istanbul ignore next */
	        exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
	        /* istanbul ignore next */
	        exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;

	    // float: ieee754
	    })(); else (function() {

	        function writeFloat_ieee754(writeUint, val, buf, pos) {
	            var sign = val < 0 ? 1 : 0;
	            if (sign)
	                val = -val;
	            if (val === 0)
	                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
	            else if (isNaN(val))
	                writeUint(2143289344, buf, pos);
	            else if (val > 3.4028234663852886e+38) // +-Infinity
	                writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
	            else if (val < 1.1754943508222875e-38) // denormal
	                writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
	            else {
	                var exponent = Math.floor(Math.log(val) / Math.LN2),
	                    mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
	                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
	            }
	        }

	        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
	        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);

	        function readFloat_ieee754(readUint, buf, pos) {
	            var uint = readUint(buf, pos),
	                sign = (uint >> 31) * 2 + 1,
	                exponent = uint >>> 23 & 255,
	                mantissa = uint & 8388607;
	            return exponent === 255
	                ? mantissa
	                ? NaN
	                : sign * Infinity
	                : exponent === 0 // denormal
	                ? sign * 1.401298464324817e-45 * mantissa
	                : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
	        }

	        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
	        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);

	    })();

	    // double: typed array
	    if (typeof Float64Array !== "undefined") (function() {

	        var f64 = new Float64Array([-0]),
	            f8b = new Uint8Array(f64.buffer),
	            le  = f8b[7] === 128;

	        function writeDouble_f64_cpy(val, buf, pos) {
	            f64[0] = val;
	            buf[pos    ] = f8b[0];
	            buf[pos + 1] = f8b[1];
	            buf[pos + 2] = f8b[2];
	            buf[pos + 3] = f8b[3];
	            buf[pos + 4] = f8b[4];
	            buf[pos + 5] = f8b[5];
	            buf[pos + 6] = f8b[6];
	            buf[pos + 7] = f8b[7];
	        }

	        function writeDouble_f64_rev(val, buf, pos) {
	            f64[0] = val;
	            buf[pos    ] = f8b[7];
	            buf[pos + 1] = f8b[6];
	            buf[pos + 2] = f8b[5];
	            buf[pos + 3] = f8b[4];
	            buf[pos + 4] = f8b[3];
	            buf[pos + 5] = f8b[2];
	            buf[pos + 6] = f8b[1];
	            buf[pos + 7] = f8b[0];
	        }

	        /* istanbul ignore next */
	        exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
	        /* istanbul ignore next */
	        exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;

	        function readDouble_f64_cpy(buf, pos) {
	            f8b[0] = buf[pos    ];
	            f8b[1] = buf[pos + 1];
	            f8b[2] = buf[pos + 2];
	            f8b[3] = buf[pos + 3];
	            f8b[4] = buf[pos + 4];
	            f8b[5] = buf[pos + 5];
	            f8b[6] = buf[pos + 6];
	            f8b[7] = buf[pos + 7];
	            return f64[0];
	        }

	        function readDouble_f64_rev(buf, pos) {
	            f8b[7] = buf[pos    ];
	            f8b[6] = buf[pos + 1];
	            f8b[5] = buf[pos + 2];
	            f8b[4] = buf[pos + 3];
	            f8b[3] = buf[pos + 4];
	            f8b[2] = buf[pos + 5];
	            f8b[1] = buf[pos + 6];
	            f8b[0] = buf[pos + 7];
	            return f64[0];
	        }

	        /* istanbul ignore next */
	        exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
	        /* istanbul ignore next */
	        exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;

	    // double: ieee754
	    })(); else (function() {

	        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
	            var sign = val < 0 ? 1 : 0;
	            if (sign)
	                val = -val;
	            if (val === 0) {
	                writeUint(0, buf, pos + off0);
	                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
	            } else if (isNaN(val)) {
	                writeUint(0, buf, pos + off0);
	                writeUint(2146959360, buf, pos + off1);
	            } else if (val > 1.7976931348623157e+308) { // +-Infinity
	                writeUint(0, buf, pos + off0);
	                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
	            } else {
	                var mantissa;
	                if (val < 2.2250738585072014e-308) { // denormal
	                    mantissa = val / 5e-324;
	                    writeUint(mantissa >>> 0, buf, pos + off0);
	                    writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
	                } else {
	                    var exponent = Math.floor(Math.log(val) / Math.LN2);
	                    if (exponent === 1024)
	                        exponent = 1023;
	                    mantissa = val * Math.pow(2, -exponent);
	                    writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
	                    writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
	                }
	            }
	        }

	        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
	        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);

	        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
	            var lo = readUint(buf, pos + off0),
	                hi = readUint(buf, pos + off1);
	            var sign = (hi >> 31) * 2 + 1,
	                exponent = hi >>> 20 & 2047,
	                mantissa = 4294967296 * (hi & 1048575) + lo;
	            return exponent === 2047
	                ? mantissa
	                ? NaN
	                : sign * Infinity
	                : exponent === 0 // denormal
	                ? sign * 5e-324 * mantissa
	                : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
	        }

	        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
	        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);

	    })();

	    return exports;
	}

	// uint helpers

	function writeUintLE(val, buf, pos) {
	    buf[pos    ] =  val        & 255;
	    buf[pos + 1] =  val >>> 8  & 255;
	    buf[pos + 2] =  val >>> 16 & 255;
	    buf[pos + 3] =  val >>> 24;
	}

	function writeUintBE(val, buf, pos) {
	    buf[pos    ] =  val >>> 24;
	    buf[pos + 1] =  val >>> 16 & 255;
	    buf[pos + 2] =  val >>> 8  & 255;
	    buf[pos + 3] =  val        & 255;
	}

	function readUintLE(buf, pos) {
	    return (buf[pos    ]
	          | buf[pos + 1] << 8
	          | buf[pos + 2] << 16
	          | buf[pos + 3] << 24) >>> 0;
	}

	function readUintBE(buf, pos) {
	    return (buf[pos    ] << 24
	          | buf[pos + 1] << 16
	          | buf[pos + 2] << 8
	          | buf[pos + 3]) >>> 0;
	}
	return float;
}

var inquire_1;
var hasRequiredInquire;

function requireInquire () {
	if (hasRequiredInquire) return inquire_1;
	hasRequiredInquire = 1;
	inquire_1 = inquire;

	/**
	 * Requires a module only if available.
	 * @memberof util
	 * @param {string} moduleName Module to require
	 * @returns {?Object} Required module if available and not empty, otherwise `null`
	 */
	function inquire(moduleName) {
	    try {
	        var mod = eval("quire".replace(/^/,"re"))(moduleName); // eslint-disable-line no-eval
	        if (mod && (mod.length || Object.keys(mod).length))
	            return mod;
	    } catch (e) {} // eslint-disable-line no-empty
	    return null;
	}
	return inquire_1;
}

var utf8 = {};

var hasRequiredUtf8;

function requireUtf8 () {
	if (hasRequiredUtf8) return utf8;
	hasRequiredUtf8 = 1;
	(function (exports) {

		/**
		 * A minimal UTF8 implementation for number arrays.
		 * @memberof util
		 * @namespace
		 */
		var utf8 = exports;

		/**
		 * Calculates the UTF8 byte length of a string.
		 * @param {string} string String
		 * @returns {number} Byte length
		 */
		utf8.length = function utf8_length(string) {
		    var len = 0,
		        c = 0;
		    for (var i = 0; i < string.length; ++i) {
		        c = string.charCodeAt(i);
		        if (c < 128)
		            len += 1;
		        else if (c < 2048)
		            len += 2;
		        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
		            ++i;
		            len += 4;
		        } else
		            len += 3;
		    }
		    return len;
		};

		/**
		 * Reads UTF8 bytes as a string.
		 * @param {Uint8Array} buffer Source buffer
		 * @param {number} start Source start
		 * @param {number} end Source end
		 * @returns {string} String read
		 */
		utf8.read = function utf8_read(buffer, start, end) {
		    var len = end - start;
		    if (len < 1)
		        return "";
		    var parts = null,
		        chunk = [],
		        i = 0, // char offset
		        t;     // temporary
		    while (start < end) {
		        t = buffer[start++];
		        if (t < 128)
		            chunk[i++] = t;
		        else if (t > 191 && t < 224)
		            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
		        else if (t > 239 && t < 365) {
		            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
		            chunk[i++] = 0xD800 + (t >> 10);
		            chunk[i++] = 0xDC00 + (t & 1023);
		        } else
		            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
		        if (i > 8191) {
		            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
		            i = 0;
		        }
		    }
		    if (parts) {
		        if (i)
		            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
		        return parts.join("");
		    }
		    return String.fromCharCode.apply(String, chunk.slice(0, i));
		};

		/**
		 * Writes a string as UTF8 bytes.
		 * @param {string} string Source string
		 * @param {Uint8Array} buffer Destination buffer
		 * @param {number} offset Destination offset
		 * @returns {number} Bytes written
		 */
		utf8.write = function utf8_write(string, buffer, offset) {
		    var start = offset,
		        c1, // character 1
		        c2; // character 2
		    for (var i = 0; i < string.length; ++i) {
		        c1 = string.charCodeAt(i);
		        if (c1 < 128) {
		            buffer[offset++] = c1;
		        } else if (c1 < 2048) {
		            buffer[offset++] = c1 >> 6       | 192;
		            buffer[offset++] = c1       & 63 | 128;
		        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
		            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
		            ++i;
		            buffer[offset++] = c1 >> 18      | 240;
		            buffer[offset++] = c1 >> 12 & 63 | 128;
		            buffer[offset++] = c1 >> 6  & 63 | 128;
		            buffer[offset++] = c1       & 63 | 128;
		        } else {
		            buffer[offset++] = c1 >> 12      | 224;
		            buffer[offset++] = c1 >> 6  & 63 | 128;
		            buffer[offset++] = c1       & 63 | 128;
		        }
		    }
		    return offset - start;
		}; 
	} (utf8));
	return utf8;
}

var pool_1;
var hasRequiredPool;

function requirePool () {
	if (hasRequiredPool) return pool_1;
	hasRequiredPool = 1;
	pool_1 = pool;

	/**
	 * An allocator as used by {@link util.pool}.
	 * @typedef PoolAllocator
	 * @type {function}
	 * @param {number} size Buffer size
	 * @returns {Uint8Array} Buffer
	 */

	/**
	 * A slicer as used by {@link util.pool}.
	 * @typedef PoolSlicer
	 * @type {function}
	 * @param {number} start Start offset
	 * @param {number} end End offset
	 * @returns {Uint8Array} Buffer slice
	 * @this {Uint8Array}
	 */

	/**
	 * A general purpose buffer pool.
	 * @memberof util
	 * @function
	 * @param {PoolAllocator} alloc Allocator
	 * @param {PoolSlicer} slice Slicer
	 * @param {number} [size=8192] Slab size
	 * @returns {PoolAllocator} Pooled allocator
	 */
	function pool(alloc, slice, size) {
	    var SIZE   = size || 8192;
	    var MAX    = SIZE >>> 1;
	    var slab   = null;
	    var offset = SIZE;
	    return function pool_alloc(size) {
	        if (size < 1 || size > MAX)
	            return alloc(size);
	        if (offset + size > SIZE) {
	            slab = alloc(SIZE);
	            offset = 0;
	        }
	        var buf = slice.call(slab, offset, offset += size);
	        if (offset & 7) // align to 32 bit
	            offset = (offset | 7) + 1;
	        return buf;
	    };
	}
	return pool_1;
}

var longbits;
var hasRequiredLongbits;

function requireLongbits () {
	if (hasRequiredLongbits) return longbits;
	hasRequiredLongbits = 1;
	longbits = LongBits;

	var util = requireMinimal$1();

	/**
	 * Constructs new long bits.
	 * @classdesc Helper class for working with the low and high bits of a 64 bit value.
	 * @memberof util
	 * @constructor
	 * @param {number} lo Low 32 bits, unsigned
	 * @param {number} hi High 32 bits, unsigned
	 */
	function LongBits(lo, hi) {

	    // note that the casts below are theoretically unnecessary as of today, but older statically
	    // generated converter code might still call the ctor with signed 32bits. kept for compat.

	    /**
	     * Low bits.
	     * @type {number}
	     */
	    this.lo = lo >>> 0;

	    /**
	     * High bits.
	     * @type {number}
	     */
	    this.hi = hi >>> 0;
	}

	/**
	 * Zero bits.
	 * @memberof util.LongBits
	 * @type {util.LongBits}
	 */
	var zero = LongBits.zero = new LongBits(0, 0);

	zero.toNumber = function() { return 0; };
	zero.zzEncode = zero.zzDecode = function() { return this; };
	zero.length = function() { return 1; };

	/**
	 * Zero hash.
	 * @memberof util.LongBits
	 * @type {string}
	 */
	var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";

	/**
	 * Constructs new long bits from the specified number.
	 * @param {number} value Value
	 * @returns {util.LongBits} Instance
	 */
	LongBits.fromNumber = function fromNumber(value) {
	    if (value === 0)
	        return zero;
	    var sign = value < 0;
	    if (sign)
	        value = -value;
	    var lo = value >>> 0,
	        hi = (value - lo) / 4294967296 >>> 0;
	    if (sign) {
	        hi = ~hi >>> 0;
	        lo = ~lo >>> 0;
	        if (++lo > 4294967295) {
	            lo = 0;
	            if (++hi > 4294967295)
	                hi = 0;
	        }
	    }
	    return new LongBits(lo, hi);
	};

	/**
	 * Constructs new long bits from a number, long or string.
	 * @param {Long|number|string} value Value
	 * @returns {util.LongBits} Instance
	 */
	LongBits.from = function from(value) {
	    if (typeof value === "number")
	        return LongBits.fromNumber(value);
	    if (util.isString(value)) {
	        /* istanbul ignore else */
	        if (util.Long)
	            value = util.Long.fromString(value);
	        else
	            return LongBits.fromNumber(parseInt(value, 10));
	    }
	    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
	};

	/**
	 * Converts this long bits to a possibly unsafe JavaScript number.
	 * @param {boolean} [unsigned=false] Whether unsigned or not
	 * @returns {number} Possibly unsafe number
	 */
	LongBits.prototype.toNumber = function toNumber(unsigned) {
	    if (!unsigned && this.hi >>> 31) {
	        var lo = ~this.lo + 1 >>> 0,
	            hi = ~this.hi     >>> 0;
	        if (!lo)
	            hi = hi + 1 >>> 0;
	        return -(lo + hi * 4294967296);
	    }
	    return this.lo + this.hi * 4294967296;
	};

	/**
	 * Converts this long bits to a long.
	 * @param {boolean} [unsigned=false] Whether unsigned or not
	 * @returns {Long} Long
	 */
	LongBits.prototype.toLong = function toLong(unsigned) {
	    return util.Long
	        ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
	        /* istanbul ignore next */
	        : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
	};

	var charCodeAt = String.prototype.charCodeAt;

	/**
	 * Constructs new long bits from the specified 8 characters long hash.
	 * @param {string} hash Hash
	 * @returns {util.LongBits} Bits
	 */
	LongBits.fromHash = function fromHash(hash) {
	    if (hash === zeroHash)
	        return zero;
	    return new LongBits(
	        ( charCodeAt.call(hash, 0)
	        | charCodeAt.call(hash, 1) << 8
	        | charCodeAt.call(hash, 2) << 16
	        | charCodeAt.call(hash, 3) << 24) >>> 0
	    ,
	        ( charCodeAt.call(hash, 4)
	        | charCodeAt.call(hash, 5) << 8
	        | charCodeAt.call(hash, 6) << 16
	        | charCodeAt.call(hash, 7) << 24) >>> 0
	    );
	};

	/**
	 * Converts this long bits to a 8 characters long hash.
	 * @returns {string} Hash
	 */
	LongBits.prototype.toHash = function toHash() {
	    return String.fromCharCode(
	        this.lo        & 255,
	        this.lo >>> 8  & 255,
	        this.lo >>> 16 & 255,
	        this.lo >>> 24      ,
	        this.hi        & 255,
	        this.hi >>> 8  & 255,
	        this.hi >>> 16 & 255,
	        this.hi >>> 24
	    );
	};

	/**
	 * Zig-zag encodes this long bits.
	 * @returns {util.LongBits} `this`
	 */
	LongBits.prototype.zzEncode = function zzEncode() {
	    var mask =   this.hi >> 31;
	    this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
	    this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
	    return this;
	};

	/**
	 * Zig-zag decodes this long bits.
	 * @returns {util.LongBits} `this`
	 */
	LongBits.prototype.zzDecode = function zzDecode() {
	    var mask = -(this.lo & 1);
	    this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
	    this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
	    return this;
	};

	/**
	 * Calculates the length of this longbits when encoded as a varint.
	 * @returns {number} Length
	 */
	LongBits.prototype.length = function length() {
	    var part0 =  this.lo,
	        part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
	        part2 =  this.hi >>> 24;
	    return part2 === 0
	         ? part1 === 0
	           ? part0 < 16384
	             ? part0 < 128 ? 1 : 2
	             : part0 < 2097152 ? 3 : 4
	           : part1 < 16384
	             ? part1 < 128 ? 5 : 6
	             : part1 < 2097152 ? 7 : 8
	         : part2 < 128 ? 9 : 10;
	};
	return longbits;
}

var hasRequiredMinimal$1;

function requireMinimal$1 () {
	if (hasRequiredMinimal$1) return minimal$1;
	hasRequiredMinimal$1 = 1;
	(function (exports) {
		var util = exports;

		// used to return a Promise where callback is omitted
		util.asPromise = requireAspromise();

		// converts to / from base64 encoded strings
		util.base64 = requireBase64();

		// base class of rpc.Service
		util.EventEmitter = requireEventemitter();

		// float handling accross browsers
		util.float = requireFloat();

		// requires modules optionally and hides the call from bundlers
		util.inquire = requireInquire();

		// converts to / from utf8 encoded strings
		util.utf8 = requireUtf8();

		// provides a node-like buffer pool in the browser
		util.pool = requirePool();

		// utility to work with the low and high bits of a 64 bit value
		util.LongBits = requireLongbits();

		/**
		 * Whether running within node or not.
		 * @memberof util
		 * @type {boolean}
		 */
		util.isNode = Boolean(typeof commonjsGlobal !== "undefined"
		                   && commonjsGlobal
		                   && commonjsGlobal.process
		                   && commonjsGlobal.process.versions
		                   && commonjsGlobal.process.versions.node);

		/**
		 * Global object reference.
		 * @memberof util
		 * @type {Object}
		 */
		util.global = util.isNode && commonjsGlobal
		           || typeof window !== "undefined" && window
		           || typeof self   !== "undefined" && self
		           || commonjsGlobal; // eslint-disable-line no-invalid-this

		/**
		 * An immuable empty array.
		 * @memberof util
		 * @type {Array.<*>}
		 * @const
		 */
		util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ []; // used on prototypes

		/**
		 * An immutable empty object.
		 * @type {Object}
		 * @const
		 */
		util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {}; // used on prototypes

		/**
		 * Tests if the specified value is an integer.
		 * @function
		 * @param {*} value Value to test
		 * @returns {boolean} `true` if the value is an integer
		 */
		util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
		    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
		};

		/**
		 * Tests if the specified value is a string.
		 * @param {*} value Value to test
		 * @returns {boolean} `true` if the value is a string
		 */
		util.isString = function isString(value) {
		    return typeof value === "string" || value instanceof String;
		};

		/**
		 * Tests if the specified value is a non-null object.
		 * @param {*} value Value to test
		 * @returns {boolean} `true` if the value is a non-null object
		 */
		util.isObject = function isObject(value) {
		    return value && typeof value === "object";
		};

		/**
		 * Checks if a property on a message is considered to be present.
		 * This is an alias of {@link util.isSet}.
		 * @function
		 * @param {Object} obj Plain object or message instance
		 * @param {string} prop Property name
		 * @returns {boolean} `true` if considered to be present, otherwise `false`
		 */
		util.isset =

		/**
		 * Checks if a property on a message is considered to be present.
		 * @param {Object} obj Plain object or message instance
		 * @param {string} prop Property name
		 * @returns {boolean} `true` if considered to be present, otherwise `false`
		 */
		util.isSet = function isSet(obj, prop) {
		    var value = obj[prop];
		    if (value != null && obj.hasOwnProperty(prop)) // eslint-disable-line eqeqeq, no-prototype-builtins
		        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
		    return false;
		};

		/**
		 * Any compatible Buffer instance.
		 * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
		 * @interface Buffer
		 * @extends Uint8Array
		 */

		/**
		 * Node's Buffer class if available.
		 * @type {Constructor<Buffer>}
		 */
		util.Buffer = (function() {
		    try {
		        var Buffer = util.inquire("buffer").Buffer;
		        // refuse to use non-node buffers if not explicitly assigned (perf reasons):
		        return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
		    } catch (e) {
		        /* istanbul ignore next */
		        return null;
		    }
		})();

		// Internal alias of or polyfull for Buffer.from.
		util._Buffer_from = null;

		// Internal alias of or polyfill for Buffer.allocUnsafe.
		util._Buffer_allocUnsafe = null;

		/**
		 * Creates a new buffer of whatever type supported by the environment.
		 * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
		 * @returns {Uint8Array|Buffer} Buffer
		 */
		util.newBuffer = function newBuffer(sizeOrArray) {
		    /* istanbul ignore next */
		    return typeof sizeOrArray === "number"
		        ? util.Buffer
		            ? util._Buffer_allocUnsafe(sizeOrArray)
		            : new util.Array(sizeOrArray)
		        : util.Buffer
		            ? util._Buffer_from(sizeOrArray)
		            : typeof Uint8Array === "undefined"
		                ? sizeOrArray
		                : new Uint8Array(sizeOrArray);
		};

		/**
		 * Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
		 * @type {Constructor<Uint8Array>}
		 */
		util.Array = typeof Uint8Array !== "undefined" ? Uint8Array /* istanbul ignore next */ : Array;

		/**
		 * Any compatible Long instance.
		 * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
		 * @interface Long
		 * @property {number} low Low bits
		 * @property {number} high High bits
		 * @property {boolean} unsigned Whether unsigned or not
		 */

		/**
		 * Long.js's Long class if available.
		 * @type {Constructor<Long>}
		 */
		util.Long = /* istanbul ignore next */ util.global.dcodeIO && /* istanbul ignore next */ util.global.dcodeIO.Long
		         || /* istanbul ignore next */ util.global.Long
		         || util.inquire("long");

		/**
		 * Regular expression used to verify 2 bit (`bool`) map keys.
		 * @type {RegExp}
		 * @const
		 */
		util.key2Re = /^true|false|0|1$/;

		/**
		 * Regular expression used to verify 32 bit (`int32` etc.) map keys.
		 * @type {RegExp}
		 * @const
		 */
		util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;

		/**
		 * Regular expression used to verify 64 bit (`int64` etc.) map keys.
		 * @type {RegExp}
		 * @const
		 */
		util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;

		/**
		 * Converts a number or long to an 8 characters long hash string.
		 * @param {Long|number} value Value to convert
		 * @returns {string} Hash
		 */
		util.longToHash = function longToHash(value) {
		    return value
		        ? util.LongBits.from(value).toHash()
		        : util.LongBits.zeroHash;
		};

		/**
		 * Converts an 8 characters long hash string to a long or number.
		 * @param {string} hash Hash
		 * @param {boolean} [unsigned=false] Whether unsigned or not
		 * @returns {Long|number} Original value
		 */
		util.longFromHash = function longFromHash(hash, unsigned) {
		    var bits = util.LongBits.fromHash(hash);
		    if (util.Long)
		        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
		    return bits.toNumber(Boolean(unsigned));
		};

		/**
		 * Merges the properties of the source object into the destination object.
		 * @memberof util
		 * @param {Object.<string,*>} dst Destination object
		 * @param {Object.<string,*>} src Source object
		 * @param {boolean} [ifNotSet=false] Merges only if the key is not already set
		 * @returns {Object.<string,*>} Destination object
		 */
		function merge(dst, src, ifNotSet) { // used by converters
		    for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
		        if (dst[keys[i]] === undefined || !ifNotSet)
		            dst[keys[i]] = src[keys[i]];
		    return dst;
		}

		util.merge = merge;

		/**
		 * Converts the first character of a string to lower case.
		 * @param {string} str String to convert
		 * @returns {string} Converted string
		 */
		util.lcFirst = function lcFirst(str) {
		    return str.charAt(0).toLowerCase() + str.substring(1);
		};

		/**
		 * Creates a custom error constructor.
		 * @memberof util
		 * @param {string} name Error name
		 * @returns {Constructor<Error>} Custom error constructor
		 */
		function newError(name) {

		    function CustomError(message, properties) {

		        if (!(this instanceof CustomError))
		            return new CustomError(message, properties);

		        // Error.call(this, message);
		        // ^ just returns a new error instance because the ctor can be called as a function

		        Object.defineProperty(this, "message", { get: function() { return message; } });

		        /* istanbul ignore next */
		        if (Error.captureStackTrace) // node
		            Error.captureStackTrace(this, CustomError);
		        else
		            Object.defineProperty(this, "stack", { value: new Error().stack || "" });

		        if (properties)
		            merge(this, properties);
		    }

		    CustomError.prototype = Object.create(Error.prototype, {
		        constructor: {
		            value: CustomError,
		            writable: true,
		            enumerable: false,
		            configurable: true,
		        },
		        name: {
		            get: function get() { return name; },
		            set: undefined,
		            enumerable: false,
		            // configurable: false would accurately preserve the behavior of
		            // the original, but I'm guessing that was not intentional.
		            // For an actual error subclass, this property would
		            // be configurable.
		            configurable: true,
		        },
		        toString: {
		            value: function value() { return this.name + ": " + this.message; },
		            writable: true,
		            enumerable: false,
		            configurable: true,
		        },
		    });

		    return CustomError;
		}

		util.newError = newError;

		/**
		 * Constructs a new protocol error.
		 * @classdesc Error subclass indicating a protocol specifc error.
		 * @memberof util
		 * @extends Error
		 * @template T extends Message<T>
		 * @constructor
		 * @param {string} message Error message
		 * @param {Object.<string,*>} [properties] Additional properties
		 * @example
		 * try {
		 *     MyMessage.decode(someBuffer); // throws if required fields are missing
		 * } catch (e) {
		 *     if (e instanceof ProtocolError && e.instance)
		 *         console.log("decoded so far: " + JSON.stringify(e.instance));
		 * }
		 */
		util.ProtocolError = newError("ProtocolError");

		/**
		 * So far decoded message instance.
		 * @name util.ProtocolError#instance
		 * @type {Message<T>}
		 */

		/**
		 * A OneOf getter as returned by {@link util.oneOfGetter}.
		 * @typedef OneOfGetter
		 * @type {function}
		 * @returns {string|undefined} Set field name, if any
		 */

		/**
		 * Builds a getter for a oneof's present field name.
		 * @param {string[]} fieldNames Field names
		 * @returns {OneOfGetter} Unbound getter
		 */
		util.oneOfGetter = function getOneOf(fieldNames) {
		    var fieldMap = {};
		    for (var i = 0; i < fieldNames.length; ++i)
		        fieldMap[fieldNames[i]] = 1;

		    /**
		     * @returns {string|undefined} Set field name, if any
		     * @this Object
		     * @ignore
		     */
		    return function() { // eslint-disable-line consistent-return
		        for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)
		            if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null)
		                return keys[i];
		    };
		};

		/**
		 * A OneOf setter as returned by {@link util.oneOfSetter}.
		 * @typedef OneOfSetter
		 * @type {function}
		 * @param {string|undefined} value Field name
		 * @returns {undefined}
		 */

		/**
		 * Builds a setter for a oneof's present field name.
		 * @param {string[]} fieldNames Field names
		 * @returns {OneOfSetter} Unbound setter
		 */
		util.oneOfSetter = function setOneOf(fieldNames) {

		    /**
		     * @param {string} name Field name
		     * @returns {undefined}
		     * @this Object
		     * @ignore
		     */
		    return function(name) {
		        for (var i = 0; i < fieldNames.length; ++i)
		            if (fieldNames[i] !== name)
		                delete this[fieldNames[i]];
		    };
		};

		/**
		 * Default conversion options used for {@link Message#toJSON} implementations.
		 *
		 * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
		 *
		 * - Longs become strings
		 * - Enums become string keys
		 * - Bytes become base64 encoded strings
		 * - (Sub-)Messages become plain objects
		 * - Maps become plain objects with all string keys
		 * - Repeated fields become arrays
		 * - NaN and Infinity for float and double fields become strings
		 *
		 * @type {IConversionOptions}
		 * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
		 */
		util.toJSONOptions = {
		    longs: String,
		    enums: String,
		    bytes: String,
		    json: true
		};

		// Sets up buffer utility according to the environment (called in index-minimal)
		util._configure = function() {
		    var Buffer = util.Buffer;
		    /* istanbul ignore if */
		    if (!Buffer) {
		        util._Buffer_from = util._Buffer_allocUnsafe = null;
		        return;
		    }
		    // because node 4.x buffers are incompatible & immutable
		    // see: https://github.com/dcodeIO/protobuf.js/pull/665
		    util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from ||
		        /* istanbul ignore next */
		        function Buffer_from(value, encoding) {
		            return new Buffer(value, encoding);
		        };
		    util._Buffer_allocUnsafe = Buffer.allocUnsafe ||
		        /* istanbul ignore next */
		        function Buffer_allocUnsafe(size) {
		            return new Buffer(size);
		        };
		}; 
	} (minimal$1));
	return minimal$1;
}

var writer;
var hasRequiredWriter;

function requireWriter () {
	if (hasRequiredWriter) return writer;
	hasRequiredWriter = 1;
	writer = Writer;

	var util      = requireMinimal$1();

	var BufferWriter; // cyclic

	var LongBits  = util.LongBits,
	    base64    = util.base64,
	    utf8      = util.utf8;

	/**
	 * Constructs a new writer operation instance.
	 * @classdesc Scheduled writer operation.
	 * @constructor
	 * @param {function(*, Uint8Array, number)} fn Function to call
	 * @param {number} len Value byte length
	 * @param {*} val Value to write
	 * @ignore
	 */
	function Op(fn, len, val) {

	    /**
	     * Function to call.
	     * @type {function(Uint8Array, number, *)}
	     */
	    this.fn = fn;

	    /**
	     * Value byte length.
	     * @type {number}
	     */
	    this.len = len;

	    /**
	     * Next operation.
	     * @type {Writer.Op|undefined}
	     */
	    this.next = undefined;

	    /**
	     * Value to write.
	     * @type {*}
	     */
	    this.val = val; // type varies
	}

	/* istanbul ignore next */
	function noop() {} // eslint-disable-line no-empty-function

	/**
	 * Constructs a new writer state instance.
	 * @classdesc Copied writer state.
	 * @memberof Writer
	 * @constructor
	 * @param {Writer} writer Writer to copy state from
	 * @ignore
	 */
	function State(writer) {

	    /**
	     * Current head.
	     * @type {Writer.Op}
	     */
	    this.head = writer.head;

	    /**
	     * Current tail.
	     * @type {Writer.Op}
	     */
	    this.tail = writer.tail;

	    /**
	     * Current buffer length.
	     * @type {number}
	     */
	    this.len = writer.len;

	    /**
	     * Next state.
	     * @type {State|null}
	     */
	    this.next = writer.states;
	}

	/**
	 * Constructs a new writer instance.
	 * @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
	 * @constructor
	 */
	function Writer() {

	    /**
	     * Current length.
	     * @type {number}
	     */
	    this.len = 0;

	    /**
	     * Operations head.
	     * @type {Object}
	     */
	    this.head = new Op(noop, 0, 0);

	    /**
	     * Operations tail
	     * @type {Object}
	     */
	    this.tail = this.head;

	    /**
	     * Linked forked states.
	     * @type {Object|null}
	     */
	    this.states = null;

	    // When a value is written, the writer calculates its byte length and puts it into a linked
	    // list of operations to perform when finish() is called. This both allows us to allocate
	    // buffers of the exact required size and reduces the amount of work we have to do compared
	    // to first calculating over objects and then encoding over objects. In our case, the encoding
	    // part is just a linked list walk calling operations with already prepared values.
	}

	var create = function create() {
	    return util.Buffer
	        ? function create_buffer_setup() {
	            return (Writer.create = function create_buffer() {
	                return new BufferWriter();
	            })();
	        }
	        /* istanbul ignore next */
	        : function create_array() {
	            return new Writer();
	        };
	};

	/**
	 * Creates a new writer.
	 * @function
	 * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
	 */
	Writer.create = create();

	/**
	 * Allocates a buffer of the specified size.
	 * @param {number} size Buffer size
	 * @returns {Uint8Array} Buffer
	 */
	Writer.alloc = function alloc(size) {
	    return new util.Array(size);
	};

	// Use Uint8Array buffer pool in the browser, just like node does with buffers
	/* istanbul ignore else */
	if (util.Array !== Array)
	    Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);

	/**
	 * Pushes a new operation to the queue.
	 * @param {function(Uint8Array, number, *)} fn Function to call
	 * @param {number} len Value byte length
	 * @param {number} val Value to write
	 * @returns {Writer} `this`
	 * @private
	 */
	Writer.prototype._push = function push(fn, len, val) {
	    this.tail = this.tail.next = new Op(fn, len, val);
	    this.len += len;
	    return this;
	};

	function writeByte(val, buf, pos) {
	    buf[pos] = val & 255;
	}

	function writeVarint32(val, buf, pos) {
	    while (val > 127) {
	        buf[pos++] = val & 127 | 128;
	        val >>>= 7;
	    }
	    buf[pos] = val;
	}

	/**
	 * Constructs a new varint writer operation instance.
	 * @classdesc Scheduled varint writer operation.
	 * @extends Op
	 * @constructor
	 * @param {number} len Value byte length
	 * @param {number} val Value to write
	 * @ignore
	 */
	function VarintOp(len, val) {
	    this.len = len;
	    this.next = undefined;
	    this.val = val;
	}

	VarintOp.prototype = Object.create(Op.prototype);
	VarintOp.prototype.fn = writeVarint32;

	/**
	 * Writes an unsigned 32 bit value as a varint.
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.uint32 = function write_uint32(value) {
	    // here, the call to this.push has been inlined and a varint specific Op subclass is used.
	    // uint32 is by far the most frequently used operation and benefits significantly from this.
	    this.len += (this.tail = this.tail.next = new VarintOp(
	        (value = value >>> 0)
	                < 128       ? 1
	        : value < 16384     ? 2
	        : value < 2097152   ? 3
	        : value < 268435456 ? 4
	        :                     5,
	    value)).len;
	    return this;
	};

	/**
	 * Writes a signed 32 bit value as a varint.
	 * @function
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.int32 = function write_int32(value) {
	    return value < 0
	        ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) // 10 bytes per spec
	        : this.uint32(value);
	};

	/**
	 * Writes a 32 bit value as a varint, zig-zag encoded.
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.sint32 = function write_sint32(value) {
	    return this.uint32((value << 1 ^ value >> 31) >>> 0);
	};

	function writeVarint64(val, buf, pos) {
	    while (val.hi) {
	        buf[pos++] = val.lo & 127 | 128;
	        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
	        val.hi >>>= 7;
	    }
	    while (val.lo > 127) {
	        buf[pos++] = val.lo & 127 | 128;
	        val.lo = val.lo >>> 7;
	    }
	    buf[pos++] = val.lo;
	}

	/**
	 * Writes an unsigned 64 bit value as a varint.
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.uint64 = function write_uint64(value) {
	    var bits = LongBits.from(value);
	    return this._push(writeVarint64, bits.length(), bits);
	};

	/**
	 * Writes a signed 64 bit value as a varint.
	 * @function
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.int64 = Writer.prototype.uint64;

	/**
	 * Writes a signed 64 bit value as a varint, zig-zag encoded.
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.sint64 = function write_sint64(value) {
	    var bits = LongBits.from(value).zzEncode();
	    return this._push(writeVarint64, bits.length(), bits);
	};

	/**
	 * Writes a boolish value as a varint.
	 * @param {boolean} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.bool = function write_bool(value) {
	    return this._push(writeByte, 1, value ? 1 : 0);
	};

	function writeFixed32(val, buf, pos) {
	    buf[pos    ] =  val         & 255;
	    buf[pos + 1] =  val >>> 8   & 255;
	    buf[pos + 2] =  val >>> 16  & 255;
	    buf[pos + 3] =  val >>> 24;
	}

	/**
	 * Writes an unsigned 32 bit value as fixed 32 bits.
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.fixed32 = function write_fixed32(value) {
	    return this._push(writeFixed32, 4, value >>> 0);
	};

	/**
	 * Writes a signed 32 bit value as fixed 32 bits.
	 * @function
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.sfixed32 = Writer.prototype.fixed32;

	/**
	 * Writes an unsigned 64 bit value as fixed 64 bits.
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.fixed64 = function write_fixed64(value) {
	    var bits = LongBits.from(value);
	    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
	};

	/**
	 * Writes a signed 64 bit value as fixed 64 bits.
	 * @function
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.sfixed64 = Writer.prototype.fixed64;

	/**
	 * Writes a float (32 bit).
	 * @function
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.float = function write_float(value) {
	    return this._push(util.float.writeFloatLE, 4, value);
	};

	/**
	 * Writes a double (64 bit float).
	 * @function
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.double = function write_double(value) {
	    return this._push(util.float.writeDoubleLE, 8, value);
	};

	var writeBytes = util.Array.prototype.set
	    ? function writeBytes_set(val, buf, pos) {
	        buf.set(val, pos); // also works for plain array values
	    }
	    /* istanbul ignore next */
	    : function writeBytes_for(val, buf, pos) {
	        for (var i = 0; i < val.length; ++i)
	            buf[pos + i] = val[i];
	    };

	/**
	 * Writes a sequence of bytes.
	 * @param {Uint8Array|string} value Buffer or base64 encoded string to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.bytes = function write_bytes(value) {
	    var len = value.length >>> 0;
	    if (!len)
	        return this._push(writeByte, 1, 0);
	    if (util.isString(value)) {
	        var buf = Writer.alloc(len = base64.length(value));
	        base64.decode(value, buf, 0);
	        value = buf;
	    }
	    return this.uint32(len)._push(writeBytes, len, value);
	};

	/**
	 * Writes a string.
	 * @param {string} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.string = function write_string(value) {
	    var len = utf8.length(value);
	    return len
	        ? this.uint32(len)._push(utf8.write, len, value)
	        : this._push(writeByte, 1, 0);
	};

	/**
	 * Forks this writer's state by pushing it to a stack.
	 * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
	 * @returns {Writer} `this`
	 */
	Writer.prototype.fork = function fork() {
	    this.states = new State(this);
	    this.head = this.tail = new Op(noop, 0, 0);
	    this.len = 0;
	    return this;
	};

	/**
	 * Resets this instance to the last state.
	 * @returns {Writer} `this`
	 */
	Writer.prototype.reset = function reset() {
	    if (this.states) {
	        this.head   = this.states.head;
	        this.tail   = this.states.tail;
	        this.len    = this.states.len;
	        this.states = this.states.next;
	    } else {
	        this.head = this.tail = new Op(noop, 0, 0);
	        this.len  = 0;
	    }
	    return this;
	};

	/**
	 * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
	 * @returns {Writer} `this`
	 */
	Writer.prototype.ldelim = function ldelim() {
	    var head = this.head,
	        tail = this.tail,
	        len  = this.len;
	    this.reset().uint32(len);
	    if (len) {
	        this.tail.next = head.next; // skip noop
	        this.tail = tail;
	        this.len += len;
	    }
	    return this;
	};

	/**
	 * Finishes the write operation.
	 * @returns {Uint8Array} Finished buffer
	 */
	Writer.prototype.finish = function finish() {
	    var head = this.head.next, // skip noop
	        buf  = this.constructor.alloc(this.len),
	        pos  = 0;
	    while (head) {
	        head.fn(head.val, buf, pos);
	        pos += head.len;
	        head = head.next;
	    }
	    // this.head = this.tail = null;
	    return buf;
	};

	Writer._configure = function(BufferWriter_) {
	    BufferWriter = BufferWriter_;
	    Writer.create = create();
	    BufferWriter._configure();
	};
	return writer;
}

var writer_buffer;
var hasRequiredWriter_buffer;

function requireWriter_buffer () {
	if (hasRequiredWriter_buffer) return writer_buffer;
	hasRequiredWriter_buffer = 1;
	writer_buffer = BufferWriter;

	// extends Writer
	var Writer = requireWriter();
	(BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;

	var util = requireMinimal$1();

	/**
	 * Constructs a new buffer writer instance.
	 * @classdesc Wire format writer using node buffers.
	 * @extends Writer
	 * @constructor
	 */
	function BufferWriter() {
	    Writer.call(this);
	}

	BufferWriter._configure = function () {
	    /**
	     * Allocates a buffer of the specified size.
	     * @function
	     * @param {number} size Buffer size
	     * @returns {Buffer} Buffer
	     */
	    BufferWriter.alloc = util._Buffer_allocUnsafe;

	    BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set"
	        ? function writeBytesBuffer_set(val, buf, pos) {
	          buf.set(val, pos); // faster than copy (requires node >= 4 where Buffers extend Uint8Array and set is properly inherited)
	          // also works for plain array values
	        }
	        /* istanbul ignore next */
	        : function writeBytesBuffer_copy(val, buf, pos) {
	          if (val.copy) // Buffer values
	            val.copy(buf, pos, 0, val.length);
	          else for (var i = 0; i < val.length;) // plain array values
	            buf[pos++] = val[i++];
	        };
	};


	/**
	 * @override
	 */
	BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
	    if (util.isString(value))
	        value = util._Buffer_from(value, "base64");
	    var len = value.length >>> 0;
	    this.uint32(len);
	    if (len)
	        this._push(BufferWriter.writeBytesBuffer, len, value);
	    return this;
	};

	function writeStringBuffer(val, buf, pos) {
	    if (val.length < 40) // plain js is faster for short strings (probably due to redundant assertions)
	        util.utf8.write(val, buf, pos);
	    else if (buf.utf8Write)
	        buf.utf8Write(val, pos);
	    else
	        buf.write(val, pos);
	}

	/**
	 * @override
	 */
	BufferWriter.prototype.string = function write_string_buffer(value) {
	    var len = util.Buffer.byteLength(value);
	    this.uint32(len);
	    if (len)
	        this._push(writeStringBuffer, len, value);
	    return this;
	};


	/**
	 * Finishes the write operation.
	 * @name BufferWriter#finish
	 * @function
	 * @returns {Buffer} Finished buffer
	 */

	BufferWriter._configure();
	return writer_buffer;
}

var reader;
var hasRequiredReader;

function requireReader () {
	if (hasRequiredReader) return reader;
	hasRequiredReader = 1;
	reader = Reader;

	var util      = requireMinimal$1();

	var BufferReader; // cyclic

	var LongBits  = util.LongBits,
	    utf8      = util.utf8;

	/* istanbul ignore next */
	function indexOutOfRange(reader, writeLength) {
	    return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
	}

	/**
	 * Constructs a new reader instance using the specified buffer.
	 * @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
	 * @constructor
	 * @param {Uint8Array} buffer Buffer to read from
	 */
	function Reader(buffer) {

	    /**
	     * Read buffer.
	     * @type {Uint8Array}
	     */
	    this.buf = buffer;

	    /**
	     * Read buffer position.
	     * @type {number}
	     */
	    this.pos = 0;

	    /**
	     * Read buffer length.
	     * @type {number}
	     */
	    this.len = buffer.length;
	}

	var create_array = typeof Uint8Array !== "undefined"
	    ? function create_typed_array(buffer) {
	        if (buffer instanceof Uint8Array || Array.isArray(buffer))
	            return new Reader(buffer);
	        throw Error("illegal buffer");
	    }
	    /* istanbul ignore next */
	    : function create_array(buffer) {
	        if (Array.isArray(buffer))
	            return new Reader(buffer);
	        throw Error("illegal buffer");
	    };

	var create = function create() {
	    return util.Buffer
	        ? function create_buffer_setup(buffer) {
	            return (Reader.create = function create_buffer(buffer) {
	                return util.Buffer.isBuffer(buffer)
	                    ? new BufferReader(buffer)
	                    /* istanbul ignore next */
	                    : create_array(buffer);
	            })(buffer);
	        }
	        /* istanbul ignore next */
	        : create_array;
	};

	/**
	 * Creates a new reader using the specified buffer.
	 * @function
	 * @param {Uint8Array|Buffer} buffer Buffer to read from
	 * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
	 * @throws {Error} If `buffer` is not a valid buffer
	 */
	Reader.create = create();

	Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */ util.Array.prototype.slice;

	/**
	 * Reads a varint as an unsigned 32 bit value.
	 * @function
	 * @returns {number} Value read
	 */
	Reader.prototype.uint32 = (function read_uint32_setup() {
	    var value = 4294967295; // optimizer type-hint, tends to deopt otherwise (?!)
	    return function read_uint32() {
	        value = (         this.buf[this.pos] & 127       ) >>> 0; if (this.buf[this.pos++] < 128) return value;
	        value = (value | (this.buf[this.pos] & 127) <<  7) >>> 0; if (this.buf[this.pos++] < 128) return value;
	        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0; if (this.buf[this.pos++] < 128) return value;
	        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0; if (this.buf[this.pos++] < 128) return value;
	        value = (value | (this.buf[this.pos] &  15) << 28) >>> 0; if (this.buf[this.pos++] < 128) return value;

	        /* istanbul ignore if */
	        if ((this.pos += 5) > this.len) {
	            this.pos = this.len;
	            throw indexOutOfRange(this, 10);
	        }
	        return value;
	    };
	})();

	/**
	 * Reads a varint as a signed 32 bit value.
	 * @returns {number} Value read
	 */
	Reader.prototype.int32 = function read_int32() {
	    return this.uint32() | 0;
	};

	/**
	 * Reads a zig-zag encoded varint as a signed 32 bit value.
	 * @returns {number} Value read
	 */
	Reader.prototype.sint32 = function read_sint32() {
	    var value = this.uint32();
	    return value >>> 1 ^ -(value & 1) | 0;
	};

	/* eslint-disable no-invalid-this */

	function readLongVarint() {
	    // tends to deopt with local vars for octet etc.
	    var bits = new LongBits(0, 0);
	    var i = 0;
	    if (this.len - this.pos > 4) { // fast route (lo)
	        for (; i < 4; ++i) {
	            // 1st..4th
	            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
	            if (this.buf[this.pos++] < 128)
	                return bits;
	        }
	        // 5th
	        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
	        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >>  4) >>> 0;
	        if (this.buf[this.pos++] < 128)
	            return bits;
	        i = 0;
	    } else {
	        for (; i < 3; ++i) {
	            /* istanbul ignore if */
	            if (this.pos >= this.len)
	                throw indexOutOfRange(this);
	            // 1st..3th
	            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
	            if (this.buf[this.pos++] < 128)
	                return bits;
	        }
	        // 4th
	        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
	        return bits;
	    }
	    if (this.len - this.pos > 4) { // fast route (hi)
	        for (; i < 5; ++i) {
	            // 6th..10th
	            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
	            if (this.buf[this.pos++] < 128)
	                return bits;
	        }
	    } else {
	        for (; i < 5; ++i) {
	            /* istanbul ignore if */
	            if (this.pos >= this.len)
	                throw indexOutOfRange(this);
	            // 6th..10th
	            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
	            if (this.buf[this.pos++] < 128)
	                return bits;
	        }
	    }
	    /* istanbul ignore next */
	    throw Error("invalid varint encoding");
	}

	/* eslint-enable no-invalid-this */

	/**
	 * Reads a varint as a signed 64 bit value.
	 * @name Reader#int64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads a varint as an unsigned 64 bit value.
	 * @name Reader#uint64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads a zig-zag encoded varint as a signed 64 bit value.
	 * @name Reader#sint64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads a varint as a boolean.
	 * @returns {boolean} Value read
	 */
	Reader.prototype.bool = function read_bool() {
	    return this.uint32() !== 0;
	};

	function readFixed32_end(buf, end) { // note that this uses `end`, not `pos`
	    return (buf[end - 4]
	          | buf[end - 3] << 8
	          | buf[end - 2] << 16
	          | buf[end - 1] << 24) >>> 0;
	}

	/**
	 * Reads fixed 32 bits as an unsigned 32 bit integer.
	 * @returns {number} Value read
	 */
	Reader.prototype.fixed32 = function read_fixed32() {

	    /* istanbul ignore if */
	    if (this.pos + 4 > this.len)
	        throw indexOutOfRange(this, 4);

	    return readFixed32_end(this.buf, this.pos += 4);
	};

	/**
	 * Reads fixed 32 bits as a signed 32 bit integer.
	 * @returns {number} Value read
	 */
	Reader.prototype.sfixed32 = function read_sfixed32() {

	    /* istanbul ignore if */
	    if (this.pos + 4 > this.len)
	        throw indexOutOfRange(this, 4);

	    return readFixed32_end(this.buf, this.pos += 4) | 0;
	};

	/* eslint-disable no-invalid-this */

	function readFixed64(/* this: Reader */) {

	    /* istanbul ignore if */
	    if (this.pos + 8 > this.len)
	        throw indexOutOfRange(this, 8);

	    return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
	}

	/* eslint-enable no-invalid-this */

	/**
	 * Reads fixed 64 bits.
	 * @name Reader#fixed64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads zig-zag encoded fixed 64 bits.
	 * @name Reader#sfixed64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads a float (32 bit) as a number.
	 * @function
	 * @returns {number} Value read
	 */
	Reader.prototype.float = function read_float() {

	    /* istanbul ignore if */
	    if (this.pos + 4 > this.len)
	        throw indexOutOfRange(this, 4);

	    var value = util.float.readFloatLE(this.buf, this.pos);
	    this.pos += 4;
	    return value;
	};

	/**
	 * Reads a double (64 bit float) as a number.
	 * @function
	 * @returns {number} Value read
	 */
	Reader.prototype.double = function read_double() {

	    /* istanbul ignore if */
	    if (this.pos + 8 > this.len)
	        throw indexOutOfRange(this, 4);

	    var value = util.float.readDoubleLE(this.buf, this.pos);
	    this.pos += 8;
	    return value;
	};

	/**
	 * Reads a sequence of bytes preceeded by its length as a varint.
	 * @returns {Uint8Array} Value read
	 */
	Reader.prototype.bytes = function read_bytes() {
	    var length = this.uint32(),
	        start  = this.pos,
	        end    = this.pos + length;

	    /* istanbul ignore if */
	    if (end > this.len)
	        throw indexOutOfRange(this, length);

	    this.pos += length;
	    if (Array.isArray(this.buf)) // plain array
	        return this.buf.slice(start, end);
	    return start === end // fix for IE 10/Win8 and others' subarray returning array of size 1
	        ? new this.buf.constructor(0)
	        : this._slice.call(this.buf, start, end);
	};

	/**
	 * Reads a string preceeded by its byte length as a varint.
	 * @returns {string} Value read
	 */
	Reader.prototype.string = function read_string() {
	    var bytes = this.bytes();
	    return utf8.read(bytes, 0, bytes.length);
	};

	/**
	 * Skips the specified number of bytes if specified, otherwise skips a varint.
	 * @param {number} [length] Length if known, otherwise a varint is assumed
	 * @returns {Reader} `this`
	 */
	Reader.prototype.skip = function skip(length) {
	    if (typeof length === "number") {
	        /* istanbul ignore if */
	        if (this.pos + length > this.len)
	            throw indexOutOfRange(this, length);
	        this.pos += length;
	    } else {
	        do {
	            /* istanbul ignore if */
	            if (this.pos >= this.len)
	                throw indexOutOfRange(this);
	        } while (this.buf[this.pos++] & 128);
	    }
	    return this;
	};

	/**
	 * Skips the next element of the specified wire type.
	 * @param {number} wireType Wire type received
	 * @returns {Reader} `this`
	 */
	Reader.prototype.skipType = function(wireType) {
	    switch (wireType) {
	        case 0:
	            this.skip();
	            break;
	        case 1:
	            this.skip(8);
	            break;
	        case 2:
	            this.skip(this.uint32());
	            break;
	        case 3:
	            while ((wireType = this.uint32() & 7) !== 4) {
	                this.skipType(wireType);
	            }
	            break;
	        case 5:
	            this.skip(4);
	            break;

	        /* istanbul ignore next */
	        default:
	            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
	    }
	    return this;
	};

	Reader._configure = function(BufferReader_) {
	    BufferReader = BufferReader_;
	    Reader.create = create();
	    BufferReader._configure();

	    var fn = util.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
	    util.merge(Reader.prototype, {

	        int64: function read_int64() {
	            return readLongVarint.call(this)[fn](false);
	        },

	        uint64: function read_uint64() {
	            return readLongVarint.call(this)[fn](true);
	        },

	        sint64: function read_sint64() {
	            return readLongVarint.call(this).zzDecode()[fn](false);
	        },

	        fixed64: function read_fixed64() {
	            return readFixed64.call(this)[fn](true);
	        },

	        sfixed64: function read_sfixed64() {
	            return readFixed64.call(this)[fn](false);
	        }

	    });
	};
	return reader;
}

var reader_buffer;
var hasRequiredReader_buffer;

function requireReader_buffer () {
	if (hasRequiredReader_buffer) return reader_buffer;
	hasRequiredReader_buffer = 1;
	reader_buffer = BufferReader;

	// extends Reader
	var Reader = requireReader();
	(BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;

	var util = requireMinimal$1();

	/**
	 * Constructs a new buffer reader instance.
	 * @classdesc Wire format reader using node buffers.
	 * @extends Reader
	 * @constructor
	 * @param {Buffer} buffer Buffer to read from
	 */
	function BufferReader(buffer) {
	    Reader.call(this, buffer);

	    /**
	     * Read buffer.
	     * @name BufferReader#buf
	     * @type {Buffer}
	     */
	}

	BufferReader._configure = function () {
	    /* istanbul ignore else */
	    if (util.Buffer)
	        BufferReader.prototype._slice = util.Buffer.prototype.slice;
	};


	/**
	 * @override
	 */
	BufferReader.prototype.string = function read_string_buffer() {
	    var len = this.uint32(); // modifies pos
	    return this.buf.utf8Slice
	        ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len))
	        : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
	};

	/**
	 * Reads a sequence of bytes preceeded by its length as a varint.
	 * @name BufferReader#bytes
	 * @function
	 * @returns {Buffer} Value read
	 */

	BufferReader._configure();
	return reader_buffer;
}

var rpc = {};

var service;
var hasRequiredService;

function requireService () {
	if (hasRequiredService) return service;
	hasRequiredService = 1;
	service = Service;

	var util = requireMinimal$1();

	// Extends EventEmitter
	(Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;

	/**
	 * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
	 *
	 * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
	 * @typedef rpc.ServiceMethodCallback
	 * @template TRes extends Message<TRes>
	 * @type {function}
	 * @param {Error|null} error Error, if any
	 * @param {TRes} [response] Response message
	 * @returns {undefined}
	 */

	/**
	 * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
	 * @typedef rpc.ServiceMethod
	 * @template TReq extends Message<TReq>
	 * @template TRes extends Message<TRes>
	 * @type {function}
	 * @param {TReq|Properties<TReq>} request Request message or plain object
	 * @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
	 * @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
	 */

	/**
	 * Constructs a new RPC service instance.
	 * @classdesc An RPC service as returned by {@link Service#create}.
	 * @exports rpc.Service
	 * @extends util.EventEmitter
	 * @constructor
	 * @param {RPCImpl} rpcImpl RPC implementation
	 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
	 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
	 */
	function Service(rpcImpl, requestDelimited, responseDelimited) {

	    if (typeof rpcImpl !== "function")
	        throw TypeError("rpcImpl must be a function");

	    util.EventEmitter.call(this);

	    /**
	     * RPC implementation. Becomes `null` once the service is ended.
	     * @type {RPCImpl|null}
	     */
	    this.rpcImpl = rpcImpl;

	    /**
	     * Whether requests are length-delimited.
	     * @type {boolean}
	     */
	    this.requestDelimited = Boolean(requestDelimited);

	    /**
	     * Whether responses are length-delimited.
	     * @type {boolean}
	     */
	    this.responseDelimited = Boolean(responseDelimited);
	}

	/**
	 * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
	 * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
	 * @param {Constructor<TReq>} requestCtor Request constructor
	 * @param {Constructor<TRes>} responseCtor Response constructor
	 * @param {TReq|Properties<TReq>} request Request message or plain object
	 * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
	 * @returns {undefined}
	 * @template TReq extends Message<TReq>
	 * @template TRes extends Message<TRes>
	 */
	Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {

	    if (!request)
	        throw TypeError("request must be specified");

	    var self = this;
	    if (!callback)
	        return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);

	    if (!self.rpcImpl) {
	        setTimeout(function() { callback(Error("already ended")); }, 0);
	        return undefined;
	    }

	    try {
	        return self.rpcImpl(
	            method,
	            requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
	            function rpcCallback(err, response) {

	                if (err) {
	                    self.emit("error", err, method);
	                    return callback(err);
	                }

	                if (response === null) {
	                    self.end(/* endedByRPC */ true);
	                    return undefined;
	                }

	                if (!(response instanceof responseCtor)) {
	                    try {
	                        response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
	                    } catch (err) {
	                        self.emit("error", err, method);
	                        return callback(err);
	                    }
	                }

	                self.emit("data", response, method);
	                return callback(null, response);
	            }
	        );
	    } catch (err) {
	        self.emit("error", err, method);
	        setTimeout(function() { callback(err); }, 0);
	        return undefined;
	    }
	};

	/**
	 * Ends this service and emits the `end` event.
	 * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
	 * @returns {rpc.Service} `this`
	 */
	Service.prototype.end = function end(endedByRPC) {
	    if (this.rpcImpl) {
	        if (!endedByRPC) // signal end to rpcImpl
	            this.rpcImpl(null, null, null);
	        this.rpcImpl = null;
	        this.emit("end").off();
	    }
	    return this;
	};
	return service;
}

var hasRequiredRpc;

function requireRpc () {
	if (hasRequiredRpc) return rpc;
	hasRequiredRpc = 1;
	(function (exports) {

		/**
		 * Streaming RPC helpers.
		 * @namespace
		 */
		var rpc = exports;

		/**
		 * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
		 * @typedef RPCImpl
		 * @type {function}
		 * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
		 * @param {Uint8Array} requestData Request data
		 * @param {RPCImplCallback} callback Callback function
		 * @returns {undefined}
		 * @example
		 * function rpcImpl(method, requestData, callback) {
		 *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
		 *         throw Error("no such method");
		 *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
		 *         callback(err, responseData);
		 *     });
		 * }
		 */

		/**
		 * Node-style callback as used by {@link RPCImpl}.
		 * @typedef RPCImplCallback
		 * @type {function}
		 * @param {Error|null} error Error, if any, otherwise `null`
		 * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
		 * @returns {undefined}
		 */

		rpc.Service = requireService(); 
	} (rpc));
	return rpc;
}

var roots;
var hasRequiredRoots;

function requireRoots () {
	if (hasRequiredRoots) return roots;
	hasRequiredRoots = 1;
	roots = {};

	/**
	 * Named roots.
	 * This is where pbjs stores generated structures (the option `-r, --root` specifies a name).
	 * Can also be used manually to make roots available across modules.
	 * @name roots
	 * @type {Object.<string,Root>}
	 * @example
	 * // pbjs -r myroot -o compiled.js ...
	 *
	 * // in another module:
	 * require("./compiled.js");
	 *
	 * // in any subsequent module:
	 * var root = protobuf.roots["myroot"];
	 */
	return roots;
}

var hasRequiredIndexMinimal;

function requireIndexMinimal () {
	if (hasRequiredIndexMinimal) return indexMinimal;
	hasRequiredIndexMinimal = 1;
	(function (exports) {
		var protobuf = exports;

		/**
		 * Build type, one of `"full"`, `"light"` or `"minimal"`.
		 * @name build
		 * @type {string}
		 * @const
		 */
		protobuf.build = "minimal";

		// Serialization
		protobuf.Writer       = requireWriter();
		protobuf.BufferWriter = requireWriter_buffer();
		protobuf.Reader       = requireReader();
		protobuf.BufferReader = requireReader_buffer();

		// Utility
		protobuf.util         = requireMinimal$1();
		protobuf.rpc          = requireRpc();
		protobuf.roots        = requireRoots();
		protobuf.configure    = configure;

		/* istanbul ignore next */
		/**
		 * Reconfigures the library according to the environment.
		 * @returns {undefined}
		 */
		function configure() {
		    protobuf.util._configure();
		    protobuf.Writer._configure(protobuf.BufferWriter);
		    protobuf.Reader._configure(protobuf.BufferReader);
		}

		// Set up buffer utility according to the environment
		configure(); 
	} (indexMinimal));
	return indexMinimal;
}

var minimal;
var hasRequiredMinimal;

function requireMinimal () {
	if (hasRequiredMinimal) return minimal;
	hasRequiredMinimal = 1;
	minimal = requireIndexMinimal();
	return minimal;
}

/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/

(function (module) {
	(function(global, factory) { /* global define, require, module */

	    /* AMD */ if (typeof commonjsRequire === 'function' && 'object' === 'object' && module && module.exports)
	        module.exports = factory(requireMinimal());

	})(commonjsGlobal, function($protobuf) {

	    // Common aliases
	    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
	    
	    // Exported root namespace
	    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
	    
	    $root.Message = (function() {
	    
	        /**
	         * Properties of a Message.
	         * @exports IMessage
	         * @interface IMessage
	         * @property {string|null} [userId] Message userId
	         * @property {number|Long|null} [messageId] Message messageId
	         * @property {number|null} [last] Message last
	         * @property {string|null} [token] Message token
	         * @property {string|null} [userChannel] Message userChannel
	         * @property {string|null} [vpsToken] Message vpsToken
	         * @property {Array.<IDevContext>|null} [devContext] Устарело с версии 3.
	         * @property {string|null} [messageName] Message messageName
	         * @property {number|null} [version] Message version
	         * @property {IVoice|null} [voice] Message voice
	         * @property {IText|null} [text] Message text
	         * @property {ISystemMessage|null} [systemMessage] Message systemMessage
	         * @property {ILegacyDevice|null} [legacyDevice] Message legacyDevice
	         * @property {ISettings|null} [settings] Message settings
	         * @property {IStatus|null} [status] Message status
	         * @property {IDevice|null} [device] Message device
	         * @property {IBytes|null} [bytes] Message bytes
	         * @property {IInitialSettings|null} [initialSettings] Message initialSettings
	         * @property {ICancel|null} [cancel] Message cancel
	         * @property {IGetHistoryRequest|null} [getHistoryRequest] Message getHistoryRequest
	         * @property {IMute|null} [mute] Message mute
	         * @property {number|Long|null} [timestamp] Message timestamp
	         * @property {Object.<string,string>|null} [meta] Message meta
	         */
	    
	        /**
	         * Constructs a new Message.
	         * @exports Message
	         * @classdesc Represents a Message.
	         * @implements IMessage
	         * @constructor
	         * @param {IMessage=} [properties] Properties to set
	         */
	        function Message(properties) {
	            this.devContext = [];
	            this.meta = {};
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * Message userId.
	         * @member {string} userId
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.userId = "";
	    
	        /**
	         * Message messageId.
	         * @member {number|Long} messageId
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.messageId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
	    
	        /**
	         * Message last.
	         * @member {number} last
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.last = 0;
	    
	        /**
	         * Message token.
	         * @member {string} token
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.token = "";
	    
	        /**
	         * Message userChannel.
	         * @member {string} userChannel
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.userChannel = "";
	    
	        /**
	         * Message vpsToken.
	         * @member {string} vpsToken
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.vpsToken = "";
	    
	        /**
	         * Устарело с версии 3.
	         * @member {Array.<IDevContext>} devContext
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.devContext = $util.emptyArray;
	    
	        /**
	         * Message messageName.
	         * @member {string} messageName
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.messageName = "";
	    
	        /**
	         * Message version.
	         * @member {number} version
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.version = 0;
	    
	        /**
	         * Message voice.
	         * @member {IVoice|null|undefined} voice
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.voice = null;
	    
	        /**
	         * Message text.
	         * @member {IText|null|undefined} text
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.text = null;
	    
	        /**
	         * Message systemMessage.
	         * @member {ISystemMessage|null|undefined} systemMessage
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.systemMessage = null;
	    
	        /**
	         * Message legacyDevice.
	         * @member {ILegacyDevice|null|undefined} legacyDevice
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.legacyDevice = null;
	    
	        /**
	         * Message settings.
	         * @member {ISettings|null|undefined} settings
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.settings = null;
	    
	        /**
	         * Message status.
	         * @member {IStatus|null|undefined} status
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.status = null;
	    
	        /**
	         * Message device.
	         * @member {IDevice|null|undefined} device
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.device = null;
	    
	        /**
	         * Message bytes.
	         * @member {IBytes|null|undefined} bytes
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.bytes = null;
	    
	        /**
	         * Message initialSettings.
	         * @member {IInitialSettings|null|undefined} initialSettings
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.initialSettings = null;
	    
	        /**
	         * Message cancel.
	         * @member {ICancel|null|undefined} cancel
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.cancel = null;
	    
	        /**
	         * Message getHistoryRequest.
	         * @member {IGetHistoryRequest|null|undefined} getHistoryRequest
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.getHistoryRequest = null;
	    
	        /**
	         * Message mute.
	         * @member {IMute|null|undefined} mute
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.mute = null;
	    
	        /**
	         * Message timestamp.
	         * @member {number|Long} timestamp
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
	    
	        /**
	         * Message meta.
	         * @member {Object.<string,string>} meta
	         * @memberof Message
	         * @instance
	         */
	        Message.prototype.meta = $util.emptyObject;
	    
	        // OneOf field names bound to virtual getters and setters
	        var $oneOfFields;
	    
	        /**
	         * Message content.
	         * @member {"voice"|"text"|"systemMessage"|"legacyDevice"|"settings"|"status"|"device"|"bytes"|"initialSettings"|"cancel"|"getHistoryRequest"|"mute"|undefined} content
	         * @memberof Message
	         * @instance
	         */
	        Object.defineProperty(Message.prototype, "content", {
	            get: $util.oneOfGetter($oneOfFields = ["voice", "text", "systemMessage", "legacyDevice", "settings", "status", "device", "bytes", "initialSettings", "cancel", "getHistoryRequest", "mute"]),
	            set: $util.oneOfSetter($oneOfFields)
	        });
	    
	        /**
	         * Creates a new Message instance using the specified properties.
	         * @function create
	         * @memberof Message
	         * @static
	         * @param {IMessage=} [properties] Properties to set
	         * @returns {Message} Message instance
	         */
	        Message.create = function create(properties) {
	            return new Message(properties);
	        };
	    
	        /**
	         * Encodes the specified Message message. Does not implicitly {@link Message.verify|verify} messages.
	         * @function encode
	         * @memberof Message
	         * @static
	         * @param {IMessage} message Message message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        Message.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
	                writer.uint32(/* id 1, wireType 2 =*/10).string(message.userId);
	            if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
	                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.messageId);
	            if (message.last != null && Object.hasOwnProperty.call(message, "last"))
	                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.last);
	            if (message.token != null && Object.hasOwnProperty.call(message, "token"))
	                writer.uint32(/* id 4, wireType 2 =*/34).string(message.token);
	            if (message.voice != null && Object.hasOwnProperty.call(message, "voice"))
	                $root.Voice.encode(message.voice, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
	            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
	                $root.Text.encode(message.text, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
	            if (message.systemMessage != null && Object.hasOwnProperty.call(message, "systemMessage"))
	                $root.SystemMessage.encode(message.systemMessage, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
	            if (message.legacyDevice != null && Object.hasOwnProperty.call(message, "legacyDevice"))
	                $root.LegacyDevice.encode(message.legacyDevice, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
	            if (message.settings != null && Object.hasOwnProperty.call(message, "settings"))
	                $root.Settings.encode(message.settings, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
	            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
	                $root.Status.encode(message.status, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
	            if (message.userChannel != null && Object.hasOwnProperty.call(message, "userChannel"))
	                writer.uint32(/* id 11, wireType 2 =*/90).string(message.userChannel);
	            if (message.vpsToken != null && Object.hasOwnProperty.call(message, "vpsToken"))
	                writer.uint32(/* id 12, wireType 2 =*/98).string(message.vpsToken);
	            if (message.devContext != null && message.devContext.length)
	                for (var i = 0; i < message.devContext.length; ++i)
	                    $root.DevContext.encode(message.devContext[i], writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
	            if (message.messageName != null && Object.hasOwnProperty.call(message, "messageName"))
	                writer.uint32(/* id 14, wireType 2 =*/114).string(message.messageName);
	            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
	                writer.uint32(/* id 15, wireType 0 =*/120).int32(message.version);
	            if (message.device != null && Object.hasOwnProperty.call(message, "device"))
	                $root.Device.encode(message.device, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
	            if (message.bytes != null && Object.hasOwnProperty.call(message, "bytes"))
	                $root.Bytes.encode(message.bytes, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
	            if (message.initialSettings != null && Object.hasOwnProperty.call(message, "initialSettings"))
	                $root.InitialSettings.encode(message.initialSettings, writer.uint32(/* id 18, wireType 2 =*/146).fork()).ldelim();
	            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
	                writer.uint32(/* id 19, wireType 0 =*/152).int64(message.timestamp);
	            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
	                for (var keys = Object.keys(message.meta), i = 0; i < keys.length; ++i)
	                    writer.uint32(/* id 20, wireType 2 =*/162).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.meta[keys[i]]).ldelim();
	            if (message.cancel != null && Object.hasOwnProperty.call(message, "cancel"))
	                $root.Cancel.encode(message.cancel, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
	            if (message.getHistoryRequest != null && Object.hasOwnProperty.call(message, "getHistoryRequest"))
	                $root.GetHistoryRequest.encode(message.getHistoryRequest, writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
	            if (message.mute != null && Object.hasOwnProperty.call(message, "mute"))
	                $root.Mute.encode(message.mute, writer.uint32(/* id 23, wireType 2 =*/186).fork()).ldelim();
	            return writer;
	        };
	    
	        /**
	         * Decodes a Message message from the specified reader or buffer.
	         * @function decode
	         * @memberof Message
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {Message} Message
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        Message.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Message(), key, value;
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.userId = reader.string();
	                        break;
	                    }
	                case 2: {
	                        message.messageId = reader.int64();
	                        break;
	                    }
	                case 3: {
	                        message.last = reader.int32();
	                        break;
	                    }
	                case 4: {
	                        message.token = reader.string();
	                        break;
	                    }
	                case 11: {
	                        message.userChannel = reader.string();
	                        break;
	                    }
	                case 12: {
	                        message.vpsToken = reader.string();
	                        break;
	                    }
	                case 13: {
	                        if (!(message.devContext && message.devContext.length))
	                            message.devContext = [];
	                        message.devContext.push($root.DevContext.decode(reader, reader.uint32()));
	                        break;
	                    }
	                case 14: {
	                        message.messageName = reader.string();
	                        break;
	                    }
	                case 15: {
	                        message.version = reader.int32();
	                        break;
	                    }
	                case 5: {
	                        message.voice = $root.Voice.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 6: {
	                        message.text = $root.Text.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 7: {
	                        message.systemMessage = $root.SystemMessage.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 8: {
	                        message.legacyDevice = $root.LegacyDevice.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 9: {
	                        message.settings = $root.Settings.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 10: {
	                        message.status = $root.Status.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 16: {
	                        message.device = $root.Device.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 17: {
	                        message.bytes = $root.Bytes.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 18: {
	                        message.initialSettings = $root.InitialSettings.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 21: {
	                        message.cancel = $root.Cancel.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 22: {
	                        message.getHistoryRequest = $root.GetHistoryRequest.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 23: {
	                        message.mute = $root.Mute.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 19: {
	                        message.timestamp = reader.int64();
	                        break;
	                    }
	                case 20: {
	                        if (message.meta === $util.emptyObject)
	                            message.meta = {};
	                        var end2 = reader.uint32() + reader.pos;
	                        key = "";
	                        value = "";
	                        while (reader.pos < end2) {
	                            var tag2 = reader.uint32();
	                            switch (tag2 >>> 3) {
	                            case 1:
	                                key = reader.string();
	                                break;
	                            case 2:
	                                value = reader.string();
	                                break;
	                            default:
	                                reader.skipType(tag2 & 7);
	                                break;
	                            }
	                        }
	                        message.meta[key] = value;
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return Message;
	    })();
	    
	    $root.InitialSettings = (function() {
	    
	        /**
	         * Properties of an InitialSettings.
	         * @exports IInitialSettings
	         * @interface IInitialSettings
	         * @property {string|null} [userId] InitialSettings userId
	         * @property {string|null} [userChannel] InitialSettings userChannel
	         * @property {IDevice|null} [device] InitialSettings device
	         * @property {ISettings|null} [settings] InitialSettings settings
	         * @property {string|null} [locale] InitialSettings locale
	         */
	    
	        /**
	         * Constructs a new InitialSettings.
	         * @exports InitialSettings
	         * @classdesc Represents an InitialSettings.
	         * @implements IInitialSettings
	         * @constructor
	         * @param {IInitialSettings=} [properties] Properties to set
	         */
	        function InitialSettings(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * InitialSettings userId.
	         * @member {string} userId
	         * @memberof InitialSettings
	         * @instance
	         */
	        InitialSettings.prototype.userId = "";
	    
	        /**
	         * InitialSettings userChannel.
	         * @member {string} userChannel
	         * @memberof InitialSettings
	         * @instance
	         */
	        InitialSettings.prototype.userChannel = "";
	    
	        /**
	         * InitialSettings device.
	         * @member {IDevice|null|undefined} device
	         * @memberof InitialSettings
	         * @instance
	         */
	        InitialSettings.prototype.device = null;
	    
	        /**
	         * InitialSettings settings.
	         * @member {ISettings|null|undefined} settings
	         * @memberof InitialSettings
	         * @instance
	         */
	        InitialSettings.prototype.settings = null;
	    
	        /**
	         * InitialSettings locale.
	         * @member {string} locale
	         * @memberof InitialSettings
	         * @instance
	         */
	        InitialSettings.prototype.locale = "";
	    
	        /**
	         * Creates a new InitialSettings instance using the specified properties.
	         * @function create
	         * @memberof InitialSettings
	         * @static
	         * @param {IInitialSettings=} [properties] Properties to set
	         * @returns {InitialSettings} InitialSettings instance
	         */
	        InitialSettings.create = function create(properties) {
	            return new InitialSettings(properties);
	        };
	    
	        /**
	         * Encodes the specified InitialSettings message. Does not implicitly {@link InitialSettings.verify|verify} messages.
	         * @function encode
	         * @memberof InitialSettings
	         * @static
	         * @param {IInitialSettings} message InitialSettings message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        InitialSettings.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
	                writer.uint32(/* id 1, wireType 2 =*/10).string(message.userId);
	            if (message.userChannel != null && Object.hasOwnProperty.call(message, "userChannel"))
	                writer.uint32(/* id 2, wireType 2 =*/18).string(message.userChannel);
	            if (message.device != null && Object.hasOwnProperty.call(message, "device"))
	                $root.Device.encode(message.device, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
	            if (message.settings != null && Object.hasOwnProperty.call(message, "settings"))
	                $root.Settings.encode(message.settings, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
	            if (message.locale != null && Object.hasOwnProperty.call(message, "locale"))
	                writer.uint32(/* id 5, wireType 2 =*/42).string(message.locale);
	            return writer;
	        };
	    
	        /**
	         * Decodes an InitialSettings message from the specified reader or buffer.
	         * @function decode
	         * @memberof InitialSettings
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {InitialSettings} InitialSettings
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        InitialSettings.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.InitialSettings();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.userId = reader.string();
	                        break;
	                    }
	                case 2: {
	                        message.userChannel = reader.string();
	                        break;
	                    }
	                case 3: {
	                        message.device = $root.Device.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 4: {
	                        message.settings = $root.Settings.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 5: {
	                        message.locale = reader.string();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return InitialSettings;
	    })();
	    
	    $root.Device = (function() {
	    
	        /**
	         * Properties of a Device.
	         * @exports IDevice
	         * @interface IDevice
	         * @property {string|null} [platformType] Device platformType
	         * @property {string|null} [platformVersion] Device platformVersion
	         * @property {string|null} [surface] Обязательно. Пример, SBERBOX
	         * @property {string|null} [surfaceVersion] Device surfaceVersion
	         * @property {string|null} [features] Device features
	         * @property {string|null} [capabilities] Device capabilities
	         * @property {string|null} [deviceId] Device deviceId
	         * @property {string|null} [deviceManufacturer] Device deviceManufacturer
	         * @property {string|null} [deviceModel] Device deviceModel
	         * @property {string|null} [additionalInfo] Device additionalInfo
	         * @property {string|null} [tenant] Device tenant
	         */
	    
	        /**
	         * Constructs a new Device.
	         * @exports Device
	         * @classdesc Represents a Device.
	         * @implements IDevice
	         * @constructor
	         * @param {IDevice=} [properties] Properties to set
	         */
	        function Device(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * Device platformType.
	         * @member {string} platformType
	         * @memberof Device
	         * @instance
	         */
	        Device.prototype.platformType = "";
	    
	        /**
	         * Device platformVersion.
	         * @member {string} platformVersion
	         * @memberof Device
	         * @instance
	         */
	        Device.prototype.platformVersion = "";
	    
	        /**
	         * Обязательно. Пример, SBERBOX
	         * @member {string} surface
	         * @memberof Device
	         * @instance
	         */
	        Device.prototype.surface = "";
	    
	        /**
	         * Device surfaceVersion.
	         * @member {string} surfaceVersion
	         * @memberof Device
	         * @instance
	         */
	        Device.prototype.surfaceVersion = "";
	    
	        /**
	         * Device features.
	         * @member {string} features
	         * @memberof Device
	         * @instance
	         */
	        Device.prototype.features = "";
	    
	        /**
	         * Device capabilities.
	         * @member {string} capabilities
	         * @memberof Device
	         * @instance
	         */
	        Device.prototype.capabilities = "";
	    
	        /**
	         * Device deviceId.
	         * @member {string} deviceId
	         * @memberof Device
	         * @instance
	         */
	        Device.prototype.deviceId = "";
	    
	        /**
	         * Device deviceManufacturer.
	         * @member {string} deviceManufacturer
	         * @memberof Device
	         * @instance
	         */
	        Device.prototype.deviceManufacturer = "";
	    
	        /**
	         * Device deviceModel.
	         * @member {string} deviceModel
	         * @memberof Device
	         * @instance
	         */
	        Device.prototype.deviceModel = "";
	    
	        /**
	         * Device additionalInfo.
	         * @member {string} additionalInfo
	         * @memberof Device
	         * @instance
	         */
	        Device.prototype.additionalInfo = "";
	    
	        /**
	         * Device tenant.
	         * @member {string} tenant
	         * @memberof Device
	         * @instance
	         */
	        Device.prototype.tenant = "";
	    
	        /**
	         * Creates a new Device instance using the specified properties.
	         * @function create
	         * @memberof Device
	         * @static
	         * @param {IDevice=} [properties] Properties to set
	         * @returns {Device} Device instance
	         */
	        Device.create = function create(properties) {
	            return new Device(properties);
	        };
	    
	        /**
	         * Encodes the specified Device message. Does not implicitly {@link Device.verify|verify} messages.
	         * @function encode
	         * @memberof Device
	         * @static
	         * @param {IDevice} message Device message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        Device.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.platformType != null && Object.hasOwnProperty.call(message, "platformType"))
	                writer.uint32(/* id 1, wireType 2 =*/10).string(message.platformType);
	            if (message.platformVersion != null && Object.hasOwnProperty.call(message, "platformVersion"))
	                writer.uint32(/* id 2, wireType 2 =*/18).string(message.platformVersion);
	            if (message.surface != null && Object.hasOwnProperty.call(message, "surface"))
	                writer.uint32(/* id 3, wireType 2 =*/26).string(message.surface);
	            if (message.surfaceVersion != null && Object.hasOwnProperty.call(message, "surfaceVersion"))
	                writer.uint32(/* id 4, wireType 2 =*/34).string(message.surfaceVersion);
	            if (message.features != null && Object.hasOwnProperty.call(message, "features"))
	                writer.uint32(/* id 5, wireType 2 =*/42).string(message.features);
	            if (message.capabilities != null && Object.hasOwnProperty.call(message, "capabilities"))
	                writer.uint32(/* id 6, wireType 2 =*/50).string(message.capabilities);
	            if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
	                writer.uint32(/* id 7, wireType 2 =*/58).string(message.deviceId);
	            if (message.deviceManufacturer != null && Object.hasOwnProperty.call(message, "deviceManufacturer"))
	                writer.uint32(/* id 8, wireType 2 =*/66).string(message.deviceManufacturer);
	            if (message.deviceModel != null && Object.hasOwnProperty.call(message, "deviceModel"))
	                writer.uint32(/* id 9, wireType 2 =*/74).string(message.deviceModel);
	            if (message.additionalInfo != null && Object.hasOwnProperty.call(message, "additionalInfo"))
	                writer.uint32(/* id 10, wireType 2 =*/82).string(message.additionalInfo);
	            if (message.tenant != null && Object.hasOwnProperty.call(message, "tenant"))
	                writer.uint32(/* id 11, wireType 2 =*/90).string(message.tenant);
	            return writer;
	        };
	    
	        /**
	         * Decodes a Device message from the specified reader or buffer.
	         * @function decode
	         * @memberof Device
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {Device} Device
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        Device.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Device();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.platformType = reader.string();
	                        break;
	                    }
	                case 2: {
	                        message.platformVersion = reader.string();
	                        break;
	                    }
	                case 3: {
	                        message.surface = reader.string();
	                        break;
	                    }
	                case 4: {
	                        message.surfaceVersion = reader.string();
	                        break;
	                    }
	                case 5: {
	                        message.features = reader.string();
	                        break;
	                    }
	                case 6: {
	                        message.capabilities = reader.string();
	                        break;
	                    }
	                case 7: {
	                        message.deviceId = reader.string();
	                        break;
	                    }
	                case 8: {
	                        message.deviceManufacturer = reader.string();
	                        break;
	                    }
	                case 9: {
	                        message.deviceModel = reader.string();
	                        break;
	                    }
	                case 10: {
	                        message.additionalInfo = reader.string();
	                        break;
	                    }
	                case 11: {
	                        message.tenant = reader.string();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return Device;
	    })();
	    
	    $root.Settings = (function() {
	    
	        /**
	         * Properties of a Settings.
	         * @exports ISettings
	         * @interface ISettings
	         * @property {number|null} [dubbing] Settings dubbing
	         * @property {number|null} [echo] Settings echo
	         * @property {string|null} [ttsEngine] Settings ttsEngine
	         * @property {string|null} [asrEngine] Settings asrEngine
	         * @property {number|null} [asrAutoStop] Settings asrAutoStop
	         * @property {number|null} [devMode] Settings devMode
	         * @property {string|null} [authConnector] Settings authConnector
	         * @property {string|null} [surface] Settings surface
	         */
	    
	        /**
	         * Constructs a new Settings.
	         * @exports Settings
	         * @classdesc Represents a Settings.
	         * @implements ISettings
	         * @constructor
	         * @param {ISettings=} [properties] Properties to set
	         */
	        function Settings(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * Settings dubbing.
	         * @member {number} dubbing
	         * @memberof Settings
	         * @instance
	         */
	        Settings.prototype.dubbing = 0;
	    
	        /**
	         * Settings echo.
	         * @member {number} echo
	         * @memberof Settings
	         * @instance
	         */
	        Settings.prototype.echo = 0;
	    
	        /**
	         * Settings ttsEngine.
	         * @member {string} ttsEngine
	         * @memberof Settings
	         * @instance
	         */
	        Settings.prototype.ttsEngine = "";
	    
	        /**
	         * Settings asrEngine.
	         * @member {string} asrEngine
	         * @memberof Settings
	         * @instance
	         */
	        Settings.prototype.asrEngine = "";
	    
	        /**
	         * Settings asrAutoStop.
	         * @member {number} asrAutoStop
	         * @memberof Settings
	         * @instance
	         */
	        Settings.prototype.asrAutoStop = 0;
	    
	        /**
	         * Settings devMode.
	         * @member {number} devMode
	         * @memberof Settings
	         * @instance
	         */
	        Settings.prototype.devMode = 0;
	    
	        /**
	         * Settings authConnector.
	         * @member {string} authConnector
	         * @memberof Settings
	         * @instance
	         */
	        Settings.prototype.authConnector = "";
	    
	        /**
	         * Settings surface.
	         * @member {string} surface
	         * @memberof Settings
	         * @instance
	         */
	        Settings.prototype.surface = "";
	    
	        /**
	         * Creates a new Settings instance using the specified properties.
	         * @function create
	         * @memberof Settings
	         * @static
	         * @param {ISettings=} [properties] Properties to set
	         * @returns {Settings} Settings instance
	         */
	        Settings.create = function create(properties) {
	            return new Settings(properties);
	        };
	    
	        /**
	         * Encodes the specified Settings message. Does not implicitly {@link Settings.verify|verify} messages.
	         * @function encode
	         * @memberof Settings
	         * @static
	         * @param {ISettings} message Settings message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        Settings.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.dubbing != null && Object.hasOwnProperty.call(message, "dubbing"))
	                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.dubbing);
	            if (message.echo != null && Object.hasOwnProperty.call(message, "echo"))
	                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.echo);
	            if (message.ttsEngine != null && Object.hasOwnProperty.call(message, "ttsEngine"))
	                writer.uint32(/* id 3, wireType 2 =*/26).string(message.ttsEngine);
	            if (message.asrEngine != null && Object.hasOwnProperty.call(message, "asrEngine"))
	                writer.uint32(/* id 4, wireType 2 =*/34).string(message.asrEngine);
	            if (message.asrAutoStop != null && Object.hasOwnProperty.call(message, "asrAutoStop"))
	                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.asrAutoStop);
	            if (message.devMode != null && Object.hasOwnProperty.call(message, "devMode"))
	                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.devMode);
	            if (message.authConnector != null && Object.hasOwnProperty.call(message, "authConnector"))
	                writer.uint32(/* id 7, wireType 2 =*/58).string(message.authConnector);
	            if (message.surface != null && Object.hasOwnProperty.call(message, "surface"))
	                writer.uint32(/* id 8, wireType 2 =*/66).string(message.surface);
	            return writer;
	        };
	    
	        /**
	         * Decodes a Settings message from the specified reader or buffer.
	         * @function decode
	         * @memberof Settings
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {Settings} Settings
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        Settings.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Settings();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.dubbing = reader.int32();
	                        break;
	                    }
	                case 2: {
	                        message.echo = reader.int32();
	                        break;
	                    }
	                case 3: {
	                        message.ttsEngine = reader.string();
	                        break;
	                    }
	                case 4: {
	                        message.asrEngine = reader.string();
	                        break;
	                    }
	                case 5: {
	                        message.asrAutoStop = reader.int32();
	                        break;
	                    }
	                case 6: {
	                        message.devMode = reader.int32();
	                        break;
	                    }
	                case 7: {
	                        message.authConnector = reader.string();
	                        break;
	                    }
	                case 8: {
	                        message.surface = reader.string();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return Settings;
	    })();
	    
	    $root.LegacyDevice = (function() {
	    
	        /**
	         * Properties of a LegacyDevice.
	         * @exports ILegacyDevice
	         * @interface ILegacyDevice
	         * @property {string|null} [clientType] LegacyDevice clientType
	         * @property {string|null} [channel] LegacyDevice channel
	         * @property {string|null} [channelVersion] LegacyDevice channelVersion
	         * @property {string|null} [platformName] LegacyDevice platformName
	         * @property {string|null} [platformVersion] LegacyDevice platformVersion
	         * @property {string|null} [sdkVersion] LegacyDevice sdkVersion
	         * @property {string|null} [protocolVersion] LegacyDevice protocolVersion
	         */
	    
	        /**
	         * Constructs a new LegacyDevice.
	         * @exports LegacyDevice
	         * @classdesc Represents a LegacyDevice.
	         * @implements ILegacyDevice
	         * @constructor
	         * @param {ILegacyDevice=} [properties] Properties to set
	         */
	        function LegacyDevice(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * LegacyDevice clientType.
	         * @member {string} clientType
	         * @memberof LegacyDevice
	         * @instance
	         */
	        LegacyDevice.prototype.clientType = "";
	    
	        /**
	         * LegacyDevice channel.
	         * @member {string} channel
	         * @memberof LegacyDevice
	         * @instance
	         */
	        LegacyDevice.prototype.channel = "";
	    
	        /**
	         * LegacyDevice channelVersion.
	         * @member {string} channelVersion
	         * @memberof LegacyDevice
	         * @instance
	         */
	        LegacyDevice.prototype.channelVersion = "";
	    
	        /**
	         * LegacyDevice platformName.
	         * @member {string} platformName
	         * @memberof LegacyDevice
	         * @instance
	         */
	        LegacyDevice.prototype.platformName = "";
	    
	        /**
	         * LegacyDevice platformVersion.
	         * @member {string} platformVersion
	         * @memberof LegacyDevice
	         * @instance
	         */
	        LegacyDevice.prototype.platformVersion = "";
	    
	        /**
	         * LegacyDevice sdkVersion.
	         * @member {string} sdkVersion
	         * @memberof LegacyDevice
	         * @instance
	         */
	        LegacyDevice.prototype.sdkVersion = "";
	    
	        /**
	         * LegacyDevice protocolVersion.
	         * @member {string} protocolVersion
	         * @memberof LegacyDevice
	         * @instance
	         */
	        LegacyDevice.prototype.protocolVersion = "";
	    
	        /**
	         * Creates a new LegacyDevice instance using the specified properties.
	         * @function create
	         * @memberof LegacyDevice
	         * @static
	         * @param {ILegacyDevice=} [properties] Properties to set
	         * @returns {LegacyDevice} LegacyDevice instance
	         */
	        LegacyDevice.create = function create(properties) {
	            return new LegacyDevice(properties);
	        };
	    
	        /**
	         * Encodes the specified LegacyDevice message. Does not implicitly {@link LegacyDevice.verify|verify} messages.
	         * @function encode
	         * @memberof LegacyDevice
	         * @static
	         * @param {ILegacyDevice} message LegacyDevice message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        LegacyDevice.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.clientType != null && Object.hasOwnProperty.call(message, "clientType"))
	                writer.uint32(/* id 1, wireType 2 =*/10).string(message.clientType);
	            if (message.channel != null && Object.hasOwnProperty.call(message, "channel"))
	                writer.uint32(/* id 2, wireType 2 =*/18).string(message.channel);
	            if (message.channelVersion != null && Object.hasOwnProperty.call(message, "channelVersion"))
	                writer.uint32(/* id 3, wireType 2 =*/26).string(message.channelVersion);
	            if (message.platformName != null && Object.hasOwnProperty.call(message, "platformName"))
	                writer.uint32(/* id 4, wireType 2 =*/34).string(message.platformName);
	            if (message.platformVersion != null && Object.hasOwnProperty.call(message, "platformVersion"))
	                writer.uint32(/* id 5, wireType 2 =*/42).string(message.platformVersion);
	            if (message.sdkVersion != null && Object.hasOwnProperty.call(message, "sdkVersion"))
	                writer.uint32(/* id 6, wireType 2 =*/50).string(message.sdkVersion);
	            if (message.protocolVersion != null && Object.hasOwnProperty.call(message, "protocolVersion"))
	                writer.uint32(/* id 7, wireType 2 =*/58).string(message.protocolVersion);
	            return writer;
	        };
	    
	        /**
	         * Decodes a LegacyDevice message from the specified reader or buffer.
	         * @function decode
	         * @memberof LegacyDevice
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {LegacyDevice} LegacyDevice
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        LegacyDevice.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LegacyDevice();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.clientType = reader.string();
	                        break;
	                    }
	                case 2: {
	                        message.channel = reader.string();
	                        break;
	                    }
	                case 3: {
	                        message.channelVersion = reader.string();
	                        break;
	                    }
	                case 4: {
	                        message.platformName = reader.string();
	                        break;
	                    }
	                case 5: {
	                        message.platformVersion = reader.string();
	                        break;
	                    }
	                case 6: {
	                        message.sdkVersion = reader.string();
	                        break;
	                    }
	                case 7: {
	                        message.protocolVersion = reader.string();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return LegacyDevice;
	    })();
	    
	    $root.Voice = (function() {
	    
	        /**
	         * Properties of a Voice.
	         * @exports IVoice
	         * @interface IVoice
	         * @property {Uint8Array|null} [data] Voice data
	         */
	    
	        /**
	         * Constructs a new Voice.
	         * @exports Voice
	         * @classdesc Represents a Voice.
	         * @implements IVoice
	         * @constructor
	         * @param {IVoice=} [properties] Properties to set
	         */
	        function Voice(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * Voice data.
	         * @member {Uint8Array} data
	         * @memberof Voice
	         * @instance
	         */
	        Voice.prototype.data = $util.newBuffer([]);
	    
	        /**
	         * Creates a new Voice instance using the specified properties.
	         * @function create
	         * @memberof Voice
	         * @static
	         * @param {IVoice=} [properties] Properties to set
	         * @returns {Voice} Voice instance
	         */
	        Voice.create = function create(properties) {
	            return new Voice(properties);
	        };
	    
	        /**
	         * Encodes the specified Voice message. Does not implicitly {@link Voice.verify|verify} messages.
	         * @function encode
	         * @memberof Voice
	         * @static
	         * @param {IVoice} message Voice message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        Voice.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
	                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
	            return writer;
	        };
	    
	        /**
	         * Decodes a Voice message from the specified reader or buffer.
	         * @function decode
	         * @memberof Voice
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {Voice} Voice
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        Voice.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Voice();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.data = reader.bytes();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return Voice;
	    })();
	    
	    $root.Text = (function() {
	    
	        /**
	         * Properties of a Text.
	         * @exports IText
	         * @interface IText
	         * @property {string|null} [data] Text data
	         * @property {string|null} [type] Text type
	         */
	    
	        /**
	         * Constructs a new Text.
	         * @exports Text
	         * @classdesc Represents a Text.
	         * @implements IText
	         * @constructor
	         * @param {IText=} [properties] Properties to set
	         */
	        function Text(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * Text data.
	         * @member {string} data
	         * @memberof Text
	         * @instance
	         */
	        Text.prototype.data = "";
	    
	        /**
	         * Text type.
	         * @member {string} type
	         * @memberof Text
	         * @instance
	         */
	        Text.prototype.type = "";
	    
	        /**
	         * Creates a new Text instance using the specified properties.
	         * @function create
	         * @memberof Text
	         * @static
	         * @param {IText=} [properties] Properties to set
	         * @returns {Text} Text instance
	         */
	        Text.create = function create(properties) {
	            return new Text(properties);
	        };
	    
	        /**
	         * Encodes the specified Text message. Does not implicitly {@link Text.verify|verify} messages.
	         * @function encode
	         * @memberof Text
	         * @static
	         * @param {IText} message Text message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        Text.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
	                writer.uint32(/* id 1, wireType 2 =*/10).string(message.data);
	            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
	                writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
	            return writer;
	        };
	    
	        /**
	         * Decodes a Text message from the specified reader or buffer.
	         * @function decode
	         * @memberof Text
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {Text} Text
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        Text.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Text();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.data = reader.string();
	                        break;
	                    }
	                case 2: {
	                        message.type = reader.string();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return Text;
	    })();
	    
	    $root.SystemMessage = (function() {
	    
	        /**
	         * Properties of a SystemMessage.
	         * @exports ISystemMessage
	         * @interface ISystemMessage
	         * @property {string|null} [data] SystemMessage data
	         */
	    
	        /**
	         * Constructs a new SystemMessage.
	         * @exports SystemMessage
	         * @classdesc Represents a SystemMessage.
	         * @implements ISystemMessage
	         * @constructor
	         * @param {ISystemMessage=} [properties] Properties to set
	         */
	        function SystemMessage(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * SystemMessage data.
	         * @member {string} data
	         * @memberof SystemMessage
	         * @instance
	         */
	        SystemMessage.prototype.data = "";
	    
	        /**
	         * Creates a new SystemMessage instance using the specified properties.
	         * @function create
	         * @memberof SystemMessage
	         * @static
	         * @param {ISystemMessage=} [properties] Properties to set
	         * @returns {SystemMessage} SystemMessage instance
	         */
	        SystemMessage.create = function create(properties) {
	            return new SystemMessage(properties);
	        };
	    
	        /**
	         * Encodes the specified SystemMessage message. Does not implicitly {@link SystemMessage.verify|verify} messages.
	         * @function encode
	         * @memberof SystemMessage
	         * @static
	         * @param {ISystemMessage} message SystemMessage message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        SystemMessage.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
	                writer.uint32(/* id 1, wireType 2 =*/10).string(message.data);
	            return writer;
	        };
	    
	        /**
	         * Decodes a SystemMessage message from the specified reader or buffer.
	         * @function decode
	         * @memberof SystemMessage
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {SystemMessage} SystemMessage
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        SystemMessage.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SystemMessage();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.data = reader.string();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return SystemMessage;
	    })();
	    
	    $root.Status = (function() {
	    
	        /**
	         * Properties of a Status.
	         * @exports IStatus
	         * @interface IStatus
	         * @property {number|null} [code] Status code
	         * @property {string|null} [description] Status description
	         * @property {string|null} [technicalDescription] Status technicalDescription
	         */
	    
	        /**
	         * Constructs a new Status.
	         * @exports Status
	         * @classdesc Represents a Status.
	         * @implements IStatus
	         * @constructor
	         * @param {IStatus=} [properties] Properties to set
	         */
	        function Status(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * Status code.
	         * @member {number} code
	         * @memberof Status
	         * @instance
	         */
	        Status.prototype.code = 0;
	    
	        /**
	         * Status description.
	         * @member {string} description
	         * @memberof Status
	         * @instance
	         */
	        Status.prototype.description = "";
	    
	        /**
	         * Status technicalDescription.
	         * @member {string} technicalDescription
	         * @memberof Status
	         * @instance
	         */
	        Status.prototype.technicalDescription = "";
	    
	        /**
	         * Creates a new Status instance using the specified properties.
	         * @function create
	         * @memberof Status
	         * @static
	         * @param {IStatus=} [properties] Properties to set
	         * @returns {Status} Status instance
	         */
	        Status.create = function create(properties) {
	            return new Status(properties);
	        };
	    
	        /**
	         * Encodes the specified Status message. Does not implicitly {@link Status.verify|verify} messages.
	         * @function encode
	         * @memberof Status
	         * @static
	         * @param {IStatus} message Status message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        Status.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
	                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
	            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
	                writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
	            if (message.technicalDescription != null && Object.hasOwnProperty.call(message, "technicalDescription"))
	                writer.uint32(/* id 3, wireType 2 =*/26).string(message.technicalDescription);
	            return writer;
	        };
	    
	        /**
	         * Decodes a Status message from the specified reader or buffer.
	         * @function decode
	         * @memberof Status
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {Status} Status
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        Status.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Status();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.code = reader.int32();
	                        break;
	                    }
	                case 2: {
	                        message.description = reader.string();
	                        break;
	                    }
	                case 3: {
	                        message.technicalDescription = reader.string();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return Status;
	    })();
	    
	    $root.Bytes = (function() {
	    
	        /**
	         * Properties of a Bytes.
	         * @exports IBytes
	         * @interface IBytes
	         * @property {Uint8Array|null} [data] Bytes data
	         * @property {string|null} [desc] Bytes desc
	         */
	    
	        /**
	         * Constructs a new Bytes.
	         * @exports Bytes
	         * @classdesc Represents a Bytes.
	         * @implements IBytes
	         * @constructor
	         * @param {IBytes=} [properties] Properties to set
	         */
	        function Bytes(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * Bytes data.
	         * @member {Uint8Array} data
	         * @memberof Bytes
	         * @instance
	         */
	        Bytes.prototype.data = $util.newBuffer([]);
	    
	        /**
	         * Bytes desc.
	         * @member {string} desc
	         * @memberof Bytes
	         * @instance
	         */
	        Bytes.prototype.desc = "";
	    
	        /**
	         * Creates a new Bytes instance using the specified properties.
	         * @function create
	         * @memberof Bytes
	         * @static
	         * @param {IBytes=} [properties] Properties to set
	         * @returns {Bytes} Bytes instance
	         */
	        Bytes.create = function create(properties) {
	            return new Bytes(properties);
	        };
	    
	        /**
	         * Encodes the specified Bytes message. Does not implicitly {@link Bytes.verify|verify} messages.
	         * @function encode
	         * @memberof Bytes
	         * @static
	         * @param {IBytes} message Bytes message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        Bytes.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
	                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
	            if (message.desc != null && Object.hasOwnProperty.call(message, "desc"))
	                writer.uint32(/* id 2, wireType 2 =*/18).string(message.desc);
	            return writer;
	        };
	    
	        /**
	         * Decodes a Bytes message from the specified reader or buffer.
	         * @function decode
	         * @memberof Bytes
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {Bytes} Bytes
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        Bytes.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Bytes();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.data = reader.bytes();
	                        break;
	                    }
	                case 2: {
	                        message.desc = reader.string();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return Bytes;
	    })();
	    
	    $root.DevContext = (function() {
	    
	        /**
	         * Properties of a DevContext.
	         * @exports IDevContext
	         * @interface IDevContext
	         * @property {string|null} [name] DevContext name
	         * @property {number|Long|null} [timestampMs] DevContext timestampMs
	         * @property {string|null} [data] DevContext data
	         */
	    
	        /**
	         * Constructs a new DevContext.
	         * @exports DevContext
	         * @classdesc Represents a DevContext.
	         * @implements IDevContext
	         * @constructor
	         * @param {IDevContext=} [properties] Properties to set
	         */
	        function DevContext(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * DevContext name.
	         * @member {string} name
	         * @memberof DevContext
	         * @instance
	         */
	        DevContext.prototype.name = "";
	    
	        /**
	         * DevContext timestampMs.
	         * @member {number|Long} timestampMs
	         * @memberof DevContext
	         * @instance
	         */
	        DevContext.prototype.timestampMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
	    
	        /**
	         * DevContext data.
	         * @member {string} data
	         * @memberof DevContext
	         * @instance
	         */
	        DevContext.prototype.data = "";
	    
	        /**
	         * Creates a new DevContext instance using the specified properties.
	         * @function create
	         * @memberof DevContext
	         * @static
	         * @param {IDevContext=} [properties] Properties to set
	         * @returns {DevContext} DevContext instance
	         */
	        DevContext.create = function create(properties) {
	            return new DevContext(properties);
	        };
	    
	        /**
	         * Encodes the specified DevContext message. Does not implicitly {@link DevContext.verify|verify} messages.
	         * @function encode
	         * @memberof DevContext
	         * @static
	         * @param {IDevContext} message DevContext message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        DevContext.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
	                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
	            if (message.timestampMs != null && Object.hasOwnProperty.call(message, "timestampMs"))
	                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestampMs);
	            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
	                writer.uint32(/* id 3, wireType 2 =*/26).string(message.data);
	            return writer;
	        };
	    
	        /**
	         * Decodes a DevContext message from the specified reader or buffer.
	         * @function decode
	         * @memberof DevContext
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {DevContext} DevContext
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        DevContext.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DevContext();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.name = reader.string();
	                        break;
	                    }
	                case 2: {
	                        message.timestampMs = reader.int64();
	                        break;
	                    }
	                case 3: {
	                        message.data = reader.string();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return DevContext;
	    })();
	    
	    $root.Cancel = (function() {
	    
	        /**
	         * Properties of a Cancel.
	         * @exports ICancel
	         * @interface ICancel
	         */
	    
	        /**
	         * Constructs a new Cancel.
	         * @exports Cancel
	         * @classdesc Represents a Cancel.
	         * @implements ICancel
	         * @constructor
	         * @param {ICancel=} [properties] Properties to set
	         */
	        function Cancel(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * Creates a new Cancel instance using the specified properties.
	         * @function create
	         * @memberof Cancel
	         * @static
	         * @param {ICancel=} [properties] Properties to set
	         * @returns {Cancel} Cancel instance
	         */
	        Cancel.create = function create(properties) {
	            return new Cancel(properties);
	        };
	    
	        /**
	         * Encodes the specified Cancel message. Does not implicitly {@link Cancel.verify|verify} messages.
	         * @function encode
	         * @memberof Cancel
	         * @static
	         * @param {ICancel} message Cancel message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        Cancel.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            return writer;
	        };
	    
	        /**
	         * Decodes a Cancel message from the specified reader or buffer.
	         * @function decode
	         * @memberof Cancel
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {Cancel} Cancel
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        Cancel.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Cancel();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return Cancel;
	    })();
	    
	    $root.Mute = (function() {
	    
	        /**
	         * Properties of a Mute.
	         * @exports IMute
	         * @interface IMute
	         */
	    
	        /**
	         * Constructs a new Mute.
	         * @exports Mute
	         * @classdesc Represents a Mute.
	         * @implements IMute
	         * @constructor
	         * @param {IMute=} [properties] Properties to set
	         */
	        function Mute(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * Creates a new Mute instance using the specified properties.
	         * @function create
	         * @memberof Mute
	         * @static
	         * @param {IMute=} [properties] Properties to set
	         * @returns {Mute} Mute instance
	         */
	        Mute.create = function create(properties) {
	            return new Mute(properties);
	        };
	    
	        /**
	         * Encodes the specified Mute message. Does not implicitly {@link Mute.verify|verify} messages.
	         * @function encode
	         * @memberof Mute
	         * @static
	         * @param {IMute} message Mute message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        Mute.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            return writer;
	        };
	    
	        /**
	         * Decodes a Mute message from the specified reader or buffer.
	         * @function decode
	         * @memberof Mute
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {Mute} Mute
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        Mute.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mute();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return Mute;
	    })();
	    
	    $root.GetHistoryRequest = (function() {
	    
	        /**
	         * Properties of a GetHistoryRequest.
	         * @exports IGetHistoryRequest
	         * @interface IGetHistoryRequest
	         * @property {Array.<string>|null} [messageTypes] GetHistoryRequest messageTypes
	         * @property {IApp|null} [app] GetHistoryRequest app
	         * @property {IOffset|null} [offset] GetHistoryRequest offset
	         */
	    
	        /**
	         * Constructs a new GetHistoryRequest.
	         * @exports GetHistoryRequest
	         * @classdesc Represents a GetHistoryRequest.
	         * @implements IGetHistoryRequest
	         * @constructor
	         * @param {IGetHistoryRequest=} [properties] Properties to set
	         */
	        function GetHistoryRequest(properties) {
	            this.messageTypes = [];
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * GetHistoryRequest messageTypes.
	         * @member {Array.<string>} messageTypes
	         * @memberof GetHistoryRequest
	         * @instance
	         */
	        GetHistoryRequest.prototype.messageTypes = $util.emptyArray;
	    
	        /**
	         * GetHistoryRequest app.
	         * @member {IApp|null|undefined} app
	         * @memberof GetHistoryRequest
	         * @instance
	         */
	        GetHistoryRequest.prototype.app = null;
	    
	        /**
	         * GetHistoryRequest offset.
	         * @member {IOffset|null|undefined} offset
	         * @memberof GetHistoryRequest
	         * @instance
	         */
	        GetHistoryRequest.prototype.offset = null;
	    
	        /**
	         * Creates a new GetHistoryRequest instance using the specified properties.
	         * @function create
	         * @memberof GetHistoryRequest
	         * @static
	         * @param {IGetHistoryRequest=} [properties] Properties to set
	         * @returns {GetHistoryRequest} GetHistoryRequest instance
	         */
	        GetHistoryRequest.create = function create(properties) {
	            return new GetHistoryRequest(properties);
	        };
	    
	        /**
	         * Encodes the specified GetHistoryRequest message. Does not implicitly {@link GetHistoryRequest.verify|verify} messages.
	         * @function encode
	         * @memberof GetHistoryRequest
	         * @static
	         * @param {IGetHistoryRequest} message GetHistoryRequest message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        GetHistoryRequest.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.messageTypes != null && message.messageTypes.length)
	                for (var i = 0; i < message.messageTypes.length; ++i)
	                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.messageTypes[i]);
	            if (message.app != null && Object.hasOwnProperty.call(message, "app"))
	                $root.App.encode(message.app, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
	            if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
	                $root.Offset.encode(message.offset, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
	            return writer;
	        };
	    
	        /**
	         * Decodes a GetHistoryRequest message from the specified reader or buffer.
	         * @function decode
	         * @memberof GetHistoryRequest
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {GetHistoryRequest} GetHistoryRequest
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        GetHistoryRequest.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetHistoryRequest();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        if (!(message.messageTypes && message.messageTypes.length))
	                            message.messageTypes = [];
	                        message.messageTypes.push(reader.string());
	                        break;
	                    }
	                case 2: {
	                        message.app = $root.App.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 3: {
	                        message.offset = $root.Offset.decode(reader, reader.uint32());
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return GetHistoryRequest;
	    })();
	    
	    $root.App = (function() {
	    
	        /**
	         * Properties of an App.
	         * @exports IApp
	         * @interface IApp
	         * @property {google.protobuf.IStringValue|null} [type] App type
	         * @property {google.protobuf.IStringValue|null} [projectId] App projectId
	         * @property {google.protobuf.IStringValue|null} [systemName] App systemName
	         */
	    
	        /**
	         * Constructs a new App.
	         * @exports App
	         * @classdesc Represents an App.
	         * @implements IApp
	         * @constructor
	         * @param {IApp=} [properties] Properties to set
	         */
	        function App(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * App type.
	         * @member {google.protobuf.IStringValue|null|undefined} type
	         * @memberof App
	         * @instance
	         */
	        App.prototype.type = null;
	    
	        /**
	         * App projectId.
	         * @member {google.protobuf.IStringValue|null|undefined} projectId
	         * @memberof App
	         * @instance
	         */
	        App.prototype.projectId = null;
	    
	        /**
	         * App systemName.
	         * @member {google.protobuf.IStringValue|null|undefined} systemName
	         * @memberof App
	         * @instance
	         */
	        App.prototype.systemName = null;
	    
	        /**
	         * Creates a new App instance using the specified properties.
	         * @function create
	         * @memberof App
	         * @static
	         * @param {IApp=} [properties] Properties to set
	         * @returns {App} App instance
	         */
	        App.create = function create(properties) {
	            return new App(properties);
	        };
	    
	        /**
	         * Encodes the specified App message. Does not implicitly {@link App.verify|verify} messages.
	         * @function encode
	         * @memberof App
	         * @static
	         * @param {IApp} message App message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        App.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
	                $root.google.protobuf.StringValue.encode(message.type, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
	            if (message.projectId != null && Object.hasOwnProperty.call(message, "projectId"))
	                $root.google.protobuf.StringValue.encode(message.projectId, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
	            if (message.systemName != null && Object.hasOwnProperty.call(message, "systemName"))
	                $root.google.protobuf.StringValue.encode(message.systemName, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
	            return writer;
	        };
	    
	        /**
	         * Decodes an App message from the specified reader or buffer.
	         * @function decode
	         * @memberof App
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {App} App
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        App.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.App();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.type = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 2: {
	                        message.projectId = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 3: {
	                        message.systemName = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return App;
	    })();
	    
	    $root.Offset = (function() {
	    
	        /**
	         * Properties of an Offset.
	         * @exports IOffset
	         * @interface IOffset
	         * @property {google.protobuf.IStringValue|null} [limit] Offset limit
	         * @property {google.protobuf.IStringValue|null} [contentId] Offset contentId
	         */
	    
	        /**
	         * Constructs a new Offset.
	         * @exports Offset
	         * @classdesc Represents an Offset.
	         * @implements IOffset
	         * @constructor
	         * @param {IOffset=} [properties] Properties to set
	         */
	        function Offset(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * Offset limit.
	         * @member {google.protobuf.IStringValue|null|undefined} limit
	         * @memberof Offset
	         * @instance
	         */
	        Offset.prototype.limit = null;
	    
	        /**
	         * Offset contentId.
	         * @member {google.protobuf.IStringValue|null|undefined} contentId
	         * @memberof Offset
	         * @instance
	         */
	        Offset.prototype.contentId = null;
	    
	        /**
	         * Creates a new Offset instance using the specified properties.
	         * @function create
	         * @memberof Offset
	         * @static
	         * @param {IOffset=} [properties] Properties to set
	         * @returns {Offset} Offset instance
	         */
	        Offset.create = function create(properties) {
	            return new Offset(properties);
	        };
	    
	        /**
	         * Encodes the specified Offset message. Does not implicitly {@link Offset.verify|verify} messages.
	         * @function encode
	         * @memberof Offset
	         * @static
	         * @param {IOffset} message Offset message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        Offset.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
	                $root.google.protobuf.StringValue.encode(message.limit, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
	            if (message.contentId != null && Object.hasOwnProperty.call(message, "contentId"))
	                $root.google.protobuf.StringValue.encode(message.contentId, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
	            return writer;
	        };
	    
	        /**
	         * Decodes an Offset message from the specified reader or buffer.
	         * @function decode
	         * @memberof Offset
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {Offset} Offset
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        Offset.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Offset();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.limit = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 2: {
	                        message.contentId = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return Offset;
	    })();
	    
	    $root.ChatHistoryRequest = (function() {
	    
	        /**
	         * Properties of a ChatHistoryRequest.
	         * @exports IChatHistoryRequest
	         * @interface IChatHistoryRequest
	         * @property {IUuid|null} [uuid] ChatHistoryRequest uuid
	         * @property {IDevice|null} [device] ChatHistoryRequest device
	         * @property {IGetHistoryRequest|null} [getHistoryRequest] ChatHistoryRequest getHistoryRequest
	         */
	    
	        /**
	         * Constructs a new ChatHistoryRequest.
	         * @exports ChatHistoryRequest
	         * @classdesc Represents a ChatHistoryRequest.
	         * @implements IChatHistoryRequest
	         * @constructor
	         * @param {IChatHistoryRequest=} [properties] Properties to set
	         */
	        function ChatHistoryRequest(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * ChatHistoryRequest uuid.
	         * @member {IUuid|null|undefined} uuid
	         * @memberof ChatHistoryRequest
	         * @instance
	         */
	        ChatHistoryRequest.prototype.uuid = null;
	    
	        /**
	         * ChatHistoryRequest device.
	         * @member {IDevice|null|undefined} device
	         * @memberof ChatHistoryRequest
	         * @instance
	         */
	        ChatHistoryRequest.prototype.device = null;
	    
	        /**
	         * ChatHistoryRequest getHistoryRequest.
	         * @member {IGetHistoryRequest|null|undefined} getHistoryRequest
	         * @memberof ChatHistoryRequest
	         * @instance
	         */
	        ChatHistoryRequest.prototype.getHistoryRequest = null;
	    
	        /**
	         * Creates a new ChatHistoryRequest instance using the specified properties.
	         * @function create
	         * @memberof ChatHistoryRequest
	         * @static
	         * @param {IChatHistoryRequest=} [properties] Properties to set
	         * @returns {ChatHistoryRequest} ChatHistoryRequest instance
	         */
	        ChatHistoryRequest.create = function create(properties) {
	            return new ChatHistoryRequest(properties);
	        };
	    
	        /**
	         * Encodes the specified ChatHistoryRequest message. Does not implicitly {@link ChatHistoryRequest.verify|verify} messages.
	         * @function encode
	         * @memberof ChatHistoryRequest
	         * @static
	         * @param {IChatHistoryRequest} message ChatHistoryRequest message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        ChatHistoryRequest.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.uuid != null && Object.hasOwnProperty.call(message, "uuid"))
	                $root.Uuid.encode(message.uuid, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
	            if (message.device != null && Object.hasOwnProperty.call(message, "device"))
	                $root.Device.encode(message.device, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
	            if (message.getHistoryRequest != null && Object.hasOwnProperty.call(message, "getHistoryRequest"))
	                $root.GetHistoryRequest.encode(message.getHistoryRequest, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
	            return writer;
	        };
	    
	        /**
	         * Decodes a ChatHistoryRequest message from the specified reader or buffer.
	         * @function decode
	         * @memberof ChatHistoryRequest
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {ChatHistoryRequest} ChatHistoryRequest
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        ChatHistoryRequest.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ChatHistoryRequest();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.uuid = $root.Uuid.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 2: {
	                        message.device = $root.Device.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 4: {
	                        message.getHistoryRequest = $root.GetHistoryRequest.decode(reader, reader.uint32());
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return ChatHistoryRequest;
	    })();
	    
	    $root.Uuid = (function() {
	    
	        /**
	         * Properties of an Uuid.
	         * @exports IUuid
	         * @interface IUuid
	         * @property {string|null} [userId] Uuid userId
	         * @property {string|null} [userChannel] Uuid userChannel
	         * @property {string|null} [sub] Uuid sub
	         */
	    
	        /**
	         * Constructs a new Uuid.
	         * @exports Uuid
	         * @classdesc Represents an Uuid.
	         * @implements IUuid
	         * @constructor
	         * @param {IUuid=} [properties] Properties to set
	         */
	        function Uuid(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * Uuid userId.
	         * @member {string} userId
	         * @memberof Uuid
	         * @instance
	         */
	        Uuid.prototype.userId = "";
	    
	        /**
	         * Uuid userChannel.
	         * @member {string} userChannel
	         * @memberof Uuid
	         * @instance
	         */
	        Uuid.prototype.userChannel = "";
	    
	        /**
	         * Uuid sub.
	         * @member {string} sub
	         * @memberof Uuid
	         * @instance
	         */
	        Uuid.prototype.sub = "";
	    
	        /**
	         * Creates a new Uuid instance using the specified properties.
	         * @function create
	         * @memberof Uuid
	         * @static
	         * @param {IUuid=} [properties] Properties to set
	         * @returns {Uuid} Uuid instance
	         */
	        Uuid.create = function create(properties) {
	            return new Uuid(properties);
	        };
	    
	        /**
	         * Encodes the specified Uuid message. Does not implicitly {@link Uuid.verify|verify} messages.
	         * @function encode
	         * @memberof Uuid
	         * @static
	         * @param {IUuid} message Uuid message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        Uuid.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
	                writer.uint32(/* id 1, wireType 2 =*/10).string(message.userId);
	            if (message.userChannel != null && Object.hasOwnProperty.call(message, "userChannel"))
	                writer.uint32(/* id 2, wireType 2 =*/18).string(message.userChannel);
	            if (message.sub != null && Object.hasOwnProperty.call(message, "sub"))
	                writer.uint32(/* id 3, wireType 2 =*/26).string(message.sub);
	            return writer;
	        };
	    
	        /**
	         * Decodes an Uuid message from the specified reader or buffer.
	         * @function decode
	         * @memberof Uuid
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {Uuid} Uuid
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        Uuid.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Uuid();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.userId = reader.string();
	                        break;
	                    }
	                case 2: {
	                        message.userChannel = reader.string();
	                        break;
	                    }
	                case 3: {
	                        message.sub = reader.string();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return Uuid;
	    })();
	    
	    $root.GetHistoryResponse = (function() {
	    
	        /**
	         * Properties of a GetHistoryResponse.
	         * @exports IGetHistoryResponse
	         * @interface IGetHistoryResponse
	         * @property {Array.<IHistoryMessages>|null} [historyMessages] GetHistoryResponse historyMessages
	         */
	    
	        /**
	         * Constructs a new GetHistoryResponse.
	         * @exports GetHistoryResponse
	         * @classdesc Represents a GetHistoryResponse.
	         * @implements IGetHistoryResponse
	         * @constructor
	         * @param {IGetHistoryResponse=} [properties] Properties to set
	         */
	        function GetHistoryResponse(properties) {
	            this.historyMessages = [];
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * GetHistoryResponse historyMessages.
	         * @member {Array.<IHistoryMessages>} historyMessages
	         * @memberof GetHistoryResponse
	         * @instance
	         */
	        GetHistoryResponse.prototype.historyMessages = $util.emptyArray;
	    
	        /**
	         * Creates a new GetHistoryResponse instance using the specified properties.
	         * @function create
	         * @memberof GetHistoryResponse
	         * @static
	         * @param {IGetHistoryResponse=} [properties] Properties to set
	         * @returns {GetHistoryResponse} GetHistoryResponse instance
	         */
	        GetHistoryResponse.create = function create(properties) {
	            return new GetHistoryResponse(properties);
	        };
	    
	        /**
	         * Encodes the specified GetHistoryResponse message. Does not implicitly {@link GetHistoryResponse.verify|verify} messages.
	         * @function encode
	         * @memberof GetHistoryResponse
	         * @static
	         * @param {IGetHistoryResponse} message GetHistoryResponse message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        GetHistoryResponse.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.historyMessages != null && message.historyMessages.length)
	                for (var i = 0; i < message.historyMessages.length; ++i)
	                    $root.HistoryMessages.encode(message.historyMessages[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
	            return writer;
	        };
	    
	        /**
	         * Decodes a GetHistoryResponse message from the specified reader or buffer.
	         * @function decode
	         * @memberof GetHistoryResponse
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {GetHistoryResponse} GetHistoryResponse
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        GetHistoryResponse.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetHistoryResponse();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        if (!(message.historyMessages && message.historyMessages.length))
	                            message.historyMessages = [];
	                        message.historyMessages.push($root.HistoryMessages.decode(reader, reader.uint32()));
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return GetHistoryResponse;
	    })();
	    
	    $root.HistoryMessages = (function() {
	    
	        /**
	         * Properties of a HistoryMessages.
	         * @exports IHistoryMessages
	         * @interface IHistoryMessages
	         * @property {string|null} [content] HistoryMessages content
	         * @property {string|null} [contentId] HistoryMessages contentId
	         * @property {string|null} [timeCreated] HistoryMessages timeCreated
	         */
	    
	        /**
	         * Constructs a new HistoryMessages.
	         * @exports HistoryMessages
	         * @classdesc Represents a HistoryMessages.
	         * @implements IHistoryMessages
	         * @constructor
	         * @param {IHistoryMessages=} [properties] Properties to set
	         */
	        function HistoryMessages(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * HistoryMessages content.
	         * @member {string} content
	         * @memberof HistoryMessages
	         * @instance
	         */
	        HistoryMessages.prototype.content = "";
	    
	        /**
	         * HistoryMessages contentId.
	         * @member {string} contentId
	         * @memberof HistoryMessages
	         * @instance
	         */
	        HistoryMessages.prototype.contentId = "";
	    
	        /**
	         * HistoryMessages timeCreated.
	         * @member {string} timeCreated
	         * @memberof HistoryMessages
	         * @instance
	         */
	        HistoryMessages.prototype.timeCreated = "";
	    
	        /**
	         * Creates a new HistoryMessages instance using the specified properties.
	         * @function create
	         * @memberof HistoryMessages
	         * @static
	         * @param {IHistoryMessages=} [properties] Properties to set
	         * @returns {HistoryMessages} HistoryMessages instance
	         */
	        HistoryMessages.create = function create(properties) {
	            return new HistoryMessages(properties);
	        };
	    
	        /**
	         * Encodes the specified HistoryMessages message. Does not implicitly {@link HistoryMessages.verify|verify} messages.
	         * @function encode
	         * @memberof HistoryMessages
	         * @static
	         * @param {IHistoryMessages} message HistoryMessages message or plain object to encode
	         * @param {$protobuf.Writer} [writer] Writer to encode to
	         * @returns {$protobuf.Writer} Writer
	         */
	        HistoryMessages.encode = function encode(message, writer) {
	            if (!writer)
	                writer = $Writer.create();
	            if (message.content != null && Object.hasOwnProperty.call(message, "content"))
	                writer.uint32(/* id 1, wireType 2 =*/10).string(message.content);
	            if (message.contentId != null && Object.hasOwnProperty.call(message, "contentId"))
	                writer.uint32(/* id 2, wireType 2 =*/18).string(message.contentId);
	            if (message.timeCreated != null && Object.hasOwnProperty.call(message, "timeCreated"))
	                writer.uint32(/* id 3, wireType 2 =*/26).string(message.timeCreated);
	            return writer;
	        };
	    
	        /**
	         * Decodes a HistoryMessages message from the specified reader or buffer.
	         * @function decode
	         * @memberof HistoryMessages
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {HistoryMessages} HistoryMessages
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        HistoryMessages.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.HistoryMessages();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.content = reader.string();
	                        break;
	                    }
	                case 2: {
	                        message.contentId = reader.string();
	                        break;
	                    }
	                case 3: {
	                        message.timeCreated = reader.string();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return HistoryMessages;
	    })();
	    
	    $root.google = (function() {
	    
	        /**
	         * Namespace google.
	         * @exports google
	         * @namespace
	         */
	        var google = {};
	    
	        google.protobuf = (function() {
	    
	            /**
	             * Namespace protobuf.
	             * @memberof google
	             * @namespace
	             */
	            var protobuf = {};
	    
	            protobuf.DoubleValue = (function() {
	    
	                /**
	                 * Properties of a DoubleValue.
	                 * @memberof google.protobuf
	                 * @interface IDoubleValue
	                 * @property {number|null} [value] DoubleValue value
	                 */
	    
	                /**
	                 * Constructs a new DoubleValue.
	                 * @memberof google.protobuf
	                 * @classdesc Represents a DoubleValue.
	                 * @implements IDoubleValue
	                 * @constructor
	                 * @param {google.protobuf.IDoubleValue=} [properties] Properties to set
	                 */
	                function DoubleValue(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }
	    
	                /**
	                 * DoubleValue value.
	                 * @member {number} value
	                 * @memberof google.protobuf.DoubleValue
	                 * @instance
	                 */
	                DoubleValue.prototype.value = 0;
	    
	                /**
	                 * Creates a new DoubleValue instance using the specified properties.
	                 * @function create
	                 * @memberof google.protobuf.DoubleValue
	                 * @static
	                 * @param {google.protobuf.IDoubleValue=} [properties] Properties to set
	                 * @returns {google.protobuf.DoubleValue} DoubleValue instance
	                 */
	                DoubleValue.create = function create(properties) {
	                    return new DoubleValue(properties);
	                };
	    
	                /**
	                 * Encodes the specified DoubleValue message. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
	                 * @function encode
	                 * @memberof google.protobuf.DoubleValue
	                 * @static
	                 * @param {google.protobuf.IDoubleValue} message DoubleValue message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                DoubleValue.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
	                        writer.uint32(/* id 1, wireType 1 =*/9).double(message.value);
	                    return writer;
	                };
	    
	                /**
	                 * Decodes a DoubleValue message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof google.protobuf.DoubleValue
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {google.protobuf.DoubleValue} DoubleValue
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                DoubleValue.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.DoubleValue();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1: {
	                                message.value = reader.double();
	                                break;
	                            }
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };
	    
	                return DoubleValue;
	            })();
	    
	            protobuf.FloatValue = (function() {
	    
	                /**
	                 * Properties of a FloatValue.
	                 * @memberof google.protobuf
	                 * @interface IFloatValue
	                 * @property {number|null} [value] FloatValue value
	                 */
	    
	                /**
	                 * Constructs a new FloatValue.
	                 * @memberof google.protobuf
	                 * @classdesc Represents a FloatValue.
	                 * @implements IFloatValue
	                 * @constructor
	                 * @param {google.protobuf.IFloatValue=} [properties] Properties to set
	                 */
	                function FloatValue(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }
	    
	                /**
	                 * FloatValue value.
	                 * @member {number} value
	                 * @memberof google.protobuf.FloatValue
	                 * @instance
	                 */
	                FloatValue.prototype.value = 0;
	    
	                /**
	                 * Creates a new FloatValue instance using the specified properties.
	                 * @function create
	                 * @memberof google.protobuf.FloatValue
	                 * @static
	                 * @param {google.protobuf.IFloatValue=} [properties] Properties to set
	                 * @returns {google.protobuf.FloatValue} FloatValue instance
	                 */
	                FloatValue.create = function create(properties) {
	                    return new FloatValue(properties);
	                };
	    
	                /**
	                 * Encodes the specified FloatValue message. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
	                 * @function encode
	                 * @memberof google.protobuf.FloatValue
	                 * @static
	                 * @param {google.protobuf.IFloatValue} message FloatValue message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                FloatValue.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
	                        writer.uint32(/* id 1, wireType 5 =*/13).float(message.value);
	                    return writer;
	                };
	    
	                /**
	                 * Decodes a FloatValue message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof google.protobuf.FloatValue
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {google.protobuf.FloatValue} FloatValue
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                FloatValue.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.FloatValue();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1: {
	                                message.value = reader.float();
	                                break;
	                            }
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };
	    
	                return FloatValue;
	            })();
	    
	            protobuf.Int64Value = (function() {
	    
	                /**
	                 * Properties of an Int64Value.
	                 * @memberof google.protobuf
	                 * @interface IInt64Value
	                 * @property {number|Long|null} [value] Int64Value value
	                 */
	    
	                /**
	                 * Constructs a new Int64Value.
	                 * @memberof google.protobuf
	                 * @classdesc Represents an Int64Value.
	                 * @implements IInt64Value
	                 * @constructor
	                 * @param {google.protobuf.IInt64Value=} [properties] Properties to set
	                 */
	                function Int64Value(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }
	    
	                /**
	                 * Int64Value value.
	                 * @member {number|Long} value
	                 * @memberof google.protobuf.Int64Value
	                 * @instance
	                 */
	                Int64Value.prototype.value = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
	    
	                /**
	                 * Creates a new Int64Value instance using the specified properties.
	                 * @function create
	                 * @memberof google.protobuf.Int64Value
	                 * @static
	                 * @param {google.protobuf.IInt64Value=} [properties] Properties to set
	                 * @returns {google.protobuf.Int64Value} Int64Value instance
	                 */
	                Int64Value.create = function create(properties) {
	                    return new Int64Value(properties);
	                };
	    
	                /**
	                 * Encodes the specified Int64Value message. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
	                 * @function encode
	                 * @memberof google.protobuf.Int64Value
	                 * @static
	                 * @param {google.protobuf.IInt64Value} message Int64Value message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                Int64Value.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
	                        writer.uint32(/* id 1, wireType 0 =*/8).int64(message.value);
	                    return writer;
	                };
	    
	                /**
	                 * Decodes an Int64Value message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof google.protobuf.Int64Value
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {google.protobuf.Int64Value} Int64Value
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                Int64Value.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Int64Value();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1: {
	                                message.value = reader.int64();
	                                break;
	                            }
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };
	    
	                return Int64Value;
	            })();
	    
	            protobuf.UInt64Value = (function() {
	    
	                /**
	                 * Properties of a UInt64Value.
	                 * @memberof google.protobuf
	                 * @interface IUInt64Value
	                 * @property {number|Long|null} [value] UInt64Value value
	                 */
	    
	                /**
	                 * Constructs a new UInt64Value.
	                 * @memberof google.protobuf
	                 * @classdesc Represents a UInt64Value.
	                 * @implements IUInt64Value
	                 * @constructor
	                 * @param {google.protobuf.IUInt64Value=} [properties] Properties to set
	                 */
	                function UInt64Value(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }
	    
	                /**
	                 * UInt64Value value.
	                 * @member {number|Long} value
	                 * @memberof google.protobuf.UInt64Value
	                 * @instance
	                 */
	                UInt64Value.prototype.value = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
	    
	                /**
	                 * Creates a new UInt64Value instance using the specified properties.
	                 * @function create
	                 * @memberof google.protobuf.UInt64Value
	                 * @static
	                 * @param {google.protobuf.IUInt64Value=} [properties] Properties to set
	                 * @returns {google.protobuf.UInt64Value} UInt64Value instance
	                 */
	                UInt64Value.create = function create(properties) {
	                    return new UInt64Value(properties);
	                };
	    
	                /**
	                 * Encodes the specified UInt64Value message. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
	                 * @function encode
	                 * @memberof google.protobuf.UInt64Value
	                 * @static
	                 * @param {google.protobuf.IUInt64Value} message UInt64Value message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                UInt64Value.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
	                        writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.value);
	                    return writer;
	                };
	    
	                /**
	                 * Decodes a UInt64Value message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof google.protobuf.UInt64Value
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {google.protobuf.UInt64Value} UInt64Value
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                UInt64Value.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.UInt64Value();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1: {
	                                message.value = reader.uint64();
	                                break;
	                            }
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };
	    
	                return UInt64Value;
	            })();
	    
	            protobuf.Int32Value = (function() {
	    
	                /**
	                 * Properties of an Int32Value.
	                 * @memberof google.protobuf
	                 * @interface IInt32Value
	                 * @property {number|null} [value] Int32Value value
	                 */
	    
	                /**
	                 * Constructs a new Int32Value.
	                 * @memberof google.protobuf
	                 * @classdesc Represents an Int32Value.
	                 * @implements IInt32Value
	                 * @constructor
	                 * @param {google.protobuf.IInt32Value=} [properties] Properties to set
	                 */
	                function Int32Value(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }
	    
	                /**
	                 * Int32Value value.
	                 * @member {number} value
	                 * @memberof google.protobuf.Int32Value
	                 * @instance
	                 */
	                Int32Value.prototype.value = 0;
	    
	                /**
	                 * Creates a new Int32Value instance using the specified properties.
	                 * @function create
	                 * @memberof google.protobuf.Int32Value
	                 * @static
	                 * @param {google.protobuf.IInt32Value=} [properties] Properties to set
	                 * @returns {google.protobuf.Int32Value} Int32Value instance
	                 */
	                Int32Value.create = function create(properties) {
	                    return new Int32Value(properties);
	                };
	    
	                /**
	                 * Encodes the specified Int32Value message. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
	                 * @function encode
	                 * @memberof google.protobuf.Int32Value
	                 * @static
	                 * @param {google.protobuf.IInt32Value} message Int32Value message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                Int32Value.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
	                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.value);
	                    return writer;
	                };
	    
	                /**
	                 * Decodes an Int32Value message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof google.protobuf.Int32Value
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {google.protobuf.Int32Value} Int32Value
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                Int32Value.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Int32Value();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1: {
	                                message.value = reader.int32();
	                                break;
	                            }
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };
	    
	                return Int32Value;
	            })();
	    
	            protobuf.UInt32Value = (function() {
	    
	                /**
	                 * Properties of a UInt32Value.
	                 * @memberof google.protobuf
	                 * @interface IUInt32Value
	                 * @property {number|null} [value] UInt32Value value
	                 */
	    
	                /**
	                 * Constructs a new UInt32Value.
	                 * @memberof google.protobuf
	                 * @classdesc Represents a UInt32Value.
	                 * @implements IUInt32Value
	                 * @constructor
	                 * @param {google.protobuf.IUInt32Value=} [properties] Properties to set
	                 */
	                function UInt32Value(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }
	    
	                /**
	                 * UInt32Value value.
	                 * @member {number} value
	                 * @memberof google.protobuf.UInt32Value
	                 * @instance
	                 */
	                UInt32Value.prototype.value = 0;
	    
	                /**
	                 * Creates a new UInt32Value instance using the specified properties.
	                 * @function create
	                 * @memberof google.protobuf.UInt32Value
	                 * @static
	                 * @param {google.protobuf.IUInt32Value=} [properties] Properties to set
	                 * @returns {google.protobuf.UInt32Value} UInt32Value instance
	                 */
	                UInt32Value.create = function create(properties) {
	                    return new UInt32Value(properties);
	                };
	    
	                /**
	                 * Encodes the specified UInt32Value message. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
	                 * @function encode
	                 * @memberof google.protobuf.UInt32Value
	                 * @static
	                 * @param {google.protobuf.IUInt32Value} message UInt32Value message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                UInt32Value.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
	                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.value);
	                    return writer;
	                };
	    
	                /**
	                 * Decodes a UInt32Value message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof google.protobuf.UInt32Value
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {google.protobuf.UInt32Value} UInt32Value
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                UInt32Value.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.UInt32Value();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1: {
	                                message.value = reader.uint32();
	                                break;
	                            }
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };
	    
	                return UInt32Value;
	            })();
	    
	            protobuf.BoolValue = (function() {
	    
	                /**
	                 * Properties of a BoolValue.
	                 * @memberof google.protobuf
	                 * @interface IBoolValue
	                 * @property {boolean|null} [value] BoolValue value
	                 */
	    
	                /**
	                 * Constructs a new BoolValue.
	                 * @memberof google.protobuf
	                 * @classdesc Represents a BoolValue.
	                 * @implements IBoolValue
	                 * @constructor
	                 * @param {google.protobuf.IBoolValue=} [properties] Properties to set
	                 */
	                function BoolValue(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }
	    
	                /**
	                 * BoolValue value.
	                 * @member {boolean} value
	                 * @memberof google.protobuf.BoolValue
	                 * @instance
	                 */
	                BoolValue.prototype.value = false;
	    
	                /**
	                 * Creates a new BoolValue instance using the specified properties.
	                 * @function create
	                 * @memberof google.protobuf.BoolValue
	                 * @static
	                 * @param {google.protobuf.IBoolValue=} [properties] Properties to set
	                 * @returns {google.protobuf.BoolValue} BoolValue instance
	                 */
	                BoolValue.create = function create(properties) {
	                    return new BoolValue(properties);
	                };
	    
	                /**
	                 * Encodes the specified BoolValue message. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
	                 * @function encode
	                 * @memberof google.protobuf.BoolValue
	                 * @static
	                 * @param {google.protobuf.IBoolValue} message BoolValue message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                BoolValue.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
	                        writer.uint32(/* id 1, wireType 0 =*/8).bool(message.value);
	                    return writer;
	                };
	    
	                /**
	                 * Decodes a BoolValue message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof google.protobuf.BoolValue
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {google.protobuf.BoolValue} BoolValue
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                BoolValue.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.BoolValue();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1: {
	                                message.value = reader.bool();
	                                break;
	                            }
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };
	    
	                return BoolValue;
	            })();
	    
	            protobuf.StringValue = (function() {
	    
	                /**
	                 * Properties of a StringValue.
	                 * @memberof google.protobuf
	                 * @interface IStringValue
	                 * @property {string|null} [value] StringValue value
	                 */
	    
	                /**
	                 * Constructs a new StringValue.
	                 * @memberof google.protobuf
	                 * @classdesc Represents a StringValue.
	                 * @implements IStringValue
	                 * @constructor
	                 * @param {google.protobuf.IStringValue=} [properties] Properties to set
	                 */
	                function StringValue(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }
	    
	                /**
	                 * StringValue value.
	                 * @member {string} value
	                 * @memberof google.protobuf.StringValue
	                 * @instance
	                 */
	                StringValue.prototype.value = "";
	    
	                /**
	                 * Creates a new StringValue instance using the specified properties.
	                 * @function create
	                 * @memberof google.protobuf.StringValue
	                 * @static
	                 * @param {google.protobuf.IStringValue=} [properties] Properties to set
	                 * @returns {google.protobuf.StringValue} StringValue instance
	                 */
	                StringValue.create = function create(properties) {
	                    return new StringValue(properties);
	                };
	    
	                /**
	                 * Encodes the specified StringValue message. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
	                 * @function encode
	                 * @memberof google.protobuf.StringValue
	                 * @static
	                 * @param {google.protobuf.IStringValue} message StringValue message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                StringValue.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
	                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
	                    return writer;
	                };
	    
	                /**
	                 * Decodes a StringValue message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof google.protobuf.StringValue
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {google.protobuf.StringValue} StringValue
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                StringValue.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.StringValue();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1: {
	                                message.value = reader.string();
	                                break;
	                            }
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };
	    
	                return StringValue;
	            })();
	    
	            protobuf.BytesValue = (function() {
	    
	                /**
	                 * Properties of a BytesValue.
	                 * @memberof google.protobuf
	                 * @interface IBytesValue
	                 * @property {Uint8Array|null} [value] BytesValue value
	                 */
	    
	                /**
	                 * Constructs a new BytesValue.
	                 * @memberof google.protobuf
	                 * @classdesc Represents a BytesValue.
	                 * @implements IBytesValue
	                 * @constructor
	                 * @param {google.protobuf.IBytesValue=} [properties] Properties to set
	                 */
	                function BytesValue(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }
	    
	                /**
	                 * BytesValue value.
	                 * @member {Uint8Array} value
	                 * @memberof google.protobuf.BytesValue
	                 * @instance
	                 */
	                BytesValue.prototype.value = $util.newBuffer([]);
	    
	                /**
	                 * Creates a new BytesValue instance using the specified properties.
	                 * @function create
	                 * @memberof google.protobuf.BytesValue
	                 * @static
	                 * @param {google.protobuf.IBytesValue=} [properties] Properties to set
	                 * @returns {google.protobuf.BytesValue} BytesValue instance
	                 */
	                BytesValue.create = function create(properties) {
	                    return new BytesValue(properties);
	                };
	    
	                /**
	                 * Encodes the specified BytesValue message. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
	                 * @function encode
	                 * @memberof google.protobuf.BytesValue
	                 * @static
	                 * @param {google.protobuf.IBytesValue} message BytesValue message or plain object to encode
	                 * @param {$protobuf.Writer} [writer] Writer to encode to
	                 * @returns {$protobuf.Writer} Writer
	                 */
	                BytesValue.encode = function encode(message, writer) {
	                    if (!writer)
	                        writer = $Writer.create();
	                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
	                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.value);
	                    return writer;
	                };
	    
	                /**
	                 * Decodes a BytesValue message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof google.protobuf.BytesValue
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {google.protobuf.BytesValue} BytesValue
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                BytesValue.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.BytesValue();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1: {
	                                message.value = reader.bytes();
	                                break;
	                            }
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };
	    
	                return BytesValue;
	            })();
	    
	            return protobuf;
	        })();
	    
	        return google;
	    })();

	    return $root;
	}); 
} (proto));

var protoExports = proto.exports;

// eslint-disable-next-line no-shadow
var VpsVersion;
(function (VpsVersion) {
    VpsVersion[VpsVersion["1.0"] = 1] = "1.0";
    VpsVersion[VpsVersion["2.0"] = 2] = "2.0";
    VpsVersion[VpsVersion["3.0"] = 3] = "3.0";
    VpsVersion[VpsVersion["4.0"] = 4] = "4.0";
    VpsVersion[VpsVersion["5.0"] = 5] = "5.0";
})(VpsVersion || (VpsVersion = {}));
var MessageNames = {
    ANSWER_TO_USER: 'ANSWER_TO_USER',
    STT: 'STT',
    MUSIC_RECOGNITION: 'MUSIC_RECOGNITION',
    DO_NOTHING: 'DO_NOTHING',
};

var createClientMethods = function (_a) {
    var getMessageId = _a.getMessageId, sendMessage = _a.sendMessage;
    var send = function (_a) {
        var payload = _a.payload, messageId = _a.messageId, other = __rest(_a, ["payload", "messageId"]);
        sendMessage(__assign(__assign(__assign({ messageName: '' }, payload), { messageId: messageId }), other));
    };
    var sendDevice = function (data, last, messageId) {
        if (last === void 0) { last = true; }
        if (messageId === void 0) { messageId = getMessageId(); }
        return send({
            payload: {
                device: protoExports.Device.create(data),
                last: last ? 1 : -1,
            },
            messageId: messageId,
        });
    };
    var sendInitialSettings = function (data, last, messageId, params) {
        if (last === void 0) { last = true; }
        if (messageId === void 0) { messageId = getMessageId(); }
        if (params === void 0) { params = {}; }
        return send({
            payload: __assign({ initialSettings: protoExports.InitialSettings.create(data), last: last ? 1 : -1 }, params),
            messageId: messageId,
        });
    };
    var getHistoryRequest = function (data, last, messageId) {
        if (last === void 0) { last = true; }
        if (messageId === void 0) { messageId = getMessageId(); }
        var uuid = data.uuid, device = data.device, historyClient = data.history;
        var historyProto = { messageTypes: historyClient === null || historyClient === void 0 ? void 0 : historyClient.messageTypes };
        // Мапим объект настроек от пользователя в формат объекта протобафа
        if (historyClient === null || historyClient === void 0 ? void 0 : historyClient.app) {
            historyProto.app = Object.entries(historyClient.app).reduce(function (acc, _a) {
                var _b;
                var key = _a[0], value = _a[1];
                return (__assign(__assign({}, acc), (_b = {}, _b[key] = { value: value }, _b)));
            }, {});
        }
        if (historyClient === null || historyClient === void 0 ? void 0 : historyClient.offset) {
            historyProto.offset = Object.entries(historyClient.offset).reduce(function (acc, _a) {
                var _b;
                var key = _a[0], value = _a[1];
                return (__assign(__assign({}, acc), (_b = {}, _b[key] = { value: value.toString() }, _b)));
            }, {});
        }
        return send({
            payload: __assign(__assign({}, protoExports.ChatHistoryRequest.create({
                uuid: uuid,
                device: device,
                getHistoryRequest: historyProto,
            })), { messageName: 'GET_HISTORY', last: last ? 1 : -1 }),
            messageId: messageId,
        });
    };
    var sendCancel = function (data, last, messageId) {
        if (last === void 0) { last = true; }
        if (messageId === void 0) { messageId = getMessageId(); }
        return send({
            payload: {
                cancel: protoExports.Cancel.create(data),
                last: last ? 1 : -1,
            },
            messageId: messageId,
        });
    };
    var sendLegacyDevice = function (data, last, messageId) {
        if (last === void 0) { last = true; }
        if (messageId === void 0) { messageId = getMessageId(); }
        return send({
            payload: {
                legacyDevice: protoExports.LegacyDevice.create(data),
                last: last ? 1 : -1,
            },
            messageId: messageId,
        });
    };
    var sendSettings = function (data, last, messageId) {
        if (last === void 0) { last = true; }
        if (messageId === void 0) { messageId = getMessageId(); }
        return send({
            payload: {
                settings: protoExports.Settings.create(data),
                last: last ? 1 : -1,
            },
            messageId: messageId,
        });
    };
    var sendText = function (data, params, type, messageId) {
        var _a;
        if (params === void 0) { params = {}; }
        if (type === void 0) { type = ''; }
        if (messageId === void 0) { messageId = getMessageId(); }
        var text = type ? { data: data, type: type } : { data: data };
        send(__assign({ payload: {
                text: protoExports.Text.create(text),
                last: (_a = params.last) !== null && _a !== void 0 ? _a : 1,
            }, messageId: messageId }, params));
    };
    var sendSystemMessage = function (_a, last, messageId, params) {
        var data = _a.data, _b = _a.messageName, mesName = _b === void 0 ? '' : _b;
        if (last === void 0) { last = true; }
        if (messageId === void 0) { messageId = getMessageId(); }
        if (params === void 0) { params = {}; }
        send({
            payload: __assign({ systemMessage: protoExports.SystemMessage.create({
                    data: JSON.stringify(data),
                }), messageName: mesName, last: last ? 1 : -1 }, params),
            messageId: messageId,
        });
    };
    var sendVoice = function (data, last, messageId, mesName, params) {
        if (last === void 0) { last = true; }
        if (messageId === void 0) { messageId = getMessageId(); }
        if (params === void 0) { params = {}; }
        return send({
            payload: __assign({ voice: protoExports.Voice.create({
                    data: new Uint8Array(data),
                }), messageName: mesName, last: last ? 1 : -1 }, params),
            messageId: messageId,
        });
    };
    var batch = function (cb) {
        var batchingMessageId = getMessageId();
        var lastMessageSent = false;
        var checkLastMessageStatus = function (last) {
            if (lastMessageSent) {
                if (last) {
                    throw new Error("Can't send two last items in batch");
                }
                else {
                    throw new Error("Can't send messages in batch after last message have been sent");
                }
            }
            else if (last) {
                lastMessageSent = true;
            }
        };
        var upgradedSendText = function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var data = _a[0], params = _a[1], type = _a[2];
            checkLastMessageStatus((params === null || params === void 0 ? void 0 : params.last) === 1);
            return sendText(data, params, type, batchingMessageId);
        };
        var upgradedSendSystemMessage = function (data, last, params) {
            checkLastMessageStatus(last);
            return sendSystemMessage(data, last, batchingMessageId, params);
        };
        var upgradedSendVoice = function (data, last, mesName, params) {
            checkLastMessageStatus(last);
            return sendVoice(data, last, batchingMessageId, mesName, params);
        };
        var upgradedSendSettings = function (data, last, messageId) {
            checkLastMessageStatus(last);
            return sendSettings(data, last, messageId);
        };
        return cb({
            sendText: upgradedSendText,
            sendSystemMessage: upgradedSendSystemMessage,
            sendVoice: upgradedSendVoice,
            sendSettings: upgradedSendSettings,
            messageId: batchingMessageId,
        });
    };
    return {
        sendDevice: sendDevice,
        sendInitialSettings: sendInitialSettings,
        getHistoryRequest: getHistoryRequest,
        sendCancel: sendCancel,
        sendLegacyDevice: sendLegacyDevice,
        sendSettings: sendSettings,
        sendText: sendText,
        sendSystemMessage: sendSystemMessage,
        sendVoice: sendVoice,
        batch: batch,
    };
};

var safeJSONParse = function (str, defaultValue) {
    try {
        return JSON.parse(str);
    }
    catch (err) {
        return defaultValue;
    }
};
var compileBasePayload = function (_a) {
    var userId = _a.userId, token = _a.token, userChannel = _a.userChannel, version = _a.version, messageName = _a.messageName, vpsToken = _a.vpsToken;
    if (version < 3) {
        return {
            userId: userId,
            token: token,
            userChannel: userChannel,
            messageName: messageName,
            vpsToken: vpsToken,
            version: version,
        };
    }
    return {
        token: token,
        messageName: messageName,
        version: version,
    };
};
var appendHeader = function (uint8Array) {
    // Добавляем 4 байта в начало с длинной сообщения
    var arrayBuffer = new ArrayBuffer(4);
    var dataView = new DataView(arrayBuffer, 0);
    dataView.setInt32(0, uint8Array.length, true);
    var newUint8Array = new Uint8Array(4 + uint8Array.length);
    newUint8Array.set(new Uint8Array(arrayBuffer));
    newUint8Array.set(uint8Array, 4);
    return newUint8Array;
};
var removeHeader = function (uint8Array) {
    // Убираем 4 байта в начале с длинной сообщения
    var newUint8Array = new Uint8Array(uint8Array).slice(4);
    return newUint8Array;
};
var createProtocol = function (transport, _a) {
    var logger = _a.logger, getToken = _a.getToken, getInitialMeta = _a.getInitialMeta, params = __rest(_a, ["logger", "getToken", "getInitialMeta"]);
    var configuration = __assign(__assign({}, params), { token: '' });
    var url = configuration.url, userId = configuration.userId, userChannel = configuration.userChannel, locale = configuration.locale, device = configuration.device, settings = configuration.settings, legacyDevice = configuration.legacyDevice, version = configuration.version, messageName = configuration.messageName, vpsToken = configuration.vpsToken;
    var basePayload = compileBasePayload({ userId: userId, token: '', messageName: messageName, vpsToken: vpsToken, userChannel: userChannel, version: version });
    var _b = createNanoEvents(), on = _b.on, emit = _b.emit;
    var subscriptions = [];
    var messageQueue = [];
    var initMessageId; // ид инициализационного сообщения, отправим мессаджи в неинициализированный протокол
    var currentSettings = { device: device, legacyDevice: legacyDevice, settings: settings, locale: locale };
    var currentMessageId = Date.now();
    var status = 'closed';
    var destroyed = false;
    var clearReadyTimer; // ид таймера установки состояния ready
    var cancelUpdatingSettingsWhenSocketReady = function () { }; // отменяет обновление настроек VPS при готовности сокета
    var getMessageId = function () {
        return currentMessageId++;
    };
    var send = function (message) {
        var createdMessage = protoExports.Message.create(__assign(__assign({}, basePayload), message));
        logger === null || logger === void 0 ? void 0 : logger({ type: 'outcoming', message: createdMessage });
        var encodedMessage = protoExports.Message.encode(createdMessage).finish();
        var encodedMessageWithHeader = appendHeader(encodedMessage);
        transport.send(encodedMessageWithHeader);
        emit('outcoming', createdMessage);
    };
    var sendMessage = function (message) {
        // отправляем инициализационные сообщения или все, когда сессия = ready
        if (status === 'ready' || (typeof initMessageId !== undefined && message.messageId === initMessageId)) {
            send(message);
            return;
        }
        // накапливаем сообщения, отправим после успешного коннекта
        messageQueue.push(message);
        if (status === 'closed' && !destroyed) {
            transport.open(url);
        }
    };
    var _c = createClientMethods({ getMessageId: getMessageId, sendMessage: sendMessage }), sendDeviceOriginal = _c.sendDevice, sendInitialSettingsOriginal = _c.sendInitialSettings, getHistoryRequestOriginal = _c.getHistoryRequest, sendCancel = _c.sendCancel, sendLegacyDeviceOriginal = _c.sendLegacyDevice, sendSettingsOriginal = _c.sendSettings, sendText = _c.sendText, sendSystemMessage = _c.sendSystemMessage, sendVoice = _c.sendVoice, batch = _c.batch;
    var sendDevice = (function (data) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        currentSettings = __assign(__assign({}, currentSettings), { device: data });
        return sendDeviceOriginal.apply(void 0, __spreadArray([data], args));
    });
    var sendInitialSettings = (function (data) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (data.device && data.settings) {
            currentSettings = __assign(__assign({}, currentSettings), { device: data.device, settings: data.settings, locale: data.locale || undefined });
        }
        return sendInitialSettingsOriginal.apply(void 0, __spreadArray([data], args));
    });
    var getHistoryRequest = function (data) {
        var _a, _b;
        if (data === void 0) { data = {}; }
        return getHistoryRequestOriginal({
            device: currentSettings.device || null,
            uuid: {
                userId: ((_a = data.uuid) === null || _a === void 0 ? void 0 : _a.userId) || userId,
                userChannel: ((_b = data.uuid) === null || _b === void 0 ? void 0 : _b.userChannel) || userChannel,
            },
            history: __assign({}, (data.history || {})),
        });
    };
    var sendLegacyDevice = (function (data) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        currentSettings = __assign(__assign({}, currentSettings), { legacyDevice: data });
        return sendLegacyDeviceOriginal.apply(void 0, __spreadArray([data], args));
    });
    var updateDefaults = function (obj) {
        Object.assign(basePayload, obj);
        Object.assign(configuration, obj);
    };
    var updateDevice = function (obj) {
        var _a, _b;
        if (obj) {
            var additionalInfo = obj.additionalInfo, deviceOptions = __rest(obj, ["additionalInfo"]);
            var oldInfo = ((_a = currentSettings.device) === null || _a === void 0 ? void 0 : _a.additionalInfo)
                ? safeJSONParse((_b = currentSettings.device) === null || _b === void 0 ? void 0 : _b.additionalInfo, {})
                : {};
            var newInfo = additionalInfo ? safeJSONParse(additionalInfo, {}) : {};
            currentSettings.device = __assign(__assign(__assign({}, currentSettings.device), deviceOptions), { additionalInfo: JSON.stringify(__assign(__assign({}, oldInfo), newInfo)) });
        }
    };
    var updateSettings = function (obj) {
        var isSocketReady = status === 'connected' || status === 'ready';
        cancelUpdatingSettingsWhenSocketReady();
        Object.assign(currentSettings.settings, obj);
        if (!isSocketReady) {
            cancelUpdatingSettingsWhenSocketReady = on('ready', function () { return updateSettings(obj); });
            return;
        }
        sendSettingsOriginal(obj);
    };
    subscriptions.push(transport.on('connecting', function () {
        status = 'connecting';
    }));
    subscriptions.push(transport.on('close', function () {
        status = 'closed';
    }));
    subscriptions.push(transport.on('open', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, e_1, meta, _e;
        var _f;
        var _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 3, , 4]);
                    _a = getToken;
                    if (!_a) return [3 /*break*/, 2];
                    _c = (_b = Object).assign;
                    _d = [basePayload];
                    _f = {};
                    return [4 /*yield*/, getToken()];
                case 1:
                    _a = _c.apply(_b, _d.concat([(_f.token = _h.sent(), _f)]));
                    _h.label = 2;
                case 2:
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _h.sent();
                    emit('error', {
                        type: 'GET_TOKEN_ERROR',
                        message: (_g = e_1) === null || _g === void 0 ? void 0 : _g.message,
                    });
                    return [2 /*return*/];
                case 4:
                    Object.assign(configuration, { token: basePayload.token });
                    initMessageId = getMessageId();
                    if (!(version < 3)) return [3 /*break*/, 5];
                    if (version === 1 && currentSettings.legacyDevice) {
                        sendLegacyDevice(currentSettings.legacyDevice, false, initMessageId);
                    }
                    else if (version === 2 && currentSettings.device) {
                        sendDevice(currentSettings.device, false, initMessageId);
                    }
                    sendSettingsOriginal(currentSettings.settings, true, initMessageId);
                    return [3 /*break*/, 9];
                case 5:
                    if (!getInitialMeta) return [3 /*break*/, 7];
                    return [4 /*yield*/, getInitialMeta()];
                case 6:
                    _e = (_h.sent());
                    return [3 /*break*/, 8];
                case 7:
                    _e = undefined;
                    _h.label = 8;
                case 8:
                    meta = _e;
                    sendInitialSettings({
                        userId: userId,
                        userChannel: userChannel,
                        device: currentSettings.device,
                        settings: currentSettings.settings,
                        locale: version > 3 ? currentSettings.locale : undefined,
                    }, true, initMessageId, { meta: meta });
                    _h.label = 9;
                case 9:
                    status = 'connected';
                    window.clearTimeout(clearReadyTimer);
                    /// считаем коннект = ready, если по истечении таймаута сокет не был разорван
                    /// т.к бек может разрывать сокет, если с settings что-то не так
                    clearReadyTimer = window.setTimeout(function () {
                        if (status !== 'connected') {
                            return;
                        }
                        while (messageQueue.length > 0) {
                            var message = messageQueue.shift();
                            if (message) {
                                send(message);
                            }
                        }
                        status = 'ready';
                        emit('ready');
                    }, 250);
                    logger === null || logger === void 0 ? void 0 : logger({ type: 'init', params: __assign(__assign({}, configuration), currentSettings) });
                    return [2 /*return*/];
            }
        });
    }); }));
    subscriptions.push(transport.on('message', function (message) {
        var decodedMessage = protoExports.Message.decode(removeHeader(message));
        logger === null || logger === void 0 ? void 0 : logger({ type: 'incoming', message: decodedMessage });
        emit('incoming', decodedMessage);
        if (decodedMessage.status) {
            transport.close();
        }
    }));
    return {
        clearQueue: function () {
            messageQueue.splice(0, messageQueue.length);
        },
        destroy: function () {
            destroyed = true;
            transport.close();
            subscriptions.splice(0, subscriptions.length).map(function (unsubscribe) { return unsubscribe(); });
        },
        on: on,
        getHistoryRequest: getHistoryRequest,
        getMessageId: getMessageId,
        sendCancel: sendCancel,
        sendText: sendText,
        sendSystemMessage: sendSystemMessage,
        sendVoice: sendVoice,
        send: sendMessage,
        batch: batch,
        changeConfiguration: updateDefaults,
        changeDevice: updateDevice,
        changeSettings: updateSettings,
        reconnect: function () {
            if (status !== 'closed') {
                transport.reconnect(url); // даем время случиться close
            }
            else {
                transport.open(url);
            }
        },
        init: function () {
            // в отличии от reconnect не обрывает коннект если он в порядке
            if (status === 'ready' && window.navigator.onLine) {
                return Promise.resolve();
            }
            return new Promise(function (resolve, reject) {
                var subs = [];
                subs.push(on('ready', function () {
                    subs.map(function (sub) { return sub(); });
                    resolve();
                }));
                subs.push(transport.on('error', function () {
                    subs.map(function (sub) { return sub(); });
                    reject(new Error('Network error'));
                }));
                transport.reconnect(url);
            });
        },
        get currentMessageId() {
            return currentMessageId;
        },
        get configuration() {
            return configuration;
        },
        get status() {
            return status;
        },
    };
};

export { MessageNames as M, VpsVersion as V, appendHeader as a, commonjsRequire as b, commonjsGlobal as c, createProtocol as d, getDefaultExportFromCjs as g, protoExports as p, requireMinimal as r };

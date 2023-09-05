import { _ as __assign, b as __awaiter, c as __generator, d as createNanoEvents, a as __rest } from './common-ba25e019.js';
import { p as protoExports, M as MessageNames, b as commonjsRequire, r as requireMinimal, c as commonjsGlobal, d as createProtocol } from './sdk-fca9cfe5.js';

var createClient = function (protocol, provideMeta) {
    if (provideMeta === void 0) { provideMeta = undefined; }
    var _a = createNanoEvents(), on = _a.on, emit = _a.emit;
    /** ждет ответ бека и возвращает данные из этого ответа */
    var waitForAnswer = function (messageId) {
        return new Promise(function (resolve) {
            var off = on('systemMessage', function (systemMessageData, originalMessage) {
                if (originalMessage.messageId === messageId &&
                    (originalMessage.messageName === MessageNames.ANSWER_TO_USER ||
                        originalMessage.messageName === MessageNames.DO_NOTHING)) {
                    off();
                    resolve(systemMessageData);
                }
            });
        });
    };
    /** отправляет произвольный systemMessage, не подкладывает мету */
    var sendData = function (data, messageName, meta) {
        if (messageName === void 0) { messageName = ''; }
        var messageId = protocol.getMessageId();
        protocol.sendSystemMessage({
            data: data,
            messageName: messageName,
        }, true, messageId, { meta: meta || {} });
        return messageId;
    };
    /** отправляет cancel на сообщение */
    var sendCancel = function (messageId) {
        protocol.sendCancel({}, true, messageId);
    };
    /** отправляет приветствие */
    var sendOpenAssistant = function (_a) {
        var _b = _a === void 0 ? { isFirstSession: false } : _a, isFirstSession = _b.isFirstSession;
        return __awaiter(void 0, void 0, void 0, function () {
            var data, meta, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        data = isFirstSession ? { is_first_session: true } : {};
                        if (!provideMeta) return [3 /*break*/, 2];
                        return [4 /*yield*/, provideMeta()];
                    case 1:
                        _c = _d.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _c = undefined;
                        _d.label = 3;
                    case 3:
                        meta = _c;
                        return [2 /*return*/, waitForAnswer(sendData(data, 'OPEN_ASSISTANT', meta))];
                }
            });
        });
    };
    /** вызывает sendSystemMessage, куда подкладывает мету */
    var sendMeta = function (sendSystemMessage, additionalMeta) { return __awaiter(void 0, void 0, void 0, function () {
        var meta, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!provideMeta) return [3 /*break*/, 2];
                    return [4 /*yield*/, provideMeta(additionalMeta)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = {};
                    _b.label = 3;
                case 3:
                    meta = _a;
                    if (typeof meta !== 'undefined') {
                        sendSystemMessage({
                            data: {},
                            messageName: '',
                        }, false, {
                            meta: meta,
                        });
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    /** отправляет server_action и мету */
    var sendServerAction = function (serverAction, appInfo, messageName) {
        if (messageName === void 0) { messageName = 'SERVER_ACTION'; }
        return __awaiter(void 0, void 0, void 0, function () {
            var messageId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        messageId = protocol.getMessageId();
                        // мету и server_action отправляем в одном systemMessage
                        return [4 /*yield*/, sendMeta(function (data, _, _a) {
                                var _b = _a === void 0 ? {} : _a, meta = _b.meta;
                                var systemData = __rest(data, []);
                                protocol.sendSystemMessage({
                                    // eslint-disable-next-line camelcase
                                    data: __assign(__assign({}, systemData), { app_info: appInfo, server_action: serverAction }),
                                    messageName: messageName || 'SERVER_ACTION',
                                }, true, messageId, { meta: meta });
                            }, {
                                source: {
                                    sourceType: 'vps',
                                },
                            })];
                    case 1:
                        // мету и server_action отправляем в одном systemMessage
                        _a.sent();
                        return [2 /*return*/, messageId];
                }
            });
        });
    };
    /** отправляет текст и текущую мету */
    var sendText = function (text, isSsml, shouldSendDisableDubbing, additionalMeta) {
        if (isSsml === void 0) { isSsml = false; }
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (text.trim() === '') {
                    return [2 /*return*/, undefined];
                }
                return [2 /*return*/, protocol.batch(function (_a) {
                        var sendSystemMessage = _a.sendSystemMessage, clientSendText = _a.sendText, sendSettings = _a.sendSettings, messageId = _a.messageId;
                        return __awaiter(void 0, void 0, void 0, function () {
                            var prevDubbing, sendDisableDubbing, isStillNeedReturnDubbing;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, sendMeta(sendSystemMessage, additionalMeta)];
                                    case 1:
                                        _b.sent();
                                        prevDubbing = protocol.configuration.settings.dubbing;
                                        sendDisableDubbing = prevDubbing !== -1 && shouldSendDisableDubbing;
                                        if (!sendDisableDubbing) return [3 /*break*/, 3];
                                        return [4 /*yield*/, sendSettings({ dubbing: -1 }, false)];
                                    case 2:
                                        _b.sent();
                                        _b.label = 3;
                                    case 3:
                                        isSsml ? clientSendText(text, {}, 'application/ssml') : clientSendText(text, {});
                                        isStillNeedReturnDubbing = prevDubbing === protocol.configuration.settings.dubbing;
                                        if (sendDisableDubbing && isStillNeedReturnDubbing) {
                                            sendSettings({ dubbing: prevDubbing });
                                        }
                                        return [2 /*return*/, messageId];
                                }
                            });
                        });
                    })];
            });
        });
    };
    /** инициализирует исходящий голосовой поток, факт. передает в callback параметры для отправки голоса,
     * отправляет мету */
    var createVoiceStream = function (callback, additionalMeta) {
        return protocol.batch(function (_a) {
            var sendSystemMessage = _a.sendSystemMessage, sendVoice = _a.sendVoice, messageId = _a.messageId;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, sendMeta(sendSystemMessage, additionalMeta)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, callback({
                                    sendVoice: sendVoice,
                                    messageId: messageId,
                                    onMessage: function (cb) { return protocol.on('incoming', cb); },
                                })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    var off = protocol.on('incoming', function (message) {
        var _a, _b, _c;
        if (message.voice) {
            emit('voice', message.voice.data || new Uint8Array(), message);
        }
        if ((_a = message.systemMessage) === null || _a === void 0 ? void 0 : _a.data) {
            emit('systemMessage', JSON.parse(message.systemMessage.data), message);
        }
        if (message.status) {
            emit('status', message.status, message);
        }
        if (message.messageName === 'TAKE_HISTORY' && ((_b = message.bytes) === null || _b === void 0 ? void 0 : _b.data)) {
            var history_1 = protoExports.GetHistoryResponse.decode((_c = message.bytes) === null || _c === void 0 ? void 0 : _c.data).historyMessages;
            var parsedHistory = history_1.map(function (historyMessage) { return (__assign(__assign({}, historyMessage), { content: JSON.parse(historyMessage.content || '') })); });
            emit('history', parsedHistory, message);
        }
    });
    return {
        destroy: function () {
            off();
        },
        init: protocol.init,
        createVoiceStream: createVoiceStream,
        sendData: sendData,
        sendMeta: sendMeta,
        sendOpenAssistant: sendOpenAssistant,
        sendServerAction: sendServerAction,
        sendText: sendText,
        sendCancel: sendCancel,
        on: on,
        waitForAnswer: waitForAnswer,
    };
};

var RETRY_INTERVAL = 300; // ms
var defaultWSCreator = function (url) { return new WebSocket(url); };
var createTransport = function (_a) {
    var _b = _a.createWS, createWS = _b === void 0 ? defaultWSCreator : _b, checkCertUrl = _a.checkCertUrl;
    var _c = createNanoEvents(), on = _c.on, emit = _c.emit;
    var hasCert = !checkCertUrl;
    var retryTimeoutId = -1;
    var retries = 0;
    var status = 'closed';
    var webSocket;
    var stopped = true;
    var checkCert = function (checkUrl) {
        return new Promise(function (resolve) {
            window
                .fetch(checkUrl)
                .then(function () { return resolve(true); })
                .catch(function () { return resolve(false); });
        });
    };
    var close = function () {
        stopped = true;
        if (status === 'closing' || status === 'closed') {
            return;
        }
        status = 'closing';
        webSocket === null || webSocket === void 0 ? void 0 : webSocket.close();
    };
    var connect = function (url) { return __awaiter(void 0, void 0, void 0, function () {
        var okay;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    status = 'connecting';
                    emit('connecting');
                    if (!(!hasCert && window.navigator.onLine)) return [3 /*break*/, 2];
                    return [4 /*yield*/, checkCert(checkCertUrl)];
                case 1:
                    okay = _a.sent();
                    if (!okay) {
                        status = 'closed';
                        emit('close');
                        emit('error', new Error('Cert authority invalid'));
                        return [2 /*return*/];
                    }
                    hasCert = true;
                    _a.label = 2;
                case 2:
                    webSocket = createWS(url);
                    webSocket.binaryType = 'arraybuffer';
                    webSocket.addEventListener('open', function () {
                        if (webSocket.readyState !== 1) {
                            return;
                        }
                        window.clearTimeout(retryTimeoutId);
                        retries = 0;
                        status = 'open';
                        emit('open');
                    });
                    webSocket.addEventListener('close', function () {
                        status = 'closed';
                        emit('close');
                    });
                    webSocket.addEventListener('error', function (e) {
                        if (status !== 'connecting') {
                            throw e;
                        }
                        // пробуем переподключаться, если возникла ошибка при коннекте
                        if (!webSocket || (webSocket.readyState === 3 && !stopped)) {
                            window.clearTimeout(retryTimeoutId);
                            if (retries < 2) {
                                retryTimeoutId = window.setTimeout(function () {
                                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                                    open(url);
                                    retries++;
                                }, RETRY_INTERVAL * retries);
                            }
                            else {
                                retries = 0;
                                emit('error', e);
                            }
                        }
                    });
                    webSocket.addEventListener('message', function (_a) {
                        var data = _a.data;
                        emit('message', data);
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var open = function (url) {
        if (status === 'connecting' || status === 'open') {
            return;
        }
        stopped = false;
        connect(url);
    };
    var reconnect = function (url) {
        if (status === 'closed') {
            open(url);
            return;
        }
        window.setTimeout(function () { return reconnect(url); });
        close();
    };
    var send = function (data) {
        webSocket.send(data);
    };
    return {
        close: close,
        get isOnline() {
            return window.navigator.onLine;
        },
        on: on,
        open: open,
        reconnect: reconnect,
        send: send,
    };
};

var convertToMetaPermissions = function (permission) {
    return Object.keys(permission).map(function (key) { return ({
        type: key,
        status: permission[key],
    }); });
};
var getLocation = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                navigator.geolocation.getCurrentPosition(function (_a) {
                    var coords = _a.coords, timestamp = _a.timestamp;
                    resolve({
                        lat: coords.latitude,
                        lon: coords.longitude,
                        accuracy: coords.accuracy,
                        timestamp: timestamp,
                    });
                }, reject, { timeout: 5000 });
            })];
    });
}); };
var getTime = function () { return ({
    // Здесь нужен полифилл, т.к. `Intl.DateTimeFormat().resolvedOptions().timeZone` - возвращает пустую строку
    timezone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezone_offset_sec: -new Date().getTimezoneOffset() * 60,
    timestamp: Date.now(),
}); };
var getAnswerForRequestPermissions = function (requestMessageId, appInfo, items) { return __awaiter(void 0, void 0, void 0, function () {
    var permissions, response;
    return __generator(this, function (_a) {
        permissions = {
            record_audio: 'denied_once',
            geo: 'denied_once',
            read_contacts: 'denied_permanently',
            push: 'denied_once',
        };
        response = {
            app_info: appInfo,
            meta: {
                time: getTime(),
                permissions: [],
            },
            server_action: {
                action_id: 'command_response',
                request_message_id: requestMessageId,
                command_response: {
                    request_permissions: {
                        permissions: [],
                    },
                },
            },
        };
        return [2 /*return*/, Promise.all(items.map(function (permission) { return __awaiter(void 0, void 0, void 0, function () {
                var _a, location_1;
                var _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _a = permission;
                            switch (_a) {
                                case 'geo': return [3 /*break*/, 1];
                            }
                            return [3 /*break*/, 5];
                        case 1:
                            _f.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, getLocation()];
                        case 2:
                            location_1 = _f.sent();
                            permissions.geo = 'granted';
                            response.meta.location = location_1;
                            (_c = response.server_action.command_response.request_permissions) === null || _c === void 0 ? void 0 : _c.permissions.push({
                                type: 'geo',
                                status: 'granted',
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            _f.sent();
                            permissions.geo = 'denied_permanently';
                            (_d = response.server_action.command_response.request_permissions) === null || _d === void 0 ? void 0 : _d.permissions.push({
                                type: 'geo',
                                status: 'denied_permanently',
                            });
                            return [3 /*break*/, 4];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            // остальные доступы не поддерживаем
                            (_e = response.server_action.command_response.request_permissions) === null || _e === void 0 ? void 0 : _e.permissions.push({
                                type: permission,
                                status: 'denied_permanently',
                            });
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); })).then(function () {
                response.meta.permissions = convertToMetaPermissions(permissions);
                return response;
            })];
    });
}); };

var mtt = {exports: {}};

/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/

(function (module) {
	(function(global, factory) { /* global define, require, module */

	    /* AMD */ if (typeof commonjsRequire === 'function' && 'object' === 'object' && module && module.exports)
	        module.exports = factory(requireMinimal());

	})(commonjsGlobal, function($protobuf) {

	    // Common aliases
	    var $Reader = $protobuf.Reader, $util = $protobuf.util;
	    
	    // Exported root namespace
	    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
	    
	    $root.Music2TrackProtocol = (function() {
	    
	        /**
	         * Namespace Music2TrackProtocol.
	         * @exports Music2TrackProtocol
	         * @namespace
	         */
	        var Music2TrackProtocol = {};
	    
	        Music2TrackProtocol.DecoderResult = (function() {
	    
	            /**
	             * Properties of a DecoderResult.
	             * @memberof Music2TrackProtocol
	             * @interface IDecoderResult
	             * @property {string|null} [result] DecoderResult result
	             * @property {boolean|null} [isMusicFound] DecoderResult isMusicFound
	             * @property {boolean|null} [isFinal] DecoderResult isFinal
	             */
	    
	            /**
	             * Constructs a new DecoderResult.
	             * @memberof Music2TrackProtocol
	             * @classdesc Represents a DecoderResult.
	             * @implements IDecoderResult
	             * @constructor
	             * @param {Music2TrackProtocol.IDecoderResult=} [properties] Properties to set
	             */
	            function DecoderResult(properties) {
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }
	    
	            /**
	             * DecoderResult result.
	             * @member {string} result
	             * @memberof Music2TrackProtocol.DecoderResult
	             * @instance
	             */
	            DecoderResult.prototype.result = "";
	    
	            /**
	             * DecoderResult isMusicFound.
	             * @member {boolean} isMusicFound
	             * @memberof Music2TrackProtocol.DecoderResult
	             * @instance
	             */
	            DecoderResult.prototype.isMusicFound = false;
	    
	            /**
	             * DecoderResult isFinal.
	             * @member {boolean} isFinal
	             * @memberof Music2TrackProtocol.DecoderResult
	             * @instance
	             */
	            DecoderResult.prototype.isFinal = false;
	    
	            /**
	             * Decodes a DecoderResult message from the specified reader or buffer.
	             * @function decode
	             * @memberof Music2TrackProtocol.DecoderResult
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {Music2TrackProtocol.DecoderResult} DecoderResult
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            DecoderResult.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Music2TrackProtocol.DecoderResult();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1: {
	                            message.result = reader.string();
	                            break;
	                        }
	                    case 2: {
	                            message.isMusicFound = reader.bool();
	                            break;
	                        }
	                    case 3: {
	                            message.isFinal = reader.bool();
	                            break;
	                        }
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };
	    
	            return DecoderResult;
	        })();
	    
	        Music2TrackProtocol.ErrorResponse = (function() {
	    
	            /**
	             * Properties of an ErrorResponse.
	             * @memberof Music2TrackProtocol
	             * @interface IErrorResponse
	             * @property {string|null} [errorMessage] ErrorResponse errorMessage
	             * @property {number|null} [errorCode] ErrorResponse errorCode
	             */
	    
	            /**
	             * Constructs a new ErrorResponse.
	             * @memberof Music2TrackProtocol
	             * @classdesc Represents an ErrorResponse.
	             * @implements IErrorResponse
	             * @constructor
	             * @param {Music2TrackProtocol.IErrorResponse=} [properties] Properties to set
	             */
	            function ErrorResponse(properties) {
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }
	    
	            /**
	             * ErrorResponse errorMessage.
	             * @member {string} errorMessage
	             * @memberof Music2TrackProtocol.ErrorResponse
	             * @instance
	             */
	            ErrorResponse.prototype.errorMessage = "";
	    
	            /**
	             * ErrorResponse errorCode.
	             * @member {number} errorCode
	             * @memberof Music2TrackProtocol.ErrorResponse
	             * @instance
	             */
	            ErrorResponse.prototype.errorCode = 0;
	    
	            /**
	             * Decodes an ErrorResponse message from the specified reader or buffer.
	             * @function decode
	             * @memberof Music2TrackProtocol.ErrorResponse
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {Music2TrackProtocol.ErrorResponse} ErrorResponse
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            ErrorResponse.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Music2TrackProtocol.ErrorResponse();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1: {
	                            message.errorMessage = reader.string();
	                            break;
	                        }
	                    case 2: {
	                            message.errorCode = reader.int32();
	                            break;
	                        }
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };
	    
	            return ErrorResponse;
	        })();
	    
	        Music2TrackProtocol.MttResponse = (function() {
	    
	            /**
	             * Properties of a MttResponse.
	             * @memberof Music2TrackProtocol
	             * @interface IMttResponse
	             * @property {Music2TrackProtocol.IDecoderResult|null} [decoderResultField] MttResponse decoderResultField
	             * @property {Music2TrackProtocol.IErrorResponse|null} [errorResponse] MttResponse errorResponse
	             */
	    
	            /**
	             * Constructs a new MttResponse.
	             * @memberof Music2TrackProtocol
	             * @classdesc Represents a MttResponse.
	             * @implements IMttResponse
	             * @constructor
	             * @param {Music2TrackProtocol.IMttResponse=} [properties] Properties to set
	             */
	            function MttResponse(properties) {
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }
	    
	            /**
	             * MttResponse decoderResultField.
	             * @member {Music2TrackProtocol.IDecoderResult|null|undefined} decoderResultField
	             * @memberof Music2TrackProtocol.MttResponse
	             * @instance
	             */
	            MttResponse.prototype.decoderResultField = null;
	    
	            /**
	             * MttResponse errorResponse.
	             * @member {Music2TrackProtocol.IErrorResponse|null|undefined} errorResponse
	             * @memberof Music2TrackProtocol.MttResponse
	             * @instance
	             */
	            MttResponse.prototype.errorResponse = null;
	    
	            // OneOf field names bound to virtual getters and setters
	            var $oneOfFields;
	    
	            /**
	             * MttResponse MessageType.
	             * @member {"decoderResultField"|"errorResponse"|undefined} MessageType
	             * @memberof Music2TrackProtocol.MttResponse
	             * @instance
	             */
	            Object.defineProperty(MttResponse.prototype, "MessageType", {
	                get: $util.oneOfGetter($oneOfFields = ["decoderResultField", "errorResponse"]),
	                set: $util.oneOfSetter($oneOfFields)
	            });
	    
	            /**
	             * Decodes a MttResponse message from the specified reader or buffer.
	             * @function decode
	             * @memberof Music2TrackProtocol.MttResponse
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {Music2TrackProtocol.MttResponse} MttResponse
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            MttResponse.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Music2TrackProtocol.MttResponse();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1: {
	                            message.decoderResultField = $root.Music2TrackProtocol.DecoderResult.decode(reader, reader.uint32());
	                            break;
	                        }
	                    case 2: {
	                            message.errorResponse = $root.Music2TrackProtocol.ErrorResponse.decode(reader, reader.uint32());
	                            break;
	                        }
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };
	    
	            return MttResponse;
	        })();
	    
	        return Music2TrackProtocol;
	    })();

	    return $root;
	}); 
} (mtt));

var mttExports = mtt.exports;

var createMusicRecognizer = function (voiceListener) {
    var off;
    var status = 'inactive';
    var currentMessageId;
    var stop = function () {
        if (voiceListener.status !== 'stopped') {
            status = 'inactive';
            voiceListener.stop();
        }
    };
    var start = function (_a) {
        var sendVoice = _a.sendVoice, messageId = _a.messageId, onMessage = _a.onMessage;
        return voiceListener
            .listen(function (data, last) { return !last && sendVoice(data, last, MessageNames.MUSIC_RECOGNITION); })
            .then(function () {
            status = 'active';
            currentMessageId = messageId;
            off = onMessage(function (message) {
                var _a, _b;
                if (message.status && message.status.code != null && message.status.code < 0) {
                    off();
                    stop();
                }
                if (message.messageId === messageId &&
                    message.messageName.toUpperCase() === MessageNames.MUSIC_RECOGNITION) {
                    if (!((_b = (_a = message.bytes) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.length)) {
                        return;
                    }
                    var _c = mttExports.Music2TrackProtocol.MttResponse.decode(message.bytes.data), decoderResultField = _c.decoderResultField, errorResponse = _c.errorResponse;
                    if ((decoderResultField === null || decoderResultField === void 0 ? void 0 : decoderResultField.isFinal) || errorResponse) {
                        off();
                        stop();
                    }
                }
            });
        });
    };
    return {
        start: start,
        stop: stop,
        get status() {
            return status;
        },
        get messageId() {
            return currentMessageId;
        },
    };
};

var asr = {exports: {}};

/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/

(function (module) {
	(function(global, factory) { /* global define, require, module */

	    /* AMD */ if (typeof commonjsRequire === 'function' && 'object' === 'object' && module && module.exports)
	        module.exports = factory(requireMinimal());

	})(commonjsGlobal, function($protobuf) {

	    // Common aliases
	    var $Reader = $protobuf.Reader, $util = $protobuf.util;
	    
	    // Exported root namespace
	    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
	    
	    $root.Variables = (function() {
	    
	        /**
	         * Properties of a Variables.
	         * @exports IVariables
	         * @interface IVariables
	         * @property {Object.<string,string>|null} [variables] Variables variables
	         */
	    
	        /**
	         * Constructs a new Variables.
	         * @exports Variables
	         * @classdesc Represents a Variables.
	         * @implements IVariables
	         * @constructor
	         * @param {IVariables=} [properties] Properties to set
	         */
	        function Variables(properties) {
	            this.variables = {};
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * Variables variables.
	         * @member {Object.<string,string>} variables
	         * @memberof Variables
	         * @instance
	         */
	        Variables.prototype.variables = $util.emptyObject;
	    
	        /**
	         * Decodes a Variables message from the specified reader or buffer.
	         * @function decode
	         * @memberof Variables
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {Variables} Variables
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        Variables.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Variables(), key, value;
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        if (message.variables === $util.emptyObject)
	                            message.variables = {};
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
	                        message.variables[key] = value;
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return Variables;
	    })();
	    
	    $root.UndecodedSeconds = (function() {
	    
	        /**
	         * Properties of an UndecodedSeconds.
	         * @exports IUndecodedSeconds
	         * @interface IUndecodedSeconds
	         * @property {number|null} [undecodedSeconds] UndecodedSeconds undecodedSeconds
	         */
	    
	        /**
	         * Constructs a new UndecodedSeconds.
	         * @exports UndecodedSeconds
	         * @classdesc Represents an UndecodedSeconds.
	         * @implements IUndecodedSeconds
	         * @constructor
	         * @param {IUndecodedSeconds=} [properties] Properties to set
	         */
	        function UndecodedSeconds(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * UndecodedSeconds undecodedSeconds.
	         * @member {number} undecodedSeconds
	         * @memberof UndecodedSeconds
	         * @instance
	         */
	        UndecodedSeconds.prototype.undecodedSeconds = 0;
	    
	        /**
	         * Decodes an UndecodedSeconds message from the specified reader or buffer.
	         * @function decode
	         * @memberof UndecodedSeconds
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {UndecodedSeconds} UndecodedSeconds
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        UndecodedSeconds.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UndecodedSeconds();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.undecodedSeconds = reader.float();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return UndecodedSeconds;
	    })();
	    
	    $root.FullyFinalized = (function() {
	    
	        /**
	         * Properties of a FullyFinalized.
	         * @exports IFullyFinalized
	         * @interface IFullyFinalized
	         */
	    
	        /**
	         * Constructs a new FullyFinalized.
	         * @exports FullyFinalized
	         * @classdesc Represents a FullyFinalized.
	         * @implements IFullyFinalized
	         * @constructor
	         * @param {IFullyFinalized=} [properties] Properties to set
	         */
	        function FullyFinalized(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * Decodes a FullyFinalized message from the specified reader or buffer.
	         * @function decode
	         * @memberof FullyFinalized
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {FullyFinalized} FullyFinalized
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        FullyFinalized.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.FullyFinalized();
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
	    
	        return FullyFinalized;
	    })();
	    
	    $root.EmotionResult = (function() {
	    
	        /**
	         * Properties of an EmotionResult.
	         * @exports IEmotionResult
	         * @interface IEmotionResult
	         * @property {string|null} [name] EmotionResult name
	         * @property {number|null} [confidence] EmotionResult confidence
	         */
	    
	        /**
	         * Constructs a new EmotionResult.
	         * @exports EmotionResult
	         * @classdesc Represents an EmotionResult.
	         * @implements IEmotionResult
	         * @constructor
	         * @param {IEmotionResult=} [properties] Properties to set
	         */
	        function EmotionResult(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * EmotionResult name.
	         * @member {string} name
	         * @memberof EmotionResult
	         * @instance
	         */
	        EmotionResult.prototype.name = "";
	    
	        /**
	         * EmotionResult confidence.
	         * @member {number} confidence
	         * @memberof EmotionResult
	         * @instance
	         */
	        EmotionResult.prototype.confidence = 0;
	    
	        /**
	         * Decodes an EmotionResult message from the specified reader or buffer.
	         * @function decode
	         * @memberof EmotionResult
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {EmotionResult} EmotionResult
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        EmotionResult.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.EmotionResult();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.name = reader.string();
	                        break;
	                    }
	                case 2: {
	                        message.confidence = reader.float();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return EmotionResult;
	    })();
	    
	    $root.Hypothesis = (function() {
	    
	        /**
	         * Properties of a Hypothesis.
	         * @exports IHypothesis
	         * @interface IHypothesis
	         * @property {string|null} [words] Hypothesis words
	         * @property {number|null} [acousticCost] Hypothesis acousticCost
	         * @property {number|null} [linguisticCost] Hypothesis linguisticCost
	         * @property {number|null} [finalCost] Hypothesis finalCost
	         * @property {number|null} [phraseStart] Hypothesis phraseStart
	         * @property {number|null} [phraseEnd] Hypothesis phraseEnd
	         * @property {string|null} [normalizedText] Hypothesis normalizedText
	         */
	    
	        /**
	         * Constructs a new Hypothesis.
	         * @exports Hypothesis
	         * @classdesc Represents a Hypothesis.
	         * @implements IHypothesis
	         * @constructor
	         * @param {IHypothesis=} [properties] Properties to set
	         */
	        function Hypothesis(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * Hypothesis words.
	         * @member {string} words
	         * @memberof Hypothesis
	         * @instance
	         */
	        Hypothesis.prototype.words = "";
	    
	        /**
	         * Hypothesis acousticCost.
	         * @member {number} acousticCost
	         * @memberof Hypothesis
	         * @instance
	         */
	        Hypothesis.prototype.acousticCost = 0;
	    
	        /**
	         * Hypothesis linguisticCost.
	         * @member {number} linguisticCost
	         * @memberof Hypothesis
	         * @instance
	         */
	        Hypothesis.prototype.linguisticCost = 0;
	    
	        /**
	         * Hypothesis finalCost.
	         * @member {number} finalCost
	         * @memberof Hypothesis
	         * @instance
	         */
	        Hypothesis.prototype.finalCost = 0;
	    
	        /**
	         * Hypothesis phraseStart.
	         * @member {number} phraseStart
	         * @memberof Hypothesis
	         * @instance
	         */
	        Hypothesis.prototype.phraseStart = 0;
	    
	        /**
	         * Hypothesis phraseEnd.
	         * @member {number} phraseEnd
	         * @memberof Hypothesis
	         * @instance
	         */
	        Hypothesis.prototype.phraseEnd = 0;
	    
	        /**
	         * Hypothesis normalizedText.
	         * @member {string} normalizedText
	         * @memberof Hypothesis
	         * @instance
	         */
	        Hypothesis.prototype.normalizedText = "";
	    
	        /**
	         * Decodes a Hypothesis message from the specified reader or buffer.
	         * @function decode
	         * @memberof Hypothesis
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {Hypothesis} Hypothesis
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        Hypothesis.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Hypothesis();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.words = reader.string();
	                        break;
	                    }
	                case 2: {
	                        message.acousticCost = reader.float();
	                        break;
	                    }
	                case 3: {
	                        message.linguisticCost = reader.float();
	                        break;
	                    }
	                case 4: {
	                        message.finalCost = reader.float();
	                        break;
	                    }
	                case 5: {
	                        message.phraseStart = reader.float();
	                        break;
	                    }
	                case 6: {
	                        message.phraseEnd = reader.float();
	                        break;
	                    }
	                case 7: {
	                        message.normalizedText = reader.string();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return Hypothesis;
	    })();
	    
	    $root.DecoderResult = (function() {
	    
	        /**
	         * Properties of a DecoderResult.
	         * @exports IDecoderResult
	         * @interface IDecoderResult
	         * @property {Array.<IHypothesis>|null} [hypothesis] DecoderResult hypothesis
	         * @property {number|null} [chunkStart] DecoderResult chunkStart
	         * @property {number|null} [chunkEnd] DecoderResult chunkEnd
	         * @property {number|null} [timeEndpointDetectionMs] DecoderResult timeEndpointDetectionMs
	         * @property {number|null} [timeDecodingMs] DecoderResult timeDecodingMs
	         * @property {IVariables|null} [variables] DecoderResult variables
	         * @property {boolean|null} [isFinal] DecoderResult isFinal
	         * @property {Array.<IEmotionResult>|null} [emotionResult] DecoderResult emotionResult
	         * @property {Array.<DecoderResult.IContextAnswer>|null} [contextAnswer] DecoderResult contextAnswer
	         */
	    
	        /**
	         * Constructs a new DecoderResult.
	         * @exports DecoderResult
	         * @classdesc Represents a DecoderResult.
	         * @implements IDecoderResult
	         * @constructor
	         * @param {IDecoderResult=} [properties] Properties to set
	         */
	        function DecoderResult(properties) {
	            this.hypothesis = [];
	            this.emotionResult = [];
	            this.contextAnswer = [];
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * DecoderResult hypothesis.
	         * @member {Array.<IHypothesis>} hypothesis
	         * @memberof DecoderResult
	         * @instance
	         */
	        DecoderResult.prototype.hypothesis = $util.emptyArray;
	    
	        /**
	         * DecoderResult chunkStart.
	         * @member {number} chunkStart
	         * @memberof DecoderResult
	         * @instance
	         */
	        DecoderResult.prototype.chunkStart = 0;
	    
	        /**
	         * DecoderResult chunkEnd.
	         * @member {number} chunkEnd
	         * @memberof DecoderResult
	         * @instance
	         */
	        DecoderResult.prototype.chunkEnd = 0;
	    
	        /**
	         * DecoderResult timeEndpointDetectionMs.
	         * @member {number} timeEndpointDetectionMs
	         * @memberof DecoderResult
	         * @instance
	         */
	        DecoderResult.prototype.timeEndpointDetectionMs = 0;
	    
	        /**
	         * DecoderResult timeDecodingMs.
	         * @member {number} timeDecodingMs
	         * @memberof DecoderResult
	         * @instance
	         */
	        DecoderResult.prototype.timeDecodingMs = 0;
	    
	        /**
	         * DecoderResult variables.
	         * @member {IVariables|null|undefined} variables
	         * @memberof DecoderResult
	         * @instance
	         */
	        DecoderResult.prototype.variables = null;
	    
	        /**
	         * DecoderResult isFinal.
	         * @member {boolean} isFinal
	         * @memberof DecoderResult
	         * @instance
	         */
	        DecoderResult.prototype.isFinal = false;
	    
	        /**
	         * DecoderResult emotionResult.
	         * @member {Array.<IEmotionResult>} emotionResult
	         * @memberof DecoderResult
	         * @instance
	         */
	        DecoderResult.prototype.emotionResult = $util.emptyArray;
	    
	        /**
	         * DecoderResult contextAnswer.
	         * @member {Array.<DecoderResult.IContextAnswer>} contextAnswer
	         * @memberof DecoderResult
	         * @instance
	         */
	        DecoderResult.prototype.contextAnswer = $util.emptyArray;
	    
	        /**
	         * Decodes a DecoderResult message from the specified reader or buffer.
	         * @function decode
	         * @memberof DecoderResult
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {DecoderResult} DecoderResult
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        DecoderResult.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DecoderResult();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        if (!(message.hypothesis && message.hypothesis.length))
	                            message.hypothesis = [];
	                        message.hypothesis.push($root.Hypothesis.decode(reader, reader.uint32()));
	                        break;
	                    }
	                case 2: {
	                        message.chunkStart = reader.float();
	                        break;
	                    }
	                case 3: {
	                        message.chunkEnd = reader.float();
	                        break;
	                    }
	                case 4: {
	                        message.timeEndpointDetectionMs = reader.float();
	                        break;
	                    }
	                case 5: {
	                        message.timeDecodingMs = reader.float();
	                        break;
	                    }
	                case 6: {
	                        message.variables = $root.Variables.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 7: {
	                        message.isFinal = reader.bool();
	                        break;
	                    }
	                case 8: {
	                        if (!(message.emotionResult && message.emotionResult.length))
	                            message.emotionResult = [];
	                        message.emotionResult.push($root.EmotionResult.decode(reader, reader.uint32()));
	                        break;
	                    }
	                case 9: {
	                        if (!(message.contextAnswer && message.contextAnswer.length))
	                            message.contextAnswer = [];
	                        message.contextAnswer.push($root.DecoderResult.ContextAnswer.decode(reader, reader.uint32()));
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        DecoderResult.ContextAnswer = (function() {
	    
	            /**
	             * Properties of a ContextAnswer.
	             * @memberof DecoderResult
	             * @interface IContextAnswer
	             * @property {Array.<DecoderResult.ContextAnswer.IContextRef>|null} [contextResult] ContextAnswer contextResult
	             */
	    
	            /**
	             * Constructs a new ContextAnswer.
	             * @memberof DecoderResult
	             * @classdesc Represents a ContextAnswer.
	             * @implements IContextAnswer
	             * @constructor
	             * @param {DecoderResult.IContextAnswer=} [properties] Properties to set
	             */
	            function ContextAnswer(properties) {
	                this.contextResult = [];
	                if (properties)
	                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                        if (properties[keys[i]] != null)
	                            this[keys[i]] = properties[keys[i]];
	            }
	    
	            /**
	             * ContextAnswer contextResult.
	             * @member {Array.<DecoderResult.ContextAnswer.IContextRef>} contextResult
	             * @memberof DecoderResult.ContextAnswer
	             * @instance
	             */
	            ContextAnswer.prototype.contextResult = $util.emptyArray;
	    
	            /**
	             * Decodes a ContextAnswer message from the specified reader or buffer.
	             * @function decode
	             * @memberof DecoderResult.ContextAnswer
	             * @static
	             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	             * @param {number} [length] Message length if known beforehand
	             * @returns {DecoderResult.ContextAnswer} ContextAnswer
	             * @throws {Error} If the payload is not a reader or valid buffer
	             * @throws {$protobuf.util.ProtocolError} If required fields are missing
	             */
	            ContextAnswer.decode = function decode(reader, length) {
	                if (!(reader instanceof $Reader))
	                    reader = $Reader.create(reader);
	                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DecoderResult.ContextAnswer();
	                while (reader.pos < end) {
	                    var tag = reader.uint32();
	                    switch (tag >>> 3) {
	                    case 1: {
	                            if (!(message.contextResult && message.contextResult.length))
	                                message.contextResult = [];
	                            message.contextResult.push($root.DecoderResult.ContextAnswer.ContextRef.decode(reader, reader.uint32()));
	                            break;
	                        }
	                    default:
	                        reader.skipType(tag & 7);
	                        break;
	                    }
	                }
	                return message;
	            };
	    
	            ContextAnswer.ContextRef = (function() {
	    
	                /**
	                 * Properties of a ContextRef.
	                 * @memberof DecoderResult.ContextAnswer
	                 * @interface IContextRef
	                 * @property {string|null} [id] ContextRef id
	                 * @property {number|null} [index] ContextRef index
	                 * @property {string|null} [originalValue] ContextRef originalValue
	                 * @property {string|null} [predictedValue] ContextRef predictedValue
	                 * @property {number|null} [score] ContextRef score
	                 */
	    
	                /**
	                 * Constructs a new ContextRef.
	                 * @memberof DecoderResult.ContextAnswer
	                 * @classdesc Represents a ContextRef.
	                 * @implements IContextRef
	                 * @constructor
	                 * @param {DecoderResult.ContextAnswer.IContextRef=} [properties] Properties to set
	                 */
	                function ContextRef(properties) {
	                    if (properties)
	                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                            if (properties[keys[i]] != null)
	                                this[keys[i]] = properties[keys[i]];
	                }
	    
	                /**
	                 * ContextRef id.
	                 * @member {string} id
	                 * @memberof DecoderResult.ContextAnswer.ContextRef
	                 * @instance
	                 */
	                ContextRef.prototype.id = "";
	    
	                /**
	                 * ContextRef index.
	                 * @member {number} index
	                 * @memberof DecoderResult.ContextAnswer.ContextRef
	                 * @instance
	                 */
	                ContextRef.prototype.index = 0;
	    
	                /**
	                 * ContextRef originalValue.
	                 * @member {string} originalValue
	                 * @memberof DecoderResult.ContextAnswer.ContextRef
	                 * @instance
	                 */
	                ContextRef.prototype.originalValue = "";
	    
	                /**
	                 * ContextRef predictedValue.
	                 * @member {string} predictedValue
	                 * @memberof DecoderResult.ContextAnswer.ContextRef
	                 * @instance
	                 */
	                ContextRef.prototype.predictedValue = "";
	    
	                /**
	                 * ContextRef score.
	                 * @member {number} score
	                 * @memberof DecoderResult.ContextAnswer.ContextRef
	                 * @instance
	                 */
	                ContextRef.prototype.score = 0;
	    
	                /**
	                 * Decodes a ContextRef message from the specified reader or buffer.
	                 * @function decode
	                 * @memberof DecoderResult.ContextAnswer.ContextRef
	                 * @static
	                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	                 * @param {number} [length] Message length if known beforehand
	                 * @returns {DecoderResult.ContextAnswer.ContextRef} ContextRef
	                 * @throws {Error} If the payload is not a reader or valid buffer
	                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
	                 */
	                ContextRef.decode = function decode(reader, length) {
	                    if (!(reader instanceof $Reader))
	                        reader = $Reader.create(reader);
	                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DecoderResult.ContextAnswer.ContextRef();
	                    while (reader.pos < end) {
	                        var tag = reader.uint32();
	                        switch (tag >>> 3) {
	                        case 1: {
	                                message.id = reader.string();
	                                break;
	                            }
	                        case 2: {
	                                message.index = reader.int32();
	                                break;
	                            }
	                        case 3: {
	                                message.originalValue = reader.string();
	                                break;
	                            }
	                        case 4: {
	                                message.predictedValue = reader.string();
	                                break;
	                            }
	                        case 5: {
	                                message.score = reader.float();
	                                break;
	                            }
	                        default:
	                            reader.skipType(tag & 7);
	                            break;
	                        }
	                    }
	                    return message;
	                };
	    
	                return ContextRef;
	            })();
	    
	            return ContextAnswer;
	        })();
	    
	        return DecoderResult;
	    })();
	    
	    $root.ErrorResponse = (function() {
	    
	        /**
	         * Properties of an ErrorResponse.
	         * @exports IErrorResponse
	         * @interface IErrorResponse
	         * @property {string|null} [errorMessage] ErrorResponse errorMessage
	         */
	    
	        /**
	         * Constructs a new ErrorResponse.
	         * @exports ErrorResponse
	         * @classdesc Represents an ErrorResponse.
	         * @implements IErrorResponse
	         * @constructor
	         * @param {IErrorResponse=} [properties] Properties to set
	         */
	        function ErrorResponse(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * ErrorResponse errorMessage.
	         * @member {string} errorMessage
	         * @memberof ErrorResponse
	         * @instance
	         */
	        ErrorResponse.prototype.errorMessage = "";
	    
	        /**
	         * Decodes an ErrorResponse message from the specified reader or buffer.
	         * @function decode
	         * @memberof ErrorResponse
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {ErrorResponse} ErrorResponse
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        ErrorResponse.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ErrorResponse();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.errorMessage = reader.string();
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return ErrorResponse;
	    })();
	    
	    $root.PacketWrapperFromServer = (function() {
	    
	        /**
	         * Properties of a PacketWrapperFromServer.
	         * @exports IPacketWrapperFromServer
	         * @interface IPacketWrapperFromServer
	         * @property {IUndecodedSeconds|null} [undecodedSecondsField] PacketWrapperFromServer undecodedSecondsField
	         * @property {IFullyFinalized|null} [fullyFinalizedField] PacketWrapperFromServer fullyFinalizedField
	         * @property {IDecoderResult|null} [decoderResultField] PacketWrapperFromServer decoderResultField
	         * @property {IErrorResponse|null} [errorResponse] PacketWrapperFromServer errorResponse
	         */
	    
	        /**
	         * Constructs a new PacketWrapperFromServer.
	         * @exports PacketWrapperFromServer
	         * @classdesc Represents a PacketWrapperFromServer.
	         * @implements IPacketWrapperFromServer
	         * @constructor
	         * @param {IPacketWrapperFromServer=} [properties] Properties to set
	         */
	        function PacketWrapperFromServer(properties) {
	            if (properties)
	                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
	                    if (properties[keys[i]] != null)
	                        this[keys[i]] = properties[keys[i]];
	        }
	    
	        /**
	         * PacketWrapperFromServer undecodedSecondsField.
	         * @member {IUndecodedSeconds|null|undefined} undecodedSecondsField
	         * @memberof PacketWrapperFromServer
	         * @instance
	         */
	        PacketWrapperFromServer.prototype.undecodedSecondsField = null;
	    
	        /**
	         * PacketWrapperFromServer fullyFinalizedField.
	         * @member {IFullyFinalized|null|undefined} fullyFinalizedField
	         * @memberof PacketWrapperFromServer
	         * @instance
	         */
	        PacketWrapperFromServer.prototype.fullyFinalizedField = null;
	    
	        /**
	         * PacketWrapperFromServer decoderResultField.
	         * @member {IDecoderResult|null|undefined} decoderResultField
	         * @memberof PacketWrapperFromServer
	         * @instance
	         */
	        PacketWrapperFromServer.prototype.decoderResultField = null;
	    
	        /**
	         * PacketWrapperFromServer errorResponse.
	         * @member {IErrorResponse|null|undefined} errorResponse
	         * @memberof PacketWrapperFromServer
	         * @instance
	         */
	        PacketWrapperFromServer.prototype.errorResponse = null;
	    
	        // OneOf field names bound to virtual getters and setters
	        var $oneOfFields;
	    
	        /**
	         * PacketWrapperFromServer MessageType.
	         * @member {"undecodedSecondsField"|"fullyFinalizedField"|"decoderResultField"|"errorResponse"|undefined} MessageType
	         * @memberof PacketWrapperFromServer
	         * @instance
	         */
	        Object.defineProperty(PacketWrapperFromServer.prototype, "MessageType", {
	            get: $util.oneOfGetter($oneOfFields = ["undecodedSecondsField", "fullyFinalizedField", "decoderResultField", "errorResponse"]),
	            set: $util.oneOfSetter($oneOfFields)
	        });
	    
	        /**
	         * Decodes a PacketWrapperFromServer message from the specified reader or buffer.
	         * @function decode
	         * @memberof PacketWrapperFromServer
	         * @static
	         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
	         * @param {number} [length] Message length if known beforehand
	         * @returns {PacketWrapperFromServer} PacketWrapperFromServer
	         * @throws {Error} If the payload is not a reader or valid buffer
	         * @throws {$protobuf.util.ProtocolError} If required fields are missing
	         */
	        PacketWrapperFromServer.decode = function decode(reader, length) {
	            if (!(reader instanceof $Reader))
	                reader = $Reader.create(reader);
	            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PacketWrapperFromServer();
	            while (reader.pos < end) {
	                var tag = reader.uint32();
	                switch (tag >>> 3) {
	                case 1: {
	                        message.undecodedSecondsField = $root.UndecodedSeconds.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 2: {
	                        message.fullyFinalizedField = $root.FullyFinalized.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 4: {
	                        message.decoderResultField = $root.DecoderResult.decode(reader, reader.uint32());
	                        break;
	                    }
	                case 8: {
	                        message.errorResponse = $root.ErrorResponse.decode(reader, reader.uint32());
	                        break;
	                    }
	                default:
	                    reader.skipType(tag & 7);
	                    break;
	                }
	            }
	            return message;
	        };
	    
	        return PacketWrapperFromServer;
	    })();

	    return $root;
	}); 
} (asr));

var asrExports = asr.exports;

var createSpeechRecognizer = function (voiceListener) {
    var _a = createNanoEvents(), emit = _a.emit, on = _a.on;
    var off;
    var status = 'inactive';
    var currentMessageId;
    var stop = function () {
        if (voiceListener.status !== 'stopped') {
            status = 'inactive';
            voiceListener.stop();
        }
    };
    var start = function (_a) {
        var sendVoice = _a.sendVoice, messageId = _a.messageId, onMessage = _a.onMessage;
        return voiceListener.listen(sendVoice).then(function () {
            if (voiceListener.status === 'stopped') {
                return;
            }
            status = 'active';
            currentMessageId = messageId;
            off = onMessage(function (message) {
                var _a, _b;
                if (message.status && message.status.code != null && message.status.code < 0) {
                    off();
                    stop();
                }
                if (message.messageId === messageId && message.messageName === MessageNames.STT) {
                    if (message.text) {
                        emit('hypotesis', message.text.data || '', message.last === 1, message.messageId);
                        if (message.last === 1) {
                            off();
                            stop();
                        }
                    }
                    if ((_a = message.bytes) === null || _a === void 0 ? void 0 : _a.data) {
                        var decoderResultField = asrExports.PacketWrapperFromServer.decode(message.bytes.data).decoderResultField;
                        if (decoderResultField && ((_b = decoderResultField.hypothesis) === null || _b === void 0 ? void 0 : _b.length)) {
                            emit('hypotesis', decoderResultField.hypothesis[0].normalizedText || '', !!decoderResultField.isFinal, message.messageId);
                            if (decoderResultField.isFinal) {
                                off();
                                stop();
                            }
                        }
                    }
                }
            });
        });
    };
    return {
        start: start,
        stop: stop,
        on: on,
        get status() {
            return status;
        },
        get messageId() {
            return currentMessageId;
        },
    };
};

var isAudioSupported = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
/**
 * Возвращает новый инстанс AudioContext или ошибку
 * @param options AudioContextOptions
 * @returns AudioContext
 */
var createAudioContext = function (options) {
    if (window.AudioContext) {
        return new AudioContext(options);
    }
    if (window.webkitAudioContext) {
        // eslint-disable-next-line new-cap
        return new window.webkitAudioContext();
    }
    throw new Error('Audio not supported');
};
var _a = createNanoEvents(), on = _a.on, emit = _a.emit;
var audioContext;
/**
 * При помощи вызова функции из аргумента, возвращает, готовый к воспроизведению звука, AudioContext.
 * Всегда возвращает один и тот же AudioContext
 * @param onReady Функция, в аргумент которой будет возвращен AudioContext
 */
var resolveAudioContext = function (onReady) {
    if (!audioContext) {
        var isSafari_1 = navigator.vendor.search('Apple') >= 0;
        var context_1 = createAudioContext();
        audioContext = {
            context: context_1,
            ready: !isSafari_1 && context_1.state === 'running',
            on: on,
        };
        /// Контекст может быть не готов для использования сразу после создания
        /// Если попробовать что-то воспроизвести в этом контексте - звука не будет
        if (!audioContext.ready) {
            var handleClick_1 = function () {
                document.removeEventListener('click', handleClick_1);
                document.removeEventListener('touchstart', handleClick_1);
                if (isSafari_1) {
                    /// проигрываем тишину, т.к нужно что-то проиграть,
                    /// чтобы сафари разрешил воспроизводить звуки в любой момент в этом контексте
                    var oscillator = audioContext.context.createOscillator();
                    oscillator.frequency.value = 0;
                    oscillator.connect(audioContext.context.destination);
                    oscillator.start(0);
                    oscillator.stop(0.5);
                }
                if (audioContext.context.state === 'suspended') {
                    /// Developers who write games, WebRTC applications, or other websites that use the Web Audio API
                    /// should call context.resume() after the first user gesture (e.g. a click, or tap)
                    /// https://sites.google.com/a/chromium.org/dev/audio-video/autoplay
                    audioContext.context.resume();
                }
                audioContext.ready = true;
                emit('ready');
            };
            /// чтобы сделать контекст готовым к использованию (воспроизведению звука),
            /// необходимо событие от пользователя
            // для пк
            document.addEventListener('click', handleClick_1);
            // для мобильных устройств
            document.addEventListener('touchstart', handleClick_1);
        }
    }
    if (audioContext.ready) {
        onReady && onReady(audioContext.context);
    }
    else {
        var unsubscribe_1 = on('ready', function () {
            onReady(audioContext.context);
            unsubscribe_1();
        });
    }
};

/**
 * Понижает sample rate c inSampleRate до значения outSampleRate и преобразует Float32Array в ArrayBuffer
 * @param buffer Аудио
 * @param inSampleRate текущий sample rate
 * @param outSampleRate требуемый sample rate
 * @returns Аудио со значением sample rate = outSampleRate
 */
var downsampleBuffer = function (buffer, inSampleRate, outSampleRate) {
    if (outSampleRate > inSampleRate) {
        throw new Error('downsampling rate show be smaller than original sample rate');
    }
    var sampleRateRatio = inSampleRate / outSampleRate;
    var newLength = Math.round(buffer.length / sampleRateRatio);
    var result = new Int16Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
        var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
        var accum = 0;
        var count = 0;
        for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
            accum += buffer[i];
            count++;
        }
        result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
        offsetResult++;
        offsetBuffer = nextOffsetBuffer;
    }
    return result.buffer;
};
var TARGET_SAMPLE_RATE = 16000;
var IS_FIREFOX = typeof window !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var IS_SAFARI = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var context;
var processor;
/**
 * Преобразует stream в чанки (кусочки), и передает их в cb,
 * будет это делать, пока не будет вызвана функция остановки
 * @param stream Аудио-поток
 * @param cb callback, куда будут переданы чанки из потока
 * @returns Функция, вызов которой остановит передачу чанков
 */
var createAudioRecorder = function (stream, cb) {
    return new Promise(function (resolve) {
        var state = 'inactive';
        var input;
        var stop = function () {
            if (state === 'inactive') {
                return;
            }
            state = 'inactive';
            stream.getTracks().forEach(function (track) {
                track.stop();
            });
            input.disconnect();
        };
        var start = function () {
            if (state !== 'inactive') {
                throw new Error("Can't start not inactive recorder");
            }
            state = 'recording';
            if (!context) {
                context = createAudioContext({
                    // firefox не умеет выравнивать samplerate, будем делать это самостоятельно
                    sampleRate: IS_FIREFOX ? undefined : TARGET_SAMPLE_RATE,
                });
            }
            input = context.createMediaStreamSource(stream);
            if (!processor) {
                processor = context.createScriptProcessor(2048, 1, 1);
            }
            var listener = function (e) {
                var buffer = e.inputBuffer.getChannelData(0);
                var data = downsampleBuffer(buffer, context.sampleRate, TARGET_SAMPLE_RATE);
                var last = state === 'inactive';
                // отсылаем только чанки где есть звук voiceData > 0, т.к.
                // в safari первые несколько чанков со звуком пустые
                var dataWithVoice = new Uint8Array(data).some(function (voiceData) { return voiceData > 0; });
                if (!IS_SAFARI || dataWithVoice) {
                    resolve(stop);
                    cb(data, last);
                }
                if (last) {
                    processor.removeEventListener('audioprocess', listener);
                }
            };
            processor.addEventListener('audioprocess', listener);
            input.connect(processor);
            processor.connect(context.destination);
        };
        start();
    });
};
/**
 * Запрашивает у браузера доступ к микрофону и резолвит Promise, если разрешение получено.
 * После получения разрешения, чанки с голосом будут передаваться в cb - пока не будет вызвана функция из результата.
 * @param cb Callback, куда будут передаваться чанки с голосом пользователя
 * @returns Promise, который содержит функцию прерывающую слушание
 */
var createNavigatorAudioProvider = function (cb) {
    return navigator.mediaDevices
        .getUserMedia({
        audio: true,
    })
        .then(function (stream) {
        return createAudioRecorder(stream, cb);
    })
        .catch(function (err) {
        if (window.location.protocol === 'http:') {
            throw new Error('Audio is supported only on a secure connection');
        }
        throw err;
    });
};

/**
 * Возвращает объект, позволяющий получать запись голоса пользователя и управлять ею.
 * @param createAudioProvider Источник голоса
 * @returns Api для запуска и остановки слушания
 */
var createVoiceListener = function (createAudioProvider) {
    if (createAudioProvider === void 0) { createAudioProvider = createNavigatorAudioProvider; }
    var _a = createNanoEvents(), emit = _a.emit, on = _a.on;
    var stopRecord;
    var status = 'stopped';
    var stop = function () {
        status = 'stopped';
        stopRecord === null || stopRecord === void 0 ? void 0 : stopRecord();
        emit('status', 'stopped');
    };
    var listen = function (handleVoice) {
        status = 'started';
        emit('status', 'started');
        return createAudioProvider(function (data, last) { return handleVoice(new Uint8Array(data), last); })
            .then(function (recStop) {
            stopRecord = recStop;
        })
            .then(function () {
            if (status === 'stopped') {
                stopRecord();
            }
            else {
                status = 'listen';
                emit('status', 'listen');
            }
        })
            .catch(function (err) {
            status = 'stopped';
            emit('status', 'stopped');
            throw err;
        });
    };
    return {
        listen: listen,
        stop: stop,
        on: on,
        get status() {
            return status;
        },
    };
};

/** Создает коллекцию треков  */
var createTrackCollection = function () {
    var trackIds;
    var trackMap;
    var clear = function () {
        trackIds = new Array();
        trackMap = new Map();
    };
    var push = function (id, track) {
        if (trackMap.has(id)) {
            throw new Error('Track already exists');
        }
        trackMap.set(id, track);
        trackIds.push(id);
    };
    var has = function (id) { return trackMap.has(id); };
    var getById = function (id) {
        var track = trackMap.get(id);
        if (track === undefined) {
            throw new Error('Unknown track id');
        }
        return track;
    };
    var getByIndex = function (index) {
        if (index < 0 || index >= trackIds.length) {
            throw new Error('Index out of bounds');
        }
        var track = trackMap.get(trackIds[index]);
        if (track == null) {
            throw new Error('Something wrong...');
        }
        return track;
    };
    var some = function (predicate) { return trackIds.some(function (id) { return predicate(getById(id)); }); };
    clear();
    return {
        clear: clear,
        has: has,
        get: getById,
        getByIndex: getByIndex,
        push: push,
        some: some,
        get length() {
            return trackIds.length;
        },
    };
};

/** Создает структуру для хранения загружаемых и воспроизводимых частей трека */
var createChunkQueue = function () {
    var buffer = []; // очередь на воспроизведение
    var chunks = []; // очередь воспроизведения
    var duration = 0; // продолжительность очереди на воспроизведение, сек
    var loaded = false; // флаг завершения загрузки
    /** Добавить чанк в очередь на воспроизведение */
    var push = function (chunk) {
        var _a;
        buffer.push(chunk);
        duration += ((_a = chunk.buffer) === null || _a === void 0 ? void 0 : _a.duration) || 0;
    };
    /** Добавить чанк в очередь воспроизведения */
    var toPlay = function (chunk) {
        chunks.push(chunk);
    };
    /** Удалить чанк из очереди воспроизведения */
    var remove = function (chunk) {
        chunks.splice(chunks.indexOf(chunk), 1);
    };
    /** Получить очередь на воспроизведение */
    var popAll = function () {
        duration = 0;
        return buffer.splice(0, buffer.length);
    };
    /** Проставляем признак окончания загрузки трека */
    var allLoaded = function () {
        loaded = true;
    };
    return {
        get bufferLen() {
            return buffer.length;
        },
        get chunks() {
            return chunks;
        },
        allLoaded: allLoaded,
        toPlay: toPlay,
        remove: remove,
        push: push,
        popAll: popAll,
        get length() {
            return chunks.length;
        },
        get duration() {
            return duration;
        },
        get ended() {
            // считаем трек законченным, когда все загружено и воспроизведено
            return loaded && chunks.length === 0 && buffer.length === 0;
        },
        get loaded() {
            return loaded;
        },
    };
};

var from16BitToFloat32 = function (incomingData) {
    var l = incomingData.length;
    var outputData = new Float32Array(l);
    for (var i = 0; i < l; i += 1) {
        outputData[i] = incomingData[i] / 32768.0;
    }
    return outputData;
};
/** Возвращает потоковый подгружаемый трек, который умеет себя проигрывать */
var createTrackStream = function (ctx, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.sampleRate, sampleRate = _c === void 0 ? 24000 : _c, _d = _b.numberOfChannels, numberOfChannels = _d === void 0 ? 1 : _d, _e = _b.delay, delay = _e === void 0 ? 0 : _e, onPlay = _b.onPlay, onEnd = _b.onEnd, trackStatus = _b.trackStatus;
    // очередь загруженных чанков (кусочков) трека
    var queue = createChunkQueue();
    var extraByte = null;
    var status = trackStatus || 'stop';
    var lastChunkOffset = 0;
    var startTime = 0;
    var firstChunk = true;
    var end = function () {
        // останавливаем воспроизведение чанков из очереди воспроизведения
        queue.chunks.forEach(function (chunk) {
            chunk.stop();
        });
        status = 'end';
        onEnd && onEnd();
        startTime = 0;
        lastChunkOffset = 0;
    };
    var play = function () {
        if (status === 'end') {
            return;
        }
        if (status !== 'play') {
            status = 'play';
            onPlay && onPlay();
        }
        if (queue.ended) {
            end();
            return;
        }
        // воспроизводим трек, если он полностью загрузился или длина загруженного больше задержки
        if (queue.loaded || queue.duration >= delay) {
            startTime = queue.length === 0 ? ctx.currentTime : startTime;
            var chunks = queue.popAll();
            chunks.forEach(function (chunk) {
                var _a;
                queue.toPlay(chunk);
                chunk.start(startTime + lastChunkOffset);
                lastChunkOffset += ((_a = chunk.buffer) === null || _a === void 0 ? void 0 : _a.duration) || 0;
            });
        }
    };
    var getExtraBytes = function (data, bytesArraysSizes) {
        if (extraByte == null && bytesArraysSizes.incomingMessageVoiceDataLength % 2) {
            extraByte = data[bytesArraysSizes.incomingMessageVoiceDataLength - 1];
            bytesArraysSizes.incomingMessageVoiceDataLength -= 1;
            bytesArraysSizes.sourceLen -= 1;
        }
        else if (extraByte != null) {
            bytesArraysSizes.prepend = extraByte;
            bytesArraysSizes.start = 1;
            if (bytesArraysSizes.incomingMessageVoiceDataLength % 2) {
                bytesArraysSizes.incomingMessageVoiceDataLength += 1;
                extraByte = null;
            }
            else {
                extraByte = data[bytesArraysSizes.incomingMessageVoiceDataLength - 1];
                bytesArraysSizes.sourceLen -= 1;
            }
        }
    };
    var createChunk = function (chunk) {
        var audioBuffer = ctx.createBuffer(numberOfChannels, chunk.length / numberOfChannels, sampleRate);
        for (var i = 0; i < numberOfChannels; i++) {
            var channelChunk = new Float32Array(chunk.length / numberOfChannels);
            var index = 0;
            for (var j = i; j < chunk.length; j += numberOfChannels) {
                channelChunk[index++] = chunk[j];
            }
            audioBuffer.getChannelData(i).set(channelChunk);
        }
        var source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = function () {
            queue.remove(source);
            if (queue.ended && status !== 'end') {
                status = 'end';
                onEnd && onEnd();
            }
        };
        return source;
    };
    /** добавляет чанк в очередь на воспроизведение */
    var write = function (data) {
        // 44 байта - заголовок трека
        var slicePoint = firstChunk ? 44 : 0;
        var bytesArraysSizes = {
            incomingMessageVoiceDataLength: data.length,
            sourceLen: data.length,
            start: 0,
            prepend: null,
        };
        firstChunk = false;
        if (slicePoint >= data.length) {
            return;
        }
        getExtraBytes(data, bytesArraysSizes);
        var dataBuffer = new ArrayBuffer(bytesArraysSizes.incomingMessageVoiceDataLength);
        var bufferUi8 = new Uint8Array(dataBuffer);
        var bufferI16 = new Int16Array(dataBuffer);
        bufferUi8.set(data.slice(0, bytesArraysSizes.sourceLen), bytesArraysSizes.start);
        if (bytesArraysSizes.prepend != null) {
            bufferUi8[0] = bytesArraysSizes.prepend;
        }
        var chunk = createChunk(from16BitToFloat32(bufferI16.slice(slicePoint)));
        queue.push(chunk);
        if (status === 'play') {
            play();
        }
    };
    return {
        get loaded() {
            return queue.loaded;
        },
        setLoaded: function () {
            queue.allLoaded();
            if (status === 'play') {
                play();
            }
        },
        write: write,
        get status() {
            return status;
        },
        play: play,
        stop: end,
    };
};

var createVoicePlayer = function (actx, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.startVoiceDelay, startVoiceDelay = _c === void 0 ? 0.2 : _c, sampleRate = _b.sampleRate, numberOfChannels = _b.numberOfChannels;
    var _d = createNanoEvents(), on = _d.on, emit = _d.emit;
    var tracks = createTrackCollection();
    // true - воспроизводим все треки в очереди (новые в том числе), false - скипаем всю очередь (новые в т.ч.)
    var active = true;
    // индекс текущего трека в tracks
    var cursor = 0;
    var play = function () {
        if (cursor >= tracks.length) {
            if (tracks.some(function (track) { return !track.loaded; })) {
                return;
            }
            // очищаем коллекцию, если все треки были воспроизведены
            cursor = 0;
            tracks.clear();
            return;
        }
        // рекурсивно последовательно включаем треки из очереди
        var current = tracks.getByIndex(cursor);
        if (current.status === 'end') {
            if (cursor < tracks.length) {
                cursor++;
                play();
            }
        }
        else {
            current.play();
        }
    };
    var append = function (data, trackId, last) {
        if (last === void 0) { last = false; }
        var current = tracks.has(trackId) ? tracks.get(trackId) : undefined;
        if (current == null) {
            /// если trackId нет в коллекции - создаем трек
            /// по окончании проигрывания - запускаем следующий трек, вызывая play
            current = createTrackStream(actx, {
                sampleRate: sampleRate,
                numberOfChannels: numberOfChannels,
                delay: startVoiceDelay,
                onPlay: function () { return emit('play', trackId); },
                onEnd: function () {
                    emit('end', trackId);
                    play();
                },
                trackStatus: active ? 'stop' : 'end',
            });
            tracks.push(trackId, current);
        }
        if (current.status !== 'end' && data.length) {
            current.write(data);
        }
        if (last) {
            // все чанки трека загружены
            current.setLoaded();
        }
        play();
    };
    var stop = function () {
        while (cursor < tracks.length) {
            var cur = cursor;
            cursor++;
            tracks.getByIndex(cur).stop();
        }
    };
    return {
        append: append,
        setActive: function (value) {
            active = value;
            if (value) {
                play();
            }
            else {
                stop();
            }
        },
        on: on,
        stop: stop,
    };
};

var createVoice = function (client, settings, emit, 
/// пока onReady не вызван, треки не воспроизводятся
/// когда случится onReady, очередь треков начнет проигрываться
onReady) {
    var voicePlayer;
    var listener = createVoiceListener();
    var musicRecognizer = createMusicRecognizer(listener);
    var speechRecognizer = createSpeechRecognizer(listener);
    var subscriptions = [];
    var appInfoDict = {};
    var mesIdQueue = [];
    var isPlaying = false; // проигрывается/не проигрывается озвучка
    var autolistenMesId = null; // id сообщения, после проигрывания которого, нужно активировать слушание
    /** останавливает слушание голоса, возвращает true - если слушание было активно */
    var stopListening = function () {
        var result = speechRecognizer.status === 'active' || musicRecognizer.status === 'active';
        autolistenMesId = null;
        if (speechRecognizer.status === 'active' ||
            (speechRecognizer.status === 'inactive' && listener.status === 'started')) {
            client.sendCancel(speechRecognizer.messageId);
            speechRecognizer.stop();
            return true;
        }
        if (musicRecognizer.status === 'active') {
            musicRecognizer.stop();
            client.sendCancel(musicRecognizer.messageId);
            return true;
        }
        return result;
    };
    /** Останавливает слушание и воспроизведение */
    var stop = function () {
        // здесь важен порядок остановки голоса
        stopListening();
        voicePlayer === null || voicePlayer === void 0 ? void 0 : voicePlayer.stop();
    };
    /** Активирует слушание голоса
     * если было активно слушание или проигрывание - останавливает, слушание в этом случае не активируется
     */
    var listen = function (_a, isAutoListening) {
        var _b = _a === void 0 ? {} : _a, begin = _b.begin;
        if (isAutoListening === void 0) { isAutoListening = false; }
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_c) {
                if (stopListening()) {
                    return [2 /*return*/];
                }
                if (isPlaying) {
                    voicePlayer === null || voicePlayer === void 0 ? void 0 : voicePlayer.stop();
                    return [2 /*return*/];
                }
                if (settings.current.disableListening) {
                    return [2 /*return*/];
                }
                // повторные вызовы не пройдут, пока пользователь не разрешит/запретит аудио
                if (listener.status === 'stopped') {
                    return [2 /*return*/, client.init().then(function () {
                            return client.createVoiceStream(function (_a) {
                                var sendVoice = _a.sendVoice, messageId = _a.messageId, onMessage = _a.onMessage;
                                begin === null || begin === void 0 ? void 0 : begin.forEach(function (chunk) { return sendVoice(new Uint8Array(chunk), false); });
                                return speechRecognizer.start({
                                    sendVoice: sendVoice,
                                    messageId: messageId,
                                    onMessage: onMessage,
                                });
                            }, {
                                source: {
                                    sourceType: isAutoListening ? 'autoListening' : 'lavashar',
                                },
                            });
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    /** Активирует распознавание музыки
     * если было активно слушание или проигрывание - останавливает, распознование музыки в этом случае не активируется
     */
    var shazam = function () {
        if (stopListening()) {
            return;
        }
        if (isPlaying) {
            voicePlayer === null || voicePlayer === void 0 ? void 0 : voicePlayer.stop();
        }
        if (settings.current.disableListening) {
            return;
        }
        // повторные вызовы не пройдут, пока пользователь не разрешит/запретит аудио
        if (listener.status === 'stopped') {
            client.createVoiceStream(function (_a) {
                var sendVoice = _a.sendVoice, messageId = _a.messageId, onMessage = _a.onMessage;
                return musicRecognizer.start({
                    sendVoice: sendVoice,
                    messageId: messageId,
                    onMessage: onMessage,
                });
            }, {
                source: {
                    sourceType: 'lavashar',
                },
            });
        }
    };
    if (isAudioSupported) {
        resolveAudioContext(function (context) {
            /// создаем плеер только если поддерживается аудио
            /// и только когда готов AudioContext
            voicePlayer = createVoicePlayer(context, { startVoiceDelay: 1 });
            // начало проигрывания озвучки
            subscriptions.push(voicePlayer.on('play', function (mesId) {
                isPlaying = true;
                emit({ emotion: 'talk' });
                emit({ tts: { status: 'start', messageId: Number(mesId), appInfo: appInfoDict[mesId] } });
            }));
            // окончание проигрывания озвучки
            subscriptions.push(voicePlayer.on('end', function (mesId) {
                isPlaying = false;
                emit({ emotion: 'idle' });
                emit({ tts: { status: 'stop', messageId: Number(mesId), appInfo: appInfoDict[mesId] } });
                if (mesId === autolistenMesId) {
                    listen();
                }
                // очистка сохраненных appInfo и messageId
                var idx = 0;
                do {
                    delete appInfoDict[mesIdQueue[0]];
                } while (mesIdQueue[idx++] !== mesId && mesIdQueue.length > idx);
                mesIdQueue.splice(0, idx);
            }));
            // оповещаем о готовности к воспроизведению звука
            onReady && onReady();
        });
    }
    // обработка входящей озвучки
    subscriptions.push(client.on('voice', function (data, message) {
        if (settings.current.disableDubbing) {
            return;
        }
        voicePlayer === null || voicePlayer === void 0 ? void 0 : voicePlayer.append(data, message.messageId.toString(), message.last === 1);
    }));
    // гипотезы распознавания речи
    subscriptions.push(speechRecognizer.on('hypotesis', function (text, isLast, mid) {
        emit({
            asr: {
                text: listener.status === 'listen' && !settings.current.disableListening ? text : '',
                last: isLast,
                mid: mid,
            },
        });
    }));
    // статусы слушания речи
    subscriptions.push(listener.on('status', function (status) {
        emit({ listener: { status: status } });
        if (status === 'listen') {
            voicePlayer === null || voicePlayer === void 0 ? void 0 : voicePlayer.setActive(false);
            emit({ emotion: 'listen' });
        }
        else if (status === 'stopped') {
            voicePlayer === null || voicePlayer === void 0 ? void 0 : voicePlayer.setActive(!settings.current.disableDubbing);
            emit({ asr: { text: '' }, emotion: 'idle' });
        }
    }));
    // активация автослушания
    subscriptions.push(client.on('systemMessage', function (systemMessage, originalMessage) {
        var autoListening = systemMessage.auto_listening;
        var messageId = originalMessage.messageId.toString();
        if (typeof systemMessage.app_info !== 'undefined') {
            appInfoDict[messageId] = systemMessage.app_info;
            mesIdQueue.push(messageId);
        }
        if (autoListening) {
            /// если озвучка включена - сохраняем mesId чтобы включить слушание после озвучки
            /// если озвучка выключена - включаем слушание сразу
            if (settings.current.disableDubbing === false) {
                autolistenMesId = messageId;
            }
            else {
                listen({}, autoListening);
            }
        }
    }));
    subscriptions.push(settings.on('change-request', function (nextSettings) {
        var disableDubbing = nextSettings.disableDubbing, disableListening = nextSettings.disableListening;
        /// Важен порядок обработки флагов слушания и озвучки —
        /// сначала слушание, потом озвучка
        disableListening && stopListening();
        // Такой вызов необходим, чтобы включая озвучку она тут же проигралась (при её наличии), и наоборот
        settings.current.disableDubbing !== disableDubbing && (voicePlayer === null || voicePlayer === void 0 ? void 0 : voicePlayer.setActive(!disableDubbing));
    }));
    return {
        destroy: function () {
            stopListening();
            voicePlayer === null || voicePlayer === void 0 ? void 0 : voicePlayer.setActive(false);
            subscriptions.splice(0, subscriptions.length).map(function (unsubscribe) { return unsubscribe(); });
        },
        listen: listen,
        shazam: shazam,
        stop: stop,
        stopPlaying: function () {
            voicePlayer === null || voicePlayer === void 0 ? void 0 : voicePlayer.stop();
        },
    };
};

var createMutexedObject = function (initialObject) {
    var _a = createNanoEvents(), on = _a.on, emit = _a.emit;
    var object = __assign({}, initialObject);
    var nextObject = {};
    var mode = 'released';
    var tryApply = function () {
        if (mode === 'released') {
            var prevObject_1 = object;
            object = __assign(__assign({}, prevObject_1), nextObject);
            var isObjectChanged = Object.keys(nextObject).some(function (name) { return nextObject[name] !== prevObject_1[name]; });
            if (isObjectChanged) {
                emit('changed', object, prevObject_1);
            }
        }
    };
    var lock = function () {
        mode = 'locked';
    };
    var release = function () {
        mode = 'released';
        tryApply();
    };
    var change = function (setts) {
        nextObject = __assign(__assign({}, nextObject), setts);
        emit('change-request', setts);
        tryApply();
    };
    var current = {};
    Object.keys(initialObject).forEach(function (prop) {
        Object.defineProperty(current, prop, {
            get: function () {
                return object[prop];
            },
        });
    });
    return {
        on: on,
        lock: lock,
        release: release,
        change: change,
        current: current,
    };
};

var createMutexSwitcher = function (_a, initialDeps) {
    var lock = _a.lock, release = _a.release;
    var deps = __assign({}, initialDeps);
    return {
        change: function (nextDeps) {
            deps = __assign(__assign({}, deps), nextDeps);
            if (Object.values(deps).every(function (dep) { return dep; })) {
                release();
            }
            else {
                lock();
            }
        },
    };
};

var STATE_UPDATE_TIMEOUT = 200;
var DEFAULT_PROJECT_ID = 'd929986a-611a-2ba0-6174-1928c99600a5';
var DEFAULT_APPLICATION_ID = '7c4e23bf-cd93-b57e-874b-d9fc1b35f93d';
var DEFAULT_APP_VERSION_ID = '26d0bb2e-45d6-a276-f70e-6c016d1f9cff';
var DEFAULT_APP = {
    projectId: DEFAULT_PROJECT_ID,
    applicationId: DEFAULT_APPLICATION_ID,
    appversionId: DEFAULT_APP_VERSION_ID,
    frontendStateId: [DEFAULT_PROJECT_ID, DEFAULT_APPLICATION_ID, DEFAULT_APP_VERSION_ID].join('_'),
    frontendType: 'DIALOG',
    systemName: 'assistant',
    frontendEndpoint: 'None',
};
var BASIC_SMART_APP_COMMANDS_TYPES = ['smart_app_data', 'smart_app_error', 'start_smart_search', 'navigation'];
function convertFieldValuesToString(object) {
    return Object.keys(object).reduce(function (acc, key) {
        if (object[key]) {
            acc[key] = JSON.stringify(object[key]);
        }
        return acc;
    }, {});
}
var isDefaultApp = function (appInfo) { return appInfo.frontendStateId === DEFAULT_APP.frontendStateId; };
var promiseTimeout = function (promise, timeout) {
    var timeoutId;
    return Promise.race([
        promise.then(function (v) {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
            return v;
        }),
        new Promise(function (_, reject) {
            timeoutId = window.setTimeout(function () {
                reject(new Error("Timed out in " + timeout + " ms."));
            }, timeout);
        }),
    ]);
};
var createAssistant = function (_a) {
    var _b;
    var getMeta = _a.getMeta, getInitialMeta = _a.getInitialMeta, checkCertUrl = _a.checkCertUrl, configuration = __rest(_a, ["getMeta", "getInitialMeta", "checkCertUrl"]);
    var _c = createNanoEvents(), on = _c.on, emit = _c.emit;
    // хеш [messageId]: requestId, где requestId - пользовательский ид экшена
    var requestIdMap = {};
    var subscriptions = [];
    var backgroundApps = {};
    var settings = createMutexedObject({
        disableDubbing: configuration.settings.dubbing === -1,
        disableListening: false,
        sendTextAsSsml: false,
    });
    var settingsSwitcher = createMutexSwitcher(settings, { isListenerStopped: true, isVoicePlayerEnded: true });
    // готов/не готов воспроизводить озвучку
    var voiceReady = false;
    // текущий апп
    var app = { info: DEFAULT_APP };
    var sdkMeta = { theme: 'dark' };
    var metaProvider = function (additionalMeta) { return __awaiter(void 0, void 0, void 0, function () {
        var appState, _a, current_app, getBackgroundAppsMeta, background_apps;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(app !== null && app.info.frontendType === 'WEB_APP' && app.getState)) return [3 /*break*/, 2];
                    return [4 /*yield*/, promiseTimeout(app.getState(), STATE_UPDATE_TIMEOUT).catch(function () {
                            // eslint-disable-next-line no-console
                            console.error('App-state wasn`t resolved, timeout had been expired');
                            return undefined;
                        })];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = undefined;
                    _b.label = 3;
                case 3:
                    appState = _a;
                    current_app = {
                        app_info: app.info,
                        state: appState || {},
                    };
                    getBackgroundAppsMeta = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var apps, backgroundAppsIds, backgroundAppsMeta;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    apps = __assign({}, backgroundApps);
                                    backgroundAppsIds = Object.keys(apps);
                                    backgroundAppsMeta = [];
                                    return [4 /*yield*/, Promise.all(backgroundAppsIds.map(function (applicationId) { return __awaiter(void 0, void 0, void 0, function () {
                                            var _a, getState;
                                            return __generator(this, function (_b) {
                                                _a = apps[applicationId].getState, getState = _a === void 0 ? function () { return Promise.resolve({}); } : _a;
                                                return [2 /*return*/, promiseTimeout(getState(), STATE_UPDATE_TIMEOUT).then(function (state) { return state; }, function () { return ({}); })];
                                            });
                                        }); })).then(function (results) {
                                            results.forEach(function (appResult, index) {
                                                var state = appResult;
                                                var applicationId = backgroundAppsIds[index];
                                                backgroundAppsMeta.push({
                                                    app_info: apps[applicationId].appInfo,
                                                    state: state,
                                                });
                                            });
                                        })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, backgroundAppsMeta];
                            }
                        });
                    }); };
                    return [4 /*yield*/, getBackgroundAppsMeta()];
                case 4:
                    background_apps = _b.sent();
                    return [2 /*return*/, convertFieldValuesToString(__assign(__assign(__assign(__assign({}, sdkMeta), { time: getTime(), current_app: current_app, background_apps: background_apps }), (additionalMeta || {})), (getMeta ? getMeta() : {})))];
            }
        });
    }); };
    var transport = createTransport({
        createWS: (_b = configuration.fakeVps) === null || _b === void 0 ? void 0 : _b.createFakeWS,
        checkCertUrl: checkCertUrl,
    });
    var protocol = createProtocol(transport, __assign(__assign({}, configuration), { getInitialMeta: typeof getInitialMeta !== 'undefined' ? function () { return getInitialMeta().then(convertFieldValuesToString); } : undefined, 
        // пока голос не готов, выключаем озвучку
        settings: __assign(__assign({}, configuration.settings), { dubbing: -1 }) }));
    var client = createClient(protocol, metaProvider);
    var voice = createVoice(client, settings, function (event) {
        if (typeof event.tts !== 'undefined') {
            emit('tts', event.tts);
            settingsSwitcher.change({ isVoicePlayerEnded: event.tts.status === 'stop' });
            return;
        }
        if (typeof event.listener !== 'undefined') {
            settingsSwitcher.change({ isListenerStopped: event.listener.status === 'stopped' });
        }
        emit('assistant', event);
    }, function () {
        voiceReady = true;
        if (!settings.current.disableDubbing) {
            protocol.changeSettings({ dubbing: 1 });
        }
    });
    /** завершает текущий апп */
    var closeApp = function () {
        var current = app;
        app = {
            info: DEFAULT_APP,
        };
        if (!isDefaultApp(current.info)) {
            emit('app', { type: 'close', app: current.info });
        }
    };
    /** отправляет текст */
    var sendText = function (text, shouldSendDisableDubbing, additionalMeta) {
        if (shouldSendDisableDubbing === void 0) { shouldSendDisableDubbing = false; }
        voice.stop();
        client.sendText(text, settings.current.sendTextAsSsml, shouldSendDisableDubbing, additionalMeta);
    };
    /** отправляет server_action */
    var sendServerAction = function (serverAction, messageName, requestId, actionApp) {
        if (messageName === void 0) { messageName = 'SERVER_ACTION'; }
        if (requestId === void 0) { requestId = undefined; }
        if (actionApp === void 0) { actionApp = app.info; }
        client.sendServerAction(serverAction, actionApp, messageName).then(function (messageId) {
            if (requestId && messageId) {
                requestIdMap[messageId.toString()] = requestId;
            }
        });
    };
    /** отправляет ответ на запрос доступа к местоположению и пр. меты */
    var sendMetaForPermissionRequest = function (requestMessageId, appInfo, items) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, props, data, meta;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getAnswerForRequestPermissions(requestMessageId, appInfo, items)];
                case 1:
                    _a = _b.sent(), props = __rest(_a.meta, []), data = __rest(_a, ["meta"]);
                    return [4 /*yield*/, metaProvider()];
                case 2:
                    meta = _b.sent();
                    client.sendData(__assign({}, data), 'SERVER_ACTION', __assign(__assign({}, meta), convertFieldValuesToString(props)));
                    return [2 /*return*/];
            }
        });
    }); };
    subscriptions.push(protocol.on('ready', function () { return emit('vps', { type: 'ready' }); }));
    // пока voicePlayer не доступен, включение озвучки не будет отправлено
    subscriptions.push(settings.on('changed', function (nextSettings, prevSettings) {
        if (nextSettings.disableDubbing !== prevSettings.disableDubbing) {
            voiceReady && protocol.changeSettings({ dubbing: nextSettings.disableDubbing ? -1 : 1 });
        }
    }));
    // при неудачном переподключении к сокету
    subscriptions.push(transport.on('error', function (error) {
        voice.stop();
        protocol.clearQueue();
        emit('vps', { type: 'error', error: error });
    }));
    // обработка исходящих сообщений
    subscriptions.push(protocol.on('outcoming', function (message) {
        emit('vps', { type: 'outcoming', message: message });
    }));
    // обработка ошибок
    subscriptions.push(protocol.on('error', function (error) {
        emit('error', error);
    }));
    // оповещение о статусах
    subscriptions.push(client.on('status', function (status) {
        emit('status', status);
    }));
    // история на запрос GetHistoryRequest
    subscriptions.push(client.on('history', function (history) {
        emit('history', history);
    }));
    // обработка входящих команд, и событий аппа
    subscriptions.push(client.on('systemMessage', function (systemMessage, originalMessage) {
        if (originalMessage.messageName === 'ANSWER_TO_USER') {
            var activate_app_info = systemMessage.activate_app_info, items = systemMessage.items, mesAppInfo = systemMessage.app_info;
            // по-умолчанию activate_app_info: true
            if (activate_app_info !== false &&
                mesAppInfo &&
                // игнорируем activate_app_info для чатапов
                (['DIALOG', 'CHAT_APP'].includes(mesAppInfo.frontendType) ||
                    mesAppInfo.applicationId !== app.info.applicationId)) {
                emit('app', { type: 'run', app: mesAppInfo });
            }
            if (items) {
                var _loop_1 = function (i) {
                    var command = items[i].command;
                    if (typeof command !== 'undefined') {
                        window.setTimeout(function () { return emit('command', command); });
                        if (command.type === 'start_music_recognition') {
                            voice.shazam();
                            return { value: void 0 };
                        }
                        if (command.type === 'request_permissions' && mesAppInfo) {
                            sendMetaForPermissionRequest(originalMessage.messageId, mesAppInfo, command.permissions);
                            return { value: void 0 };
                        }
                        if (command.type === 'action') {
                            emit('actionCommand', {
                                type: 'command',
                                command: command,
                            });
                        }
                        if (mesAppInfo && BASIC_SMART_APP_COMMANDS_TYPES.includes(command.type)) {
                            // эмитим все команды, т.к бывают фоновые команды
                            emit('app', {
                                type: 'command',
                                command: __assign(__assign({}, command), { sdk_meta: {
                                        mid: originalMessage.messageId.toString(),
                                        requestId: requestIdMap[originalMessage.messageId.toString()],
                                    } }),
                                app: mesAppInfo,
                            });
                        }
                        if (command.type === 'close_app') {
                            closeApp();
                        }
                    }
                };
                for (var i = 0; i < (items || []).length; i++) {
                    var state_1 = _loop_1(i);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
            }
            emit('vps', { type: 'incoming', systemMessage: systemMessage, originalMessage: originalMessage });
        }
    }));
    // прокидывает команды backgroundApp'ов в их подписчики
    on('app', function (event) {
        var _a;
        if (event.type === 'command') {
            var backgroundAppOnCommand = (_a = backgroundApps[event.app.applicationId]) === null || _a === void 0 ? void 0 : _a.commandsSubscribers;
            if (Array.isArray(backgroundAppOnCommand)) {
                backgroundAppOnCommand.forEach(function (onCommand) {
                    var _a;
                    onCommand(event.command, (_a = event.command.sdk_meta) === null || _a === void 0 ? void 0 : _a.mid);
                });
            }
        }
    });
    /** уничтожает ассистент, очищает подписки */
    var destroy = function () {
        voice.destroy();
        client.destroy();
        protocol.destroy();
        subscriptions.splice(0, subscriptions.length).map(function (unsubscribe) { return unsubscribe(); });
    };
    /** запускает ассистент (приветствие) */
    var start = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.disableGreetings, disableGreetings = _c === void 0 ? false : _c, _d = _b.initPhrase, initPhrase = _d === void 0 ? undefined : _d, _e = _b.isFirstSession, isFirstSession = _e === void 0 ? false : _e;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!(!disableGreetings && isDefaultApp(app.info))) return [3 /*break*/, 2];
                        return [4 /*yield*/, client.sendOpenAssistant({ isFirstSession: isFirstSession })];
                    case 1:
                        _f.sent();
                        _f.label = 2;
                    case 2:
                        if (initPhrase) {
                            return [2 /*return*/, client
                                    .sendText(initPhrase)
                                    .then(function (messageId) { return (messageId ? client.waitForAnswer(messageId) : undefined); })];
                        }
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    return {
        get activeApp() {
            return !isDefaultApp(app.info) ? app.info : null;
        },
        get settings() {
            return Object.create(Object.getPrototypeOf(settings.current), Object.getOwnPropertyDescriptors(settings.current));
        },
        destroy: destroy,
        closeApp: closeApp,
        listen: voice.listen,
        sendServerAction: sendServerAction,
        getHistoryRequest: protocol.getHistoryRequest,
        sendText: sendText,
        start: start,
        stop: function () {
            voice.stop();
            protocol.clearQueue();
            transport.close();
        },
        stopTts: voice.stopPlaying,
        stopVoice: voice.stop,
        emit: emit,
        on: on,
        changeConfiguration: protocol.changeConfiguration,
        changeSettings: settings.change,
        changeSdkMeta: function (nextSdkMeta) {
            sdkMeta = __assign(__assign({}, sdkMeta), nextSdkMeta);
        },
        reconnect: protocol.reconnect,
        get protocol() {
            return protocol;
        },
        setActiveApp: function (info, getState) {
            app = { info: info, getState: getState };
        },
        addBackgroundApp: function (_a) {
            var appInfo = _a.appInfo, getState = _a.getState;
            backgroundApps[appInfo.applicationId] = {
                appInfo: appInfo,
                getState: getState,
                commandsSubscribers: [],
            };
            var remove = function () {
                delete backgroundApps[appInfo.applicationId];
            };
            var onCommand = function (subscriber) {
                var _a;
                (_a = backgroundApps[appInfo.applicationId]) === null || _a === void 0 ? void 0 : _a.commandsSubscribers.push(subscriber);
                return {
                    clearSubscribers: function () {
                        if (backgroundApps[appInfo.applicationId]) {
                            backgroundApps[appInfo.applicationId].commandsSubscribers = [];
                        }
                    },
                };
            };
            var sendServerActionToBackgroundApp = function (serverAction, messageName, requestId) {
                var _a;
                if (messageName === void 0) { messageName = 'SERVER_ACTION'; }
                if (requestId === void 0) { requestId = undefined; }
                return sendServerAction(serverAction, messageName, requestId, (_a = backgroundApps[appInfo.applicationId]) === null || _a === void 0 ? void 0 : _a.appInfo);
            };
            return {
                remove: remove,
                onCommand: onCommand,
                sendServerAction: sendServerActionToBackgroundApp,
            };
        },
        get status() {
            return protocol.status;
        },
    };
};

export { createNavigatorAudioProvider as a, asrExports as b, createAssistant as c };

import { e as __spreadArray, a as __rest, _ as __assign, b as __awaiter, f as createNanoObservable, d as createNanoEvents, c as __generator } from './common-ba25e019.js';

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

function validate(uuid) {
  return typeof uuid === 'string' && REGEX.test(uuid);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return stringify(rnds);
}

var isDeepEqual = function (a, b) {
    // Простое значение
    if (typeof a !== 'object' || a === null) {
        return a === b;
    }
    // Массив
    if (Array.isArray(a)) {
        if (!Array.isArray(b) || a.length !== b.length) {
            return false;
        }
        return !a.some(function (valA, key) { return !isDeepEqual(valA, b[key]); });
    }
    // Словарь
    if (typeof b !== 'object' || b === null) {
        return false;
    }
    var entriesA = Object.entries(a);
    var entriesB = Object.entries(b);
    if (entriesA.length !== entriesB.length) {
        return false;
    }
    return !entriesA.some(function (_a) {
        var key = _a[0], valA = _a[1];
        return !(key in b && isDeepEqual(valA, b[key]));
    });
};
var findCommandIndex = function (arr, command) {
    var insets = ['insets', 'minimum_static_insets', 'maximum_static_insets', 'dynamic_insets'];
    var index = -1;
    if (command.type === 'character') {
        index = arr.findIndex(function (c) { return c.type === 'character' && c.character.id === command.character.id; });
    }
    else if (insets.includes(command.type)) {
        index = arr.findIndex(function (c) { return c.type === command.type; });
    }
    else if (command.type === 'app_context') {
        index = arr.findIndex(function (c) { return c.type === 'app_context'; });
    }
    else {
        index = arr.findIndex(function (c) { return isDeepEqual(c, command); });
    }
    return index;
};
var appInitialData = (function () {
    var isPulled = false;
    var pulled = [];
    var committed = [];
    var diff = [];
    var isCommandWasPulled = function (command) { return findCommandIndex(pulled, command) >= 0; };
    return {
        /**
         * Прочитать appInitialData. Запоминает состояние на момент прочтения
         * @returns Массив комманд
         */
        pull: function () {
            isPulled = true;
            pulled = __spreadArray([], (window.appInitialData || []));
            return __spreadArray([], pulled);
        },
        /**
         * Прочитать appInitialData
         * @returns Массив комманд
         */
        get: function () { return __spreadArray([], (window.appInitialData || [])); },
        /**
         * Зафиксировать текущее состояние appInitialData
         */
        commit: function () {
            committed = __spreadArray([], (window.appInitialData || []));
            diff =
                isPulled === true
                    ? (window.appInitialData || []).filter(function (c) { return !isCommandWasPulled(c); })
                    : __spreadArray([], (window.appInitialData || []));
        },
        /**
         * Возвращает диф appInitialData между pull и commit
         * @returns Массив комманд
         */
        diff: function () {
            return __spreadArray([], diff);
        },
        /**
         * Возвращает флаг наличия command в appInitialData на момент commit
         * @param command Команда, которую нужно проверить на наличие в appInitialData
         * @returns true - если команда была в appInitialData
         */
        isCommitted: function (command) {
            var commandIndex = findCommandIndex(committed, command);
            var isCommitted = commandIndex >= 0;
            if (isCommitted) {
                committed.splice(commandIndex, 1);
            }
            return isCommitted;
        },
        /**
         * Возвращает первое сообщение из appInitialData, подходящее под фильтры param
         * @param param Параметры: тип сообщения (например, smart_app_data)
         * и тип команды (значение поля smart_app_data.type)
         * @returns Первое сообщение, соответствующее параметрам или undefined
         */
        find: function (_a) {
            var type = _a.type, command = _a.command;
            var initialCommands = __spreadArray([], (window.appInitialData || []));
            var result = initialCommands.find(function (initialCommand) {
                if (!command && type && type === initialCommand.type) {
                    return true;
                }
                var isCommandInSmartAppData = command && 'smart_app_data' in initialCommand;
                if (!isCommandInSmartAppData) {
                    return;
                }
                if (command === initialCommand.smart_app_data.command ||
                    command === initialCommand.smart_app_data.type) {
                    return true;
                }
                return false;
            });
            return (result && 'smart_app_data' in result ? result.smart_app_data : result);
        },
    };
})();

var excludeTags = ['A', 'AUDIO', 'BUTTON', 'INPUT', 'OPTION', 'SELECT', 'TEXTAREA', 'VIDEO'];
function inIframe() {
    try {
        return window.self !== window.parent;
    }
    catch (e) {
        return true;
    }
}
if (/[a-zA-Z]/.test('1.21.5')) {
    console.info('%cPlease use the latest version of SaluteJS Client. Your version is 1.21.5', 'color: yellow; font-size: 14px');
}
if (typeof window !== 'undefined' && inIframe()) {
    var postMessage_1 = function (action) {
        var _a;
        (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage(JSON.stringify(action), '*');
    };
    var historyBack_1 = function () {
        var prevPage = window.location.href;
        window.history.back();
        setTimeout(function () {
            // закрываем страницу, если переход назад не поменял урл
            if (window.location.href === prevPage) {
                postMessage_1({ type: 'close' });
            }
        }, 500);
    };
    window.appInitialData = [];
    window.AssistantHost = {
        sendDataContainer: function (json) {
            postMessage_1({ type: 'sendDataContainer', payload: json });
        },
        close: function () {
            postMessage_1({ type: 'close' });
        },
        sendData: function (json) {
            postMessage_1({ type: 'sendData', payload: json });
        },
        setSuggests: function (suggests) {
            postMessage_1({ type: 'setSuggests', payload: suggests });
        },
        setHints: function (hints) {
            postMessage_1({ type: 'setHints', payload: hints });
        },
        ready: function () {
            postMessage_1({ type: 'ready' });
        },
        sendText: function (message) {
            postMessage_1({ type: 'sendText', payload: message });
        },
        setHeaderButtons: function (headerButtons) {
            postMessage_1({ type: 'setHeaderButtons', payload: headerButtons });
        },
    };
    window.addEventListener('message', function (e) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        try {
            if (typeof e.data === 'string') {
                var data = JSON.parse(e.data);
                switch (data.type) {
                    case 'onBack':
                        historyBack_1();
                        break;
                    case 'onData':
                        (_b = (_a = window.AssistantClient) === null || _a === void 0 ? void 0 : _a.onData) === null || _b === void 0 ? void 0 : _b.call(_a, data.payload);
                        break;
                    case 'onRequestState': {
                        var state = (_d = (_c = window.AssistantClient) === null || _c === void 0 ? void 0 : _c.onRequestState) === null || _d === void 0 ? void 0 : _d.call(_c);
                        postMessage_1({ type: 'state', payload: state, requestId: data.requestId });
                        break;
                    }
                    case 'onRequestRecoveryState': {
                        var recoverystate = (_f = (_e = window.AssistantClient) === null || _e === void 0 ? void 0 : _e.onRequestRecoveryState) === null || _f === void 0 ? void 0 : _f.call(_e);
                        postMessage_1({ type: 'recoveryState', payload: recoverystate });
                        break;
                    }
                    case 'onStart':
                        (_h = (_g = window.AssistantClient) === null || _g === void 0 ? void 0 : _g.onStart) === null || _h === void 0 ? void 0 : _h.call(_g);
                        break;
                    default:
                        // eslint-disable-next-line no-console
                        console.error(e, 'Unknown parsed message');
                        break;
                }
            }
        }
        catch (err) {
            // eslint-disable-next-line no-console
            console.error(err, 'Unknown message');
        }
    });
    window.addEventListener('keydown', function (_a) {
        var _b, _c;
        var code = _a.code;
        switch (code) {
            case 'Enter':
                if (document.activeElement && !excludeTags.includes(document.activeElement.tagName)) {
                    (_c = (_b = document.activeElement).click) === null || _c === void 0 ? void 0 : _c.call(_b);
                }
                break;
            case 'Escape':
                historyBack_1();
                break;
        }
    });
}
var createAssistant = function (_a) {
    var _b;
    var getState = _a.getState, getRecoveryState = _a.getRecoveryState, _c = _a.ready, ready = _c === void 0 ? true : _c;
    var _d = createNanoEvents(), on = _d.on, emitOriginal = _d.emit;
    var _e = createNanoEvents(), subscribeToCommand = _e.on, emitAllCommands = _e.emit;
    var observables = new Map();
    var currentGetState = getState;
    var currentGetRecoveryState = getRecoveryState;
    var isInitialCommandsEmitted = false;
    var readyRetries = 0;
    var emitCommand = function (command) {
        if (command.type === 'smart_app_data') {
            emitOriginal('command', command.smart_app_data);
        }
        if (command.type === 'smart_app_error') {
            emitOriginal('error', command.smart_app_error);
        }
        return emitOriginal('data', command);
    };
    var cancelTts = typeof ((_b = window.AssistantHost) === null || _b === void 0 ? void 0 : _b.cancelTts) !== 'undefined'
        ? function () {
            var _a, _b;
            (_b = (_a = window.AssistantHost).cancelTts) === null || _b === void 0 ? void 0 : _b.call(_a, '');
        }
        : undefined;
    var emitAppInitialData = function () {
        if (!isInitialCommandsEmitted) {
            appInitialData.diff().forEach(function (c) { return emitCommand(c); });
            isInitialCommandsEmitted = true;
        }
    };
    var saveFirstSmartAppDataMid = function (mid) {
        // eslint-disable-next-line no-underscore-dangle
        if (typeof window.__ASSISTANT_CLIENT__.firstSmartAppDataMid === 'undefined') {
            // eslint-disable-next-line no-underscore-dangle
            window.__ASSISTANT_CLIENT__.firstSmartAppDataMid = mid;
        }
    };
    window.AssistantClient = {
        onData: function (command) {
            var _a, _b, _c, _d, _e;
            if (appInitialData.isCommitted(command)) {
                return;
            }
            emitAllCommands(command.type, command);
            if (command.type === 'smart_app_data' && (((_a = command.sdk_meta) === null || _a === void 0 ? void 0 : _a.mid) || '-1') !== '-1') {
                saveFirstSmartAppDataMid((_b = command.sdk_meta) === null || _b === void 0 ? void 0 : _b.mid);
            }
            /// фильтр команды 'назад'
            /// может приходить type='system', но в типах это не отражаем
            // @ts-ignore
            if (command.type === 'system' && ((_d = (_c = command.system) === null || _c === void 0 ? void 0 : _c.command) === null || _d === void 0 ? void 0 : _d.toUpperCase()) === 'BACK') {
                return;
            }
            if (command.type === 'tts_state_update') {
                emitOriginal('tts', {
                    state: command.state,
                    owner: command.owner,
                });
            }
            if ((command.type === 'smart_app_data' || command.type === 'smart_app_error') &&
                ((_e = command.sdk_meta) === null || _e === void 0 ? void 0 : _e.requestId) &&
                observables.has(command.sdk_meta.requestId)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                var _f = command.sdk_meta; _f.requestId; var meta = __rest(_f, ["requestId"]);
                var _g = observables.get(command.sdk_meta.requestId) || {}, requestId = _g.requestId, next = _g.next;
                if (Object.keys(meta).length > 0 || requestId) {
                    // eslint-disable-next-line camelcase
                    command.sdk_meta = __assign({}, meta);
                    if (requestId) {
                        // eslint-disable-next-line camelcase
                        command.sdk_meta = { requestId: requestId };
                    }
                }
                next === null || next === void 0 ? void 0 : next(command.type === 'smart_app_data' ? command : command);
            }
            emitCommand(command);
        },
        onRequestState: function () {
            return currentGetState();
        },
        onRequestRecoveryState: function () {
            if (currentGetRecoveryState) {
                return currentGetRecoveryState();
            }
            return undefined;
        },
        onStart: function () {
            emitOriginal('start');
            emitAppInitialData();
        },
    };
    var readyFn = function () { return __awaiter(void 0, void 0, void 0, function () {
        var firstSmartAppDataMid;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            readyRetries += 1;
            if (typeof ((_a = window.AssistantHost) === null || _a === void 0 ? void 0 : _a.ready) !== 'function') {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var _a;
                        if (readyRetries > 3) {
                            throw new Error("window.AssistantHost is not ready. The ready method has the type \"" + typeof ((_a = window.AssistantHost) === null || _a === void 0 ? void 0 : _a.ready) + "\"");
                        }
                        window.setTimeout(function () {
                            readyFn().then(resolve, reject);
                        }, 500);
                    })];
            }
            firstSmartAppDataMid = ((_c = (_b = appInitialData.get().find(function (c) {
                var _a;
                return c.type === 'smart_app_data' && (((_a = c.sdk_meta) === null || _a === void 0 ? void 0 : _a.mid) || '-1') !== '-1';
                // @ts-ignore
            })) === null || _b === void 0 ? void 0 : _b.sdk_meta) === null || _c === void 0 ? void 0 : _c.mid) || '-1';
            if (firstSmartAppDataMid !== '-1') {
                saveFirstSmartAppDataMid(firstSmartAppDataMid);
            }
            appInitialData.commit();
            window.AssistantHost.ready();
            return [2 /*return*/];
        });
    }); };
    if (ready) {
        window.setTimeout(readyFn); // таймаут для подписки на start
    }
    var sendData = function (_a, onData) {
        var _b, _c, _d;
        var action = _a.action, name = _a.name, requestId = _a.requestId;
        if ((_b = window.AssistantHost) === null || _b === void 0 ? void 0 : _b.sendDataContainer) {
            if (onData == null) {
                (_c = window.AssistantHost) === null || _c === void 0 ? void 0 : _c.sendDataContainer(
                /* eslint-disable-next-line camelcase */
                JSON.stringify({ data: action, message_name: name || '', requestId: requestId }));
                return function () { };
            }
            if (requestId && observables.has(requestId)) {
                throw new Error('requestId должен быть уникальным');
            }
            var realRequestId_1 = requestId || v4();
            var subscribe = createNanoObservable(function (_a) {
                var _b;
                var next = _a.next;
                (_b = window.AssistantHost) === null || _b === void 0 ? void 0 : _b.sendDataContainer(
                /* eslint-disable-next-line camelcase */
                JSON.stringify({ data: action, message_name: name || '', requestId: realRequestId_1 }));
                observables.set(realRequestId_1, { next: next, requestId: requestId });
            }).subscribe;
            var unsubscribe_1 = subscribe({ next: onData }).unsubscribe;
            return function () {
                unsubscribe_1();
                observables.delete(realRequestId_1);
            };
        }
        if (onData != null) {
            throw new Error('Не поддерживается в данной версии клиента');
        }
        (_d = window.AssistantHost) === null || _d === void 0 ? void 0 : _d.sendData(JSON.stringify(action), name || null);
        return function () { };
    };
    return {
        cancelTts: cancelTts,
        close: function () { var _a; return (_a = window.AssistantHost) === null || _a === void 0 ? void 0 : _a.close(); },
        getInitialData: appInitialData.pull,
        findInInitialData: appInitialData.find,
        getRecoveryState: function () { return window.appRecoveryState; },
        on: on,
        subscribeToCommand: subscribeToCommand,
        sendAction: function (action, onData, onError, _a) {
            var _b = _a === void 0 ? {} : _a, name = _b.name, requestId = _b.requestId;
            return sendData({ action: action, name: name, requestId: requestId }, function (data) {
                if (data.type === 'smart_app_data') {
                    onData === null || onData === void 0 ? void 0 : onData(data.smart_app_data);
                }
                if (data.type === 'smart_app_error') {
                    onError === null || onError === void 0 ? void 0 : onError(data.smart_app_error);
                }
            });
        },
        sendData: sendData,
        setGetState: function (nextGetState) {
            currentGetState = nextGetState;
        },
        setGetRecoveryState: function (nextGetRecoveryState) {
            currentGetRecoveryState = nextGetRecoveryState;
        },
        setSuggests: function (suggestions) {
            var _a;
            (_a = window.AssistantHost) === null || _a === void 0 ? void 0 : _a.setSuggests(JSON.stringify({ suggestions: { buttons: suggestions } }));
        },
        setHints: function (hints) {
            var _a;
            (_a = window.AssistantHost) === null || _a === void 0 ? void 0 : _a.setHints(JSON.stringify({ hints: hints }));
        },
        sendText: function (message) { var _a; return (_a = window.AssistantHost) === null || _a === void 0 ? void 0 : _a.sendText(message); },
        setHeaderButtons: function (headerButtons) {
            var _a, _b;
            if (!((_a = window.AssistantHost) === null || _a === void 0 ? void 0 : _a.setHeaderButtons)) {
                throw new Error('setHeaderButtons не поддерживается в данной версии клиента');
            }
            (_b = window.AssistantHost) === null || _b === void 0 ? void 0 : _b.setHeaderButtons(JSON.stringify(headerButtons));
        },
        ready: readyFn,
    };
};
if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-underscore-dangle
    window.__ASSISTANT_CLIENT__ = { version: '1.21.5' };
}

export { createAssistant };

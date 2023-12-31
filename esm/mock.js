import { a as createRecordOfflinePlayer } from './record-9287e14d.js';
import './common-ba25e019.js';
import './sdk-fca9cfe5.js';

// сначала создаем mock, затем вызываем createAssistant
var createAssistantHostMock = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.context, context = _c === void 0 ? window : _c;
    /* eslint-disable-next-line no-spaced-func, func-call-spacing, @typescript-eslint/no-explicit-any */
    var handlers = new Map();
    var currentResolve = null;
    var onReady;
    var handleAction = function (action, name, requestId) {
        if (!context.AssistantClient || !context.AssistantClient.onRequestState || !context.AssistantClient.onData) {
            throw new Error('Assistant not initialized');
        }
        if (currentResolve) {
            var resolve = currentResolve;
            currentResolve = null;
            resolve({
                state: context.AssistantClient.onRequestState(),
                name: name,
                action: action,
                requestId: requestId,
            });
            return;
        }
        if ('action_id' in action) {
            var actionType = action.action_id.toLowerCase();
            var handler = handlers.has(actionType) ? handlers.get(actionType) : undefined;
            if (handler != null) {
                handler(action);
            }
        }
    };
    context.AssistantHost = {
        close: function () {
            // ничего не делаем
        },
        ready: function () {
            var _a, _b;
            ((_a = window.AssistantClient) === null || _a === void 0 ? void 0 : _a.onStart) && ((_b = window.AssistantClient) === null || _b === void 0 ? void 0 : _b.onStart());
            onReady && onReady();
        },
        sendData: function (action, message) {
            handleAction(JSON.parse(action), message);
        },
        sendDataContainer: function (container) {
            var _a = JSON.parse(container), action = _a.data, name = _a.message_name, requestId = _a.requestId;
            handleAction(action, name, requestId);
        },
        setSuggests: function () {
            throw new Error('Not implemented method');
        },
        setHints: function () {
            throw new Error('Not implemented method');
        },
        sendText: function () {
            throw new Error('Not implemented method');
        },
        setHeaderButtons: function () {
            throw new Error('Not implemented method');
        },
    };
    /** Добавить обработчик клиентского экшена */
    var addActionHandler = function (actionType, handler) {
        var type = actionType.toLowerCase();
        if (handlers.has(type)) {
            throw new Error('Action-handler already exists');
        }
        handlers.set(type, handler);
    };
    /** Удалить обработчик клиентского экшена */
    var removeActionHandler = function (actionType) {
        var type = actionType.toLowerCase();
        if (handlers.has(type)) {
            handlers.delete(type);
        }
    };
    /** Вызвать обработчик команды бека */
    var receiveCommand = function (command) {
        if (!context.AssistantClient || !context.AssistantClient.onData) {
            throw new Error('Assistant not initialized');
        }
        context.AssistantClient.onData(command);
        return new Promise(function (resolve) { return setTimeout(resolve); });
    };
    /** Дождаться и вернуть клиентский экшен и его контекст */
    var waitAction = function (onAction) {
        return new Promise(function (resolve) {
            currentResolve = resolve;
            onAction && onAction();
        });
    };
    return {
        addActionHandler: addActionHandler,
        removeActionHandler: removeActionHandler,
        receiveCommand: receiveCommand,
        waitAction: waitAction,
        onReady: function (cb) {
            onReady = cb;
        },
    };
};
var createAssistantHostMockWithRecord = function (_a) {
    var _b = _a.context, context = _b === void 0 ? window : _b, record = _a.record;
    var mock = createAssistantHostMock({ context: context });
    var player = createRecordOfflinePlayer(record, { context: context });
    var hasNext = true;
    var next = function (_a) {
        var _b = _a === void 0 ? {} : _a, onRequest = _b.onRequest, _c = _b.waitRequest, waitRequest = _c === void 0 ? false : _c;
        return new Promise(function (resolve) {
            hasNext = player.continue(function (command) {
                if (!waitRequest && onRequest == null) {
                    resolve(mock.receiveCommand(command));
                    return;
                }
                return mock.waitAction(onRequest).then(function (result) {
                    // на будущее - неплохо было бы иметь эталон из записи
                    mock.receiveCommand(command);
                    resolve(result);
                });
            });
        });
    };
    return {
        get hasNext() {
            return hasNext;
        },
        onReady: mock.onReady,
        next: next,
        receiveCommand: mock.receiveCommand,
    };
};

export { createAssistantHostMock, createAssistantHostMockWithRecord };

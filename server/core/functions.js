/**
 * Core functions
 */

/**
 * log functions
 * @param message
 */
log = console.log;

/**
 * error function
 * @param message
 */
error = function (message) {
    console.log("Ошибка: " + message);
    process.exit();
};

/* Sequenced inits */
let sequencedInitStack = [];
let sequencedInitBlocked = false;

/**
 * Add to queue and try call next
 * @param initFunction {function}
 */
sequencedInit = function (initFunction) {
    sequencedInitStack.push(initFunction);
    tryInitNext();
};

let tryInitNext = function () {
    if (!sequencedInitStack.length) {
        return;
    }
    if (sequencedInitBlocked) return;
    sequencedInitBlocked = true;
    initFunction = sequencedInitStack.shift();
    initFunction(function () {
        sequencedInitBlocked = false;
        tryInitNext();
    });
};

/**
 * Динициализация\остановка системы.
 */
let deInitCallbacks = [];
addDeInitCallback = function (callback) {
    deInitCallbacks.push(callback);
};

deInitBeforeShutdown = function (callback) {
    let count;
    count = 0;
    log("Deinit callbacks is raised.");
    for (let i in deInitCallbacks) {
        deInitCallbacks[i].call(null, function () {
            count++;
        });
    }
    log("De inits completed.");
    setTimeout(callback, 1235);
};

/**
 * При вызове process.exit(), выполниться каллбэки деинициализации.
 */
process.on('exit', function () {
    log("on Exit raized!");
});

/**
 * Перехыватываем ошибки!
 */
process.on('uncaughtException', function (err) {

    if (typeof Logs === 'undefined') {
        console.log(err);
    }

    if (err.code === 'ECONNRESET') {
        return Logs.log("Skip process.exit()", Logs.LEVEL_DETAIL, err);
    }
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        return Logs.log("Skip process.exit()", Logs.LEVEL_DETAIL, err);
    }

    Logs.log("!!! ERROR HAPPENDZ !!!.", Logs.LEVEL_ERROR, err, Logs.CHANNEL_TELEGRAM);
    Logs.log("!!! ERROR HAPPENDZ !!!!.", Logs.LEVEL_ERROR, err);

    log('!!! ERROR HAPPENDZ !!!!', err, Date.now());
    // process.exit();
    //@todo check self connect
});

/**
 *
 *  Javascript string pad
 *  http://www.webtoolkit.info/
 *
 **/
let STR_PAD_LEFT = 1;
let STR_PAD_RIGHT = 2;
let STR_PAD_BOTH = 3;

str_pad = function (str, len, pad, dir) {
    if (typeof (len) == "undefined") {
        let len = 0;
    }
    if (typeof (pad) == "undefined") {
        let pad = ' ';
    }
    if (typeof (dir) == "undefined") {
        let dir = STR_PAD_RIGHT;
    }
    if (len + 1 >= str.length) {

        switch (dir) {
            case STR_PAD_LEFT:
                str = Array(len + 1 - str.length).join(pad) + str;
                break;

            case STR_PAD_BOTH:
                let right = Math.ceil((padlen = len - str.length) / 2);
                let left = padlen - right;
                str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                break;

            default:
                str = str + Array(len + 1 - str.length).join(pad);
                break;

        } // switch
    }
    return str;
};

/**
 * Возвращает время в секундах.
 */
time = function () {
    return Math.floor(mtime() / 1000);
};

/**
 * Возвращает время в миллисекундах секундах.
 */
mtime = Date.now;

serverCrypt = function (str) {
    return str.split('')
        .map(function (s, i) {
            return String.fromCharCode(s.charCodeAt() ^ DataCross.serverCryptKey + i)
        })
        .join('');
};

serverDecrypt = function (str) {
    return str.split('')
        .map(function (s, i) {
            return String.fromCharCode(s.charCodeAt() ^ DataCross.clientCryptKey + i)
        })
        .join('');
};

/**
 *
 * @param message
 */
telegramSent = function (message) {
    let HTTPS = require('https');
    let URL = require('url');
    var HttpsProxyAgent = require('https-proxy-agent');

    /**
     * @see  https://50na50.net/ru/proxy/httplist
     * token: 1194574646:AAFn2QK8b_9gR-h6FI-M6a4DCeuGmkDgMro
     * получить id чта https://api.telegram.org/bot[BOT:TOKEN]/getChat?chat_id=@mychannelname
     * отправить сообщение https://api.telegram.org/bot[BOT_API_KEY]/sendMessage?chat_id=[MY_CHANNEL_NAME]&text=[MY_MESSAGE_TEXT]
     */
    function exec(message) {
        /**
         * -1001210466099 - tri_base_log_local
         * -1001416055228 - tri_base_log_prod
         */
        let req, agent, endpoint, options;
        endpoint = "https://api.telegram.org/" +
            "bot1194574646:AAFn2QK8b_9gR-h6FI-M6a4DCeuGmkDgMro" +
            "/sendMessage?chat_id=" + Config.Telegramm.chatId +
            "&text=" + encodeURIComponent(message);
        options = URL.parse(endpoint);

        if (Config.Telegramm.agent) {
            agent = new HttpsProxyAgent(Config.Telegramm.agent);
            options.agent = agent;
        }

        req = HTTPS.get(options, function (res) {
            res.statusCode;
            res.statusMessage;
            res.on('data', function (data) {
                //console.log(data.toString());
            });
            res.on('error', function (data) {
                console.log('error telegramm', data);
            });
            req.end();
        });
    }

    exec(message);
};
var $AIM, MY = [], _AIM_ = 'AIM'+Math.floor(Math.random() * 100);

if(!document.currentScript && 
    (window['AIM'] && Object.keys(window['AIM']).length == 4 )
){ 
        $AIM = 'AIM';
} else {
    MY[_AIM_] = (document.currentScript) ? document.currentScript : document.querySelector('script[data-aim]') || false;

    $AIM = (MY[_AIM_]) ? MY[_AIM_].getAttribute('data-aim') : 'AIM';
}

$AIM = (typeof $AIM === 'string') ? $AIM.replace(/\W/g, '').toUpperCase() : 'AIM';

window[$AIM] = (function (win, doc, undefined) {
    return {
        'init': function () {},
        'activate': function () {},
        'run': function () {},
        'pageview': function () {},
        'fetch': function () {
            return {};
        },
        'version': function () { 
            return '';
        },
        'ready': function () {},
        'ondetect': function () {},
        'clear': function () {},
        'test': function () {},
        'debug': function () {},
        'tag': function () {},
        'getSessionId': function () {
            return '';
        }
    };
})(window, window.document);

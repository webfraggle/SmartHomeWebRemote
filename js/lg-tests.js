var lgtv = require("lgtv2")({
    url: 'ws://192.168.178.80:3000'
});

lgtv.on('error', function (err) {
    console.log(err);
});

lgtv.on('connect', function () {
    console.log('connected');

    lgtv.subscribe('ssap://audio/getVolume', function (err, res) {
        if (res.changed.indexOf('volume') !== -1) console.log('volume changed',res);
        if (res.changed.indexOf('muted') !== -1) console.log('mute changed', res);
    });

});

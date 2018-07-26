/*
 *通用弹窗显示
 */
// reset alert
window.alert = function (msg, callback) {
    var body = $('body'),
        box = $("<div class='dialog'></div>"),
        boxbg = $("<div class='dialog-bg'></div>"),
        boxcont = $("<div class='dialog-cont back-white back-alertcont'></div>"),
        boxhead = $('<h2 class="dialog-head"><span class="left">平台提示</span></h2>'),
        boxttext = $("<div class='alertmsg'>" + msg + "</div>"),
        boxhandle = $("<div class='alerthandle'></div>"),
        alertSure = $("<input type='button' class='btn dialog-console' value='确定' />");
    boxhead.appendTo(boxcont);
    alertSure.appendTo(boxhandle);
    boxttext.appendTo(boxcont);
    boxhandle.appendTo(boxcont);
    boxbg.appendTo(box);
    boxcont.appendTo(box);
    box.appendTo($("body")).dialog();
    alertSure.click(function () {
        setTimeout(function () {
            box.remove();
        }, 300);
        if (callback) {
            callback();
        }
    });
}

//reset confirm
window.confirm = function (msg, callback) {
    var body = $('body'),
        box = $("<div class='dialog'></div>"),
        boxbg = $("<div class='dialog-bg'></div>"),
        boxcont = $("<div class='dialog-cont back-white back-alertcont'></div>"),
        boxhead = $('<h2 class="dialog-head"><span class="left">平台提示</span></h2>'),
        boxttext = $("<div class='alertmsg'>" + msg + "</div>"),
        boxhandle = $("<div class='alerthandle'></div>"),
        alertSure = $("<input type='button' class='btn dialog-console' value='确定' />"),
        alertConsole = $("<input type='button' class='dialog-console graybtn' style='border: none;' value='取消' />");
    boxhead.appendTo(boxcont);
    alertSure.appendTo(boxhandle);
    alertConsole.appendTo(boxhandle);
    boxttext.appendTo(boxcont);
    boxhandle.appendTo(boxcont);
    boxbg.appendTo(box);
    boxcont.appendTo(box);
    box.appendTo($("body")).dialog();
    alertSure.click(function () {
        setTimeout(function () {
            box.remove();
        }, 300);
        if (callback) {
            callback();
        }
    });
}


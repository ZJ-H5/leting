/*
 *通用弹窗显示
 */
$.fn.dialog = function () {
    var dialog = $(this);
    var body = $("body");
    dialog.show();
    if (body.outerHeight() > $(window).outerHeight()) {
        var width01 = body.outerWidth();
        body.css({
            "overflow": "hidden"
        });
        var width02 = body.outerWidth();
        body.css({
            'padding-right': width02 - width01
        });
    }
    var cont = dialog.children(".dialog-cont"),
        close = dialog.find(".dialog-close,.dialog-console");
    var width = cont.outerWidth(),
        height = cont.outerHeight(),
        w = dialog.outerWidth(),
        h = dialog.outerHeight();
    cont.css({
        "left": (w - width) / 2,
        "top": (h - height) / 2,
        "opacity": 0,
        "margin-top": -30
    }).stop().animate({
        "opacity": 1,
        "margin-top": 0
    }, 300);
    close.click(function () {
        cont.stop().animate({
            "margin-top": 30
        }, 300, function () {
            cont.css("margin-top", -30);
        });
        dialog.fadeOut(300);
        body.css({
            "overflow": "auto",
            "padding-right": 0
        });
    });
    $(window).resize(resetPosition);
    function resetPosition() {
        var newHeight = cont.outerHeight(),
            newWidth = cont.outerWidth(),
            newW = dialog.outerWidth(),
            newH = dialog.outerHeight();
        if (!(newHeight == height && newWidth == width && newW == w && newH == h)) {
            cont.css({
                "left": (newW - newWidth) / 2,
                "top": (newH - newHeight) / 2
            });
        }
    }
}


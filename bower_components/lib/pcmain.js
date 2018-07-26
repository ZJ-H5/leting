$(function () {
    // var timeid=setInterval(function () {
    //     if($(".navsildar").length>0)
    //     {
    //     	clearInterval(timeid);
    //         var win=$(window).width(),
    //
    //             wih=$(window).height(),
    //             _that=$(".navsildar"),
    //             _left=$(".leftsider"),
    //
    //             _footer=$(".footer");
    //         _that.width(win-544);
    //         _left.height(wih-64);
    //
    //         _footer.width(win-235);
    //         $(window).resize(function(){
    //             win=$(window).width();
    //             wih=$(window).height();
    //             _that.width(win-544);
    //             _left.height(wih-64);
    //
    //             _footer.width(win-235);
    //         })
    //     }
    // },10)

    //弹窗


    //checkbox
    if ($('.checkbox').length > 0) {
        $('.checkbox').each(function () {
            $(this).click(function () {
                if ($(this).hasClass("check")) {
                    $(this).removeClass('check')
                } else {
                    $(this).addClass('check').siblings().removeClass('check')
                }
            })
        })
    }

})
function hopruletab(obj) {
    $('.' + obj).dialog();
}


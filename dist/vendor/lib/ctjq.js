$(function () {

    $(".arrowup").each(function () {
        $(this).on("click", function () {
            var _self = $(this).parent(),
                parent = _self.parent().siblings().find(".arrowup");
            if (!$(this).children("i").hasClass("c-xxtbtnia")) {
                $(this).children("em").html("收起");
                $(this).addClass("maincolor");
                $(this).children("i").addClass("c-xxtbtnia").removeClass("c-xxtbtnib");

            } else {
                $(this).children("em").html("展开");
                $(this).removeClass("maincolor");
                $(this).children("i").removeClass("c-xxtbtnia").addClass("c-xxtbtnib");
            }
            parent.removeClass("maincolor");
            parent.children("em").html("展开");
            parent.children("i").removeClass("c-xxtbtnia").addClass("c-xxtbtnib");
            _self.parent().siblings().find(".c-xxboxtab").hide();
            _self.next().stop(true, true).slideToggle(1000);
        })
    })


    /*checkbox*/


    $(".c-allcheacked").each(function () {
        $(this).on("click", function () {
            if (this.checked) {
                $(this).parent().siblings().find("i").addClass("c-htcboxiy").removeClass("c-htcboxin");
            } else {
                $(this).parent().siblings().find("i").addClass("c-htcboxin").removeClass("c-htcboxiy");
            }
        })
    })
})
function htcbox(obj, num) {
    if (obj.checked) {
        $(obj).parent().find("i").addClass("c-htcboxiy").removeClass("c-htcboxin");
        if (num == 1) {
            $(obj).parent().parent().find("i").addClass("c-htcboxiy").removeClass("c-htcboxin");
        }
    } else {
        if (num == 1) {
            $(obj).parent().parent().find("i").addClass("c-htcboxin").removeClass("c-htcboxiy");
        }
        $(obj).parent().find("i").addClass("c-htcboxin").removeClass("c-htcboxiy");
    }
}
window.onload = function () {
    $('#portalmask').hide(777);
    $('#colsplit').select();
};
$(function () {
    changeFrameHeight();
    window.onresize = function () {
        changeFrameHeight();
    }
    $("#accordion").accordion({
        header: "> div > h3",
        collapsible: true,
        heightStyle: "content",
        activate: function (event, ui) {
            if (ui.newHeader[0] != undefined && ui.newHeader[0].textContent == "grid") {
                $('#colsplit').select();
            }
        }
    }).sortable({
        axis: "y",
        handle: "h3",
        stop: function (event, ui) {
            ui.item.children("h3").triggerHandler("focusout");
            $(this).accordion("refresh");
        }
    });
});

function changeFrameHeight() {
    var leftbox = parent.$('.typelist');
    $('.typelist').css({"height": $(window).height() - leftbox[0].getBoundingClientRect().top});
    var rightbox = parent.$('.drag-container');
    $('.dragbox').css({"height": $(window).height() - rightbox[0].getBoundingClientRect().top -20});
}

$('.pagetitle').click(function () {
    if ($('.typelist').hasClass('sidebar-close')) {
        $('.typelist').removeClass('sidebar-close');
        $('.drag-container').css("margin-left", "400px");
        $(".main-content").css("margin-left", "");
        $('.typelist').show(100);
    } else {
        $('.typelist').addClass('sidebar-close');
        $('.drag-container').css("margin-left", "0px");
        $('.main-content').css("margin-left", "0px");
        $('.typelist').hide(100);
    }
});

$('#cleanbtn').click(function () {
    $('.dragbox').children().remove();
    $("#accordion").accordion({active: 0});
    bootbox.alert({
        message: "已清除",
        size: "small",
        callback: function () {
            setTimeout(function () {
                $('#colsplit').select();
            }, 50);
        }
    });
});

$('#savebtn').click(function () {
    bootbox.alert({
        message: "待开发",
        size: "small",
        callback: function () {
            setTimeout(function () {
            }, 50);
        }
    });
});

$('#viewbtn').click(function () {
    bootbox.alert({
        message: "待开发",
        size: "small",
        callback: function () {
            setTimeout(function () {
            }, 50);
        }
    });
});

$('#downbtn').click(function () {
    bootbox.alert({
        message: "待开发",
        size: "small",
        callback: function () {
            setTimeout(function () {
            }, 50);
        }
    });
});

$('#colsplit').bind('input propertychange', function () {
    var checknum = 0;
    var content = "";
    var colsplit = $('#colsplit').val();
    var arr = colsplit.trim().split(" ");
    for (var i = 0; i < arr.length; i++) {
        checknum += parseInt(arr[i]);
    }
    if (checknum == 12) {
        $('.component-layout .draglabel').removeAttr("disabled");
        $(".components-col .col-layout").children('*[class^="col"]').remove();
        for (var i = 0; i < arr.length; i++) {
            content += '<div class="col-sm-' + arr[i] + '" style="border :1px solid #999;min-height:65px;"></div>';
        }
        $(".components-col .col-layout").append(content);
        $(".drag-component.component-layout").draggable({
            handle: ".draglabel",
            appendTo: "body",
            helper: "clone"
        });
        dragboxdrag();
    }
});

var dragboxdrag = function () {
    $(".dragbox").droppable({
        accept: ".drag-component.component-layout",
        helper: "clone",
        activeClass: "ui-state-hover",
        drop: function (event, ui) {
            var uidraggable = $(ui.draggable);
            if (!uidraggable.hasClass("dropped")) {
                uidraggable.clone().addClass("dropped").appendTo(this);
                // if ($el.children()[1] == null || $el.children()[1].className == "row col-layout") {
                //     $('<button class="btn btn-danger btn-xs remove-link"><i class="fa fa-trash"></i>移除</button>').appendTo($el.children()[0]);
                // }
            } else {
                if ($(this)[0] != uidraggable.parent()[0]) {
                    uidraggable.clone().appendTo(this);
                    uidraggable.remove();
                }
            }
            $('.drag-container .hiddentoolbar').show();
            $(".drag-component.component-normal,.drag-component.component-formparent,.drag-component.component-btnparent").draggable({
                handle: ".draglabel",
                appendTo: "body",
                helper: "clone"
            });
            $('.component-normal .draglabel,.component-formparent .draglabel,.component-btnparent .draglabel').removeAttr("disabled");
            colcomponentdarg();
        }
    }).sortable({handle: ".draglabel"});
};

var colcomponentdarg = function () {
    $(".dragbox [class*=col-sm-]").droppable({
        accept: ".drag-component.component-normal,.drag-component.component-formparent,.drag-component.component-btnparent",
        helper: "clone",
        greedy: true,
        hoverClass: "droppable-active",
        activeClass: "ui-state-hover",
        drop: function (event, ui) {
            var uidraggable = $(ui.draggable);
            if (!uidraggable.hasClass("dropped")) {
                uidraggable.clone().addClass("dropped").appendTo(this);
            } else {
                if ($(this)[0] != uidraggable.parent()[0]) {
                    uidraggable.clone().appendTo(this);
                    uidraggable.remove();
                }
            }
            $('.drag-container .hiddentoolbar').show();
            if (uidraggable[0].className.indexOf("component-formparent") != -1) {
                $('.dragtoolbar.formbar .draglabel').removeAttr("disabled");
                $(".drag-component.component-form").draggable({
                    handle: ".draglabel",
                    appendTo: "body",
                    helper: "clone"
                });
                formcomponentdrag();
            }
            if (uidraggable[0].className.indexOf("component-btnparent") != -1) {
                $('.dragtoolbar.btnbar .draglabel').removeAttr("disabled");
                $(".drag-component.component-btn").draggable({
                    handle: ".draglabel",
                    appendTo: "body",
                    helper: "clone"
                });
                btncomponentdrag();
            }
        }
    }).sortable({handle: ".draglabel"});
}

var formcomponentdrag = function () {
    $(".dragbox .fromparent").droppable({
        accept: ".drag-component.component-form",
        helper: "clone",
        greedy: true,
        hoverClass: "droppable-active",
        activeClass: "ui-state-hover",
        drop: function (event, ui) {
            var uidraggable = $(ui.draggable);
            if (!uidraggable.hasClass("dropped")) {
                uidraggable.clone().addClass("dropped").appendTo(this);
                var id = uidraggable.children(".form-group").find(":input").attr("id");
                if (id) {
                    id = id.split("-").slice(0, -1).join("-") + "-" + (parseInt(id.split("-").slice(-1)[0]) + 1);
                    uidraggable.children(".form-group").find(":input").attr("id", id);
                    uidraggable.children(".form-group").find("label").attr("for", id);
                }
            } else {
                if ($(this)[0] != uidraggable.parent()[0]) {
                    uidraggable.clone().appendTo(this);
                    uidraggable.remove();
                }
            }
            $('.drag-container .hiddentoolbar').show();
        }
    }).sortable({handle: ".draglabel"});
}
var btncomponentdrag = function () {
    $(".dragbox .btnparent").droppable({
        accept: ".drag-component.component-btn",
        helper: "clone",
        greedy: true,
        hoverClass: "droppable-active",
        activeClass: "ui-state-hover",
        drop: function (event, ui) {
            var uidraggable = $(ui.draggable);
            if (!uidraggable.hasClass("dropped")) {
                uidraggable.clone().addClass("dropped").appendTo(this);
            } else {
                if ($(this)[0] != uidraggable.parent()[0]) {
                    uidraggable.clone().appendTo(this);
                    uidraggable.remove();
                }
            }
            $('.drag-container .hiddentoolbar').show();
        }
    }).sortable({handle: ".draglabel"});
}

$(document).on("click", ".remove-link", function () {
    $(this).parent().parent().remove();
});
console.log("有问题联系: %c774669939@qq.com\n%cPowered By %c7c","color:#0099FF","color:#000","color:#990099");
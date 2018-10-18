window.onload = function () {
    // setTimeout(function () {
    $('#portalmask').hide(700);
    // }, 500);
};
$(function () {
    changeFrameHeight();
    window.onresize = function () {
        changeFrameHeight();
    }
    $("#accordion").accordion({
        header: "> div > h3",
        collapsible: true,
        heightStyle: "content"
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
    var box = parent.$('.dragbox');
    $('.dragbox').css({"min-height": $(window).height() - box[0].getBoundingClientRect().top - 10});
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
    bootbox.alert({
        message: "待开发",
        size: "small",
        callback: function () {
            setTimeout(function () {
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
        hoverClass: "droppable-active",
        drop: function (event, ui) {
            var uidraggable = $(ui.draggable);
            if (!uidraggable.hasClass("dropped")) {
                uidraggable.clone().addClass("dropped").css({
                    "position": "static",
                    "left": null,
                    "right": null
                }).appendTo(this);
                // if ($el.children()[1] == null || $el.children()[1].className == "row col-layout") {
                //     $('<button class="btn btn-danger btn-xs remove-link"><i class="fa fa-trash"></i>移除</button>').appendTo($el.children()[0]);
                // }
            } else {
                if ($(this)[0] != uidraggable.parent()[0]) {
                    uidraggable.clone().css({
                        "position": "static",
                        "left": null,
                        "right": null
                    }).appendTo(this);
                    uidraggable.remove();
                }
            }
            $('.drag-container .hiddentoolbar').show();
            $(".drag-component.component-button").draggable({
                handle: ".draglabel",
                appendTo: "body",
                helper: "clone"
            });
            colcomponentdarg();
        }
    }).sortable();
};

var colcomponentdarg = function () {
    $("[class*=col-sm-]").droppable({
        accept: ".drag-component.component-button",
        helper: "clone",
        greedy: true,
        hoverClass: "droppable-active",
        drop: function (event, ui) {
            var uidraggable = $(ui.draggable);
            if (!uidraggable.hasClass("dropped")) {
                uidraggable.clone().addClass("dropped").css({
                    "position": "static",
                    "left": null,
                    "right": null,
                    "width": "auto"
                }).appendTo(this);
            } else {
                if ($(this)[0] != uidraggable.parent()[0]) {
                    uidraggable.clone().css({
                        "position": "static",
                        "left": null,
                        "right": null
                    }).appendTo(this);
                    uidraggable.remove();
                }
            }
            $('.drag-container .hiddentoolbar').show();
        }
    }).sortable();
}

$(document).on("click", ".remove-link", function () {
    $(this).parent().parent().parent().remove();
});
window.onload = function () {
    $('#portalmask').hide(777);
    $('#colsplit').select();
};

$(function () {
    bootbox.setLocale("zh_CN");
    changeFrameHeight();
    window.onresize = function () {
        changeFrameHeight();
    };
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
        handle: ".ui-accordion-header",
        stop: function (event, ui) {
            ui.item.children("h3").triggerHandler("focusout");
            $(this).accordion("refresh");
        }
    });
    $('.modal-body').find('input').bind('keydown', function (event) {
        if (event.keyCode == "13") {
            $('#updateContent').click();
        }
        if (event.ctrlKey == true && event.keyCode == "83") {
            event.preventDefault();
            $('#updateCode').click();
        }
    });
});

function changeFrameHeight() {
    var leftbox = parent.$('.typelist');
    $('.typelist').css({"height": $(window).height() - leftbox[0].getBoundingClientRect().top});
    var rightbox = parent.$('.drag-container');
    $('.dragbox').css({"height": $(window).height() - rightbox[0].getBoundingClientRect().top - 20});
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
    var code = $('.dragbox').clone();
    code.find('.dragtoolbar').remove();
    code.find('.drag-component').addClass('viewcode');
    code.find('.component-row').addClass('viewcode');
    code.find('.component-parentblock').addClass('viewcode');
    code.find('.codeblock').addClass('viewcode');

    code.find('.codeblock.viewcode').each(function () {
        $(this).parent().append($(this).children().html());
    });
    code.find('.view-child.viewcode').each(function () {
        $(this).parent().append($(this).children().html().replace(/[\r\n]/g, "").replace(/(^\s*)|(\s*$)/g, ""));
    });
    code.find('.view-parent.viewcode').each(function () {
        if ($(this).children()[0].className.indexOf("form-horizontal") != -1) {
            $(this).parent().append($(this).children()[0].outerHTML);
        } else {
            $(this).parent().append($(this).children().html().replace(/[\r\n]/g, "").replace(/(^\s*)|(\s*$)/g, ""));
        }
    });
    code.find('.component-row.viewcode').each(function () {
        $(this).parent().append($(this).children().html());
    });
    code.find('.component-layout.viewcode').each(function () {
        $(this).parent().append($(this).children().html());
    });
    code.find(".viewcode").remove();

    $.each(["col-layout", "ui-droppable", "ui-sortable", "fromparent", "btnparent"],
        function (i, c) {
            code.find("." + c).removeClass(c).removeAttr("style");
        }
    );

    console.log(html_beautify(code.html()));

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
                var dropedui = uidraggable.clone();
                dropedui.addClass("dropped").appendTo(this);
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
};

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
                var dropedui = uidraggable.clone();
                dropedui.addClass("dropped").appendTo(this);
                var id = uidraggable.children(".form-group").find(":input").attr("id");
                if (id) {
                    id = id.split("-").slice(0, -1).join("-") + "-" + (parseInt(id.split("-").slice(-1)[0]) + 1);
                    uidraggable.children(".form-group").find(":input").attr("id", id);
                    uidraggable.children(".form-group").find("label").attr("for", id);
                }
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
    }).sortable({handle: ".draglabel"});
};

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
                var dropedui = uidraggable.clone();
                dropedui.addClass("dropped").appendTo(this);
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
    }).sortable({handle: ".draglabel", axis: "x"});
};

$(document).on("click", ".remove-link", function () {
    $(this).parent().parent().remove();
});

var operation;
$(document).on("click", ".edit-link", function () {
    operation = $(this).parent().parent();
    $('#codeModal').modal('show');
    $('#codeModalLabel').html('编辑');
    if (operation.find('.codeblock').children()[0].className == "form-group") {
        $('.modal-body').find('input').val(operation.find('label')[0].innerHTML);
    } else {
        $('.modal-body').find('input').val(operation.find('.codeblock').children()[0].innerHTML);
    }
    $('.modal-body').find('textarea').val(html_beautify(operation.find('.codeblock').html()));

    setTimeout(function () {
        $('.modal-body').find('input').select();
    }, 500);
});

$('#updateContent').on("click", function () {
    var copycontent = operation.clone();
    if (copycontent.find('.codeblock').children()[0].className == "form-group") {
        copycontent.find('label')[0].innerHTML = $('.modal-body').find('input').val();
    } else {
        copycontent.find('.codeblock').children()[0].innerHTML = $('.modal-body').find('input').val();
    }
    $('.modal-body').find('textarea').val(html_beautify(copycontent.find('.codeblock').html()));
    $('.modal-body').find('input').select();
});

$(document).on("click", "#hsize .dropdown-menu a", function () {
    $(this).parent().parent().find("li").removeClass("active");
    $(this).parent().addClass("active");
    var elementobj = $(this).parent().parent().parent().parent().parent();
    var elementval = $(this).attr("rel");
    var hh = $(elementval).html(elementobj.find('.codeblock')[0].innerText.replace(/[\r\n]/g, ""));
    elementobj.find('.codeblock').prop('innerHTML', hh.prop('outerHTML'));
});

$(document).on("click", ".changeclass .dropdown-menu a", function () {
    $(this).parent().parent().find("li").removeClass("active");
    $(this).parent().addClass("active");
    var elementobj = $(this).parent().parent().parent().parent().parent();
    var elementval = $(this).attr("rel");
    var classes = "";
    $(this).parent().parent().find("a").each(function () {
        classes += $(this).attr("rel") + " "
    });
    if (elementobj[0].className.indexOf("view-parent") != -1) {
        elementobj.find('.component-parentblock').children().removeClass(classes);
        elementobj.find('.component-parentblock').children().addClass(elementval);
    } else {
        elementobj.find('.codeblock').children().removeClass(classes);
        elementobj.find('.codeblock').children().addClass(elementval);
    }
});

$('#updateCode').on("click", function () {
    operation.find('.codeblock').html($('.modal-body').find('textarea').val());
    $('#codeModal').modal('hide');
});

console.log("有问题联系: %c774669939@qq.com\n%cPowered By %c7c", "color:#0099FF", "color:#000", "color:#990099");
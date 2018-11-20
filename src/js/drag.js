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
    if (localStorage.getItem("dragcode") != "") {
        $('.dragbox').html(localStorage.getItem("dragcode"));
    }
    $('#headcode').val(localStorage.getItem("headcode"));
    $('#footcode').val(localStorage.getItem("footcode"));
    $(document).keydown(function (event) {
        if ($('.bootbox').hasClass('in')) {
            event.preventDefault();
            return;
        }
        if (event.ctrlKey == true && event.keyCode == "81") {
            event.preventDefault();
            $('#cleanbtn').click();
        }
        if (event.ctrlKey == true && event.keyCode == "83") {
            event.preventDefault();
            $('#savebtn').click();
        }
        if (event.ctrlKey == true && event.keyCode == "80") {
            event.preventDefault();
            $('#previewbtn').click();
        }
        if (event.ctrlKey == true && event.keyCode == "70") {
            event.preventDefault();
            $('#viewbtn').click();
        }
        if (event.ctrlKey == true && event.keyCode == "68") {
            event.preventDefault();
            $('#downbtn').click();
        }
        if (event.altKey == true && event.keyCode == "67") {
            $('#codeModal').modal('hide');
        }
    });
    $('#updatetext').bind('keydown', function (event) {
        if (event.keyCode == "13") {
            $('#updateContent').click();
        }
        if (event.altKey == true && event.keyCode == "83") {
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
    bootbox.confirm({
        title: "清除",
        message: "是否确认清除",
        size: 'small',
        buttons: {
            cancel: {
                className: 'btn-danger',
                label: '<i class="fa fa-times"></i>否'
            },
            confirm: {
                className: 'btn-success',
                label: '<i class="fa fa-check"></i>是'
            }
        },
        callback: function (result) {
            if (result) {
                $('.dragbox').children().remove();
                $("#accordion").accordion({active: 0});
                setTimeout(function () {
                    $('#colsplit').select();
                }, 50);
            }
        }
    });
});

$('#savebtn').click(function () {
    localsave("dragcode", $('.dragbox').clone().html());
});

$('#previewbtn').click(function () {
    if ($('body').hasClass('preview')) {
        $('body').removeClass('preview');
        $('.typelist').removeClass('sidebar-close');
        $('.drag-container').css("margin-left", "400px");
        $(".main-content").css("margin-left", "");
        $('.typelist').show();
    } else {
        $('body').addClass('preview');
        $('.typelist').addClass('sidebar-close');
        $('.drag-container').css("margin-left", "0px");
        $('.main-content').css("margin-left", "0px");
        $('.typelist').hide();
    }
});

$('#viewbtn').click(function () {
    $('#codeModal').modal('show');
    $('#codeModalLabel').html('查看');
    $('#codeModal').find('.input-group').hide();
    $('#updateCode').hide();
    $('#headcode,#footcode,#downloadCode').hide();
    $('#codeModal').find('.form-inline').hide();
    $('#bodycode').css({"min-height": "568px"});
    $('#bodycode').val(viewcode());
    setTimeout(function () {
        $('#bodycode').select();
    }, 500);
});

$('#downbtn').click(function () {
    $('#codeModal').modal('show');
    $('#codeModalLabel').html('下载');
    $('#headcode,#footcode,#downloadCode').show();
    $('#codeModal').find('.form-inline').show();
    $('#headcode').css({"min-height": "128px"});
    $('#bodycode').css({"min-height": "368px"});
    $('#footcode').css({"min-height": "98px"});
    $('#codeModal').find('.input-group').hide();
    $('#updateCode').hide();
    $('#bodycode').css({"min-height": "268px"});
    $('#bodycode').val(viewcode());
    setTimeout(function () {
        $('#filename').select();
    }, 500);
});

$('#savehead').click(function () {
    localsave("headcode", $('#headcode').val());
});

$('#savefoot').click(function () {
    localsave("footcode", $('#footcode').val());
});

function localsave(item, content) {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem(item, html_beautify(content));
    } else {
        bootbox.alert({
            message: "浏览器不支持",
            size: "small"
        });
        return;
    }
    bootbox.dialog({
        message: '<div class="text-center">已暂存至浏览器缓存</div>',
        size: 'small'
    });
    setTimeout(function () {
        bootbox.hideAll();
    }, 1000);
}

$('#downloadCode').click(function () {
    var filename = $('#filename').val();
    var filetype = $('#filetype').val();
    if (filename == "" || filename == null) {
        bootbox.alert({
            message: "请输入文件名",
            size: "small",
            callback: function () {
                setTimeout(function () {
                    $('#filename').select();
                }, 500);
            }
        });
        return;
    }
    var content = $('#headcode').val() + $('#bodycode').val() + $('#footcode').val();
    download(filename, filetype, html_beautify(content));
});

function download(filename, filetype, content) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename + '.' + filetype);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function viewcode() {
    var code = $('.dragbox').clone();
    code.find('.dragtoolbar').remove();
    code.find('.easyuidisplay').remove();
    code.find('.drag-component').addClass('viewcode');
    code.find('.component-row').addClass('viewcode');
    code.find('.codeblock').addClass('viewcode');

    code.find('.codeblock.viewcode').each(function () {
        var classname = $(this).find('.easyui').attr("rel");
        $(this).find('.easyui').removeAttr("rel").removeClass("easyui").addClass(classname);
        $(this).parent().append($(this).html());
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
    code.find('[contenteditable]').removeAttr("contenteditable");
    return html_beautify(code.html());
}

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
        activeClass: "droppable-hover",
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
        activeClass: "droppable-hover",
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
        activeClass: "droppable-hover",
        drop: function (event, ui) {
            var uidraggable = $(ui.draggable);
            if (!uidraggable.hasClass("dropped")) {
                var dropedui = uidraggable.clone();
                dropedui.addClass("dropped").appendTo(this);
                var id = uidraggable.find(".form-group").find(":input").attr("id");
                if (id) {
                    id = id.split("-").slice(0, -1).join("-") + "-" + (parseInt(id.split("-").slice(-1)[0]) + 1);
                    uidraggable.find(".form-group").find(":input").attr("id", id);
                    uidraggable.find(".form-group").find("label").attr("for", id);
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
        activeClass: "droppable-hover",
        drop: function (event, ui) {
            var uidraggable = $(ui.draggable);
            if (!uidraggable.hasClass("dropped")) {
                var dropedui = uidraggable.clone();
                dropedui.addClass("dropped").appendTo(this);
                var id = uidraggable.find(".form-group").find(":input").attr("id");
                if (id) {
                    id = id.split("-").slice(0, -1).join("-") + "-" + (parseInt(id.split("-").slice(-1)[0]) + 1);
                    uidraggable.find(".form-group").find(":input").attr("id", id);
                    uidraggable.find(".form-group").find("label").attr("for", id);
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
    }).sortable({handle: ".draglabel", axis: "x"});
};

$(document).on("click", ".remove-link", function () {
    $(this).parent().parent().remove();
});

var operation;
$(document).on("click", ".edit-link", function () {
    operation = $(this).parent().parent();
    operation.find('[contenteditable]').removeAttr("contenteditable");
    $('#codeModal').modal('show');
    $('#codeModalLabel').html('编辑');
    $('#codeModal').find('.input-group').show();
    $('#updatetext').val('');
    $('#bodycode').val('');
    $('#updateCode').show();
    $('#headcode,#footcode,#downloadCode').hide();
    $('#codeModal').find('.form-inline').hide();
    $('#bodycode').css({"min-height": "268px"});
    if (operation.find('.codeblock').children()[0].className == "form-group") {
        if (operation.find('.codeblock').hasClass("easyuicode")) {
            $('#updatetext').val(operation.find('label')[0].innerHTML);
            var easyuicode = operation.clone().find('.easyuicode');
            var classname = operation.clone().find('.easyui').attr("rel");
            easyuicode.find('.easyui').removeAttr("rel").removeClass("easyui").addClass(classname);
            $('#bodycode').val(html_beautify(easyuicode.html()));
        } else {
            $('#updatetext').val(operation.find('label')[0].innerHTML);
            $('#bodycode').val(html_beautify(operation.find('.codeblock').html().replace(/[\r\n]/g, "")));
        }
    } else if (operation.find('.codeblock').hasClass("easyuicode")) {
        $('#updatetext').attr('placeholder', "暂时不提供更新，可对文本直接操作");
        var easyuicode = operation.clone().find('.easyuicode');
        var classname = operation.clone().find('.easyui').attr("rel");
        easyuicode.find('.easyui').removeAttr("rel").removeClass("easyui").addClass(classname);
        $('#bodycode').val(html_beautify(easyuicode.html()));
    } else {
        $('#updatetext').val(operation.find('.codeblock').children()[0].innerHTML);
        $('#bodycode').val(html_beautify(operation.find('.codeblock').html().replace(/[\r\n]/g, "")));
    }
    setTimeout(function () {
        $('#updatetext').select();
    }, 500);
});

$('#updateContent').on("click", function () {
    var copycontent = operation.clone();
    if (copycontent.find('.codeblock').children()[0].className == "form-group") {
        if (operation.find('.codeblock').hasClass("easyuicode")) {
            var easyuicode = copycontent.find('.easyuicode');
            var classname = copycontent.find('.easyui').attr("rel");
            easyuicode.find('.easyui').removeAttr("rel").removeClass("easyui").addClass(classname);
            easyuicode.find('label')[0].innerHTML = $('#updatetext').val();
            $('#bodycode').val(html_beautify(easyuicode.html()));
        } else {
            copycontent.find('label')[0].innerHTML = $('#updatetext').val();
            $('#bodycode').val(html_beautify(copycontent.find('.codeblock').html()));
        }
    } else if (copycontent.find('.codeblock').children()[0].className == "easyui") {
        bootbox.dialog({
            message: '<div class="text-center">暂时不提供更新，可对文本直接操作</div>',
            size: 'small'
        });
        setTimeout(function () {
            bootbox.hideAll();
        }, 1000);
    } else {
        copycontent.find('.codeblock').children()[0].innerHTML = $('#updatetext').val();
        $('#bodycode').val(html_beautify(copycontent.find('.codeblock').html()));
    }
    $('#updatetext').select();
});

$('#updateCode').on("click", function () {
    if (operation.find('.codeblock').hasClass('easyuicode')) {
        var newcode = $('#bodycode').val();
        operation.find('.easyuidisplay').children().remove();
        operation.find('.easyuidisplay').html(html_beautify(newcode));
        $.parser.parse(operation.find('.easyuidisplay'));
        operation.find('.easyuicode').children().remove();
        operation.find('.easyuicode').html(html_beautify(newcode));
    } else {
        operation.find('.codeblock').html($('#bodycode').val());
    }
    $('#codeModal').modal('hide');
});

$(document).on("click", "#hsize .dropdown-menu a", function () {
    $(this).parent().parent().find("li").removeClass("active");
    $(this).parent().addClass("active");
    var elementobj = $(this).parent().parent().parent().parent().parent();
    var elementval = $(this).attr("rel");
    var hh = $(elementval).html(elementobj.find('.codeblock')[0].innerText.replace(/[\r\n]/g, ""));
    hh.addClass("fontbold");
    hh.attr("contenteditable", "true");
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

console.log("有问题联系: %c774669939@qq.com\n%cPowered By %c7c", "color:#0099FF", "color:#000", "color:#990099");
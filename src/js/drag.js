window.onload = function () {
    $('#portalmask').hide(777);//遮罩隐藏
    $('#colsplit').select();//焦点
};

$(function () {
    bootbox.setLocale("zh_CN");//弹框
    $('[data-toggle="tooltip"]').tooltip();//tip初始化
    changeFrameHeight();//拖拽区自适应
    window.onresize = function () {
        changeFrameHeight();
    };
    //组件区初始化
    $("#accordion").accordion({
        header: "> div > h3",
        collapsible: true,
        heightStyle: "content",
        activate: function (event, ui) {
            if (ui.newHeader[0] != undefined && ui.newHeader[0].textContent == "grid") {
                $('#colsplit').select();
            }
        }
    }).sortable({//组件拖拽排序
        axis: "y",
        handle: ".ui-accordion-header",
        stop: function (event, ui) {
            ui.item.children("h3").triggerHandler("focusout");
            $(this).accordion("refresh");
        }
    });

    //客户端缓存加载
    if (localStorage.getItem("dragcode") != "") {
        $('.dragbox').html(localStorage.getItem("dragcode"));
    }
    $('#headcode').val(localStorage.getItem("headcode"));
    $('#footcode').val(localStorage.getItem("footcode"));

    //快捷键
    $(document).keydown(function (event) {
        //防止重复弹框
        if ($('.bootbox').hasClass('in')) {
            event.preventDefault();
            return;
        }
        //ctrl q 清除代码
        if (event.ctrlKey == true && event.keyCode == "81") {
            event.preventDefault();
            $('#cleanbtn').click();
        }
        //ctrl s 暂存代码
        if (event.ctrlKey == true && event.keyCode == "83") {
            event.preventDefault();
            $('#savebtn').click();
        }
        //ctrl p 预览
        if (event.ctrlKey == true && event.keyCode == "80") {
            event.preventDefault();
            $('#previewbtn').click();
        }
        //ctrl f 查看代码
        if (event.ctrlKey == true && event.keyCode == "70") {
            event.preventDefault();
            $('#viewbtn').click();
        }
        //ctrl d 下载代码
        if (event.ctrlKey == true && event.keyCode == "68") {
            event.preventDefault();
            $('#downbtn').click();
        }
        //alt c 关闭modal
        if (event.altKey == true && event.keyCode == "67") {
            $('#codeModal').modal('hide');
        }
    });
    //焦点在更新框中 enter更新代码，alt s 更新页面
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


//高度自适应
function changeFrameHeight() {
    var leftbox = parent.$('.typelist');
    $('.typelist').css({"height": $(window).height() - leftbox[0].getBoundingClientRect().top});
    var rightbox = parent.$('.drag-container');
    $('.dragbox').css({"height": $(window).height() - rightbox[0].getBoundingClientRect().top - 20});
}

//组件区隐藏、显示
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

//清空代码
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
                localStorage.removeItem('dragcode');//清除代码时清除缓存
                //激活组件区第一个分类
                $("#accordion").accordion({active: 0});
                setTimeout(function () {
                    $('#colsplit').select();
                }, 50);
            }
        }
    });
});

//客户端缓存
$('#savebtn').click(function () {
    localsave("dragcode", $('.dragbox').clone().html());
});

//预览
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

//查看代码
$('#viewbtn').click(function () {
    //打开modal
    $('#codeModal').modal('show');
    $('.editmore').css("display", "none");
    $('#codeModalLabel').html('查看');
    $('#codeModal').find('.input-group').hide();
    $('#updateCode').hide();
    $('#headcode,#footcode,#downloadCode').hide();
    $('#codeModal').find('.form-inline').hide();
    $('#bodycode').css({"min-height": "568px"});
    //加载代码
    $('#bodycode').val(viewcode());
    setTimeout(function () {
        $('#bodycode').select();
    }, 500);
});

//代码下载
$('#downbtn').click(function () {
    $('#codeModal').modal('show');
    $('.editmore').css("display", "none");
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

//下载框 缓存头部
$('#savehead').click(function () {
    localsave("headcode", $('#headcode').val());
});

//下载框 缓存尾部
$('#savefoot').click(function () {
    localsave("footcode", $('#footcode').val());
});

//客户端缓存base function
function localsave(item, content) {
    //判断浏览器是否支持
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

//下载按钮点击事件
$('#downloadCode').click(function () {
    //校验
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
    //文件内容
    var content = $('#headcode').val() + $('#bodycode').val() + $('#footcode').val();
    //使用download下载
    download(filename, filetype, html_beautify(content));
});

//下载 base function
function download(filename, filetype, content) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename + '.' + filetype);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

//查看代码
function viewcode() {
    //获取拖拽区所有代码
    var code = $('.dragbox').clone();
    //清除编辑按钮等代码
    code.find('.dragtoolbar').remove();
    code.find('.easyuidisplay').remove();
    //标记代码
    code.find('.drag-component').addClass('viewcode');
    code.find('.component-row').addClass('viewcode');
    code.find('.codeblock').addClass('viewcode');
    //从最最叶子节点至根节点层层逐级将代码移至当前层外层
    code.find('.codeblock.viewcode').each(function () {
        var classname = $(this).find('.easyui').attr("rel");
        $(this).find('.easyui').removeAttr("rel").removeClass("easyui").addClass(classname);
        $(this).parent().append($(this).html());
    });
    code.find('.view-child.viewcode').each(function () {
        $(this).parent().append($(this).children().html().replace(/[\r\n]/g, "").replace(/(^\s*)|(\s*$)/g, ""));
    });
    //处理form块
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
    //移除class及样式
    $.each(["col-layout", "ui-droppable", "ui-sortable", "fromparent", "btnparent", "fast-edit"],
        function (i, c) {
            code.find("." + c).removeClass(c).removeAttr("style");
        }
    );
    //移除html点击编辑功能
    code.find('[contenteditable]').removeAttr("contenteditable");
    code.find('[data-icon]').removeAttr("data-icon");
    code.find('[data-color]').removeAttr("data-color");
    //将处理后的代码格式化
    return html_beautify(code.html());
}

//row布局
$('#colsplit').bind('input propertychange', function () {
    var checknum = 0;
    var content = "";
    var colsplit = $('#colsplit').val();
    //以空格分隔 计算是否为12
    var arr = colsplit.trim().split(" ");
    for (var i = 0; i < arr.length; i++) {
        checknum += parseInt(arr[i]);
    }
    //根据输入生成布局 激活拖拽
    if (checknum == 12) {
        $('.component-layout .draglabel').removeAttr("disabled");
        $(".components-col .col-layout").children('*[class^="col"]').remove();
        for (var i = 0; i < arr.length; i++) {
            content += '<div class="col-sm-' + arr[i] + '" style="border :1px solid #999;min-height:65px;"></div>';
        }
        $(".components-col .col-layout").append(content);
        //layout可拖拽
        $(".drag-component.component-layout").draggable({
            handle: ".draglabel",
            appendTo: "body",
            helper: "clone"
        });
        //激活布局拖拽功能
        dragboxdrag();
    }
});

//.dragbox放置
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
            //激活可放置组件
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

//布局内放置
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
            //激活可放置组件 form块
            if (uidraggable[0].className.indexOf("component-formparent") != -1) {
                $('.dragtoolbar.formbar .draglabel').removeAttr("disabled");
                $(".drag-component.component-form").draggable({
                    handle: ".draglabel",
                    appendTo: "body",
                    helper: "clone"
                });
                formcomponentdrag();
            }
            //激活可放置组件 button块
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

//form块放置
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
                //处理form中id
                if (!uidraggable.find(".codeblock").hasClass("inputcheckbox")) {
                    var id = uidraggable.find(".codeblock").find(":input").attr("id");
                    var name = uidraggable.find(".codeblock").find(":input").attr("name");
                    if (id) {
                        id = id.split("-").slice(0, -1).join("-") + "-" + (parseInt(id.split("-").slice(-1)[0]) + 1);
                        uidraggable.find(".codeblock").find(":input").attr("id", id);
                        uidraggable.find(".codeblock").find("label").attr("for", id);
                    }
                    if (name) {
                        name = name.split("-").slice(0, -1).join("-") + "-" + (parseInt(name.split("-").slice(-1)[0]) + 1);
                        uidraggable.find(".codeblock").find(":input").attr("name", name);
                    }
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

//button块放置
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
                var id = uidraggable.find(".codeblock").find(":input").attr("id");
                var name = uidraggable.find(".codeblock").find(":input").attr("name");
                if (id) {
                    id = id.split("-").slice(0, -1).join("-") + "-" + (parseInt(id.split("-").slice(-1)[0]) + 1);
                    uidraggable.find(".codeblock").find(":input").attr("id", id);
                    uidraggable.find(".codeblock").find("label").attr("for", id);
                }
                if (name) {
                    name = name.split("-").slice(0, -1).join("-") + "-" + (parseInt(name.split("-").slice(-1)[0]) + 1);
                    uidraggable.find(".codeblock").find(":input").attr("name", name);
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

//移除代码
$(document).on("click", ".remove-link", function () {
    $(this).parent().parent().remove();
});

var operation;//获取编辑父级代码块
var editelementlabel;//属性标签
var editelementattr;//类型区分 属性自动加载

var inputlabel = "input,textarea";
var inputattr = ["id", "name", "placeholder", "data-options"];//input、textarea定义的加载属性
//编辑代码
$(document).on("click", ".edit-link", function () {
    operation = $(this).parent().parent();
    // operation.find('[contenteditable]').removeAttr("contenteditable");
    $('#codeModal').modal('show');
    $('.editmore').css("display", "block");
    $('#codeModalLabel').html('编辑');
    $('#codeModal').find('.input-group').show();
    $('#updatetext').val('');
    $('#bodycode').val('');
    $('#updateCode').show();
    $('#headcode,#footcode,#downloadCode').hide();
    $('#codeModal').find('.form-inline').hide();
    $('#bodycode').css({"min-height": "268px"});
    // var codechildname = operation.find('.codeblock').children()[0].className;
    // if (codechildname == "form-group" || codechildname == "element-inline" || codechildname == "row-inline-item") {
    //     if (operation.find('.codeblock').hasClass("easyuicode")) {
    //         $('#updatetext').val(operation.find('label')[0].innerHTML);
    //         var easyuicode = operation.clone().find('.easyuicode');
    //         var classname = operation.clone().find('.easyui').attr("rel");
    //         easyuicode.find('.easyui').removeAttr("rel").removeClass("easyui").addClass(classname);
    //         $('#bodycode').val(html_beautify(easyuicode.html()));
    //     } else {
    //         if (operation.find('label')[0] == undefined) {
    //             $('#updatetext').val(operation.find('.inline-input').children()[0].innerHTML);
    //         } else {
    //             $('#updatetext').val(operation.find('label')[0].innerHTML);
    //         }
    //         $('#bodycode').val(html_beautify(operation.find('.codeblock').html().replace(/[\r\n]/g, "")));
    //     }
    // } else if (operation.find('.codeblock').hasClass("easyuicode")) {
    //     $('#updatetext').attr('placeholder', "暂时不提供更新，可对文本直接操作");
    //     var easyuicode = operation.clone().find('.easyuicode');
    //     var classname = operation.clone().find('.easyui').attr("rel");
    //     easyuicode.find('.easyui').removeAttr("rel").removeClass("easyui").addClass(classname);
    //     $('#bodycode').val(html_beautify(easyuicode.html()));
    // } else {
    //     $('#updatetext').val(operation.find('.codeblock').children()[0].innerHTML);
    //     $('#bodycode').val(html_beautify(operation.find('.codeblock').html().replace(/[\r\n]/g, "")));
    // }
    //添加一个class取代上面code
    //快速编辑属性类 fast-edit
    if (operation.find('.fast-edit')[0] == undefined) {
        $('#updatetext').attr('placeholder', "组件未设置快速修改");
    } else {
        $('#updatetext').val(operation.find('.fast-edit')[0].innerHTML);
    }
    //处理easyui组件
    var displaycode = operation.clone().find('.codeblock');
    if (operation.find('.codeblock').hasClass("easyuicode")) {
        var classname = operation.clone().find('.easyui').attr("rel");
        displaycode.find('.easyui').removeAttr("rel").removeClass("easyui").addClass(classname);
        $('#bodycode').val(html_beautify(displaycode.html()));
    } else {
        displaycode.find('.fast-edit');
        $('#bodycode').val(html_beautify(displaycode.html().replace(/[\r\n]/g, "")));
    }

    //--------------------抽取codeblock 可编辑 属性-------------------
    //清空属性列表
    $(".attrlist").children().remove();
    $(".attrlist").html("");
    var attrcontent = "";//属性加载代码块
    //判断编辑的组件
    if (operation.find('.codeblock').hasClass("inputtextarea")) {
        editelementlabel = inputlabel;
        editelementattr = inputattr;
        $.each(editelementattr,
            function (i, c) {
                if (displaycode.find(editelementlabel).attr(c)) {
                    attrcontent +=
                        '<div class="form-group">' +
                        '<label>' + c + '</label>' +
                        '<input class="form-control" id="dcode-' + c + '" value="' + displaycode.find(editelementlabel).attr(c) + '">' +
                        '</div>';
                }
            }
        );
    } else if (operation.find('.codeblock').hasClass("inputifa")) {
        editelementlabel = inputlabel;
        editelementattr = inputattr;
        $.each(editelementattr,
            function (i, c) {
                if (displaycode.find(editelementlabel).attr(c)) {
                    attrcontent +=
                        '<div class="form-group">' +
                        '<label>' + c + '</label>' +
                        '<input class="form-control" id="dcode-' + c + '" value="' + displaycode.find(editelementlabel).attr(c) + '">' +
                        '</div>';
                }
            }
        );
        attrcontent = attrcontent +
            '<div class="form-group">' +
            '<label>图标&emsp;<i class="fa ' + displaycode.find(".input-icon > i").data("icon") + '"></i></label>' +
            '<input class="form-control" id="dcode-icon" value="' + displaycode.find(".input-icon > i").data("icon") + '">' +
            '</div>' +
            '<div class="form-group">' +
            '<label>图标<i class="' + displaycode.find(".input-icon > i").data("color") + '">颜色</i></label>' +
            '<input class="form-control" id="dcode-iconcolor" value="' + displaycode.find(".input-icon > i").data("color") + '">' +
            '</div>';

    } else if (operation.find(".codeblock").hasClass("inputcheckbox")) {
        attrcontent += '<button type="button" class="btn btn-success" id="">添加项目</button><br><ul class="checkboxsortable">';
        operation.find(".checkboxedit .checkbox-inline").each(function () {
            attrcontent +=
                '<li class="">' +
                'id <input class="boot-input" value="' + $(this).find("input").attr("id") + '">&emsp;' +
                'value <input class="boot-input" value="' + $(this).find("input").attr("value") + '">&emsp;' +
                'option <input class="boot-input" value="' + $(this)[0].innerText + '">&emsp;' +
                '</li>';
        });
        attrcontent += '</ul>';

        setTimeout(function () {
            $(".checkboxsortable").sortable({
                placeholder: "draghighlight",
                axis: "y"
            });
        }, 500);
    }

    //属性列表后面添加按钮
    if (attrcontent != "") {
        $('.editmore').css("display", "block");
        attrcontent = attrcontent + '<button type="button" class="btn btn-info" id="displaybtn">属性更新</button>';
        $(".attrlist").append(attrcontent);
    } else {
        $('.editmore').css("display", "none");
        $(".attrlist").html("自动加载属性：<br>" +
            "输入框、文本域---\"id\", \"name\", \"placeholder\", \"data-options\" <br>" +
            "复选框、单选框---");
    }

    setTimeout(function () {
        $('#updatetext').select();
    }, 500);
});


//更多属性修改按钮
$(document).on("click", "#displaybtn", function () {
    var copycontent = operation.clone();

    if (operation.find('.codeblock').hasClass("inputtextarea")) {
        $.each(editelementattr,
            function (i, c) {
                if (copycontent.find(".codeblock").find(editelementlabel).attr(c)) {
                    copycontent.find(".codeblock").find(editelementlabel).attr(c, $('#dcode-' + c).val());
                    if (c == "id") {
                        if (copycontent.find(".codeblock").find("label").attr("for")) {
                            copycontent.find(".codeblock").find("label").attr("for", $('#dcode-' + c).val());
                        }
                    }
                }
            }
        );
    } else if (operation.find('.codeblock').hasClass("inputifa")) {
        $.each(editelementattr,
            function (i, c) {
                if (copycontent.find(".codeblock").find(editelementlabel).attr(c)) {
                    copycontent.find(".codeblock").find(editelementlabel).attr(c, $('#dcode-' + c).val());
                    if (c == "id") {
                        if (copycontent.find(".codeblock").find("label").attr("for")) {
                            copycontent.find(".codeblock").find("label").attr("for", $('#dcode-' + c).val());
                        }
                    }
                }
            }
        );
        copycontent.find(".codeblock").find("i").removeClass("fa " + copycontent.find(".input-icon > i").data("icon")).addClass("fa " + $('#dcode-icon').val());
        copycontent.find(".codeblock").find("i").removeClass(copycontent.find(".input-icon > i").data("color")).addClass($('#dcode-iconcolor').val());
    } else if (operation.find(".codeblock").hasClass("inputcheckbox")) {
        copycontent.find(".checkboxedit").children().remove();

    }

    if (copycontent.find('.codeblock').hasClass("easyuicode")) {
        var easyuicode = copycontent.find('.easyuicode');
        var classname = copycontent.find('.easyui').attr("rel");
        easyuicode.find('.easyui').removeAttr("rel").removeClass("easyui").addClass(classname);
        easyuicode.find('.fast-edit')[0].innerHTML = $('#updatetext').val();
        $('#bodycode').val(html_beautify(easyuicode.html()));
    }

    $('#bodycode').val(html_beautify(copycontent.find('.codeblock').html()));
});

//将修改更新至下方code
$('#updateContent').on("click", function () {
    var copycontent = operation.clone();
    // var codechildname = copycontent.find('.codeblock').children()[0].className;
    // if (codechildname == "form-group" || codechildname == "element-inline" || codechildname == "row-inline-item") {
    //     if (operation.find('.codeblock').hasClass("easyuicode")) {
    //         var easyuicode = copycontent.find('.easyuicode');
    //         var classname = copycontent.find('.easyui').attr("rel");
    //         easyuicode.find('.easyui').removeAttr("rel").removeClass("easyui").addClass(classname);
    //         easyuicode.find('label')[0].innerHTML = $('#updatetext').val();
    //         $('#bodycode').val(html_beautify(easyuicode.html()));
    //     } else {
    //         if (operation.find('label')[0] == undefined) {
    //             copycontent.find('.inline-input').children()[0].innerHTML = $('#updatetext').val();
    //         } else {
    //             copycontent.find('label')[0].innerHTML = $('#updatetext').val();
    //         }
    //         $('#bodycode').val(html_beautify(copycontent.find('.codeblock').html()));
    //     }
    // } else if (copycontent.find('.codeblock').children()[0].className == "easyui") {
    //     bootbox.dialog({
    //         message: '<div class="text-center">暂时不提供更新，可对文本直接操作</div>',
    //         size: 'small'
    //     });
    //     setTimeout(function () {
    //         bootbox.hideAll();
    //     }, 1000);
    // } else {
    //     copycontent.find('.codeblock').children()[0].innerHTML = $('#updatetext').val();
    //     $('#bodycode').val(html_beautify(copycontent.find('.codeblock').html()));
    // }
    if (operation.find('.codeblock').hasClass("easyuicode")) {
        var easyuicode = copycontent.find('.easyuicode');
        var classname = copycontent.find('.easyui').attr("rel");
        easyuicode.find('.easyui').removeAttr("rel").removeClass("easyui").addClass(classname);
        easyuicode.find('.fast-edit')[0].innerHTML = $('#updatetext').val();
        $('#bodycode').val(html_beautify(easyuicode.html()));
    } else {
        copycontent.find('.fast-edit')[0].innerHTML = $('#updatetext').val();
        $('#bodycode').val(html_beautify(copycontent.find('.codeblock').html()));
    }
    $('#updatetext').select();
});

$('#editmore').on("click", function () {
    if ($('.editmore').css("display") == "none") {
        $('.editmore').css("display", "block");
    } else {
        $('.editmore').css("display", "none");
    }
});

//将修改code更新至拖拽区
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


var editform;
$(document).on("click", ".edit-form-link", function () {
    editform = $(this).parent().parent();
    $('#formModal').modal("show");
    $('#formid').val(editform.find("form").attr("id"));
    $('#formaction').val(editform.find("form").attr("action"));
    $('#formmethod').val(editform.find("form").attr("method"));
});

$(document).on("click", "#updateformCode", function () {
    editform.find("form").attr("id", $('#formid').val());
    editform.find("form").attr("action", $('#formaction').val());
    editform.find("form").attr("method", $('#formmethod').val());
    $('#formModal').modal("hide");
});

//标题组件样式下拉
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

//组件class选择下拉
$(document).on("click", ".changeclass .dropdown-menu a", function () {
    $(this).parent().parent().find("li").removeClass("active");
    $(this).parent().addClass("active");
    var elementobj = $(this).parent().parent().parent().parent().parent();
    var elementval = $(this).attr("rel");
    var classes = "";
    $(this).parent().parent().find("a").each(function () {
        classes += $(this).attr("rel") + " "
    });
    if (elementobj[0].className.indexOf("component-btnparent") != -1) {
        elementobj.find('.component-parentblock').children().removeClass(classes);
        elementobj.find('.component-parentblock').children().addClass(elementval);
    } else if (elementobj[0].className.indexOf("component-btn") != -1) {
        elementobj.find('.codeblock .inline-input').children().removeClass(classes);
        elementobj.find('.codeblock .inline-input').children().addClass(elementval);
    } else {
        if (elementobj.find('.codeblock').children()[0].className.indexOf("form-btn") != -1) {
            elementobj.find('.codeblock .form-btn').children().removeClass(classes);
            elementobj.find('.codeblock .form-btn').children().addClass(elementval);
        } else {
            elementobj.find('.codeblock').children().removeClass(classes);
            elementobj.find('.codeblock').children().addClass(elementval);
        }
    }
});

//将对齐功能抽出，使用.changeclass-align对应需要对齐的组件添加.alignval
$(document).on("click", ".changeclass-align .dropdown-menu a", function () {
    $(this).parent().parent().find("li").removeClass("active");
    $(this).parent().addClass("active");
    var elementobj = $(this).parent().parent().parent().parent().parent();
    var elementval = $(this).attr("rel");
    var classes = "";
    $(this).parent().parent().find("a").each(function () {
        classes += $(this).attr("rel") + " "
    });
    if (elementobj[0].className.indexOf("component-btnparent") != -1) {
        elementobj.find('.component-parentblock .alignval').removeClass(classes);
        elementobj.find('.component-parentblock .alignval').addClass(elementval);
    } else {
        elementobj.find('.codeblock .alignval').removeClass(classes);
        elementobj.find('.codeblock .alignval').addClass(elementval);
    }
});

console.log("有问题联系: %c774669939@qq.com\n%cPowered By %c7c", "color:#0099FF", "color:#000", "color:#990099");
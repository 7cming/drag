window.onload = function () {
    $('#portalmask').hide();
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
            // IE doesn't register the blur when sorting
            // so trigger focusout handlers to remove .ui-state-focus
            ui.item.children("h3").triggerHandler("focusout");
            // Refresh accordion to handle new order
            $(this).accordion("refresh");
        }
    });
});

function changeFrameHeight() {
    var box = parent.$('.dragbox');
    $('.dragbox').css({"min-height": $(window).height() - box[0].getBoundingClientRect().top - 10})
}

$('.pagetitle').click(function () {
    if ($('.typelist').hasClass('sidebar-close')) {
        $('.typelist').removeClass('sidebar-close');
        $('.drag-container').css("margin-left", "400px");
        $(".main-content").css("margin-left", "");
        $('.typelist').show();
    } else {
        $('.typelist').addClass('sidebar-close');
        $('.drag-container').css("margin-left", "0px");
        $('.main-content').css("margin-left", "0px");
        $('.typelist').hide();
    }
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
        // $('#colsplitbtn').removeAttr("disabled");
        $(".components-col .col-layout").children('*[class^="col"]').remove();
        for (var i = 0; i < arr.length; i++) {
            content += '<div class="col-sm-' + arr[i] + '" style="border :1px solid #999;min-height:65px;"></div>';
        }
        $(".components-col .col-layout").append(content);
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


$(function() {
    changeFrameHeight();
    window.onresize = function () {
        changeFrameHeight();
    }

    $( "#accordion" )
        .accordion({
            header: "> div > h3",
            collapsible: true,
            heightStyle: "content"
        })
        .sortable({
            axis: "y",
            handle: "h3",
            stop: function( event, ui ) {
                // IE doesn't register the blur when sorting
                // so trigger focusout handlers to remove .ui-state-focus
                ui.item.children( "h3" ).triggerHandler( "focusout" );

                // Refresh accordion to handle new order
                $( this ).accordion( "refresh" );
            }
        });
});
function changeFrameHeight() {
    var box = parent.$('.dragbox');
    $('.dragbox').height($(window).height() - box[0].getBoundingClientRect().top - $('.navbar').height()-10);
}
$('.pagetitle').click(function(){
    if($('.typelist').hasClass('sidebar-close')){
        $('.typelist').removeClass('sidebar-close');
        $('.drag-container').css("margin-left","400px");
        $(".main-content").css("margin-left","");
        $('.typelist').show();
    }else{
        $('.typelist').addClass('sidebar-close');
        $('.drag-container').css("margin-left","0px");
        $('.main-content').css("margin-left","0px");
        $('.typelist').hide();
    }
});
$('#cleanbtn').click(function () {
    alert(1);
});
$('#savebtn').click(function () {
    alert(2);
});
$('#viewbtn').click(function () {
    alert(3);
});
$('#downbtn').click(function () {
    alert(4);
});
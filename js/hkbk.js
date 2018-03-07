$(function() {
    document.body.addEventListener('touchstart', function() {});//觸發iphone按鈕active效果
    //计算屏幕高度，自动适配 基准 667 iphone6尺寸
    var height=window.screen.height;
    var adjustRem=(height/667*62.5).toFixed(2)+'%';
    $("html").css("font-size",adjustRem);


    // 点击分享按钮
    var clicks=0;
    $(".share_btn").on('click', function() {
        clicks++;
        if(clicks===1){
            $('.share_zc').removeClass('hide')
        }else if(clicks>1){
            $('.share_zzc').removeClass('hide')
        }
    })


    // 分享页面取消
    $(".zzc").on('click', function() {
        $(".share_zzc").addClass('hide');

    })
    // 取消分享页面弹窗
    $(".cancel").on('click', function() {
        $(".share_zc").addClass('hide');
        $(".game_rule").addClass('hide');
        $(".prize_game").addClass('hide');
        $(".matched_game").addClass('hide');
    })


});

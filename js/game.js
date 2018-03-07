
$(function() {
    var timeDom=$("#pokerTime");
    var scoreDom=$("#pokerScore");
    var countDownDom=$("#countState");

    var pokerGame=new Game(timeDom,scoreDom,countDownDom);
    pokerGame.init();

    $(".game_btn").on('click', function() {
        $(".game_rule").addClass('hide');
        pokerGame.play();
    })

    $(".beginGame").on('click', function() {
        $(".game_rule").addClass('hide');
        pokerGame.play();
    })

    //添加背景图片
    var bgGounp = ["images/icon1.png", "images/icon2.png", "images/icon3.png", "images/icon4.png", "images/icon5.png", "images/icon6.png", "images/icon7.png", "images/icon8.png", "images/icon6.png", "images/icon1.png", "images/icon7.png", "images/icon5.png", "images/icon4.png", "images/icon3.png", "images/icon8.png", "images/icon2.png"];
    var bgPic1 = document.getElementsByClassName('icon');
    for (var i = 0; i < 16; i++) {
        if(bgPic1[i]){
            bgPic1[i].src = bgGounp[i]
        }

    }
})

//卡牌游戏
function Game(timeDom,scoreDom,countDownDom){
    var self=this;
    this.time=25;                    //游戏时间
    this.timeDom=timeDom;          //控制时间的DOM元素
    this.scorePerHit=1000;         //每成功一次加多少分
    this.score=0;                  //当前得分
    this.scoreDom=scoreDom;        //控制得分的DOM元素
    this.timeInterval;             //游戏倒计时的句柄
    this.gameStatus=0;             //0:停止 stopped 1:游戏中 playing 2:暂停 paused
    this.countDownInterval;        //3-2-1-开始 的句柄
    this.countTime=4;              //3-2-1-开始 的倒计时时间
    this.countDownDom=countDownDom //游戏开始时3-2-1-开始 的DOM元素

    //初始化游戏页面及定义交互逻辑
    this.init=function(){
        let displayTime=this.time;
        if(displayTime<10){
            displayTime='0'+displayTime;
        }
        //初始化显示
        this.timeDom.html(displayTime);
        this.scoreDom.html(this.score);
        //卡牌交互逻辑
        this.initCardLogic();

    };

    var clickedIndex = [];//记录点击的卡片ID
    var record = []; //记录src的地址
    this.initCardLogic=function(){
        var cards = $('li[id^=tile_]');
        cards.on("click",function(){
            let gameStatus=self.getGameStatus();
            //只在游戏进行中的时候 才可以翻转卡牌
            if(gameStatus==='playing'){
                //TODO:继续你的卡牌交互逻辑 配对成功调用 self.addScore()

                    if ($(this).hasClass('ok') || $(this).hasClass('on')) {
                        return false;
                    }
                    var curIndex = cards.index(this); // 当前点击的是第几个卡片，以 0 开始
                    clickedIndex.push(curIndex);


                    $(this).addClass("on");
                    //点击图片的src属性
                    var current = $(this).children('.red_pack.back').children('.icon').attr('src')
                    //点击的src属性存入数组以便进行比较
                    record.push(current);

                    if (record.length === 2) {
                        // 之前点击过的两个元素，保存在变量中方便在定时器中使用
                        var elm1 = cards.eq(clickedIndex[0]),
                            elm2 = cards.eq(clickedIndex[1]);

                        //如果两者src属性相同,表示配对成功
                        if (record[0] === record[1]) {
                            self.addScore()
                            $(this).children('.integral').css('display', 'block').fadeOut(1000)
                        } else {//如果两者 src 不同则重新翻回卡片
                            setTimeout(function() {
                                elm1.removeClass('on');
                                elm2.removeClass('on');
                            }, 400); // 数值很重要！应该为动画的时长，代表动画结束后执行此操作
                        }
                        // 清空数组
                        record.length = 0;
                        clickedIndex.length = 0;
                    }
                    return false;


            }
        });
    }

    this.addScore=function(){
        this.score+=this.scorePerHit;
        // console.log('匹配成功',this.score);
        this.scoreDom.html(this.score);
    }

    //游戏开始时的运行逻辑
    this.play=function(){
        //3-2-1-开始 倒数效果
        $("#countState").removeClass('hide');
        //未激活状态-暂停游戏，激活状态 继续游戏
        self.startPageListener();

        this.countDownInterval=setInterval(function(){
            if(self.countTime>0){
                self.countTime--;
                switch(self.countTime){

                    case 3:
                        self.countDownDom.find("img").attr('src', 'images/count2.png');
                        break;
                    case 2:
                        self.countDownDom.find("img").attr('src', 'images/count1.png');
                        break;
                    case 1:
                        self.countDownDom.find("img").attr('src', 'images/count-start.png');
                        break;
                    case 0:
                        self.countDownDom.addClass('hide clic');
                        self.updateGameStatus('playing'); //设置为 游戏中

                        clearInterval(self.countTimeInterval);
                        break;
                }

            }

        },1000)
    }



    //开始倒计时
    this.startTimer=function(){
        if(self.time ===0){
            return
        }
        self.countDownDom.addClass('hide clic');
        this.timeInterval=setInterval(function(){
            if(self.time>0){
                self.time--;
                let displayTime=self.time;
                //倒计时前置零效果
                if(self.time<10){
                    displayTime='0'+self.time;
                }
                self.timeDom.html(displayTime)

            }
            else{
                self.updateGameStatus('stopped');//设置为 停止
                $(".count_state").removeClass('hide');
                $(".count_state img").attr('src', 'images/count-end.png');
                setTimeout(function(){
                    $(".count_state").addClass('hide');
                    let score=self.getGameScore();
                    $('#total').text(score);
                    switch(score){
                        case 0:
                            $('#gameFail').removeClass('hide');
                            break;
                        case 8000:
                            // score>=8000
                            $("#machedGame").removeClass('hide');
                            break;
                        default:
                            // 0<score<=8000
                            $("#prizeGame").removeClass('hide');
                            break;
                    }
                },1000)

            }
        },1000)
    }

    //暂停倒计时
    this.stopTimer=function(){

        if(self.countDownInterval){
            clearInterval(self.countDownInterval);
        }
        if(self.timeInterval){
            clearInterval(self.timeInterval);
        }

    }

    //更新游戏状态 0:停止 stopped 1:游戏中 playing 2:暂停 paused
    this.updateGameStatus=function(code){
        console.log('游戏状态',code);
        switch(code){
            case 'stopped':
                this.gameStatus=0;
                this.stopTimer();
                break;
            case 'playing':
                this.gameStatus=1;
                this.startTimer();
                break;
            case 'paused' :
                this.gameStatus=2;
                this.stopTimer();
                break;
        }

    }

    //获取游戏状态
    this.getGameStatus=function(){
        if(this.gameStatus===0){
            return 'stopped';
        }
        else if (this.gameStatus===1) {
            return 'playing';
        }
        else if (this.gameStatus===2) {
            return 'paused'
        }
    }

    //获取当前的得分
    this.getGameScore=function(){
        return this.score;
    }

    //判断页面处于什么状态
    this.startPageListener=function(){
        document.addEventListener("visibilitychange",function(){
            switch(document.visibilityState){
                case 'hidden':
                    self.updateGameStatus('paused');
                    break;
                case 'visible':
                    self.updateGameStatus('playing');
                    break;
            }
        })
    }
}

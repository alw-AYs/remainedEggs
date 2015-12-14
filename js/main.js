/*
 * @Author: alw-AYs
 * @Date:   2015-11-27 11:43:19
 * @Last Modified by:   yaosichen
 * @Last Modified time: 2015-12-14 11:27:29
 */

'use strict';
$(function() {
  var w = $(window).width();
  var h = $(window).height();
  var resource = null;
  var renderer = PIXI.autoDetectRenderer(w, h, {
    transparent: true
  });
  $('#stage').append(renderer.view);
  var stage = new PIXI.Container();
  stage.interactive = true;
  var timer, back, cat, eggs, cats = [],
    ct = 1,
    stopGame = false;

  init();

  function init() {
    var loader = PIXI.loader;
    loader.add('main', "js/main.js").add('title', "img/bg_title.png").add('bg', "img/bg_bg.png").add('cat1', "img/cat_1.png").add('cat2', "img/cat_2.png").add('cat3', "img/cat_3.png").add('cat4', "img/cat_4.png").add('cat5', "img/cat_5.png").add('boom', "img/boom.png").add('egg', "img/egg.png").add('tray1', "img/tray_1.png").add('tray2', "img/tray_2.png").add('tray3', "img/tray_3.png").add('clickBtn', "img/click_btn.png").add('egg_dance_1', "img/egg_dance_1.png").add('egg_dance_2', "img/egg_dance_2.png").add('egg_dance_3', "img/egg_dance_3.png").add('egg_dance_4', "img/egg_dance_4.png");
    loader.on('progress', onProgressCallback).once('complete', setup);
    loader.load();
  }

  function onProgressCallback(event) {

  }

  function setup(loader, resources) {
    console.log(resources);
    console.log(loader);
    resource = resources;

    timer = new Timer();
    back = new Back();
    eggs = new Eggs();

    stage.addChild(back.ground);
    stage.addChild(eggs.wrap);
    animate();
    startGame();
  }

  function animate() {
    requestAnimationFrame(animate);

    back.render();
    renderer.render(stage)
  }

  function startGame() {
    timer.start();
    forDoomHammer();
    back.clickBtn.on("tap", function() {
      if (cats.length > 0) {
        var index = parseInt(Math.random() * cats.length);
        cats[index].boom();
      }
    });
  }

  function gameOver() {
    stopGame = true;
  }
  function celebrate() {
    var n = 0;
    var m = 0;
    var tl = new TimelineMax();
    var dx = -350;
    var dy = 100;

    for(i=0;i<eggs.tray.length;i++)
    {
      tl.to(eggs.tray[i],0.1, {alpha:0},0.1);
    }

    var dn = Math.round(eggs.eggList.length/2);
    if(dn>5)
    {
      dn = 5;
    }else if(dn>=3)
    {
      dx = -250;
    }else {
      dn = 2;
      dx = -180;
      dy = 40;
    }

    for(var i = 0; i<eggs.eggList.length; i++)
    {
      var eg = eggs.eggList[i];
      var xx = dx + n*100;
      var yy = dy - m *70;
      var tt = i*0.05;
      eg.setSXY(xx-3,yy);
      tl.to(eg.gg, 0.5, {bezier:{type:"thru", values:[{x:xx+50, y:yy-280}, {x:xx, y:yy}], autoRotate:false}, ease:Power1.easeOut},tt);
      setTimeout(eg.survive,parseInt((eggs.eggList.length*0.05+0.6)*1000));
      n++;
      if(n == dn)
      {
        n = 0;
        m++;
        dx += 70;
      }
    }
  }

  function forDoomHammer() {
    if (!stopGame) {
      var tt = eggs.getTarget();
      var ttt = Math.random() * 1300 + 100;
      if (typeof(tt) == 'undefined' || tt == false) {
        ttt = 0;
      } else {
        cat = new Cat(ct);
        stage.addChild(cat.claw);
        var tx = tt.gg.x * w / 640 + eggs.wrap.x;
        var ty = tt.gg.y * w / 640 + eggs.wrap.y;
        cat.attack(tt, tx, ty);
        cats.push(cat);
      }

      setTimeout(forDoomHammer, ttt);
    }
  }

  function Timer() {
    var ttime = 20;

    this.start = function() {
      countdown();
    };

    init();

    function init() {
      var s = w / 640;
      TweenMax.set($('#countdown'), {
        scale: s
      });
    }

    function countdown() {
      if (!stopGame) {
        var t = ttime;
        if (t < 10) {
          t = "0" + t;
        }
        $('#countdown').text('0:' + t);
        ttime--;

        if (ct > .3) {
          ct -= .05;
        }
        if (ttime > -1) {
          setTimeout(countdown, 1000);
        } else {
          stopGame = true;
          celebrate();
        }
      }
    }
  }

  function Back() {
    var self = this;
    this.ground = null;
    this.clickBtn = null;

    this.render = function() {};
    init();

    function init() {
      self.ground = new PIXI.Container();
      var tt = resource['bg'].texture;
      var t = new PIXI.Sprite(tt);
      t.width = w;
      t.scale.y = t.scale.x;
      t.x = 0;
      t.y = h - t.height;
      self.ground.addChild(t);

      self.clickBtn = new PIXI.Sprite(resource['clickBtn'].texture);
      self.clickBtn.anchor.x = 0.5;
      self.clickBtn.anchor.y = 1;
      self.clickBtn.x = w / 2;
      self.clickBtn.y = h;
      self.clickBtn.scale.set(w / 640);
      self.ground.addChild(self.clickBtn);
      self.clickBtn.interactive = true;
    }
    // function initSingleBG(_index, _scaleHeight, _dy) {
    //   if (typeof(_scaleHeight) == 'undefined') {
    //     _scaleHeight = 1
    //   }
    //   var tt = _r["bg" + _index].texture;
    //   var t = new PIXI.Sprite(tt);
    //   var width = tt.width;
    //   var height = tt.height;
    //   t.width = w;
    //   t.height = (t.width / width) * height * _scaleHeight;
    //   t.x = 0;
    //   t.y = _index > 1 ? _dy : 0;
    //   self.ground.addChild(t);
    //   return t.y + t.height
    // }
  }

  function Eggs() {
    var self = this;
    this.wrap = null;
    this.eggList = [];
    this.tray = [];

    this.render = function() {};
    this.getTarget = function() {
      if (self.eggList.length > 0) {
        var t = self.eggList[parseInt(Math.random() * self.eggList.length)];
        if (t.active) {
          t.active = false;
          return t;
        }
      }
      return false;
    };

    init();

    function init() {
      self.wrap = new PIXI.Container();
      var trayTT;
      var eggTT = resource['egg'].texture;

      for (var i = 0; i < 6; i++) {
        if (i == 0) {
          trayTT = resource['tray1'].texture;
        } else if (i == 5) {
          trayTT = resource['tray3'].texture;
        } else {
          trayTT = resource['tray2'].texture;
        }
        var t = new PIXI.Sprite(trayTT);
        self.tray.push(t);
      }

      self.tray[5].x = -16;
      self.tray[5].y = 16;
      self.wrap.addChild(self.tray[5]);
      for (var i = 0; i < 5; i++) {
        var ty = 24 * i;
        if (i == 4) {
          ty = 24 * 4 + 8;
        }
        var row = [];
        for (var j = 0; j < 3; j++) {
          var tx = (eggTT.width + 8) * j - 12 * i + 24;
          var egg = new Egg(eggTT, self.wrap, tx, ty);
          self.eggList.push(egg);
        }
        self.tray[(4 - i)].x = -16 - 12 * (i + 1);
        self.tray[(4 - i)].y = 16 + 24 * (i + 1);
        self.wrap.addChild(self.tray[(4 - i)]);
      }
      self.tray[0].x += 4;

      self.wrap.x = Math.round(w * 0.64);
      self.wrap.y = Math.round(h - 467 * w / 640);
      self.wrap.scale.x = self.wrap.scale.y = w / 640;
    }
  }

  function Egg(_t, _p, _x, _y) {
    var self = this;
    this.active = true;
    this.gg = null;
    this.movie = null;
    var sx = 0, sy = 0;

    this.destroy = function() {
      var index = $.inArray(self, eggs.eggList);
      if (index >= 0) {
        eggs.eggList.splice(index, 1);
      }
      if (eggs.eggList.length == 0) {
        gameOver();
      }
    };
    this.survive = function(){
      var frames = [];
      for (var i = 1; i < 4; i++) {
        frames.push(resource['egg_dance_' + i].texture);
      }

      self.movie = new PIXI.extras.MovieClip(frames);
      self.movie.animationSpeed = 0.05;
      self.movie.anchor.x = 0.5;
      self.movie.x = sx;
      self.movie.y = sy;
      self.movie.alpha = 0;
      _p.addChild(self.movie);
      _p.setChildIndex(self.movie, _p.children.length - _p.getChildIndex(self.gg));

      TweenMax.to(self.gg,0.1,{alpha:0,repeat:4,yoyo:true});
      TweenMax.to(self.movie,0.1,{alpha:1,repeat:4,yoyo:true});
      self.movie.play();
    };
    this.setSXY = function(_x,_y)
    {
      sx = _x;
      sy = _y;
    };

    init();

    function init() {
      self.gg = new PIXI.Sprite(_t);
      self.gg.anchor.x = 0.5;
      self.gg.anchor.y = 0;
      self.gg.x = _x;
      self.gg.y = _y;
      _p.addChild(self.gg);
    }
  }

  function Cat(_t) {
    var self = this;
    this.claw = null;
    this.canAttack = false;

    var om = null,
      aw = null,
      egg = null;
    var speed = _t,
      stopped = false;
    var dx = w + 40,
      dy = h * 0.6;
    var targetEgg = null;

    this.render = function() {};

    this.boom = function() {
      TweenMax.killTweensOf(self.claw);
      stopped = true;
      destroy();
      TweenMax.to(om, speed / 3, {
        alpha: 1,
        ease: Expo.easeInOut,
        repeat: 1,
        repeatDelay: 1,
        yoyo: true
      });
      TweenMax.to(self.claw, 0.1, {
        alpha: 0,
        repeat: 4,
        yoyo: true,
        delay: speed / 3,
        onComplete: function() {
          targetEgg.gg.alpha = 1;
          targetEgg.active = true;
        }
      });
    };

    this.attack = function(_t, _tx, _ty) {
      self.canAttack = false;
      targetEgg = _t;
      TweenMax.to(self.claw, speed, {
        x: _tx,
        y: _ty,
        onComplete: attack1,
        ease: Expo.easeInOut
      });
    };

    function destroy() {
      if (!stopped) {
        targetEgg.destroy();
      }
      var index = $.inArray(self, cats);
      if (index >= 0) {
        cats.splice(index, 1);
      }
    }

    function attack1() {
      if (!stopped) {
        egg.alpha = 1;
        targetEgg.gg.alpha = 0;

      }
      TweenMax.to(self.claw, speed, {
        x: dx,
        y: dy,
        onComplete: attack2,
        ease: Expo.easeOut
      });
      TweenMax.delayedCall(speed / 5, destroy);
    }

    function attack2() {
      // egg.alpha = 0;
      // stopped = false;
      // self.canAttack = true;
      //destroy();
    }

    init();

    function init() {
      self.claw = new PIXI.Container();

      var tt;

      tt = resource['egg'].texture;
      egg = new PIXI.Sprite(tt);
      egg.x = -26;
      egg.y = 0;
      egg.alpha = 0;
      self.claw.addChild(egg);

      var id = Math.round(Math.random() * 4 + 1);
      tt = resource['cat' + id].texture;
      aw = new PIXI.Sprite(tt);
      //aw.width = tt.width;
      aw.x = -38;
      aw.y = -28;
      self.claw.addChild(aw);

      tt = resource['boom'].texture;
      om = new PIXI.Sprite(tt);
      om.x = -62;
      om.y = -58;
      om.alpha = 0;
      self.claw.addChild(om);

      self.claw.scale.x = self.claw.scale.y = w / 640;
      self.claw.x = dx;
      self.claw.y = dy;

      self.canAttack = true;
    }
  }

});



function initWX() {
  var postUrl = "http://www.rfistudios.com.cn/Client/Webchat/Signature/rfistudios";
  var thisUrl = location.href.split('#')[0];
  var postData = {
    url: thisUrl
  };
  $.post(postUrl, postData, function(result) {
    if (result.Error == "") {
      wx.config({
        debug: false,
        appId: result.Data.AppId,
        timestamp: result.Data.Timestamp,
        nonceStr: result.Data.NonceStr,
        signature: result.Data.Signature,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo']
      });
      wx.ready(function() {
        resetShareInfo()
      })
    } else {}
  })
}

function resetShareInfo() {
  var wxData = {
    "title": '嫦娥献礼',
    "desc": '中秋月圆 嫦娥献礼 脑洞惊喜等你来挑战(⺣◡⺣)♡',
    "imgUrl": 'http://www.rfistudios.com.cn/holiday/longGoose/img/sharing.jpg',
    "link": 'http://www.rfistudios.com.cn/holiday/longGoose/'
  };
  var wxCallbacks = {
    success: function() {
      showShare(0);
      document.getElementById("picstat").src = "http://stat.rfistudios.com.cn/Handler/Action?e=A1FAE3FFB6067C7A391F09B57AF904907D401FB779412F3DE6BE5B56CAAC90D9C63F23E392F21813E534BF750FF7D8AD"
    },
    cancel: function() {}
  };
  wx.onMenuShareTimeline({
    title: wxData.desc,
    link: wxData.link,
    imgUrl: wxData.imgUrl,
    success: wxCallbacks.success,
    cancel: wxCallbacks.cancel
  });
  wx.onMenuShareAppMessage({
    title: wxData.title,
    desc: wxData.desc,
    link: wxData.link,
    imgUrl: wxData.imgUrl,
    success: wxCallbacks.success,
    cancel: wxCallbacks.cancel
  });
  wx.onMenuShareQQ({
    title: wxData.title,
    desc: wxData.desc,
    link: wxData.link,
    imgUrl: wxData.imgUrl,
    success: wxCallbacks.success,
    cancel: wxCallbacks.cancel
  });
  wx.onMenuShareWeibo({
    title: wxData.title,
    desc: wxData.desc,
    link: wxData.link,
    imgUrl: wxData.imgUrl,
    success: wxCallbacks.success,
    cancel: wxCallbacks.cancel
  })
}

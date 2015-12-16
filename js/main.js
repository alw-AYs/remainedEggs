/*
 * @Author: alw-AYs
 * @Date:   2015-11-27 11:43:19
 * @Last Modified by:   yaosichen
 * @Last Modified time: 2015-12-16 17:24:28
 */

'use strict';
$(function() {
  var w = $(window).width();
  var h = $(window).height();
  var s = h / 1136;
  var ds = 1 / window.devicePixelRatio;
  var resource = null;
  var renderer = PIXI.autoDetectRenderer(w, h, {
    transparent: true,
    resolution: window.devicePixelRatio
  });
  $('#stage').append(renderer.view);
  var stage = new PIXI.Container();
  var loader, timer, back, cat, eggs, cats = [],
    ct = 1,
    stopGame = false;

  init();

  function init() {
    loader = new PIXI.loaders.Loader();
    loader.add('bg', "img/bg_bg.png").add('title', "img/bg_title.png").add('joel_ellie', "img/joel_ellie.png").add('dialog_1', "img/dialog_1.png").add('dialog_2', "img/dialog_2.png").add('dialog_3', "img/dialog_3.png").add('turner', "img/turner.png").add('wine', "img/wine.png").add('mistletoe', "img/mistletoe.png").add('wreath', "img/wreath.png").add('light', "img/light.png").add('startBtn', "img/start_btn.png").add('clickBtn', "img/click_btn.png").add('cat1', "img/cat_1.png").add('cat2', "img/cat_2.png").add('cat3', "img/cat_3.png").add('cat4', "img/cat_4.png").add('cat5', "img/cat_5.png").add('boom', "img/boom.png").add('egg', "img/egg.png").add('tray1', "img/tray_1.png").add('tray2', "img/tray_2.png").add('tray3', "img/tray_3.png").add('egg_dance_1', "img/egg_dance_1.png").add('egg_dance_2', "img/egg_dance_2.png").add('egg_dance_3', "img/egg_dance_3.png").add('egg_dance_4', "img/egg_dance_4.png").add('shareBtn', 'img/share_btn.png').add('replayBtn', 'img/replay_btn.png');
    loader.on('progress', onProgressCallback).once('complete', setup);


    TweenMax.set($('#loadingBar, #stage'), {
      scale: ds
    });
    TweenMax.to($('#loadingBar'), 0.5, {
      alpha: 1
    });
    TweenMax.to($('#loadingBar p'), 0.1, {
      alpha: 0.5,
      repeat: -1,
      yoyo: true
    });
    loader.load();
  }


  function setupLoading(_l, _r) {
    resource = _r;



    loader.reset();
    loader



    back.gameIn();
  }


  function onProgressCallback(event) {
    $('#loadingBar p').text(Math.round(event.progress) + '%');
  }

  function setup(loader, resources) {
    console.log(resources);
    console.log(loader);


    resource = resources;

    back = new Back();
    timer = new Timer();
    eggs = new Eggs();
    stage.addChild(back.ground);
    stage.addChild(eggs.wrap);
    animate();


    TweenMax.to($('#loadingBar'), 0.1, {
      autoAlpha: 0,
      repeat: 2,
      yoyo: true,
      delay: 1,
      ease: Power2.easeOut,
      onComplete: function() {
        $('#loadingBar').remove();
        coverIn();
      }
    });
  }

  function animate() {
    requestAnimationFrame(animate);

    back.render();
    renderer.render(stage)
  }

  function coverIn() {
    var tl = new TimelineMax();
    tl.to(back.ground, 0.3, {
      alpha: 1,
      ease: Expo.easeOut
    }, 0);
    tl.to(back.joelEllie, 0.1, {
      alpha: 1,
      repeat: 4,
      yoyo: true
    }, 0.5);
    tl.to(back.dialog[0], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 2,
      yoyo: true,
      ease: Power2.easeOut
    }, 1.2);
    tl.to(eggs.wrap, 0.1, {
      alpha: 1,
      yoyo: true,
      repeat: 2
    }, 2.2);
    tl.to(back.dialog[1], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 4,
      yoyo: true,
      ease: Power2.easeOut
    }, 4.2);
    tl.to(back.dialog[2], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 4,
      yoyo: true,
      ease: Power2.easeOut
    }, 9.2);
    tl.to(back.title, 0.5, {
      alpha: 1,
      ease: Expo.easeInOut
    }, 14);
    tl.to(back.startBtn, 0.5, {
      alpha: 1,
      ease: Power2.easeOut,
      onStart: function() {
        back.startBtn.visible = true;
      },
      onComplete: function() {
        back.startBtn.interactive = true;
      }
    }, 15.5);
    tl.to(back.startBtn, 0.4, {
      alpha: 0.5,
      repeat: -1,
      yoyo: true
    }, 16);
  }

  function coverOut() {
    var tl = new TimelineMax();
    tl.to(back.startBtn, 0.3, {
      alpha: 0,
      ease: Power2.easeOut,
      onComplete: function() {
        back.startBtn.visible = false;
      }
    }, 0);
    tl.to(back.title, 0.8, {
      y: -back.title.height * 1.5,
      alpha: 0,
      ease: Power2.easeOut
    }, 0);
    tl.to(back.joelEllie, 0.1, {
      alpha: 0,
      repeat: 4,
      yoyo: true
    }, 1);
    tl.to(back.clickBtn, 0.5, {
      alpha: 1,
      ease: Power2.easeOut,
      onStart: function() {
        back.clickBtn.visible = true;
      },
      onComplete: readyGame
    }, 1.5);
    tl.to(back.clickBtn, 0.4, {
      alpha: 0.5,
      repeat: -1,
      yoyo: true
    }, 2);
  }

  function readyGame() {
    setTimeout(startGame, 1000);
  }

  function startGame() {
    back.clickBtn.interactive = true;
    ct = 1;
    stopGame = false;
    timer.start();
    forDoomHammer();
  }

  function replay() {
    back.hideElement();
    var tl = new TimelineMax();

    tl.to(eggs.wrap, 0.3, {
      alpha: 0,
      ease: Power2.easeOut,
      onComplete: eggs.reset
    }, 0);

    tl.to(eggs.wrap, 0.1, {
      alpha: 1,
      yoyo: true,
      repeat: 2
    }, 0.8);

    tl.to(back.clickBtn, 0.5, {
      alpha: 1,
      ease: Power2.easeOut,
      onStart: function() {
        back.clickBtn.visible = true;
      },
      onComplete: readyGame
    }, 1);
    tl.to(back.clickBtn, 0.4, {
      alpha: 0.5,
      repeat: -1,
      yoyo: true
    }, 1.5);
  }

  function gameOver() {
    stopGame = true;
    back.clickBtn.interactive = false;
    $('#countdown').text('');
    var tl = new TimelineMax();
    tl.to(back.clickBtn, 0.3, {
      alpha: 0,
      ease: Power2.easeOut,
      onComplete: function() {
        back.clickBtn.visible = false;
      }
    }, 0);
    tl.to(back.joelEllie, 0.1, {
      alpha: 1,
      repeat: 4,
      yoyo: true
    }, 2);
    tl.to(back.dialog[3], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 5,
      yoyo: true,
      ease: Power2.easeOut
    }, 2.5);
    tl.to(back.title, 0.5, {
      alpha: 1,
      ease: Expo.easeInOut,
      onStart: function() {
        back.title.y = 33 * s;
      }
    }, 6.5);
    tl.to(back.shareBtn, 0.5, {
      alpha: 1,
      ease: Expo.easeInOut,
      onStart: function() {
        back.shareBtn.visible = true;
      },
      onComplete: function() {
        back.shareBtn.interactive = true;
      }
    }, 8);
    tl.to(back.replayBtn, 0.5, {
      alpha: 1,
      ease: Expo.easeInOut,
      onStart: function() {
        back.replayBtn.visible = true;
      },
      onComplete: function() {
        back.replayBtn.interactive = true;
      }
    }, 8);
    var d = 25;
    tl.to(back.dialog[4], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 1,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 2;
    tl.to(back.dialog[5], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 5,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 6;
    tl.to(back.dialog[6], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 3,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 4;
    tl.to(back.dialog[7], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 5,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 6;
    tl.to(back.dialog[8], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 4,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 6;
    tl.to(back.dialog[9], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 2,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 3;
    tl.to(back.dialog[10], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 5,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 5;
    tl.to(back.dialog[11], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 3,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 4;
    tl.to(back.dialog[12], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 2,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 3;
    tl.to(back.dialog[13], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 4,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 6;
    tl.to(back.dialog[14], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 3,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 4;
    tl.to(back.dialog[15], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 4,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 5;
    tl.to(back.dialog[16], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 4,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 5;
    tl.to(back.dialog[17], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 2,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 4;
    tl.to(back.dialog[18], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 5,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 6;
    tl.to(back.dialog[19], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 3,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
    d += 6;
    tl.to(back.dialog[20], 0.3, {
      alpha: 1,
      repeat: 1,
      repeatDelay: 4,
      yoyo: true,
      ease: Power2.easeOut
    }, d);
  }

  function gameWin() {
    back.clickBtn.interactive = false;
    back.showElement();
    setTimeout(celebrate, 1000);
  }

  function celebrate() {
    var n = 0;
    var m = 0;
    var tl = new TimelineMax();
    var dx = -350;
    var dy = 100;

    for (i = 0; i < eggs.tray.length; i++) {
      tl.to(eggs.tray[i], 0.1, {
        alpha: 0
      }, 0.1);
    }

    var dn = Math.round(eggs.eggList.length / 2);
    if (dn > 5) {
      dn = 5;
    } else if (dn >= 3) {
      dx = -250;
    } else {
      dn = 2;
      dx = -180;
      dy = 40;
    }

    for (var i = 0; i < eggs.eggList.length; i++) {
      var eg = eggs.eggList[i];
      var xx = dx + n * 100;
      var yy = dy - m * 70;
      var tt = i * 0.05;
      eg.setSXY(xx - 3, yy);
      tl.to(eg.gg, 0.5, {
        bezier: {
          type: "thru",
          values: [{
            x: xx + 50,
            y: yy - 280
          }, {
            x: xx,
            y: yy
          }],
          autoRotate: false
        },
        ease: Power1.easeOut
      }, tt);
      setTimeout(eg.survive, parseInt((eggs.eggList.length * 0.05 + 0.6) * 1000));
      n++;
      if (n == dn) {
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
        var tx = tt.gg.x * s + eggs.wrap.x;
        var ty = tt.gg.y * s + eggs.wrap.y;
        cat.attack(tt, tx, ty);
        cats.push(cat);
      }

      setTimeout(forDoomHammer, ttt);
    }
  }

  function Timer() {
    var ttime = 20;

    this.start = function() {
      ttime = 20;
      countdown();
    };

    init();

    function init() {
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
          $('#countdown').text('');
          setTimeout(gameWin, 1000);
        }
      }
    }
  }

  function Back() {
    var self = this;
    this.ground = null;
    this.clickBtn = null;
    this.startBtn = null;
    this.shareBtn = null;
    this.replayBtn = null;
    this.canRun = true;
    this.joelEllie = null;
    this.title = null;
    this.dialog = [];
    var loading, mistletoe, wine, turner, wreath, lights = [];

    this.render = function() {};

    this.hideElement = function() {
      TweenMax.killAll(true,true,true,true);
      var tl = new TimelineMax();

      tl.to(self.shareBtn, 0.3, {
        alpha: 0,
        ease: Power2.easeOut,
        onComplete: function() {
          self.shareBtn.visible = false;
        }
      }, 0);
      tl.to(self.replayBtn, 0.3, {
        alpha: 0,
        ease: Power2.easeOut,
        onComplete: function() {
          self.shareBtn.visible = false;
        }
      }, 0);

      tl.to(turner, 0.3, {
        alpha: 0,
        ease: Power2.easeOut
      }, 0);
      tl.to(mistletoe, 0.3, {
        alpha: 0,
        ease: Power2.easeOut
      }, 0);
      tl.to(wine, 0.3, {
        alpha: 0,
        ease: Power2.easeOut
      }, 0);
      tl.to(wreath, 0.3, {
        alpha: 0,
        ease: Power2.easeOut
      }, 0);
      tl.to(self.joelEllie, 0.3, {
        alpha: 0,
        ease: Power2.easeOut
      }, 0);
      tl.to(self.title, 0.3, {
        alpha: 0,
        ease: Power2.easeOut
      }, 0);

      for (var i = 0; i < lights.length; i++) {
        tl.to(lights[i], 0.3, {
          alpha: 0,
          ease: Power2.easeInOut
        }, 0);
      }
    };

    this.showElement = function() {
      var tl = new TimelineMax();
      tl.to(self.clickBtn, 0.3, {
        alpha: 0,
        ease: Power2.easeOut,
        onComplete: function() {
          self.clickBtn.visible = false;
        }
      }, 0);
      tl.to(turner, 0.1, {
        alpha: 1,
        repeat: 4,
        yoyo: true
      }, 0);
      tl.to(mistletoe, 0.1, {
        alpha: 1,
        repeat: 4,
        yoyo: true
      }, 0);
      tl.to(wine, 0.1, {
        alpha: 1,
        repeat: 4,
        yoyo: true
      }, 0);
      tl.to(wreath, 0.1, {
        alpha: 1,
        repeat: 4,
        yoyo: true
      }, 0);
      tl.to(back.shareBtn, 0.5, {
        alpha: 1,
        ease: Expo.easeInOut,
        onStart: function() {
          back.shareBtn.visible = true;
        },
        onComplete: function() {
          back.shareBtn.interactive = true;
        }
      }, 3);
      tl.to(back.replayBtn, 0.5, {
        alpha: 1,
        ease: Expo.easeInOut,
        onStart: function() {
          back.replayBtn.visible = true;
        },
        onComplete: function() {
          back.replayBtn.interactive = true;
        }

      }, 3);

      for (var i = 0; i < lights.length; i++) {
        TweenMax.to(lights[i], 0.2, {
          alpha: 1,
          repeat: -1,
          repeatDelay: Math.random() + 0.3 + 0.05 * i,
          yoyo: true,
          ease: Expo.easeInOut
        });
      }
    };

    init();

    function init() {
      var s = 0;
      self.ground = new PIXI.Container();
      self.ground.alpha = 0;
      var tt = resource['bg'].texture;
      var t = new PIXI.Sprite(tt);
      t.height = h;
      s = t.scale.x = t.scale.y;
      t.x = 0;
      t.y = h - t.height;
      self.ground.addChild(t);

      turner = new PIXI.Sprite(resource['turner'].texture);
      turner.scale.set(s);
      turner.x = w - turner.width;
      turner.y = 280 * s;
      turner.alpha = 0;
      self.ground.addChild(turner);
      mistletoe = new PIXI.Sprite(resource['mistletoe'].texture);
      mistletoe.scale.set(s);
      mistletoe.x = turner.x - 24 * s;
      mistletoe.y = 268 * s;
      mistletoe.alpha = 0;
      self.ground.addChild(mistletoe);
      wine = new PIXI.Sprite(resource['wine'].texture);
      wine.scale.set(s);
      wine.x = w - 116 * s;
      wine.y = 396 * s;
      wine.alpha = 0;
      self.ground.addChild(wine);
      wreath = new PIXI.Sprite(resource['wreath'].texture);
      wreath.scale.set(s);
      wreath.x = 0;
      wreath.y = 0;
      wreath.alpha = 0;
      self.ground.addChild(wreath);

      var dd = new PIXI.Container();
      var t1 = resource['dialog_1'].texture;
      var t2 = resource['dialog_2'].texture;
      var t3 = resource['dialog_3'].texture;
      var style = {
        font: '24px Arial',
        fill: '#000000'
      };

      var tt1 = new PIXI.Sprite(t1);
      var tt2 = new PIXI.Sprite(t2);
      var tt3 = new PIXI.Sprite(t3);
      var tt4 = new PIXI.Text('Joel, 看我发现了什么！', style);
      tt3.width = 180;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 25;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 250 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('天啊，Ellie, 咱们一定要保护好他\n们，这可能是最后的生还者了。', style);
      tt3.width = 290;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 11;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 180 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('嗯，快！做好准备，\n它们...它们就要来了...', style);
      tt3.width = 170;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 11;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 250 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('唉，还是失败了，走吧，\n咱们继续去找火萤吧...', style);
      tt3.width = 200;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 11;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 180 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('嘿，等等...', style);
      tt3.width = 60;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 25;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 250 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('在波士顿的时候，我被咬的时候，\n我最好的朋友也在，她也被咬了...', style);
      tt3.width = 290;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 11;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 250 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('我们不知道该怎么办，所以...', style);
      tt3.width = 260;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 25;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 250 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('她就说：“我们先静观其变，说不\n定一起变成疯子也行，很诗意呀”', style);
      tt3.width = 290;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 11;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 250 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('我...还在等轮到我的那一刻...', style);
      tt3.width = 250;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 25;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 250 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('Ellie...', style);
      tt3.width = 10;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 25;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 180 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('她叫Riley，她是第一个牺牲者，\n然后是Tess，然后是Sam...', style);
      tt3.width = 270;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 11;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 250 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('这都不是你的错', style);
      tt3.width = 115;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 25;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 180 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('不，你不懂', style);
      tt3.width = 70;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 25;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 250 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('我也是为了生存下去一直努力奋斗', style);
      tt3.width = 310;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 25;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 180 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('而你...', style);
      tt3.width = 10;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 25;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 180 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('不论如何，你都得继\n续找到奋斗的目标', style);
      tt3.width = 160;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 11;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 180 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('我知道你并不想听这些，但是...', style);
      tt3.width = 280;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 25;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 180 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('向我发誓', style);
      tt3.width = 40;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 25;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 250 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('你发誓，你说过关于\n火萤的事都是真的', style);
      tt3.width = 160;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 11;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 250 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('我发誓', style);
      tt3.width = 15;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 20;
      tt4.y = 25;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 180 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);

      dd = new PIXI.Container();
      tt1 = new PIXI.Sprite(t1);
      tt2 = new PIXI.Sprite(t2);
      tt3 = new PIXI.Sprite(t3);
      tt4 = new PIXI.Text('好', style);
      tt3.width = 0;
      tt3.x = tt1.width;
      tt2.x = tt3.width + tt3.x;
      tt4.x = 35;
      tt4.y = 25;
      dd.addChild(tt1);
      dd.addChild(tt2);
      dd.addChild(tt3);
      dd.addChild(tt4);
      dd.x = 250 * s;
      dd.y = 590 * s;
      dd.alpha = 0;
      dd.scale.set(s);
      self.ground.addChild(dd);
      self.dialog.push(dd);



      tt = resource['light'].texture;
      var light = new PIXI.Sprite(tt);
      light.scale.set(s);
      light.x = 168 * s;
      light.y = 0;
      light.alpha = 0;
      light.tint = 0xde0505;
      self.ground.addChild(light);
      lights.push(light);
      var light = new PIXI.Sprite(tt);
      light.scale.set(s);
      light.x = 216 * s;
      light.y = 28 * s;
      light.alpha = 0;
      light.tint = 0x00ccff;
      self.ground.addChild(light);
      lights.push(light);
      var light = new PIXI.Sprite(tt);
      light.scale.set(s);
      light.x = 228 * s;
      light.y = 68 * s;
      light.alpha = 0;
      light.tint = 0xde0505;
      self.ground.addChild(light);
      lights.push(light);
      var light = new PIXI.Sprite(tt);
      light.scale.set(s);
      light.x = 180 * s;
      light.y = 91 * s;
      light.alpha = 0;
      light.tint = 0xf9e555;
      self.ground.addChild(light);
      lights.push(light);
      var light = new PIXI.Sprite(tt);
      light.scale.set(s);
      light.x = 212 * s;
      light.y = 136 * s;
      light.alpha = 0;
      light.tint = 0x00ccff;
      self.ground.addChild(light);
      lights.push(light);
      var light = new PIXI.Sprite(tt);
      light.scale.set(s);
      light.x = 164 * s;
      light.y = 156 * s;
      light.alpha = 0;
      light.tint = 0xde0505;
      self.ground.addChild(light);
      lights.push(light);
      var light = new PIXI.Sprite(tt);
      light.scale.set(s);
      light.x = 160 * s;
      light.y = 200 * s;
      light.alpha = 0;
      light.tint = 0xf9e555;
      self.ground.addChild(light);
      lights.push(light);
      var light = new PIXI.Sprite(tt);
      light.scale.set(s);
      light.x = 104 * s;
      light.y = 192 * s;
      light.alpha = 0;
      light.tint = 0x00ccff;
      self.ground.addChild(light);
      lights.push(light);
      var light = new PIXI.Sprite(tt);
      light.scale.set(s);
      light.x = 12 * s;
      light.y = 188 * s;
      light.alpha = 0;
      light.tint = 0xde0505;
      self.ground.addChild(light);
      lights.push(light);
      var light = new PIXI.Sprite(tt);
      light.scale.set(s);
      light.x = 44 * s;
      light.y = 232 * s;
      light.alpha = 0;
      light.tint = 0xf9e555;
      self.ground.addChild(light);
      lights.push(light);



      tt = resource['joel_ellie'].texture;
      self.joelEllie = new PIXI.Sprite(tt);
      self.joelEllie.scale.set(s);
      self.joelEllie.x = 220 * s;
      self.joelEllie.y = 700 * s;
      self.joelEllie.alpha = 0;
      self.ground.addChild(self.joelEllie);


      tt = resource['title'].texture;
      self.title = new PIXI.Sprite(tt);
      self.title.scale.set(s);
      self.title.x = 25 * s;
      self.title.y = 33 * s;
      self.title.alpha = 0;
      self.ground.addChild(self.title);

      self.clickBtn = new PIXI.Sprite(resource['clickBtn'].texture);
      self.clickBtn.anchor.x = 0.5;
      self.clickBtn.anchor.y = 1;
      self.clickBtn.x = w / 2;
      self.clickBtn.y = h;
      self.clickBtn.alpha = 0;
      self.clickBtn.visible = false;
      self.clickBtn.scale.set(s);
      self.ground.addChild(self.clickBtn);
      self.clickBtn.interactive = false;

      self.startBtn = new PIXI.Sprite(resource['startBtn'].texture);
      self.startBtn.anchor.x = 0.5;
      self.startBtn.anchor.y = 1;
      self.startBtn.x = w / 2;
      self.startBtn.y = h;
      self.startBtn.alpha = 0;
      self.startBtn.visible = false;
      self.startBtn.scale.set(s);
      self.ground.addChild(self.startBtn);
      self.startBtn.interactive = false;

      self.shareBtn = new PIXI.Sprite(resource['shareBtn'].texture);
      self.shareBtn.anchor.x = 0;
      self.shareBtn.anchor.y = 1;
      self.shareBtn.x = 0;
      self.shareBtn.y = h;
      self.shareBtn.alpha = 0;
      self.shareBtn.visible = false;
      self.shareBtn.scale.set(s);
      self.ground.addChild(self.shareBtn);
      self.shareBtn.interactive = true;

      self.replayBtn = new PIXI.Sprite(resource['replayBtn'].texture);
      self.replayBtn.anchor.x = 1;
      self.replayBtn.anchor.y = 1;
      self.replayBtn.x = w;
      self.replayBtn.y = h;
      self.replayBtn.alpha = 0;
      self.replayBtn.visible = false;
      self.replayBtn.scale.set(s);
      self.ground.addChild(self.replayBtn);
      self.replayBtn.interactive = false;

      self.startBtn.on("tap", function() {
        self.startBtn.interactive = false;
        coverOut();
      });

      self.clickBtn.on("tap", function() {
        if (cats.length > 0) {
          var index = parseInt(Math.random() * cats.length);
          cats[index].boom();
        }
      });

      self.replayBtn.on('tap', function() {
        self.replayBtn.interactive = false;
        replay();
      });
    }
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
    this.reset = function() {
      self.wrap.removeChildren();
      self.eggList = [];
      initEgg();
    };

    init();

    function init() {
      self.wrap = new PIXI.Container();
      self.wrap.alpha = 0;
      var trayTT;

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

      initEgg();

      self.wrap.x = Math.round(w * 0.64);
      self.wrap.y = Math.round(h - 467 * s);
      self.wrap.scale.x = self.wrap.scale.y = s;
    }

    function initEgg() {
      var eggTT = resource['egg'].texture;
      self.tray[5].x = -16;
      self.tray[5].y = 16;
      self.tray[5].alpha = 1;
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
        self.tray[i].alpha = 1;
        self.tray[(4 - i)].x = -16 - 12 * (i + 1);
        self.tray[(4 - i)].y = 16 + 24 * (i + 1);
        self.wrap.addChild(self.tray[(4 - i)]);
      }
      self.tray[0].x += 4;
    }
  }

  function Egg(_t, _p, _x, _y) {
    var self = this;
    this.active = true;
    this.gg = null;
    this.movie = null;
    var sx = 0,
      sy = 0;

    this.destroy = function() {
      var index = $.inArray(self, eggs.eggList);
      if (index >= 0) {
        eggs.eggList.splice(index, 1);
      }
      if (eggs.eggList.length == 0) {
        gameOver();
      }
    };
    this.survive = function() {
      var frames = [];
      for (var i = 1; i < 5; i++) {
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

      TweenMax.to(self.gg, 0.1, {
        alpha: 0,
        repeat: 4,
        yoyo: true
      });
      TweenMax.to(self.movie, 0.1, {
        alpha: 1,
        repeat: 4,
        yoyo: true
      });
      self.movie.play();
    };
    this.setSXY = function(_x, _y) {
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

      self.claw.scale.x = self.claw.scale.y = s;
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

$(function(){
	window.MessageBox = (function($){
		var $messageBoxList, $messageBox, $header, $body, $footer, blinkClass = "blink", exc = ["alarm", "error"]
		, type = {
				message : {
					txt : "메세지"
					, delay : 2000
					, isBlink : false
				}
				, info : {
					txt : "확인"
					, delay : 4000
					, isBlink : true
				}
				, alarm : {
					txt : "경고"
					, delay : 3000
					, isBlink : true
				}
				, error : {
					txt : "에러"
					, delay : 4000
					, isBlink : true
				}
		};
		var _init = function(){
			$messageBoxList = $("<div>", {'class' : 'sfp-message-box-list'});
			$messageBoxList.hide();
			$("body").append($messageBoxList);
			setInterval(blink, 1000);
		}
		, blink = function(){
			$('.sfp-message-box.blink .sfp-message-box-body').fadeOut(500).fadeIn(500);
		}
		, show = function( key, msg ){
			if(!window["POPHeader"] || (window["POPHeader"] && POPHeader.isAlarmMessage() && exc.indexOf(key) < 0)){
				var boxType = type[key];
				var box = _getBox(key, boxType.isBlink);
				box.header.text(boxType.txt);
				box.body.text(msg);
				$messageBoxList.append(box.main);
				$messageBoxList.show();
				preMessage = setTimeout(function(){
					box.remove();
				}, boxType.delay);
			}
		}
		, _getBox = function(mainclass, isBlink){
			var result = {
				main : $("<div>", {'class' : 'sfp-message-box ' + mainclass + ( isBlink ? " " + blinkClass : "")})
				, header : $("<div>", {'class' : 'sfp-message-box-header'})
				, body : $("<div>", {'class' : 'sfp-message-box-body'})
				, footer : $("<div>", {'class' : 'sfp-message-box-footer'})
				, remove : function(){
					this.main.slideUp( "slow", function(){
						$(this).remove();
						if($(".sfp-message-box-list").find(".sfp-message-box").length == 0){
							$(".sfp-message-box-list").hide();
						}
					});
				}
			};
			result.main.append(result.header).append(result.body).append(result.footer);
			return result;
		}
		, message = function(msg){
			show("message", msg);
		}
		, info = function(msg){
			show("info", msg);
		}
		, alarm = function(msg){
			show("alarm", msg);
		}
		, error = function(msg){
			show("error", msg);
		};
		_init();

		return {
			message : message
			, alarm : alarm
			, error : error
			, info : info
		}
	})(jQuery);

	window.BallonBox =(function($){
		var intervalId = 0, $ballon, exc = ["alarm","error"]
			options = {
				timeout : 0
				, direction : "up"		// up , down , left , right
				, proportion : "normal"	// big, small
			};

		var directionPosition = {
				common : function($selector){
					return {
						/*width : $selector.width()*/
						magnification : 1.5
					};
				}
				, getHeight : function($selector){
					return ($selector.height() - $ballon.height())/2;
				}
				, left : function($selector, position){
					var result = this.common($selector);
					result["top"] = position.top + this.getHeight($selector);
					result["left"] = position.left - $ballon.width() - 20;
					return result;
				}
				, right : function($selector, position){
					var result = this.common($selector);
					result["top"] = position.top + this.getHeight($selector)
					result["left"] = position.left + $selector.width() + 30;
					return result;
				}
				, up : function($selector, position){
					var result = this.common($selector);
					result["top"] = position.top - $ballon.height() - 20;
					result["left"] = position.left + $selector.width()/2 - $ballon.width()/2;
					return result;
				}
				, down : function($selector, position){
					var result = this.common($selector);
					result["top"] = position.top + $ballon.height();
					result["left"] = position.left + $selector.width()/2 - $ballon.width()/2;
					return result;
				}
		}
		var _init = function(){
			$ballon = $("<div>", {'class' : 'sfp-message-balloon small'});
			$ballon.hide();
			$("body").append($ballon.append("<span/>"));
		}
		, _show = function(main, selector, txt){
			if(!window["POPHeader"] || (window["POPHeader"] && POPHeader.isWorkGuideBalloon() && exc.indexOf(main) < 0)){
				$ballon.removeClass("message alarm error info big small normal").addClass(main).addClass(options.proportion);
				clearInterval(intervalId);
				var $selector = $(selector);
				$ballon.removeClass("up down left right").addClass(options.direction).show();
				$ballon.find("span").text(txt);
				$ballon.css(directionPosition[options.direction]($selector, $selector.offset()));
				if(options.timeout !== undefined && options.timeout > 0){
					intervalId = setTimeout(function(){
						$ballon.hide();
					}, options.timeout);
				}
			}
		}
		, message = function(selector, txt){
			_show("message", selector, txt);
		}
		, alarm = function(selector, txt){
			_show("alarm", selector, txt);
		}
		, error = function(selector, txt){
			_show("error", selector, txt);
		}
		, info = function(selector, txt){
			_show("info", selector, txt);
		}
		, setOption = function(key, val){
			options[key] = val;
		}
		, setOptions = function(opts){
			$.extend(options, opts);
		}
		, clear = function(){
			$ballon.hide();
		};
		_init();
		return {
			message : message
			, alarm : alarm
			, error : error
			, info : info
			, clear : clear
			, setOption : setOption
			, setOptions : setOptions
		};
	})(jQuery);
});
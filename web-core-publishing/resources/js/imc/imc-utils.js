/**
 *
 */
// ns 패턴형 util 패키지 정리후 모듈패턴형태로 재작업 예정
//'use strict';
var formValidator = function(obj){

	obj = $(obj);

	var tagName = obj.get(0).tagName;
	var required = obj.data("required");
	var value = $.trim( obj.val() );

	var who = obj.attr("placeholder");
	if(required !== undefined && required === true && value.length <= 0) {
		imcAlert(who + "은(는) 필수값입니다.");
		obj.focus();
		return false;
	}

	if(obj.data("valid") == 'number'){
		var min = obj.data("valid-min");
		if(min !== undefined && min !== '' && $.isNumeric(min) && (parseFloat(value) < parseFloat(min))){
			imcAlert(who + "은(는) 최소값보다 작습니다.");
			obj.focus();
			return false;
		}

		var max = obj.data("valid-max");
		if(max !== undefined && max !== '' && $.isNumeric(max) && (parseFloat(value) > parseFloat(max))){
			imcAlert(who + "은(는) 최대값보다 큽니다.");
			obj.focus();
			return false;
		}
	}

	return true;

}

var validator = (function($){
	var validateNumber = function(event) {

		this.value = this.value.replace(/[^0-9\.]/g,'');

//		var key = window.event ? event.keyCode : event.which;
//		if (event.keyCode == 8 || event.keyCode == 46
//				|| event.keyCode == 37 || event.keyCode == 39) {
//			return true;
//		}
//		else if ( key < 48 || key > 57 ) {
//			return false;
//		}
//		else return true;

	},

	validateString = function(event) {

	},

	validateDate = function(event) {

	},

	validateMaxSize = function(event) {
		var $this = $(this);

		var maxSize = $this.data("valid-max-size");
		var v = $this.val();

		if(getByteLength(v) > maxSize){
			$this.val(v.substr(0, maxSize));
//			this.value = this.value.substr(0, maxSize)
		}
	},

	getByteLength = function(s) {
		var totalByte = 0;
		for(var i =0; i < s.length; i++) {
			var currentByte = s.charCodeAt(i);
			if(currentByte > 128) totalByte += 2;
			else totalByte++;
		}
		return totalByte;
	};

	$(document).on("keyup focusout", "input[data-valid='number']", validateNumber);
	$(document).on("keypress focusout", "input[data-valid='string']", validateString);
	$(document).on("keypress focusout", "input[data-valid='date']", validateDate);
	$(document).on("keyup paste focusout", "input[data-valid-max-size]", validateMaxSize);

})(jQuery);

(function( $ ) {
	/**
	 * 현재 해당 요소의 도시여부(세로만 체크:현 프로젝트상 가로체크 불필요)를 체크하는 function
	 * @param parent
	 */
	$.fn.visible = function(parent) {
		var $parent = $(parent);
		var bHeight = $parent.height();
		var bTop = $parent.offset().top;
		var top = $(this).offset().top;
		if(top >= bTop && top < (bTop + bHeight)){
			return true;
		}
		return false;
	};

	$.fn.decideClass=function(a,d){return this[d?"addClass":"removeClass"](a)}

	$.fn.setData = function(data){
		if(data !== null && $.isPlainObject(data)){
			//data-set-exclude='true'
			this.find("input, select, textarea, td, span").not("[data-set-exclude='true']").each(function(idx, elem){
				var $this = $(this);
				var key = $this.attr("name") || $this.attr("id");
				if(key !== undefined){
					if($this.is("input, select")){
						$this.val(data[key]);
					}else{
						$this.text(data[key]);
					}
				}
			});
		}
	}

	$.fn.serializeObject = function() {
		var o = {};
		this.each(function() {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	$.fn.validate = function() {
		var result = true;
		$(this).find("[name]").each(function() {
			result = formValidator(this);
			return result;
		});
		return result;
	};}(jQuery));

var TimerManager = (function(){
	var timerList = [];
	var put = function(timer){
		timerList[timerList.length] = timer;
	},
	clear = function(){
		for(var i = 0, len = timerList.length; i < len ; i++){
			clearInterval(timerList[i]);
		}
		timerList = [];
	}
	return {
		put :put,
		clear : clear
	}
})();

var PageManager = (function(){
	var animateSpeed = 300;
	var nextPage = function(target, arriveLastFn){
		var $target = $(target);
		$target = $target.has(".sfp-grid-body-panel").length > 0 ? $target.find(".sfp-grid-body-panel") : $target;
		$target.animate({scrollTop:$target.scrollTop() + $target.height() + "px"}, animateSpeed, function(){
			if( ($target[0].scrollHeight <= $target.scrollTop() + $target.outerHeight()) && $.isFunction(arriveLastFn)){
				arriveLastFn.call(this);
			}

		});
	}
	, prevPage = function(target, arriveTopFn){
		var $target = $(target);
		$target = $target.has(".sfp-grid-body-panel").length > 0 ? $target.find(".sfp-grid-body-panel") : $target;
		$target.animate({scrollTop:$target.scrollTop() - $target.height() + "px"}, animateSpeed, function(){
			if( $target.scrollTop() == 0 && $.isFunction(arriveTopFn)){
				arriveTopFn.call(this);
			}
		});
	}
	, reset = function(target){
		var $target = $(target);
		$target.scrollTop(0);
	}
	, isEnd = function(target){
		var $target = $(target);
		if($target[0].scrollHeight <= $target.scrollTop() + $target.outerHeight()){
			return true;
		}
		return false;
	}
	, isFirst = function(target){
		return $target.scrollTop() == 0;
	};

	return {
		nextPage : nextPage, // 다음페이지
		prevPage : prevPage, // 이전페이지
		reset : reset,  // 최초
		isEnd : isEnd,  // 끝이니
		isFirst : isFirst // 처음이니
	}
})();


var numberCount = function( start, end, duration, target, toFixed, etc){
	$({ data : start }).animate({ data : end }, { duration : duration, complete : function(){
	}, step: function(now) {
		$(target).html(now.toFixed(toFixed) + "" + etc);
	}});
};

var getRGBColorByRate = function(oeeRateGrade){
	if(oeeRateGrade == 'good') {
		return "#65B8E2";
	}
	if(oeeRateGrade == 'normal') {
		return "#FFBD20";
	}
	if(oeeRateGrade == 'bad') {
		return "#F45152";
	}
	if(oeeRateGrade == 'off') {
		return "#E3E1E0";
	}
};

/* numerator에서 denominator를 나눈 퍼센트를 구한다 100이 넘으면 100 */
var getPercent = function(numerator, denominator){
//	alert(numerator + " | " + denominator);
	var result = 0.0;
	if(isNaN(numerator) || numerator == null) numerator = 0.0;
	if(isNaN(denominator) || denominator == null) denominator = 0.0;
	if(numerator == 0) return 0.0;
	if(denominator == 0) return 0.0;
	result = ((numerator/denominator)*100);
	if(result >= 100) result = 100.0;
	if(result < 0) result = 0.0;
	return result;
}

/* numerator에서 denominator를 나눈 퍼센트를 구한다 */
var getPercentNoLimit = function(numerator, denominator){
	var result = 0.0;
	if(isNaN(numerator) || numerator == null) numerator = 0.0;
	if(isNaN(denominator) || denominator == null) denominator = 0.0;
	if(numerator == 0) return 0.0;
	if(denominator == 0) return 0.0;
	result = ((numerator/denominator)*100);
	if(result < 0) result = 0.0;
	return result;
}

var progressbar = function() {
	var $bar, gauge, animate = 'Y';
		value = parseInt(this.getAttribute('data-value'));
	if (isNaN(value)) {
		return;
	}
	if(this.getAttribute('data-animate') !== null){
		animate = this.getAttribute('data-animate');
	}
	$bar = $(this);
	$('<span>').appendTo($bar)[0]
	gauge = $(this).children("span");
	if(animate == "Y"){
		gauge.animate({width: value + "%"},1000)
	}else{
		gauge.width(value + "%");
	}
}

var numberWithCommas = function(val){
	if( val == undefined || val == null || val == "" ) {
		val = 0;
	}
	return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var imcAlert = function(msg){
	alert(msg);
}


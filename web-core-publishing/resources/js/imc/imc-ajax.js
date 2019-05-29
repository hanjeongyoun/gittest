window.IMCURL = (function($){
	var _context = '/sfp2.0', onLoadCbFn = []; // 외부세팅으로 한군데서 공통관리하는게 맞는데..

	var setContextUrl = function(context){
		_context = context || '/sfp2.0';
		for(var i = 0, len = onLoadCbFn.length ; i < len ; i ++){
			$.isFunction(generate) &&  onLoadCbFn.call(this);
		}
	}
	, getUrl = function(url){
		return [_context , (url.indexOf('/') == 0 ? '' : '/') , url].join('');
	}
	, register = function(cb){
		onLoadCbFn[onLoadCbFn.length] = cb;
	}
	, locationHref = function(url, params){
		var query = jQuery.param(params);
		if(query != "") {
			if( query.indexOf("?") == -1 ){
				location.href = url + "?" + query;
			} else {
				location.href = url + "&" + query;
			}
		} else {
			location.href = url;
		}
	};
	return {
		setContextUrl : setContextUrl
		, getUrl : getUrl
		, locationHref : locationHref
	}
})(jQuery);

window.ImcAjax = (function($){
	var default_opt = {
			method : "POST",
			loader : 'yes',
			error : function(jqXHR, textStatus, errorThrown ){
				console.error(textStatus);
			}
		};
	var getMemoryName = function(tableNm, key, cbFn){//멀티키는 나중에
		$.ajax({
			method : "POST",
			url : IMCURL.getUrl('getMemoryName'),
			loader : 'no',
			data : {
				'key' : key,
				'tableNm' : tableNm,
			},
			success : function(data, resultTxt, req) {
				if($.isFunction(cbFn)){
					cbFn.call(this, data);
				}
			},
			error : function(jqXHR, textStatus, errorThrown ){
				console.error(textStatus);
			}
		});
	}
	, _ajax = function(cbFn, opt){
		opt =  $.extend({
			success : function(data, resultTxt, req) {
				if(_validate(data) && $.isFunction(cbFn)){
					cbFn.call(this, data);
				}
			}}, default_opt, opt);
		$.ajax(opt);
	}
	, ajax = function(url, param, cbFn, opt){
		if($.isArray(param)){
			ajaxRequestBody(url, param, cbFn, opt);
			return;
		}
		_ajax(cbFn , $.extend({url : url, data : param}, opt));
	}
	, ajaxRequestBody = function(url, param, cbFn, opt){
		_ajax(cbFn , $.extend({ contentType: "application/json", url : url, data : JSON.stringify(param) }, opt));
	}
	, _validate = function(result) {
		if($.isPlainObject(result) && result.hasOwnProperty('code')){
			if(result.code !== "000") {
				console.info(result.error);
				alert(result.message);
				return false;
			}
		}
		return true;
	}
	, setOptions = function(opts){
		$.extend(default_opt, opts);
	};
	return {
		  getMemoryName : getMemoryName
		, ajaxRequestBody : ajaxRequestBody
		, ajax : ajax
		, setOptions : setOptions
	}
})(jQuery);

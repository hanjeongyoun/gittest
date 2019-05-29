// 새로 만들 예정 by MHD
window.BoxTag = (function(){
	var typeNm = {"selectBox" : "selectBox", "radioBox" : "radio" , "checkBox" : "checkbox"}, _context, _url = "/getBox"
		, options = {
				selector : ""				//선택자
				, serviceName : "MemoryTable"	//서비스 ID , 미포함시 코드에서 조회
				, masterCd : null			//코드에서 조회시 필요한 코드그룹
				, firstTxt : null			//최초의 텍스트 추가. 미포함시 추가안됨
				, value : "slaveCd"			//value 로 사용할 키 , 코드에서 조회시 미포함
				, text : "slaveName"			//text 로 사용할 키, 코드에서 조회시 미포함
				, selectedValue : null		//선택하고싶은값
				, removeValue : []			//삭제하고 싶은 값
				, children : null			// select 에서 만 유형함 다중연계 변경이 필요한 경우 사용
				, tableNm : "sys_code_slave" //
				, vertical : false 			// 기본은 세로 check, radio 만
				, type : "checkBox" 			// 기본은 세로 check, radio 만
				, params : {}				// 추가할 파라미터
				, callFn : null				// function 단일 처리 후 리턴 되면 해당 그려진 데이터만 전달
				, filter : null				// function 리턴 true 일 경우 그림
			};
	var selectBox = ( function(){
		var draw = function(service, callFn){
			BoxTag.draw(service, callFn, 'selectBox');
		} ,
		generate = function(data, settings){
			var map = {};
			var html = _generate(data, settings, map);
			var $selector = $(settings.selector).empty().append(html);
			if($selector.length > 0 && settings.children != null && data.length > 0){
				_children(map[$(settings.selector).val()][settings.children.name], settings.children);
				$(settings.selector).on("change", onChange);
			}
			return html;
		},
		_generate = function(data, settings, map){
			var _html = [];
			settings.firstTxt && _html.push("<option value='' >", settings.firstTxt, "</option>");
			if(data != undefined && data != null){
				for(var i = 0 , len = data.length ; i < len ; i++){
					if(settings.removeValue === undefined || settings.removeValue.indexOf(data[i][settings.value]) < 0){
						if(!$.isFunction(settings.filter) || settings.filter.call(this, data[i]) == true){
							_html.push("<option value='", data[i][settings.value], "' ");
							_html.push("data-orgdata='" , JSON.stringify(data[i]),"' ");
							if(settings.children != null){
								settings.children.type = settings.type;
								_html.push("data-children='" , settings.children.name,"' ");
								_html.push("data-service='" ,JSON.stringify(settings.children),"' ");
							}
							if(settings.selectedValue){
								settings.selectedValue == data[i][settings.value] && _html.push(" selected=selected ");
							}else if(i == 0 && !settings.firstTxt){
								_html.push(" selected=selected ");
							}
							_html.push(">", data[i][settings.text],"</option>");
							map[data[i][settings.value]] = data[i];
						}
					}
				}
			}
			return _html.join("")
		},
		onChange = function(){
			var $selected =$(this).find("option:selected");
			var service = $selected.data("service");
			var orgData = $selected.data("orgdata");
			orgData && _children(orgData[$selected.data("children")], $selected.data("service"));
		}
		return {
			draw : draw,
			generate : generate,
			options : options
		}
	})()
	, checkBox = (function(){
			var draw = function(service, callFn){
				BoxTag.draw(service, callFn, 'checkBox');
			},
			generate = function(data, settings){
				var _html = [];
				for(var i = 0 , len = data.length ; i < len ; i++){
					if(settings.removeValue === undefined || settings.removeValue.indexOf(data[i][settings.value]) < 0){
						if(!$.isFunction(settings.filter) || settings.filter.call(this, data[i]) == true){
							_html.push('<div><input type="',typeNm[settings.type],'" id="',data[i][settings.value] ,
									'" name="', settings.selector ,'" value="', data[i][settings.value] ,
									'" /><label for="',data[i][settings.value],'">',data[i][settings.text],'</label></div>');
						}
					}
				}

				var $tag = $(_html.join(""));
				_checkedProp($tag, settings.selectedValue);
				if(!settings.vertical){
					$tag.filter("div").css("float" , "left");
				}
				$(settings.selector).empty().append($tag);
				$tag.find("input");
			},

			_checkedProp = function($tag, selectedValue){
				var selected = [];
				if($.isArray(selectedValue)){
					for(var i = 0, len = selectedValue.length; i < len ; i++){
						selected.push("#" + selectedValue[i]); // 공백을 위해서 + 로 처리함
					}
				}else if(selectedValue != null){
					selected.push("#" + selectedValue)
				}
				$tag.find(selected.join(", ")).prop("checked", true);
			};

		return {
			draw : draw,
			generate : generate,
			options : options
		}
	}())
	, radioBox = (function(){
		return {
			draw : function(service, callFn){
				BoxTag.draw(service , callFn, 'radioBox');
			},
			generate :  function(data, settings){
				checkBox.generate(data, settings);
				var $selector = $(settings.selector).find("input[type='radio']");
				if( $selector.filter(":checked").length == 0){
					$selector.eq(0).prop("checked", true);
				}
			},
			options : checkBox.options
		};
	}()),
	_camelize = function camelize(str) {
	    return str.replace(/_(.)/g, function(match, chr) {
	    	return chr.toUpperCase();
		});
	},
	_getParam = function(service){
		return $.extend(true, {}, { serviceName :  options.serviceName , params : { key : options.tableNm, value : options.masterCd } }
					, { serviceName :  service.serviceName, params : { key : service.tableNm, value : service.masterCd } }
					, { params : service.params } );
	},
	_children = function(data, service){
		var comp = BoxTag[service.type];
		comp.generate.call(this, data, $.extend( {}, comp.options, service ));
	},
	draw = function(service, callFn, type, etc){
		var params = { list : [] };
		if(!$.isArray(service)){
			service = [service]
		}
		for(var i = 0, len = service.length; i < len ; i++){
			if(type !== undefined && type != null && type != ""){
				service[i].type = type;
			}
			params.list[params.list.length] = _getParam(service[i])
			service[i] = $.extend( {} , options , service[i]);
		}
		callAjax(params, service, callFn, etc);
	},
	callAjax = function(params, settings, completeFn, etc){
		$.ajax({
			method : "POST",
			url : IMCURL.getUrl(_url),
			data : JSON.stringify(params),
			contentType: "application/json",
			success : function(data, resultTxt, req) {
				var html = [];
				if($.isArray(data)){
					for(var i = 0, len = data.length; i < len ; i++){
						var generate = BoxTag[settings[i].type].generate;
						if($.isFunction(generate)){
							html[html.length] = generate.call(this, data[i], settings[i]);
							if($.isFunction(settings[i].callFn)){	// 개별 완료 콜백
								settings[i].callFn.call(this, data[i], html);
							}
						}
					}
				}
				if($.isFunction(completeFn)){ // 전체 완료 콜백
					completeFn.call(this, data, html, etc);
				}
			},
			error : function( jqXHR, textStatus, err ){
				console.error(textStatus);
			},
			complete : function(response){
				if (response && response.responseJSON) {
				}
			}
		});
	}
	return {
		selectBox: selectBox,
		radioBox : radioBox,
		checkBox : checkBox,
		draw : draw
	}
})();
/*
 * IMC 의 Template 플러그인
 * by MHD
 */
$.widget( "imc.template", {
	// default options
	options: {
		height : '700px'
		, classes : ''  // 기본 클래스
		, addClasses : ''  // 추가 클래스
		, isFocus : false  // 새로운 행 추가 addRows 에 대해 자동 스크롤 및 포커싱
		, isSortable : false
		, isChange : false // input 내용 변경 확인
	},

	// the constructor
	_create: function() {
		this.element.css('height', this.options.height);
		this.element.addClass(this.options.addClasses);
		this.setTemplate(this.options.templateModel == null ? this.element.attr('id') : this.options.templateModel);
		this.elTag = "sfp-template-el";
		this.elTagClass = ".sfp-template-el";
	},

	_refresh: function() {
		this.draw();
	},

	setTemplate : function(dataModelId){
		this.template = $('[data-model='+dataModelId+']').html();
	},

	setTemplateHtml : function(html){
		this.template = html;
	},

	getTemplateHtml : function(){
		return this.template;
	},

	removeRows : function(cbFn){
		this.element.find(this.elTagClass).each(function(){
			if($.isFunction(cbFn)){
				var $this = $(this);
				if(cbFn.call(this, $(this).data('org_data'))){
					$this.remove();
				}
			}
		});
	},
	filter : function(cbFn){
		this.element.find(this.elTagClass).each(function(){
			if($.isFunction(cbFn)){
				var $this = $(this);
				if(cbFn.call(this, $(this).data('org_data'))){
					$this.show();
				}else{
					$this.hide();
				}
			}
		});
	},
	setFocus : function(){
		this.element.scrollTop(this.element.height()+this.element.height());
		this.element.find(this.elTagClass).last().find("input, select").eq(0).focus();
	},
	removeRowIndex : function(idx){
		this.element.find(this.elTagClass).eq(idx).remove();
	},
	addAfter : function(obj, row, cbFn){
		$(obj).closest(this.elTagClass).after(this._generateRow(row, cbFn));
	},
	addBefore : function(obj, row, cbFn){
		$(obj).closest(this.elTagClass).before(this._generateRow(row, cbFn));
	},
	addRows : function(row, cbFn){
		if(!$.isArray(row)){
			row = [row];
		}
		this._draw(row, cbFn, true, false);
		if(this.options.isFocus){
			this.setFocus();
		}
	},
	addFirstRows : function(row, cbFn){
		if(!$.isArray(row)){
			row = [row];
		}else{
			row = row.reverse();
		}
		this._draw(row, cbFn, true, true);
	},
	getData : function(obj){
		var $tr = $(obj).closest(this.elTagClass);
		var val = {};
		$tr.find('input, select, [data-object]').each(function(){
			var $this = $(this);
			var data = $this.data('object');
			if(data){
				val[$this.attr('name')] = $this.data('object');
			}else if($this.is('[type=checkbox]')){
				val[$this.attr('name')] = this.checked ? 'Y' : 'N';
			}else{
				val[$this.attr('name')] = $this.val();
			}
		});
		return $.extend({}, $tr.data('org_data'), val);
	},

	_setRowValue : function($tr, row){
		$tr.find('input, select').each($.proxy(function(idx, el){
			var $el = $(el);
			var name = $el.attr('name');
			if(row[name] != null){
				if(typeof row[name] === 'object'){
					$el.data('object', row[name]);
				}else if($el.is('[type=checkbox]')){
					el.checked = row[name] == 'Y' ? true : false;
				}else{
					$el.val(row[name]);
				}
			}
		}, this));
	},
	resetRow : function(obj){
		var $tr = $(obj).closest(this.elTagClass);
		this._setRowValue($tr, $tr.data('org_data'));
	},
	mergeData : function(obj, row){
		this._setRowValue($(obj).closest(this.elTagClass), row);
	},
	redrawData : function(obj, row){
		this._merge($(obj).closest(this.elTagClass), row);
	},
	redrawDataByIndex : function(idx, row){
		this._merge(this.element.find(this.elTagClass).eq(idx), row);
	},
	_merge : function($tr, row){
		var orgRow = $tr.data('org_data');
		row = $.extend({}, orgRow, row);
		var $el = this._generateElement(row).data('org_data', orgRow);
		return $tr.replaceWith($el);
	},
	getDataList : function(cbFn, isStop){
		var result = [];
		var _this = this;
		this.element.find(this.elTagClass).each(function(idx, el){
			var val = _this.getData(el);
			if(cbFn === undefined || ($.isFunction(cbFn) && cbFn.call(el, val))){
				result[result.length] = val;
				if(isStop == true){
					return false;
				}
			}
		});
		return result;
	},
	getChangedDataList : function(){
		var result = [];
		var _this = this;
		this.element.find(this.elTagClass).each(function(idx, el){
			var $tr = $(this);
			var orgData = $tr.data('org_data');
			$tr.find('input, select').each(function(){
				var $this = $(this);
				if(orgData[$this.attr('name')] != $this.val()){
					result[result.length] = _this.getData(el);
					return false;
				}
			});
		});
		return result;
	},
	draw : function(list, cbFn){
		this._draw(list, cbFn, false, false);
	},
	_draw : function(list, cbFn, useNotEmpty, isFirst){
		var tmp = this.getTemplateHtml();
		!useNotEmpty && this.element.empty();
		for(var i = 0, len= list.length; i < len ; i++){
			var $el = this._generateElement(list[i], cbFn, tmp);
			if($el == null){
				continue;
			}
			isFirst ? this.element.prepend($el) : this.element.append($el)
		}
	},
	_generateElement : function(el, cbFn, tmp){
		tmp = tmp === undefined ? this.getTemplateHtml() : tmp;
		var rowData = $.extend({}, el);
		if($.isFunction(cbFn) && cbFn.call(this, rowData) == false){
			return null;
		}
		var $el = this._templateTag(rowData, tmp).addClass(this.elTag).data('org_data', el);
		this._setRowValue($el, rowData);
		return $el;
	},
	_templateTag : function(elData, tmp){
		return $(tmp.replace(/@{(\w+[.]?)+}/g, function(val){
			var convertValue = function(key, data){
				key = key.replace(/(@{|})/g, '');
				return reculsive(key.split(".") , data);
			},
			reculsive = function(keys, data){
				var result = data[keys[0]];
				if(result === undefined || result === null){
					return '';
				}

				if(keys.length > 1){
					return reculsive( keys.slice(1), result);
				}
				return result;
			}
			return convertValue(val, elData);
		}));
	},
	_setOption: function( key, value ) {
		if(/height/.test(key)){
			this.element.css('height', value);
		}
		this._super( key, value );
	},

	_destroy: function() {
		this.element.remove();
	}
});
/*
 * IMC 의 Grid 플러그인 // 전체적으로 이름 변경해야함
 * by MHD
 */
$.widget( "imc.grid", {
	// default options
	options: {
		isHeaderFix : true
		, isFooterFix : true
		, boxShadow : false
		, height : '821px'
		, classes : 'sfp-grid'  // 기본 클래스
		, addClasses : ''  // 추가 클래스
		, header : [[]] // {name:'', width :'', colspan : 2, rowspan :2, sunIndex}
		, isSelected : false  // 선택 모드 활성화 .tbtn-select 클래스가 눌렀을 경우만 셀렉트되도록 막았음
		, isFocus : false  // 새로운 행 추가 addRows 에 대해 자동 스크롤 및 포커싱
		, isSortable : false
		, isChange : false // input 내용 변경 확인
		, isScrollY : true  // 이름 변경해야함
		, isScrollX : false
		, templateModel : null
		, isClickable : false
		, isCRUD : false
		, optCRUD : {
			icon : {
				width : '60px'
				, text :''
			}
			,btn : {
				width : '80px'
				, text : '작업'
			}
		}
		, boxTag : null
	},
	CRUD : {
		'C' : { mode : 'C', btn : function(obj){
			this.removeRow(obj);
		}} ,
		'R' : { mode : 'R', btn : function(obj){
			this.removeRow(obj);
		}},
		'U' : { mode : 'U', btn : function(obj){
			this.resetRow($(obj).closest('tr'));
		}},
		'D' : { mode : 'D', btn : function(obj){
			var $tr = $(obj).closest('tr');
			$tr.removeClass('C R U D').addClass(this.CRUD.R.mode).find('input, select').not("[data-grid-disabled-fix='true']").attr("disabled", false);
			$tr.data('crud-mode',this.CRUD.R.mode);
		}},
	},
	// the constructor
	_create: function() {
		this._createInner();
		this._setHeader(this.options.header);
		this._setFooter(this.options.footer);
		this.setTemplate(this.options.templateModel == null ? this.element.attr('id') : this.options.templateModel);
		this._setSort();
	},

	_setHeader : function(header){
		this._appendHF(this.thead, header, '<th>');
		this.header.empty().append(this.table.clone()).find("tbody, tfoot").remove();
		this.header.find("thead").show();
		this.setFixHeader(this.options.isHeaderFix);
	},

	_setFooter : function(footer){
		this._appendHF(this.tfoot, footer, '<td>');
		this.footer.empty().append(this.table.clone()).find("thead, tbody").remove();
		this.footer.find("tfoot").show();
		this.setFixFooter(this.options.isFooterFix);
	},

	_setSort : function(){
		if(this.options.isSortable){
			this.element.on('click', 'th', $.proxy(function(e){
				var $th = $(e.target);
				if(!$th.hasClass('arrow') || $th.hasClass('bottom')){
					$th.removeClass('bottom')
					this.sort($(e.target).index() ,1)
				}else{
					$th.addClass('bottom')
					this.sort($(e.target).index() ,-1)
				}
				$th.addClass('arrow');
			}, this));
		}
	},

	_createInner : function(){
		var scroll = ( this.options.isScrollY ? 'scroll' : 'hidden');
		this.header = $('<div>', {'class' : 'sfp-grid-header-panel', 'style' : 'overflow-x: hidden;overflow-y: ' + scroll});
		this.body = $('<div>', {'class' : 'sfp-grid-body-panel',
			'style' : ['overflow-y:',scroll,'; overflow-x:',( this.options.isScrollX ? 'scroll' : 'hidden')
				,';height: ', this.options.height].join('')
			});
		this.footer = $('<div>', {'class' : 'sfp-grid-footer-panel', 'style' : 'overflow-x:hidden;overflow-y: ' + scroll});
		this.table = $('<table>', {'class' : this.options.classes }).addClass(this.options.addClasses);
		this.options.isCRUD && this.table.addClass('crud');
		this.colgroup = $('<colgroup>');
		this.thead = $('<thead>')
		this.tbody = $('<tbody>');
		this.tfoot = $('<tfoot>');
		this.element.addClass("sfp-grid-panel").append(
				this.header,
				this.body.append(this.table.append(this.colgroup, this.thead, this.tbody, this.tfoot)),
				this.footer)
			.on('click', "[data-useClick='true'], img.crud-btn, .crud-evt-target", $.proxy(function(e, t){ // button:not(.flow-controller > button)
				if(t == undefined){
					var $this = $(e.target);
					e.stopImmediatePropagation();
					$this.trigger(e.handleObj.type, [this.getData($this.closest('tr')), $this.closest('tr').index()]);
				}
				return false;
			}, this));
		this.bindEvent();
		this.summaryList = [];
	},

	bindEvent : function(){
		if(this.options.isSelected){
			this.tbody.on('click', '.tbtn-select', function(){// tr,  해야함
				var $this = $(this);
				$this.closest('tbody').find('tr').removeClass( "selected" );
				$this.closest('tr').addClass( "selected" );
			});
		};
		if(this.options.isChange){
			this.tbody.on('keyup', 'input', function(){
				var $tr = $(this).closest('tr');
				var orgData = $tr.data('org_data');

				$tr.find("input[type='text']").each(function(idx, element){
					if(orgData[element.name] != element.value){
						$tr.addClass("selected");
						return false;
					}else{
						$tr.removeClass("selected");
					}
				});
			});
		};

		var $grid = this;
		this.tbody.on('keyup change', 'input, select', function(e){
			var $this = $(e.target);
			var $tr = $this.closest('tr');
			if(!$tr.hasClass('C')){
				$tr.removeClass('C R U D').addClass($grid.CRUD.R.mode);
				$tr.data('crud-mode',$grid.CRUD.R.mode);

				if($this.data('org-data') !== $this.val()){
					$tr.removeClass('C R U D').addClass($grid.CRUD.U.mode);
					$tr.data('crud-mode',$grid.CRUD.U.mode);
				}else{
					$tr.find("input[type='text']").each(function(idx, el){
						var $el = $(el);
						if($el.data('org-data') != el.value){
							$tr.removeClass('C R U D').addClass($grid.CRUD.U.mode);
							$tr.data('crud-mode',$grid.CRUD.U.mode);
							return false;
						}
					});
				}
			}
		});

		this.table.on('click', 'span.crud-btn', $.proxy(function(e) {
			this.CRUD[$(e.target).closest('tr').data('crud-mode')].btn.call(this, e.target);
		}, this));

		if(this.options.isScrollX){
			this.body.on('scroll', $.proxy(function(){
				this.header.scrollLeft(this.body.scrollLeft());
				this.footer.scrollLeft(this.body.scrollLeft());
			}, this));
		}
	},
	mostup : function(obj){
		this.tbody.prepend($(obj).closest('tr'));
		this.setSortNum();
	},
	up : function(obj){
		var $tr = $(obj).closest('tr');
		$tr.first().prev().before($tr);
		this.setSortNum();
	},
	mostdown : function(obj){
		this.tbody.append($(obj).closest('tr'));
		this.setSortNum();
	},
	down : function(obj){
		var $tr = $(obj).closest('tr');
		$tr.last().next().after($tr);
		this.setSortNum();
	},
	setFixHeader : function(used){
		this._setFixHF(this.header, this.thead, used);
	},
	setFixFooter : function(used){
		this._setFixHF(this.footer, this.tfoot, used);
	},
	_setFixHF : function($panel, $t, used){
		if(used){
			$t.hide()
			$panel.show();
		}else {
			$t.show()
			$panel.hide();
		}
	},
	_appendHF : function(target, list, html){
		if(list != null && list.length > 0){
			var maxRow = 1;
			for(var i = 0 , ilen = list.length ; i < ilen ; i++){
				var $tr =  $('<tr>')
				var row = list[i];
				for(var j = 0 , jlen = row.length ; j < jlen ; j++){
					var $th =  $(html)
					if(typeof row[j] === 'string'){
						target == this.thead && i == 0 && this._addcol(1);
						$th.html(row[j]);
					}else{
						var colspan = row[j].colspan == undefined ? 1 : row[j].colspan;
						if($.isArray(row[j].width) && row[j].width.length != colspan){
							row[j].width = row[j].width.slice(0, row[j].width.length-1);
						}
						target == this.thead && i == 0 && this._addcol(colspan, row[j].width);

						row[j].colspan != undefined && $th.attr('colspan', row[j].colspan);
						row[j].rowspan != undefined && ($th.attr('rowspan', row[j].rowspan), maxRow=row[j].rowspan);
						row[j].id != undefined && $th.attr('id', row[j].id);
						if(row[j].sumIndex !== undefined){
							this.summaryList[this.summaryList.length] = row[j].sumIndex;
							$th.attr('data-summary',row[j].sumIndex);
							$th.data('summary',row[j].sumIndex)
						};
						$th.html(row[j].name);
						$th.addClass(row[j].classes)
					}
					$tr.append($th);
				}
				i == 0 && this.options.isCRUD && this._appendCrudHF($tr, html, maxRow);
				target.append($tr);
			}
		}
	},
	_appendCrudHF : function($tr, html, maxRow){
		var $icon = $(html), $btn = $(html);
		$icon.text(this.options.optCRUD.icon.text);
		$icon.attr('rowspan', maxRow);
		$btn.text(this.options.optCRUD.btn.text);
		$btn.attr('rowspan', maxRow);
		this.colgroup.prepend($('<col>', {'style' : 'width:' + this.options.optCRUD.icon.width}))
			.append($('<col>', {'style' : 'width:' + this.options.optCRUD.btn.width}));
		$tr.prepend($icon ).append($btn);
	},
	_addcol : function(rec, width){
		this.colgroup.append($('<col>', {'style' : 'width:' + (width == undefined ? '*':
			$.isArray(width) ? width[width.length-rec] : width)}));
		--rec > 0 && this._addcol(rec, width);
	},

	refresh: function(opt) {
		$.extend(this.options, opt);
		this.element.empty();
		this._create();
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

	removeRows : function(cbFn){ // crud 모드 적용해야하나?
		this.tbody.find('tr').each(function(){
			if($.isFunction(cbFn)){
				var $this = $(this);
				if(cbFn.call(this, $(this).data('org_data'))){
					$this.remove();
				}
			}
		});
		this.summary();
	},
	filter : function(cbFn, isContinueHide){
		isContinueHide = isContinueHide === undefined ? true : isContinueHide;
		this.tbody.find('tr').each(function(){
			if($.isFunction(cbFn)){
				var $this = $(this);
				var isShow = $this.data('show') === undefined ? true : $this.data('show');
				if(cbFn.call(this, $this.data('org_data'), isShow)){
					$this.show();
					$this.data('show', true);
				}else{
					$this.hide();
					$this.data('show', false);
					if(!isContinueHide) return false;
				}
			}
		});
	},
	// 콜백함수에 조건에 해당되는 행만 도시
	show : function(cbFn){
		this.tbody.find('tr').each(function(){
			if($.isFunction(cbFn)){
				var $this = $(this);
				if(cbFn.call(this, $this.data('org_data'))){
					$this.show();
					$this.data('show', true);
				}
			}
		});
	},
	// 콜백함수에 조건에 해당되는 행만 숨김
	hide : function(cbFn){
		this.tbody.find('tr').each(function(){
			if($.isFunction(cbFn)){
				var $this = $(this);
				if(cbFn.call(this, $this.data('org_data'))){
					$this.hide();
					$this.data('show', false);
				}
			}
		});
	},
	setFocus : function(){
		this.body.scrollTop(this.tbody.height()+this.body.height());
		this.tbody.find('tr').last().find("input, select").eq(0).focus();
	},
	clear : function(){
		this.tbody.empty();
		this.summary();
	},
	// 특정 tr 삭제 index 로
	removeRowIndex : function(idx, isHide){
		var $tr = this.tbody.find('tr').eq(idx);
		this._remove($tr, isHide);
	},
	removeRow : function(obj, isHide){
		var $tr = $(obj).closest('tr');
		this._remove($tr, isHide);
	},
	_remove : function($tr, isHide){
		if($tr.data('crud-mode') == this.CRUD.C.mode || (!this.options.isCRUD && !isHide)){
			 $tr.remove();
		}else{
			if(this.options.isCRUD){
				$tr.removeClass('C R U D').addClass(this.CRUD.D.mode).find('input, select').attr("disabled", true);
			}else{
				$tr.hide();
			}
			$tr.data('crud-mode',this.CRUD.D.mode);
		}
		this.setSortNum();
		this.summary();
	},
	addAfter : function(obj, row, cbFn){
		$(obj).closest('tr').after(this._generateRow(row, this.CRUD.C, cbFn));
		this.setSortNum();
		return this;
	},
	addBefore : function(obj, row, cbFn){
		$(obj).closest('tr').before(this._generateRow(row, this.CRUD.C, cbFn));
		this.setSortNum();
	},
	addRows : function(row, cbFn){
		if(!$.isArray(row)){
			row = [row];
		}
		this._draw(row, cbFn, true, false, this.CRUD.C);
		if(this.options.isFocus){
			this.setFocus();
		}
	},

	addRowHtml : function(html){
		this.tbody.append(html);
	},

	addFirstRows : function(row, cbFn){
		if(!$.isArray(row)){
			row = [row];
		}else{
			row = row.reverse();
		}
		this._draw(row, cbFn, true, true, this.CRUD.C);
	},
	getData : function(obj){
		var $tr = $(obj).closest('tr');
		var val = {};
		$tr.find('input, select, [data-object]').each(function(){
			var $this = $(this);
			var data = $this.data('object');
			if($this.attr('name') !== undefined){
				if(data){
					val[$this.attr('name')] = $this.data('object');
				}else if($this.is('[type=checkbox]')){
					val[$this.attr('name')] = this.checked ? 'Y' : 'N';
				}else{
					val[$this.attr('name')] = $this.val();
				}
			}
		});
		return $.extend({}, $tr.data('org_data'), val, {crudMode : $tr.data('crud-mode')});
	},

	_setRowValue : function($tr, row){ //merge 와 혼용되어 있으니.. 문제임.
		$tr.find('input, select, td').each($.proxy(function(idx, el){
			var $el = $(el);
			var name = $el.attr('name');
			if(row[name] != null){
				if(typeof row[name] === 'object'){
					$el.data('object', row[name]);
				}else if($el.is('[type=checkbox]')){
					el.checked = row[name] == 'Y' ? true : false;
				}else if(!$el.is('td')){
					$el.val(row[name]);
					$el.data('org-data', row[name]);
				}else{
					$el.text(row[name]);
				}
			}else if(row[name] !== null && $el.data('org-data') != null){
				$el.val($el.data('org-data'));
			}else{
				$el.data('org-data', $el.val());
			}
		}, this));
	},
	resetRow : function(obj, cbFn){
		var $tr = $(obj).closest('tr');
		var row = $tr.data('org_data');
		$.isFunction(cbFn) && cbFn.call(this, row);
		this._setRowValue($tr, $tr.data('org_data'));
		$tr.removeClass('C R U D').addClass(this.CRUD.R.mode);
		$tr.data('crud-mode',this.CRUD.R.mode);
	},
	mergeData : function(obj, row){
		var $tr = $(obj).closest('tr');
		var orgRow = $tr.data('org_data');
		row = $.extend({}, orgRow, row);
		this._setRowValue($tr, row);
	},
	merge : function(obj, row, cbFn){
		var $tr = $(obj).closest('tr');
		var orgRow = $tr.data('org_data');
		row = $.extend({}, orgRow, row);
		this._merge($tr, row, cbFn);
	},
	redrawData : function(obj, row, cbFn){
		this._merge($(obj).closest('tr'), row, cbFn);
	},
	redrawDataByIndex : function(idx, row, cbFn){
		this._merge(this.tbody.find('tr').eq(idx), row, cbFn);
	},
	_merge : function($tr, row, cbFn){
		var $el = this._generateRow(row, this.CRUD.U, cbFn);
		return $tr.replaceWith($el);
	},
	getDataListCRUD : function(cbFn, isStop){
		return this.getDataList(cbFn, isStop, true);
	},
	getDataList : function(cbFn, isStop, crud){
		var result = [];
		var _this = this;
		this.tbody.find('tr').each(function(idx, el){
			var val = _this.getData(this);
			val.rowNum = idx + 1;
			val.crudMode = $(this).data('crud-mode');
			if((cbFn === undefined || ($.isFunction(cbFn) && cbFn.call(this, val, idx) != false))
					&& (crud === undefined || (crud == true && val.crudMode != 'R'))){
				result[result.length] = val;
				if(isStop == true){
					return false;
				}
			}
		});
		return result;
	},
	getChangedDataList : function(){ // TODO 앞으로 불필요 function 임
		var result = [];
		var _this = this;
		this.tbody.find('tr').each(function(idx, el){
			var $tr = $(this);
			var orgData = $tr.data('org_data');
			$tr.find('input, select').each(function(){
				var $this = $(this);
				var data = orgData[$this.attr('name')];
				if(data === undefined) return;
				if( (typeof data !== 'object' && data != $this.val())
						|| (typeof data === 'object' && data.length != $this.data('object').length)){
					result[result.length] = _this.getData(el);
					return false;
				}
			});
		});
		return result;
	},
	sort : function(idx , order){ // order =>  내림 차순 -1, 오름차순 = 1
		var rows = this.tbody.find('tr').get();
		order === undefined &&  (order = 1);
		var rows = this.tbody.find('tr').get();
		rows.sort(function(prev , next) {
			var $prev = $(prev).children('td').eq(idx);
			var $next = $(next).children('td').eq(idx);
			var A = $prev.has('input').length > 0 ? $prev.find('input').val().toUpperCase() : $prev.text().toUpperCase();
			var B = $next.has('input').length > 0 ? $next.find('input').val().toUpperCase() : $next.text().toUpperCase();
			A = $.isNumeric(A) == true ? Number(A) : A;
			B = $.isNumeric(B) == true ? Number(B) : B;
			if (A < B) {return -1 * order;}
			if (A > B) {return 1 * order;}
			return 0;
		});
		this.tbody.append(rows);
	},
	summary : function(){
		var sum = {};
		if(this.summaryList.length > 0){
			for(var i = 0 , len = this.summaryList.length ; i < len ; i++ ){
				var list = this.summaryList[i];
				!$.isArray(list) && (list = [list]);
				for(var j = 0 , jlen = list.length ; j < jlen ; j++){
					var index = list[j];
					if(sum[index] === undefined){
						sum[index] = 0;
						this.tbody.find('tr[data-skip-sum!="true"]:visible td:nth-child(' + (index + 1) + ')').each(function(){
							var $this = $(this);
							var $input = $this.find('input');
							var val = $input.length > 0 ? $input.val() : $this.text();
							if($.isNumeric(val)){
								sum[index] += parseInt(val);
							}
						});
					}
				}
			}
			this.element.find('tr [data-summary]').each($.proxy(function(idx, el){
				var $el = $(el), list = $el.data('summary'), total = 0 ;
				!$.isArray(list) && (list = [list]);
				for(var i = 0 , len = list.length ; i < len ; i ++){
					total += sum[list[i]];
				}
				$el.html(total);
			},this));
		}
		this.setSortNum();
	},
	setSortNum : function(){
		this.element.find('tr [data-sort]').each(function(idx){
			$(this).text(idx+1);
		})
	},
	_setBoxTagHtml : function(data, boxhtml, etc){
		this.boxData = data;
		this.boxhtml = boxhtml;
		this._draw(etc.list, etc.cbFn, false, false, this.CRUD.R);
	},
	draw : function(list, cbFn){
		if(this.options.boxTag && !this.boxhtml){
			BoxTag.draw(this.options.boxTag, $.proxy(this._setBoxTagHtml, this), null, {list:list, cbFn:cbFn});
		}else{
			this._draw(list, cbFn, false, false, this.CRUD.R);
		}
	},
	_draw : function(list, cbFn, useNotEmpty, isFirst, crud){
		!useNotEmpty && this.tbody.empty();
		for(var i = 0, len= list.length; i < len ; i++){
			if($.type(list[i]) === "string"){
				list[i] = { _val : list[i] };
			}
			list[i].rowNum = i+1;//순번 추가
			var $tr = this._generateRow(list[i], crud, cbFn);
			if($tr == null){
				continue;
			}
			isFirst ? this.tbody.prepend($tr) : this.tbody.append($tr);
			this._setBoxTag($tr, list[i]);
		}
		this.summary();
		Dialog.resize();
	},
	_setBoxTag : function($tr, data){
		if(this.options.boxTag){
			!$.isArray(this.options.boxTag) && (this.options.boxTag = [this.options.boxTag]);
			for(var i = 0, len= this.options.boxTag.length ; i < len ; i++){
				(this.options.type === undefined || this.options.type === null) && (this.options.type = "selectBox");
				var boxtag = $.extend({}, this.options.boxTag[i]);
				boxtag.selector = $tr.find(this.options.boxTag[i].selector);
				boxtag.selectedValue = data[boxtag.selector.attr("name")];
				BoxTag[this.options.type].generate(this.boxData[i], boxtag);
			}
		}
	},
	_changeBoxSelector : function($tr, tag){
		tag.selector = $tr.find(tag.selector);
		if($.isPlainObject(tag.children)){
			_changeBoxSelector($tr, tag.children);
		}
	},
	_generateRow : function(row, crud, cbFn){ // TODO tr draw 완료후에 호출이 필요하다.
		var rowData = $.extend({}, row);
		if($.isFunction(cbFn) && cbFn.call(this, rowData, row) == false){
			return null;
		}
		var $tr = this._templateTag(rowData, this.template, crud).data('org_data', row);
		this._setRowValue($tr, rowData);
		return $tr;
	},
	_templateTag : function(rowData, tmp, crud){
		var $tr = $(tmp.replace(/@{(\w+[.]?)+}/g, function(val){
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
			return convertValue(val, rowData);
		}));

		$tr.addClass(crud.mode  + this.isClickable ? ' clickable' : '').data('crud-mode', crud.mode);
		this._appendCRUD($tr);
		return $tr;
	},
	_appendCRUD : function($tr){
		if(this.options.isCRUD){
			$tr.prepend('<td><span class="crud-icon"></span></td>');
			$tr.append('<td><span class="crud-btn"></span></td>');
		}
	},
	_setOption: function( key, value ) {
		if(/isHeaderFix/.test(key)){
			this.setFixHeader(value);
		}
		if(/isFooterFix/.test(key)){
			this.setFixFooter(value);
		}
		if(/height/.test(key)){
			this.body.css('height', value);
		}
		if(/header/.test(key)){
			this._setHeader(value);
			this.summary();
		}
		if(/footer/.test(key)){
			this._setFooter(value);
			this.summary();
		}

		this._super( key, value );
	},

	_destroy: function() {
		this.element.empty();
	}
});
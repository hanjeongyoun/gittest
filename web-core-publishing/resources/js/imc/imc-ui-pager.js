/*
 * IMC 의 장비 가동상태바 를 도시하기 위한 플러그인
 * by MHD
 */
$.widget( "imc.pager", {
	// default options
	options: {
		"pagesPerOnce" : 10
		, "prevTxt" : "이전"
		, "nextTxt" : "다음"
		, "name" :{ // 추후 이름 처리 로직
			"currentPageIndex" : "currentPageIndex"
			, "rowsPerPage" : "rowsPerPage"
			, "pagesPerOnce" : "pagesPerOnce"
			, "totalRows" : "totalRows"
			, "totalPages" : "totalPages"
			, "firstPageIndex" : "firstPageIndex"
			, "lastPageIndex" : "lastPageIndex"
		}
		, click : null
	},
	_create: function() {
		this.prev = $("<a href='#' class='prev'>", this.options.prevTxt, "</a>");
		this.next = $("<a href='#' class='next'>", this.options.nextTxt, "</a>");
		this.total = $("<div class=\"footer-title\">Total <strong>-</strong></div>");
		this.paging = $("<div class=\"paging-wrap\">");

		this.element.append(this.total).append(this.paging).on("click", ".paging-wrap a:not([disabled='disabled'])", $.proxy(function(e){
					if($.isFunction(this.options.click)){
						var pageNum = parseInt(this.paging.find("a.on").not(".prev, .next").text());
						var $this = $(e.target);
						if($this.hasClass("prev")){
							pageNum = (pageNum - (pageNum-1) % this.options.pagesPerOnce) - 1;
						}else if($this.hasClass("next")){
							pageNum = (pageNum - (pageNum-1) % this.options.pagesPerOnce) + this.options.pagesPerOnce;
						}else{
							pageNum = $this.text();
						}
						this.options.click.call(this, {
							"currentPageIndex" : pageNum
							, "rowsPerPage" : this._rowPerPage
							, "pagesPerOnce" : this.options.pagesPerOnce
						});
					}

				}, this));
	},
	_rowPerPage : 20,
	setPage : function(paging){
		var pageTag = [];
		if(paging.totalRows == 0){
			return;
		}
		var currentPage = paging.currentPageIndex;
		var end = 0;
		paging && paging.rowsPerPage && (this._rowPerPage = paging.rowsPerPage);

		for(var i = paging.firstPageIndex; i <= paging.lastPageIndex ; i++){
			pageTag.push(currentPage == i ? "<a href='#' class='on'>" : "<a href='#'>", i, "</a>");
		}

		currentPage < this.options.pagesPerOnce + 1 ? this.prev.attr( "disabled", "disabled" ) : this.prev.removeAttr( "disabled" );
		paging.totalPages == paging.lastPageIndex ? this.next.attr( "disabled", "disabled" ) : this.next.removeAttr( "disabled" );

		this.paging.empty().append(this.prev).append(pageTag.join("")).append(this.next);
		this.total.find("strong").text(paging.totalRows);
	},

	_refresh: function() {
		this.redraw();
	},

	redraw : function(){
		this.svg.empty();
	},
	_destroy: function() {
		this.svg.remove();
	},

	_setOptions: function() {
		this._superApply( arguments );
		this._refresh();
	},

	_setOption: function( key, value ) {
//		if(/lineColor|lineWidth/.test(key)){
//			value = $.extend({}, this.options[key], value);
//		}
		this._super( key, value );
	}
});
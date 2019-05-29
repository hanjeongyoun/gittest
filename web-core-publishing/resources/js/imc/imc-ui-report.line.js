
$.widget( "imc.reportLine", {

	/**
	 * 생성자
	 * */
	_create: function() {
		this._createHtml();
		this.element.append(this.lineBoxes);
		this._bindEvent();
	},
	/**
	 * String html 만들기
	 * */
	_createHtml : function(){
		this.lineBoxes = [
			'<div class="box-item-wrap">',
				'<ul class="box-item-container">',
				'<li><a href="#" data-line="EGA001">엔진</a></li>',
				'<li><a href="#" data-line="TMA001">미션</a></li>',
				'<li><a href="#" data-line="DOA001">도킹</a></li>',
				'<li><a href="#" data-line="MNA001">메인(소형)</a></li>',
				'<li><a href="#" data-line="MNA002">메인(중형)</a></li>',
				'</ul>',
			'</div>'
		].join("");
	},

	/**
	 * 이벤트 바인드
	 * */
	_bindEvent : function(){
		var _this = this;
		 this.element.on("click", "li a", function(e){
			 var $this =$(this);
			 _this.element.find('li a').addClass('dark-box').removeClass('on');
			 $this.addClass("on").removeClass('dark-box');

			var locId = $(this).data("line");
			 _this.boxClickFunc(locId);
		 });
	},
	/**
	 * 선택된 박스가 있으면 해당 라인 아이디 반환
	 * 선택된 박스가 없으면 undefined
	 * */
	getSelectedBoxId : function(){
		return this.selectedBox ? this.selectedBox : typeof this.selectedBox;
	},
	/**
	 *box를 클릭했을 때 함수 등록
	 * */
	boxClick : function(boxClickFunc){
		this.boxClickFunc = boxClickFunc;
	},
	/**
	 *박스를 선택안한 상태로 만들기
	 * */
	reset : function(){
		$("#box-container-wrapper").find('li a').removeAttr("class");
	}

});

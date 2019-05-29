
$.widget( "imc.reportSearcher", {
	// default options
	options: {
		height : '300px',
		startDateTitle : '시작일',
		endDateTitle : '종료일',
		searchTitle : '조회',
		timelyTitle : '시간',
		dailyTitle : '일',
		weeklyTitle : '주',
		monthlyTitle : '월',
		selectShow : true,
		typeSelectShow : false,
		useTimely : true,
		excelDown : false
	},

	// the constructor
	_create: function() {
		//this.searchArea = $('<div>', {'class' : 'test', 'style' : 'height:' + this.options.height});
		this._createHtml();
		this.element.append(this.range);
		this.element.append(this.locationArea);
		this.radio.find('input[type="radio"]').fakecheck();
		this._bindEvent();
		this.resetCalendar();
	},
	_createHtml : function(){

		if(this.options.useTimely){
			this.radio = $('<span>', {'style' : 'margin-left: 20px'})
			.append($('<input type="radio" value="timely" name="range_type" id="timely"/><label for="timely">'+this.options.timelyTitle+'</label>'))
			.append($('<input type="radio" value="daily" name="range_type" checked="checked" id="daily"/><label for="daily">'+this.options.dailyTitle+'</label>'))
			.append($('<input type="radio" value="weekly" name="range_type" id="weekly"/><label for="weekly">'+this.options.weeklyTitle+'</label>'))
			.append($('<input type="radio" value="monthly" name="range_type" id="monthly"/><label for="monthly">'+this.options.monthlyTitle+'</label>'));
		}else{
			this.radio = $('<span>', {'style' : 'margin-left: 20px'})
			.append($('<input type="radio" value="daily" name="range_type" checked="checked" id="daily"/><label for="daily">'+this.options.dailyTitle+'</label>'))
			.append($('<input type="radio" value="weekly" name="range_type" id="weekly"/><label for="weekly">'+this.options.weeklyTitle+'</label>'))
			.append($('<input type="radio" value="monthly" name="range_type" id="monthly"/><label for="monthly">'+this.options.monthlyTitle+'</label>'));
		}

		this.range = $('<div>', {'class' : 'function-area small'})
			.append($('<input type="text" class="search minimum calendar" id="start-date" style="width:130px;margin-left:0px !important;" placeholder="'+ this.options.startDateTitle+'" readonly="readonly">'))
			.append($('<input type="text" class="search minimum calendar" id="end-date" style="width:130px;" placeholder="'+ this.options.endDateTitle +'" readonly="readonly">'))
			.append($('<button type="button" class="btnf-search" id="btn-search">'+ this.options.searchTitle +'</button>'))
			.append($('<button type="button" class="btnf-reset minimum" id="btn-reset"></button>'))
			.append(this.radio);

		this.drationTxt = 	$('<div>', {'style' : 'margin-left:60% !important;'})
			.append($('<span id="dration" style="font-size:14px;padding-top:10px;"></span>'))

		this.select = $('<div>', {'class' : 'left'}).append($('<select id="locId" data-searchkey="locId"></select>'))

		this.typeSelect = $('<div>', {'class' : 'left', 'style' : 'margin-left:0px;'}).append($('<select id="reportType" data-searchkey="reportType"><option value="typeDetail">유형상세</option>	<option value="indicatorsDetail">지표상세</option></select>'))

		this.locationArea = $('<div>', {'class' : 'function-area small'})

		if(this.options.selectShow){
			this.locationArea.append(this.select)
		}

		if(this.options.typeSelectShow){
			this.locationArea.append(this.typeSelect)
			this.typeSelect.find("select").fakeselect();
		}

		this.locationArea.append(this.drationTxt)

		if(this.options.selectShow){
			Tag.selectBox.draw(
					{	selector : "#locId",
						firstTxt : "라인 전체",
						value : "locId",
						text : "locName",
						masterCd : "line",
						tableNm : "mdm_location"
					}, $.proxy(function(){
						this.select.find("select").fakeselect();
					}, this));
		}

		if(this.options.excelDown){
			this.excelButton = $('<button type="button" class="btnf-download" id="btn-excel-down" style="float: right;">엑셀 다운로드</button>');
			this.drationTxt.append(this.excelButton);
		}
	},
	_setOptions : function(option){
		this.options = $.extend({},this.options, option);
	},

	resetCalendar : function(){
		var settingDate = new Date();
		settingDate.setDate(settingDate.getDate()-1); //하루 전

		$('#start-date').datepicker('setDate',settingDate);
		$('#end-date').datepicker('setDate', settingDate);
	},

	_bindEvent : function(){
		var $startDatePicker = this.range.find('#start-date').datepicker();
		var $endDatePicker = this.range.find('#end-date').datepicker();
		$startDatePicker.on( "change", function() {
			var dateFormat = $(this).datepicker("option", "dateFormat");
			var minDate = $.datepicker.parseDate(dateFormat, this.value );
			$endDatePicker.datepicker( "option", "minDate", minDate );
		});
		$endDatePicker.on( "change", function() {
			var dateFormat = $(this).datepicker("option", "dateFormat");
			var maxDate = $.datepicker.parseDate(dateFormat, this.value );
			$startDatePicker.datepicker( "option", "maxDate", maxDate );
		});

		var $this = this;
		 $("#btn-reset").click(function() {
			 $this.resetCalendar();
		 });

		/* $("#btn-search").click(function() {
			 $this.setReportDuration();
		 });*/

		 $('.radio, span.radio+label').click(function () {
			 if($(this).attr("for") === "timely" || ( $(this).attr("data-fakeform-index") === "0" && $(this).prev().attr("id") === "timely" )){
				 $("#end-date").hide();
			 }else{
				 $("#end-date").show();
			 }
	     });
	},

	setReportDuration : function(){
		var str = '※ 집계 기간 : ';
		var startDate = "";
		var endDate = "";
		if($("#start-date").val()){
			startDate = $("#start-date").val();
		}

		if($("#end-date").val()){
			endDate   = $("#end-date").val();
		}

		if($("input[name=range_type]:checked").val() == "timely"){
			str += startDate;
		}else if($("input[name=range_type]:checked").val() == "monthly"){
			str += startDate.substring(0, startDate.length-3);
			str += ' ~ ';
			str += endDate.substring(0, endDate.length-3);
		}else{
			str += startDate;
			str += ' ~ ';
			str += endDate;
		}

		str += ' | '
		str += '조회일 : '  ;

		var Now = new Date();
		var NowTime = Now.getFullYear();
		var month = "0" + (Now.getMonth() + 1)
		var day = "0" + (Now.getDate())
		NowTime += '-' +  month.slice(-2);
		NowTime += '-' + day.slice(-2);

		str += NowTime;

		$("#dration").text(str);
	},

	getSearchParam : function() {

		//TODO valid check
		var result = "OK";

		var startYyyymmdd = $("#start-date").val();
		var endYyyymmdd = $("#end-date").val();
		var locId = $( "#locId option:selected" ).val();
		var reportType;
		if(this.options.typeSelectShow) {
			reportType = $( "#reportType option:selected" ).val();
		}else{
			reportType = null;
		}

		var gubun = $("input[name=range_type]:checked").val();


		if(startYyyymmdd.length == 0){
			alert("시작일을 선택해주세요.");
			result = "ERROR_StartDate"
		}else if(gubun != "timely" && endYyyymmdd.length == 0){
			alert("종료일을 선택해주세요.");
			result = "ERROR_EndDate"
		}

		var now = new Date();
		var strNow = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

		var nowDate = new Date(strNow + ' 00:00:00');
		var d1 = new Date(startYyyymmdd + ' 00:00:00');
		var d2 = new Date(endYyyymmdd + ' 00:00:00');

		if(d1 >= nowDate || d2 >= nowDate){
			alert("과거일자를 선택해주세요.");
			result = "ERROR_Date"
		}

		if(gubun == "monthly" && startYyyymmdd.length > 0 && endYyyymmdd.length > 0){
			var startYyyymm = startYyyymmdd.substring(0, 8);
			startYyyymmdd = startYyyymm + "01";

			var endYyyy = endYyyymmdd.substring(0, 4);
			var endMm = endYyyymmdd.substring(5, 7);
			var lastDay = ( new Date( endYyyy, endMm, 0) ).getDate();
			var endDt =  new Date( endYyyy, endMm, lastDay);

			if(endDt >= nowDate){
				endYyyymmdd = endYyyy + "-" + endMm + "-" + (nowDate.getDate()-1);
			}else{
				endYyyymmdd = endYyyy + "-" + endMm + "-" + lastDay;
			}

			$('#start-date').datepicker("setDate", new Date(startYyyymm) );
			$('#end-date').datepicker("setDate", new Date(endYyyymmdd) );

		}

		return{
				startYyyymmdd : startYyyymmdd,
				endYyyymmdd : endYyyymmdd,
			    gubun : gubun,
			    locId : locId,
			    reportType : reportType,
			    result : result
		}
	},

	_refresh: function() {
		this.resetCalendar();
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

		this._super( key, value );
	},

	_destroy: function() {
		this.element.empty();
	}
});

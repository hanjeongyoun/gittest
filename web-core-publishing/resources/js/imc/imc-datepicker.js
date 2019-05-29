window.DatePicker = (function($){

	var Holiday_List = {};//휴일정보객체

	var fn_getHolidayList = function(data){
		var param = $.extend({}, { delYn : "N" }, data);
		ImcAjax.ajax(IMCURL.getUrl("/apps/mdm/holiday/getHolidayList"),
			$.extend({}, param)
			, function(data) {
				$.each(data.list, function(index, data){
					var holidayYmd = data.holidayYmd;
					var holidayName = data.holidayName;
					Holiday_List[holidayYmd] = holidayName;
				});
			});
		}
		,datePickerSettings = function(){
			/* datepicker 기본 설정 */
			var nowDate = new Date();
			var nowYear = new String( nowDate.getFullYear() );
			var nowMonth = new String( nowDate.getMonth() + 1);
			var nowDay = new String( nowDate.getDate() );

			// DANIEL ADD START
			var $startDatePicker;
			var $endDatePicker;

			var $doms = $(document).find('.calendar');
			$doms.each(function() {
				var $tag = $(this);
				var periodName = $tag.attr('period');
				if(periodName === 'start'){
					$startDatePicker = $tag;
				} else if(periodName === 'end'){
					$endDatePicker = $tag;
				}
			});

			if($startDatePicker != null && $endDatePicker != null){
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
			}
			// DANIEL ADD END

			$.datepicker.setDefaults(
			{
				  closeText: "닫기"
				, prevText: "이전달"
				, nextText: "다음달"
				, currentText: "오늘"
				, monthNames: ["1월", "2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"]
				, monthNamesShort: ["1월", "2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"]
				, dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]
				, dayNamesShort: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]
				, dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"]
				, weekHeader: "주"
				, dateFormat: "yy-mm-dd"
				, firstDay: 0
				, isRTL: false
				, showMonthAfterYear: true
				, yearSuffix: "년"
				, changeYear :true
				, changeMonth: true
				, showOn: "focus" // focus | button | both
				//, buttonImage: "<c:url value='/resources/images/icons/micro/calendar5.png' />"
				, buttonImageOnly: true
				, buttonText: "Select date"
				, beforeShow : function(input,  inst) { // 달력에 휴일 표시 처리

					var selectedYear = inst.selectedYear;
					var selectedMonth = inst.selectedMonth;

					var data = {};
					if(selectedYear == "0" || selectedMonth == "0") {
						data.holidayYear = nowYear;
						data.holidayMonth = nowMonth;
					} else {
						data.holidayYear = selectedYear;
						data.holidayMonth = selectedMonth + 1;
					}
					if($(this).hasClass("calendar")){
						fn_getHolidayList(data);
					}
				}
				, beforeShowDay : function(day) { // 달력에 휴일 표시 처리
					var formattedDay = $.datepicker.formatDate("yy-mm-dd", day);
					var dayInfo = [true, "", ""];
					if( formattedDay in Holiday_List ){
						dayInfo = [true, "ui-datepicker-holiday", Holiday_List[formattedDay] ];
					} else {
						switch( day.getDay() ) {
							case 0 : dayInfo = [true, "ui-datepicker-sunday", "일요일"]; break;
							case 6 : dayInfo = [true, "ui-datepicker-saturday", "토요일"]; break;
						default: dayInfo = [true, ""]; break;
					}
				}
				return dayInfo;
			}

			, onChangeMonthYear : function(year, month, inst ) {
				var data = {};
				if(year == "0" || month == "0") {
					data.holidayYear = nowYear;
					data.holidayMonth = nowMonth;
				} else {
					data.holidayYear = year;
					data.holidayMonth = month;
				}
				if($(this).hasClass("calendar")){
					fn_getHolidayList(data);
				}
			}
			}
		);
	};
	return {datePickerSettings : datePickerSettings}
}(jQuery));

$(function(){
	window.DatePicker.datePickerSettings();
	$( ".calendar" ).datepicker({});
})

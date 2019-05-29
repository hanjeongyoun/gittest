var DateUtils = (function(){

	//yyyy-MM-dd hh:mm:ss 형식의 문자열 반환
	//pYmdhms = 변환할 날짜 형식의 문자열, yyyyMMddhhmmss | Date 객체
	var fnYmdhms = function(pYmdhms){
		if(pYmdhms == undefined) { // 매개변수가 없으면 현재일시 값으로 설정
			pYmdhms = fnNowYmdhms14();
		}

		// ymdhms 가 string 인지 Date() 인지 판별
		if( typeof(pYmdhms) == "object" && ymdhms instanceof Date ) {
			pYmdhms = fnDateToYmdhms14(pYmdhms);
		}

		if(pYmdhms == "") return "";

		var ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환

		var result = ymdhmsArray[0] + "-" + ymdhmsArray[1] + "-" + ymdhmsArray[2] + " " + ymdhmsArray[3] + ":" + ymdhmsArray[4] + ":" + ymdhmsArray[5];
		return result;
	}
	//yyyy 형식의 문자열 반환
	,fnYyyy = function(pYmdhms){

		if(pYmdhms == undefined) { // 매개변수가 없으면 현재일시 값으로 설정
			pYmdhms = fnNowYmdhms14();
		}

		// ymdhms 가 string 인지 Date() 인지 판별
		if( typeof(pYmdhms) == "object" && ymdhms instanceof Date ) {
			pYmdhms = fnDateToYmdhms14(pYmdhms);
		}

		if(pYmdhms == "") return "";

		var ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환

		var result = ymdhmsArray[0];
		return result;
	}
	//mm 형식의 문자열 반환
	,fnMm = function(pYmdhms){
		if(pYmdhms == undefined) { // 매개변수가 없으면 현재일시 값으로 설정
			pYmdhms = fnNowYmdhms14();
		}

		// ymdhms 가 string 인지 Date() 인지 판별
		if( typeof(pYmdhms) == "object" && pYmdhms instanceof Date ) {
			pYmdhms = fnDateToYmdhms14(pYmdhms);
		}

		if(pYmdhms == "") return "";

		var ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환

		var result = ymdhmsArray[1];
		return result;
	}
	//dd 형식의 문자열 반환
	,fnDd = function(pYmdhms){
		if(pYmdhms == undefined) { // 매개변수가 없으면 현재일시 값으로 설정
			pYmdhms = fnNowYmdhms14();
		}

		// ymdhms 가 string 인지 Date() 인지 판별
		if( typeof(pYmdhms) == "object" && pYmdhms instanceof Date ) {
			pYmdhms = fnDateToYmdhms14(pYmdhms);
		}

		if(pYmdhms == "") return "";

		var ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환

		var result = ymdhmsArray[2];
		return result;
	}
	//yyyy-MM-dd 형식의 문자열 반환
	//pYmdhms = 변환할 날짜 형식의 문자열, yyyyMMddhhmmss | Date 객체
	,fnYmd = function(pYmdhms){

		if(pYmdhms == undefined) { // 매개변수가 없으면 현재일시 값으로 설정
			pYmdhms = fnNowYmdhms14();
		}

		// ymdhms 가 string 인지 Date() 인지 판별
		if( typeof(pYmdhms) == "object" && pYmdhms instanceof Date ) {
			pYmdhms = fnDateToYmdhms14(pYmdhms);
		}

		if(pYmdhms == "") return "";

		var ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환

		var result = ymdhmsArray[0] + "-" + ymdhmsArray[1] + "-" + ymdhmsArray[2];
		return result;
	}
	//pYmdhms = 변환할 날짜 형식의 문자열, yyyyMMddhhmmss | Date 객체
	//gubun = YY MM 사이에 들어갈 구분자 없으면 .
	,fnYm = function(pYmdhms, gubun){
		if(pYmdhms == undefined) { // 매개변수가 없으면 현재일시 값으로 설정
			pYmdhms = fnNowYmdhms14();
		}

		// ymdhms 가 string 인지 Date() 인지 판별
		if( typeof(pYmdhms) == "object" && pYmdhms instanceof Date ) {
			pYmdhms = fnDateToYmdhms14(pYmdhms);
		}

		if(pYmdhms == "") return "";

		var ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환

		if(gubun === undefined) gubun = ".";

		var result = ymdhmsArray[0] + gubun + ymdhmsArray[1];
		return result;
	}
	//pYmdhms = 변환할 날짜 형식의 문자열, yyyyMMddhhmmss | Date 객체
	//gubun = MM dd 사이에 들어갈 구분자 없으면 -
	,fnMd = function(pYmdhms, gubun){
		if(pYmdhms == undefined) { // 매개변수가 없으면 현재일시 값으로 설정
			pYmdhms = fnNowYmdhms14();
		}

		// ymdhms 가 string 인지 Date() 인지 판별
		if( typeof(pYmdhms) == "object" && pYmdhms instanceof Date ) {
			pYmdhms = fnDateToYmdhms14(pYmdhms);
		}

		if(pYmdhms == "") return "";

		var ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환

		if(gubun === undefined) gubun = "-"

		var result = ymdhmsArray[1] + gubun + ymdhmsArray[2];
		return result;
	}
	//문자열을 Date 객체로 변환
	//ymdhms14 = yyyymmddhhmmss || y-m-d h:m:s || yyyy-mm-dd
	,fnToDate = function (ymdhms14) {
		var array = fnToArray(ymdhms14);

		var year = parseInt( array[0] );
		var month = parseInt( array[1] ) - 1;
		var day = parseInt( array[2] );
		var hour = parseInt( array[3] );
		var minute = parseInt( array[4] );
		var second = parseInt( array[5] );

		return new Date(year, month, day, hour, minute, second);
	}
	//yyyyMMddhhmmss 형식의 현재일시 반환
	,fnNowYmdhms14 = function(){
		var dt = new Date();

		var month = new String( dt.getMonth()+1 );
		var day = new String( dt.getDate() );
		var year = new String( dt.getFullYear() );
		var hour = new String( dt.getHours() );
		var minute = new String( dt.getMinutes() );
		var second = new String( dt.getSeconds() );

		if(month.length == 1) month = ("0" + month);
		if(day.length == 1) day = ("0" + day);

		if(hour.length == 1) hour = ("0" + hour);
		if(minute.length == 1) minute = ("0" + minute);
		if(second.length == 1) second = ("0" + second);

		return year + month + day + hour + minute + second;
	}
	//Date() 형식을 yyyyMMddhhmmss 문자열로 변환
	,fnDateToYmdhms14 = function(date){
		var year = new String( date.getFullYear() );
		var month = new String( date.getMonth()+1 );
		var day = new String( date.getDate() );
		var hour = new String( date.getHours() );
		var minute = new String( date.getMinutes() );
		var second = new String( date.getSeconds() );

		if(month.length == 1) month = ("0" + month);
		if(day.length == 1) day = ("0" + day);

		if(hour.length == 1) hour = ("0" + hour);
		if(minute.length == 1) minute = ("0" + minute);
		if(second.length == 1) second = ("0" + second);

		return year + month + day + hour + minute + second;
	}
	//Date() 형식을 yyyy-MM-dd hh:mm:ss 문자열로 변환
	,fnDateToYmdhms = function(date){
		var year = new String( date.getFullYear() );
		var month = new String( date.getMonth()+1 );
		var day = new String( date.getDate() );
		var hour = new String( date.getHours() );
		var minute = new String( date.getMinutes() );
		var second = new String( date.getSeconds() );

		if(month.length == 1) month = ("0" + month);
		if(day.length == 1) day = ("0" + day);

		if(hour.length == 1) hour = ("0" + hour);
		if(minute.length == 1) minute = ("0" + minute);
		if(second.length == 1) second = ("0" + second);

		return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
	}
	//yyyymmddhhMMss 형식의 문자열 => yyyy-mm-dd hh:MM:ss 형식으로 변환
	//- ymdhms14 전달하지 않으면 현재일자
	,fnFormatToYmdhms = function(ymdhms14){

		if(ymdhms14 === undefined) {
			var ymdhms14 = fnNowYmdhms14();
		}

		if(ymdhms14 == null) {
			return "";
		}

		ymdhms14 = fnRefineYmdHms14(ymdhms14);

		if(ymdhms14 == "") return "";
		var ymd = ymdhms14.substring(0, 8);
		var hms = ymdhms14.substring(8, 14);

		var yyyy = ymd.substring(0, 4);
		var MM = ymd.substring(4, 6);
		var dd = ymd.substring(6, 8);

		var hh = hms.substring(0, 2);
		var mm = hms.substring(2, 4);
		var ss = hms.substring(4, 6);

		var result = yyyy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss;

		return result;
	}
	//yyyymmddhhMMss 형식의 문자열 => yyyy-mm-dd hh:MM 형식으로 변환
	//- ymdhms14 전달하지 않으면 현재일자
	,fnFormatToYmdhm = function(ymdhms14){
		if(ymdhms14 === undefined) {
			ymdhms14 = fnNowYmdhms14();
		}

		if(ymdhms14 === null) {
			return "";
		}

		ymdhms14 = fnRefineYmdHms14(ymdhms14);

		if(ymdhms14 == "") return "";
		var ymd = ymdhms14.substring(0, 8);
		var hms = ymdhms14.substring(8, 14);

		var yyyy = ymd.substring(0, 4);
		var MM = ymd.substring(4, 6);
		var dd = ymd.substring(6, 8);

		var hh = hms.substring(0, 2);
		var mm = hms.substring(2, 4);
		var ss = hms.substring(4, 6);

		var result = yyyy + "-" + MM + "-" + dd + " " + hh + ":" + mm

		return result;
	}
	//yyyymmdd 형식의 문자열 => yyyy-mm-dd 형식으로 변환
	//- ymdhms14 전달하지 않으면 현재일자
	,fnFormatToYmd = function(ymdhms14){
		if(ymdhms14 === undefined) {
			var ymdhms14 = fnNowYmdhms14();
		}

		ymdhms14 = fnRefineYmdHms14(ymdhms14);

		if(ymdhms14 == "") return "";
		var ymd = ymdhms14.substring(0, 8);
		var hms = ymdhms14.substring(8, 14);

		var yyyy = ymd.substring(0, 4);
		var MM = ymd.substring(4, 6);
		var dd = ymd.substring(6, 8);

		var hh = hms.substring(0, 2);
		var mm = hms.substring(2, 4);
		var ss = hms.substring(4, 6);

		var result = yyyy + "-" + MM + "-" + dd;
		return result;
	}
	//hhMMss 형식의 문자열 => hh:MM:ss 형식으로 변환
	,fnFormatToHms = function(ymdhms14){
		if(ymdhms14 === undefined) {
			var ymdhms14 = fnNowYmdhms14();
		}

		ymdhms14 = fnRefineYmdHms14(ymdhms14);

		if(ymdhms14 == "") return "";
		var ymd = ymdhms14.substring(0, 8);
		var hms = ymdhms14.substring(8, 14);

		var yyyy = ymd.substring(0, 4);
		var MM = ymd.substring(4, 6);
		var dd = ymd.substring(6, 8);

		var hh = hms.substring(0, 2);
		var mm = hms.substring(2, 4);
		var ss = hms.substring(4, 6);

		var result = hh + ":" + mm + ":" + ss;
		return result;
	}
	//문자열에서 "-", ":", " " 삭제
	,fnRefineYmdHms14 = function(ymdhms14){
		if( ymdhms14 == undefined || ymdhms14 == null) return "";
		ymdhms14 = ymdhms14.replace(/\-/g, "");
		ymdhms14 = ymdhms14.replace(/\:/g, "");
		ymdhms14 = ymdhms14.replace(/ /g, "");
		return ymdhms14;
	}
	//두 날짜의 차이 (초 단위로 반환)
	//result = future - past
	,fnDiffSecond = function (future, past) {
		future = fnRefineYmdHms14(future);
		past = fnRefineYmdHms14(past);

		var futureDate = fnToDate(future);
		var pastDate = fnToDate(past);
		var result = (futureDate - pastDate) / 1000;
		return result;
	}
	//HH:MM:SS 를 초로 계산하여 리턴
	,fnHhmmssToSec = function (hhmmss) {
		var array = hhmmss.split(':');
		return parseInt(array[0] * 60 * 60) + parseInt(array[1] * 60) + parseInt(array[2]);
	}
	//ymdhms 에 일, 시간, 분, 초를 더한다.
	//r = d+v
	//w : "d" | "h" | "m" | "s",
	//d : "yyyyMMddhhmmss 또는 yyyy-MM-dd hh:mm:ss
	//v : 정수
	//return : yyyyMMddhhmmss
	,fnAddTime = function (w, d, v) {
		var date = fnToDate(d); // Date 형식으로 바꾸고
		var result;
		if(w == "d") { // 일
			result = date.getTime() + (v * 1000 * 60 * 60 * 24);
		}
		else if(w=="h"){ // 시간
			result = date.getTime() + (v * 1000 * 60 * 60);
		}
		else if(w=="m"){ // 분
			result = date.getTime() + (v * 1000 * 60);
		}
		else if(w=="s"){ // 초
			result = date.getTime() + (v * 1000);
		}

		return fnDateToYmdhms( new Date(result) );
	}
	//ymdhms14를 배열로 반환
	,fnToArray = function (ymdhms14) {
		ymdhms14 = fnRefineYmdHms14(ymdhms14);

		var yyyy = ymdhms14.substring(0, 4);
		var MM = ymdhms14.substring(4, 6);
		var dd = ymdhms14.substring(6, 8);
		var hh = ymdhms14.substring(8, 10);
		var mm = ymdhms14.substring(10, 12);
		var ss = ymdhms14.substring(12, 14);

		var array = new Array();

		array.push(yyyy);
		array.push(MM);
		array.push(dd);

		if(ymdhms14.length == 8) {
			array.push("00");
			array.push("00");
			array.push("00");
		}
		else {
			array.push(hh);
			array.push(mm);
			array.push(ss);
		}
		return array;
	}
	//HH:MM:SS를 배열로 반환
	,fnHHMMSStoArray = function (hhmmss) {
		hhmmss = fnRefineYmdHms14(hhmmss);

		var hh = hhmmss.substring(0, 2);
		var mm = hhmmss.substring(2, 4);
		var ss = hhmmss.substring(4, 6);

		var array = new Array();

		array.push(hh);
		array.push(mm);
		array.push(ss);

		return array;
	}
	//value에 해당하는 분을 hh:mm 형식으로 반환
	//minutes : 분
	//return : hh:mm
	,fnMinToHHMM = function (minutes) {
		var pad = function(x) { return (x < 10) ? "0"+x : x; }
		return pad(parseInt(minutes / (60*60))) + ":" + pad(parseInt(minutes / 60 % 60));

	}
	//value 에 해당하는 분을 hh:mm:ss 형식으로 반환
	//seconds : 초
	//return : hh:mm:ss
	,fnSecToHHMMSS = function (seconds) {
		var pad = function(x) { return (x < 10) ? "0"+x : x; }
		return pad(parseInt(seconds / (60*60))) + ":" + pad(parseInt(seconds / 60 % 60)) + ":" + pad(seconds % 60);
	}
	//startYmd ~ endYmd 사이의 모든 날짜(yyyy-mm-dd) 배열을 반환
	,fnGetBetweenYmd = function(startYmd, endYmd) {
		startYmd = fnYmd( startYmd );
		endYmd = fnYmd( endYmd );

		var startDt = fnToDate(startYmd); // Date 형식으로 바꾸고
		var endDt = fnToDate(endYmd); // Date 형식으로 바꾸고
		var indexDt = startDt;

		var dateArray = new Array();

		while(indexDt.getTime() <= endDt.getTime() ) {
			dateArray.push( fnYmd(indexDt)  );
			indexDt.setDate( indexDt.getDate() + 1 );
		}
		return dateArray;
	}
	return {
		 fnYmdhms : fnYmdhms
		,fnNowYmdhms14 : fnNowYmdhms14
		,fnYyyy : fnYyyy
		,fnMm : fnMm
		,fnDd : fnDd
		,fnYmd : fnYmd
		,fnYm : fnYm
		,fnMd : fnMd
		,fnToDate : fnToDate
		,fnNowYmdhms14 : fnNowYmdhms14
		,fnDateToYmdhms14 : fnDateToYmdhms14
		,fnDateToYmdhms : fnDateToYmdhms
		,fnFormatToYmdhms : fnFormatToYmdhms
		,fnFormatToYmdhm : fnFormatToYmdhm
		,fnFormatToYmd : fnFormatToYmd
		,fnFormatToHms : fnFormatToHms
		,fnRefineYmdHms14 : fnRefineYmdHms14
		,fnDiffSecond : fnDiffSecond
		,fnHhmmssToSec : fnHhmmssToSec
		,fnAddTime : fnAddTime
		,fnToArray : fnToArray
		,fnHHMMSStoArray : fnHHMMSStoArray
		,fnMinToHHMM : fnMinToHHMM
		,fnSecToHHMMSS : fnSecToHHMMSS
		,fnGetBetweenYmd : fnGetBetweenYmd
	}
})();


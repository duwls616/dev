/**
 * [Mixin Common JS]
 * @author UBCARE 전략개발팀
 * @description
 * UBSales에서 사용하는 공용함수 모음
 *
 * @add_in_module
 * lodash: javascript 함수라이브러리 (https://lodash.com/docs)
 *
 * @namespace $_comm_
 */
import _ from 'lodash';

export const Common = {
  methods: {
    $_comm_log(obj) {
      const clsRow = obj;

      if (typeof (clsRow) === 'object') {
        console.log(JSON.stringify(clsRow));
      } else {
        console.log(clsRow);
      }
    },

    $_comm_getSortArray(obj, id, boolean) {
      const clsRow = obj;
      clsRow.sort((a, b) => {
        let rtnVal = 0;
        if (boolean) {
          rtnVal = a[id] < b[id] ? -1 : 1;
        } else {
          rtnVal = a[id] < b[id] ? 1 : -1;
        }
        return rtnVal;
      });
    },

    $_comm_setCookie(cName, cValue, cDay) {
      const expire = new Date();
      expire.setDate(expire.getDate() + cDay);

      const cookies = `${cName}=${escape(cValue)}; path=/; expires=${expire}`;
      document.cookie = cookies;
    },

    $_comm_getCookie(cName) {
      const name = `${cName}=`;
      const cookieData = document.cookie;
      let startDT = cookieData.indexOf(name);
      let cValue = '';

      if (startDT !== -1) {
        startDT += name.length;
        let endDT = cookieData.indexOf(';', startDT);
        if (endDT === -1) {
          endDT = cookieData.length;
        }
        cValue = cookieData.substring(startDT, endDT);
      }
      return unescape(cValue);
    },

    $_comm_convertArrToStr(obj, key, sChar) {
      if (!obj || obj.length === 0) return '';

      let result = '';
      const char = sChar || '|';
      for (let i = 0, len = obj.length; i < len; i += 1) {
        if (i === 0) {
          result += (obj[i][key] || '');
        } else {
          result += (char + (obj[i][key] || ''));
        }
      }

      return result;
    },

    /**
     * 텍스트의 \n, \r을 <br>로 치환
     * @param {텍스트} str
     */
    $_comm_convertNewLineToBrTag(str) {
      let strValue = str;
      if (strValue) {
        strValue = strValue.replace(/(?:\r\n|\r|\n)/g, '<br />');
      } else {
        strValue = '';
      }
      return strValue;
    },

    /**
     * 파일id를 통해 파일다운로드 호출
     * @param {파일ID} fileId
     */
    $_comm_downloadFile(fileId) {
      const link = `/business/fileDownload.do?file_id=${fileId}`;
      window.open(link, '_blank');
    },

    /**
     * 파일확장자에 맞는 표시 아이콘 반환
     * @param {파일확장자} fileExt 파일확장자
     */
    $_comm_getFileExtMatchIcon(fileExt) {
      let iconText;
      switch (fileExt) {
        case 'doc':
        case 'docx':
          iconText = 'mdi-microsoft-word';
          break;
        case 'xls':
        case 'xlsx':
          iconText = 'mdi-microsoft-excel';
          break;
        case 'ppt':
        case 'pptx':
          iconText = 'mdi-microsoft-powerpoint';
          break;
        case 'pdf':
          iconText = 'mdi-file-pdf-outline';
          break;
        case 'mp4':
          iconText = 'mdi-file-video-outline';
          break;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'bmp':
        case 'svg':
        case 'gif':
        case 'ico':
          iconText = 'mdi-file-image-outline';
          break;
        default:
          iconText = 'mdi-file-document-outline';
          break;
      }
      return iconText;
    },

     /**
     * XML 형식의 텍스트 파일을 XML 객체로 변환
     * @param {XML객체} xmlStr XML형식의 텍스트파일
     */
    $_comm_convertStringToXml(xmlStr) {
      let returnDoc = '';
      if (window.DOMParser) {
        const dp = new window.DOMParser();
        returnDoc = dp.parseFromString(xmlStr, 'text/xml');
      } else {
        const xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async = 'false';
        xmlDoc.loadXML(xmlStr);

        returnDoc = xmlDoc;
      }
      return returnDoc;
    },

    /**
     * XML객체를 JSON형식으로 변환
     * @param {XML객체} xml객체
     */
    $_comm_xml2json(xml) {
      let obj = {};
      if (xml.children.length > 0) {
        for (let i = 0; i < xml.children.length; i += 1) {
          const item = xml.children.item(i);
          if (typeof (obj[item.nodeName]) === 'undefined') {
            obj[item.nodeName] = this.$_comm_xml2json(item);
          } else {
            if (typeof (obj[item.nodeName].push) === 'undefined') {
              const old = obj[item.nodeName];

              obj[item.nodeName] = [];
              obj[item.nodeName].push(old);
            }
            obj[item.nodeName].push(this.$_comm_xml2json(item));
          }
        }
      } else {
        obj = xml.textContent;
      }
      return obj;
    },

    /**
     * 숫자를 제외한 모든 문자 제거
     */
    $_comm_numberOnly(value) {
      const rtnValue = `${value}`;
      return String(rtnValue).replace(/[^\d]+/g, '');
    },

    /**
     * (금액 등) 수치값 3자리 콤마 적용
     */
    $_comm_numberComma(value) {
      const rtnValue = `${value}`;
      return String(rtnValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * 기준 문자열을 받아 포맷(형식)기준에서 일부를 파싱한다.
     * @param {대상문자열} input
     * @param {포맷(형식)} format
     * @param {파싱할부분} key
     * @exam1 $_comm_parseStr('9999.12.31', 'YYYY.MM.DD', 'MM'); => '12'
     * @exam2 $_comm_parseStr('9999.12.31', 'YYYY.MM.DD', 'YYYY'); => '9999'
     */
    $_comm_parseStr(input, format, key) {
      const index = format.indexOf(key);
      return input.slice(index, index + key.length);
    },

    /**
     * 일자 형식의 문자열을 받아 Date()객체로 반환
     * @param {대상문자열} input
     * @param {일자포맷} format
     * @param {기준연도(1900,2000)} epoch
     * @exam this.$_comm_parseDate('2020.04.23', 'YYYY.MM.DD')
     */
    $_comm_parseDate(input, format, epoch = 2000) {
      let year = 2000;
      if (format.includes('YYYY')) {
        year = parseInt(this.$_comm_parseStr(input, format, 'YYYY'), 10);
      } else if (input.includes('YY')) {
        year = parseInt(this.$_comm_parseStr(input, format, 'YY'), 10) + epoch;
      }
      let month = 0;
      if (format.includes('MM')) {
        month = parseInt(this.$_comm_parseStr(input, format, 'MM'), 10) - 1;
      }
      let date = 1;
      if (format.includes('DD')) {
        date = parseInt(this.$_comm_parseStr(input, format, 'DD'), 10);
      }
      let hours = 0;
      if (format.includes('HH')) {
        hours = parseInt(this.$_comm_parseStr(input, format, 'HH'), 10);
      }
      let minutes = 0;
      if (format.includes('mm')) {
        minutes = parseInt(this.$_comm_parseStr(input, format, 'mm'), 10);
      }
      let seconds = 0;
      if (format.includes('ss')) {
        seconds = parseInt(this.$_comm_parseStr(input, format, 'ss'), 10);
      }
      return new Date(year, month, date, hours, minutes, seconds);
    },

    /**
     * 텍스트 형식의 일시문자열을 포맷팅한다.
     * @param {일시텍스트} str
     * @param {Date포맷} format
     * @param {일자구분문자} pdd
     * @param {시간구분문자} ptd
     */
    $_comm_toDateFormat(str, format, pdd, ptd) {
      const dd = pdd || '.';
      const td = ptd || ':';
      let out = String(str);
      if (out) {
        switch (format) {
            case 'yyyy':
              out = out.substr(0, 4);
              break;
            case 'yyyyMM':
              out = out.substr(0, 4) + dd + out.substr(4, 2);
              break;
            case 'yyyyMMdd':
              out = out.substr(0, 4) + dd + out.substr(4, 2) + dd + out.substr(6, 2);
              break;
            case 'HHmm':
              out = out.substr(0, 2) + td + out.substr(2, 2);
              break;
            case 'HHmmss':
              out = out.substr(0, 2) + td + out.substr(2, 2) + td + out.substr(4, 2);
              break;
            default:
              out = null;
              break;
        }
      }
      return out;
    },

    /**
     * Object, Array를 받아 새로운 객체 복사본을 반환
     * @param {복사대상객체} obj
     */
    $_comm_cloneDeep(obj) {
      return _.cloneDeep(obj);
    },

    /**
     * Array 정렬
     * @param {기준배열} arr
     * @param {컬럼} col
     * @param {정렬기준} order
     * @exam1 $_comm_orderBy(list, 'age', 'desc');
     * @exam2 $_comm_orderBy(list, ['user', 'age'], ['asc', 'desc']);
     */
    $_comm_orderBy(arr, col, order) {
      return _.orderBy(arr, col, order);
    },

    /**
     * Obj 인자 반복
     * @param {반복할인자}} obj
     */
    $_comm_each(obj) {
      return _.each(obj);
    },

    /**
     * 파일사이즈 표시
     */
    $_comm_bytes(bytes = 0, decimals) {
      const k = 1024;
      const dm = decimals <= 0 ? 0 : decimals || 2;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      const retVal = parseFloat((bytes / (k ** i)).toFixed(dm));
      return `${retVal} ${sizes[i]}`;
    },

    /**
     * 파일사이즈 표시
     */
    $_comm_dataURLtoFile(dataurl, fileName) {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n > 0) {
        n -= 1;
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, { type: mime });
    },

    /**
     * 패스워드 체크
     */
    $_comm_checkPassword(e) {
      const pw = e;
      const num = pw.search(/[0-9]/g);
      const eng = pw.search(/[a-z]/ig);
      // eslint-disable-next-line
      const spe = pw.search(/[`~!@@#$%^&*|\\\'\";:\/?]/gi);

      // 1. 자리수 체크
      // 2. 공백 체크
      // 3. 혼합문자 체크(영문, 숫자, 특문)
      // 4. 사용가능
      let returnValue = '';
      if (pw.length < 8 || pw.length > 20) returnValue = 'MSG1001';
      else if (pw.search(/\s/) !== -1) returnValue = 'MSG1002';
      else if (num < 0 || eng < 0 || spe < 0) returnValue = 'MSG1003';
      else returnValue = 'MSG9999';

      return returnValue;
    },

    /**
     * 랜덤 문자열 생성
     */
    $_comm_randomStr() {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
      let randomStr = '';
      for (let index = 0; index < 8; index += 1) {
        const rnum = Math.floor(Math.random() * chars.length);
        randomStr += chars.substring(rnum, rnum + 1);
      }
      return randomStr;
    },
  },
};

export default Common;

/**
 * 추후 삭제할 예정
 * 더 이상 여기에 함수를 정의하지 않음
 */
export const Common = {
  data: () => ({
  }),

  methods: {
    getSortArray(obj, id, boolean) {
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

    setCookie(cName, cValue, cDay) {
      const expire = new Date();
      expire.setDate(expire.getDate() + cDay);

      const cookies = `${cName}=${escape(cValue)}; path=/ `;
      document.cookie = cookies;
    },

    getCookie(cName) {
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

    convertArrToStr(obj, key, sChar) {
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
     * 텍스트 형식의 일시문자열을 포맷팅한다.
     * @param {일시텍스트} str
     * @param {Date포맷} format
     * @param {일자구분문자} pdd
     * @param {시간구분문자} ptd
     */
    toDateFormat(str, format, pdd, ptd) {
      const dd = pdd || '-';
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
     * 텍스트의 \n, \r을 <br>로 치환
     * @param {텍스트} str
     */
    convertNewLineToBrTag(str) {
      return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
    },

    /**
     * 파일id를 통해 파일다운로드 호출
     * @param {파일ID} fileId
     */
    downloadFile(fileId) {
      const link = `/business/fileDownload.do?file_id=${fileId}`;
      window.open(link, '_blank');
    },

    /**
     * 파일확장자에 맞는 표시 아이콘 반환
     * @param {파일확장자} fileExt 파일확장자
     */
    getFileExtMatchIcon(fileExt) {
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
    convertStringToXml(xmlStr) {
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
    xml2json(xml) {
      let obj = {};
      if (xml.children.length > 0) {
        for (let i = 0; i < xml.children.length; i += 1) {
          const item = xml.children.item(i);
          if (typeof (obj[item.nodeName]) === 'undefined') {
            obj[item.nodeName] = this.xml2json(item);
          } else {
            if (typeof (obj[item.nodeName].push) === 'undefined') {
              const old = obj[item.nodeName];

              obj[item.nodeName] = [];
              obj[item.nodeName].push(old);
            }
            obj[item.nodeName].push(this.xml2json(item));
          }
        }
      } else {
        obj = xml.textContent;
      }
      return obj;
    },
  },
};

export default Common;

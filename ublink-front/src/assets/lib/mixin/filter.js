/**
 * [Mixin Filter JS]
 * @author UBCARE 전략개발팀
 * @description
 * UBSales에서 사용하는 필터,포맷적용 용도
 *
 * @namespace $_filt_
 */
export const Filter = {
  filters: {
    /**
     * (금액 등) 수치값 3자리 콤마 적용
     */
    $_filt_number(value = '') {
      const rtnValue = ` ${value}`;
      return String(rtnValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * 텍스트 형식의 일시문자열을 포맷팅한다.
     * @param {Date포맷} format
     * @param {일자구분문자} pdd
     * @param {시간구분문자} ptd
     */
    $_filt_strDate(value = '', format, pdd, ptd) {
      const dd = pdd || '.';
      const td = ptd || ':';
      let out = String(value);
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
     * 파일사이즈 표시
     */
    $_filt_bytes(bytes = 0, decimals) {
      const k = 1024;
      const dm = decimals <= 0 ? 0 : decimals || 2;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      const retVal = parseFloat((bytes / (k ** i)).toFixed(dm));
      return `${retVal} ${sizes[i]}`;
    },

  },
};

export default Filter;

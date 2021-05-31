/**
 * 추후 삭제할 예정
 * 더 이상 여기에 함수를 정의하지 않음
 */
export default (value = '') => {
  const rtnValue = ` ${value}`;
  return rtnValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

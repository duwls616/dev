export const gps = {
  data: () => ({
    curLat: '',
    curLng: '',
    distance: '',
  }),
  methods: {
    getCurrentPosition() {
      navigator.geolocation.getCurrentPosition(
        this.callbackPosition,
        this.callbackError,
        { enableHighAccuracy: true },
      );
    },

    callbackPosition(e) {
      this.curLat = e.coords.latitude;
      this.curLng = e.coords.longitude;
    },

    callbackError(e) {
      console.log(e.message);
    },

    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },

    // 현 위치와 거래처의 거리 차이 계산
    getDistance(compPosition, curPosition) {
      const R = 6371; // Radius of the earth in KM

      const compLat = compPosition.lat;
      const compLng = compPosition.lng;

      const currLat = curPosition.lat;
      const currLng = curPosition.lng;

      const subLat = this.deg2rad(compLat - currLat);
      const subLng = this.deg2rad(compLng - currLng);

      const result1 = Math.sin(subLat / 2) * Math.sin(subLat / 2)
                      + Math.cos(this.deg2rad(currLat))
                      * Math.cos(this.deg2rad(compLat))
                      * Math.sin(subLng / 2) * Math.sin(subLng / 2);

      const result2 = 2 * Math.atan2(Math.sqrt(result1), Math.sqrt(1 - result1));

      this.distance = (R * result2);
    },
  },
};

export default { gps };

<template>
  <v-dialog
    content-class="ubs-dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
    v-model="visible">
    <v-card tile>
      <v-card-title class="pb20">
        <p>내 위치 조회</p>
        <v-btn
          class="btn-close"
          icon
          color="#222"
          @click="close()"
        >
          <i class="ubs-icon ubs-icon-close-black"></i>
        </v-btn>
      </v-card-title>
      <div class="pt30"></div>
      <div v-if="xyInfo.type === 'GPS'" class="mt20 ubs-info-belt">
        <p class="txt">
          거래처와 내 위치 거리 차이는
          <b style="color:red">
            {{ parseInt(distance) > 0.0 ? distance.toFixed(0) + 'km'
              : (distance * 1000).toFixed(0) + 'm' }}
            </b> 입니다.
        </p>
      </div>
      <v-layout id="map_content" class="bg-f2f2f2" row wrap>
        <div id="map" style="width:100%;" :height="innerMapHeight"></div>
      </v-layout>
      <v-card-actions >
        <v-btn
          block
          depressed
          large
          tile
          height="52"
          dark
          color="#00ACC1"
          class=""
          @click="close()"
        >
          확인
        </v-btn>
      </v-card-actions>
    </v-card>
    <!-- <AlertDialog :parentData="alertData" /> -->
  </v-dialog>
</template>

<script>
import { gps } from '@/assets/lib/mixin/gps';

/*eslint-disable */
export default {
  props: ['visible', 'xyInfo'],
  mixins: [gps],
  data: () => ({
    apiKey: '',
    map: '',
    marker: '',
    polyLine: '',
    innerMapHeight: '',
  }),
  updated() {
    this.innerMapHeight = document.getElementById('map_content').clientHeight;
  },
  methods: {
    clearMapInfo() {
      if (this.marker) this.marker.setMap(null);
      if (this.polyLine) this.polyLine.setMap(null);
    },
    initHandler() {
      this.clearMapInfo();

      if (this.xyInfo.openCnt === 1) this.addDoc();
      else {
        this.addMarker();
        this.addPolyLine();
        this.setCenter();
      }

      if (this.xyInfo.type === 'GPS') {
        const compPosition = { lat: this.xyInfo.lat, lng: this.xyInfo.lng };
        const curPosition = { lat: this.xyInfo.curLat, lng: this.xyInfo.curLng };

        this.getDistance(compPosition, curPosition);
      }
    },
    addDoc() {
      const sysComboId = 'KAKAO_KEY';
      this.sysCodeList(sysComboId).then((rs) => {
        const clsRow = rs.data.resultList;

        const apiKey = clsRow[0][0].EXT_FIELD2;
        this.apiKey = apiKey;

        this.addScript();
      });
    },
    addScript() {
      const protocol = window.location.protocol;
      const script = document.createElement('script');
      script.onload = () => kakao.maps.load(this.initMap);
      script.src = `${protocol}//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${this.apiKey}`;
      document.head.appendChild(script);
    },
    initMap() {
      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(this.xyInfo.lat, this.xyInfo.lng),
        level: 7,
      };
      this.map = new kakao.maps.Map(container, options); // 지도 생성

      this.addMarker();
      this.addPolyLine();
      this.setCenter();
    },
    addMarker() {
      const positions = [];
      positions.push({latlng: new kakao.maps.LatLng(this.xyInfo.lat, this.xyInfo.lng)});
      if (this.xyInfo.curLat && this.xyInfo.curLng) {
        positions.push({ latlng: new kakao.maps.LatLng(this.xyInfo.curLat, this.xyInfo.curLng) });
      }

      const imgSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
      const imgSize = new kakao.maps.Size(24, 35);

      const imgMarker = new kakao.maps.MarkerImage(imgSrc, imgSize);
      positions.forEach((e, i) => {
        this.marker = new kakao.maps.Marker({
          map: this.map,
          position: e.latlng,
          image: i == 0 ? imgMarker : '',
        });
      });
    },
    addPolyLine() {
      const lines = [];
      lines.push(new kakao.maps.LatLng(this.xyInfo.lat, this.xyInfo.lng));
      if (this.xyInfo.curLat && this.xyInfo.curLng) {
        lines.push(new kakao.maps.LatLng(this.xyInfo.curLat, this.xyInfo.curLng));
      }

      this.polyLine = new kakao.maps.Polyline({
        path: lines,
        strokeWeight: 5,
        strokeColor: 'red',
        strokeStyle: 'solid',
      });

      this.polyLine.setMap(this.map);
    },
    setCenter() {
      const moveLatLng = new kakao.maps.LatLng(this.xyInfo.lat, this.xyInfo.lng);
      this.map.setCenter(moveLatLng);
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
  .ubs-info-belt { width:100%; background-color:#26C6AB; height:42px; }
  .ubs-info-belt .txt { color:#FFF; font-size:16px; font-weight:500; text-align:center; padding-top:8px; }
</style>
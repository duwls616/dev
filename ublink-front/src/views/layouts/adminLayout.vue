<template>
  <v-app>
    <v-card>
      <v-card-title class="text-left justify-left py-6 gray--text">
        UBLink
      </v-card-title>
      <v-card-subtitle class="text-right">
      &#91;{{deptNm}}&#93;{{userNm}}
      <a class="grey--text" @click="logout()">로그아웃</a>
      </v-card-subtitle>
      <v-tabs
        background-color="grey darken-1"
        centered
        grow
        icons-and-text
        color="#FFFFFF"
      >
        <v-tab :key=i
          v-for="(item, i) in tabs"
          @click="movePage(item.id)"><v-icon>{{item.icon}}</v-icon>{{item.name}}</v-tab>
      </v-tabs>
      <component :is="currVw"></component>
  </v-card>

    <!--[바텀네비게이션]-->
    <BottomNavi
      @showMenus="showMenus"
      @showFavMenus="showFavMenus"/>
    <!--//[바텀네비게이션]-->

    <v-content>
      <!--[메뉴화면]-->
      <keep-alive :include="cacheList">
        <router-view :key="$route.fullPath" ref="eventBus" @onProgress="onProgress"></router-view>
      </keep-alive>

      <div class="mt70"></div>
      <AlertDialog :parentData="alertData" />
    </v-content>

    <!--[프로그레스]-->
    <v-dialog persistent overlay-color="white" v-model="progressIsShow">
      <v-progress-circular
        indeterminate
        class="ubs-progress"
        :size="60"
        :width="3"
        :value="25"
        color="primary">
        {{ value }}
      </v-progress-circular>
    </v-dialog>
    <!--//[프로그레스]-->
    <!--[로그인연장팝업]-->
    <LoginExtDialog :visible="loginExtDialogIsShow" @close="closeLoginExtDialog" />
  </v-app>
</template>

<script>
import '@/assets/lib/css/ubs.css';
import Dashboard from '@/views/business/admin/Dashboard.vue';
import ChannelList from '@/views/business/admin/ChannelList.vue';
import AdminRecord from '@/views/business/admin/AdminRecord.vue';
import Layout from '@/views/business/admin/Layout.vue';
import BottomNavi from '@/views/components/BottomNavi.vue';
import LoginExtDialog from '@/views/dialog/LoginExtDialog.vue';

export default {
  name: 'Main',
  components: {
    BottomNavi,
    LoginExtDialog,
    Dashboard,
    ChannelList,
    AdminRecord,
    Layout,
  },
  computed: {
    bindClass() {
      return {
        'bg-gray': (this.currVw === 'ChannelList' || this.currVw === 'AdminRecord' || this.currVw === 'Layout'),
        'bg-white': this.currVw === 'Dashboard',
      };
    },
  },
  data: () => ({
    currVw: null,
    tabs: [
      { id: 'Dashboard', name: '대시보드', icon: 'mdi-home-variant-outline' },
      { id: 'ChannelList', name: '채널관리', icon: 'mdi-animation-play-outline' },
      { id: 'AdminRecord', name: '레코드', icon: 'mdi-chart-areaspline' },
      { id: 'Layout', name: '레이아웃 이동', icon: 'mdi-cog' },
    ],
    lm: {
      isShow: false,
      list: [
        {
          ICON: 'mdi-home-variant-outline', MENU_NM: '홈', ROUTER: 'dashboard',
        },
        {
          ICON: 'mdi-animation-play-outline', MENU_NM: '채널관리', ROUTER: 'channellist',
        },
        {
          ICON: 'mdi-chart-areaspline', MENU_NM: '레코드관리', ROUTER: 'adminrecord',
        },
        {
          ICON: 'mdi-cog', MENU_NM: '레이아웃이동', ROUTER: 'layout',
        },
      ],
    },
    userNm: null,
    deptNm: null,
    vwTitle: null,
    isBackArrow: false,
    isSubmitYn: 'N',
    cacheList: [
      'Invitation',
    ],
    // fav => 즐겨찾기 관련 데이터
    fav: {
      isShow: false,
      isShowSetPopup: false,
      list: [],
      setList: [],
    },
    notice: {
      isShow: false,
      list: {
        NOTICE_ID: '',
        NOTICE_TITLE: '',
        CONTENTS: '',
        HITS: '',
        CRT_TIME: '',
        EMP_NM: '',
      },
    },
    progressIsShow: false,
    loginExtDialogIsShow: false,
  }),
  created() {
    this.onResizeHandler();
    this.$store.dispatch('getUserInfo', { router: this.$router }).then(() => {
      this.userNm = this.$store.getters.getUserNm;
      this.deptNm = this.$store.getters.getDeptNm;

      this.fav.setList = this.$_comm_cloneDeep(this.lm.list);
      this.currVw = 'Dashboard';
    });
  },
  updated() {
    this.vwTitle = this.$route.meta.title;
    this.isBackArrow = this.$route.meta.isBackArrow;
    this.isSubmitYn = this.$store.getters.getSubmitYn;
  },
  methods: {
    onResizeHandler() {
      const currWidth = window.innerWidth;
      if (currWidth >= 1264) this.lm.isShow = true;
    },
    doProcess() {
      this.$refs.eventBus.doSubmit();
    },
    logout() {
      const url = '/business/loginExpire.do';
      this.axiosCall('', url).then(() => {
        this.$router.push('/login');
      });
    },
    menuBar(id) {
      const currWidth = window.innerWidth;
      if (currWidth <= 1263) {
        this.lm.isShow = false;
        this.fav.isShow = false;
        this.fav.isShowSetPopup = false;
      }

      if (this.routerValidation(id)) {
        this.$router.push(`/admin/${id}`);
      }
    },
    movePage(id) {
      this.currVw = id;
    },
    // 동일 라우터 요청시 오류발생으로 Validation 체크
    routerValidation(id) {
      const curUrl = this.$route.path;
      const nextUrl = `/admin/${id}`;

      if (curUrl === nextUrl) {
        return false;
      }
      return true;
    },
    showMenus() {
      this.lm.isShow = !this.lm.isShow;
    },
    showFavMenus() {
      this.fav.isShow = !this.fav.isShow;
    },
    onProgress(isOn) {
      this.progressIsShow = isOn;
    },
    openLoginExtDialog() {
      this.loginExtDialogIsShow = true;
    },
    closeLoginExtDialog() {
      this.loginExtDialogIsShow = false;
    },
  },
};
</script>

<style scope>
  .theme--light.v-icon:hover {color: #FFFFFF}
  .gray--text {color: #424242 !important}
  .white--text {color: #FFFFFF !important}
</style>

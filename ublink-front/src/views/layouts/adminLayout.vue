<template>
  <v-app id="inspire">
    <div class="display">
      <v-spacer></v-spacer>
      <v-row>
          <v-col cols="10">
            <v-row>
                <v-icon class="white--color">mdi-cube-outline</v-icon>
                <p style="font-size:25px">
                  UBLINK
                </p>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-avatar
              class="hidden-sm-and-down"
              color="grey darken-1 shrink"
              size="32"
              icon
              outlined
            >
            <v-icon color="white">mdi-account</v-icon>
          </v-avatar>
          [] <v-icon class="white--color">mdi-logout-variant</v-icon>
          </v-col>
      </v-row>
    </div>
    <v-app-bar
      app
      color="grey lighten-5"
      style="margin-top:80px"
      flat
      fixed
    >
      <v-container class="py-0 fill-height">
        <v-btn
          v-for="item in lm.list"
          :key="item"
          text
          large
          style="font-size:15px;padding-right:50px;color:#37474F"
        >
          <v-icon left>{{ item.ICON }}</v-icon>{{ item.MENU_NM }}
        </v-btn>

        <v-spacer></v-spacer>
      </v-container>
    </v-app-bar>

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
import BottomNavi from '@/views/components/BottomNavi.vue';
import LoginExtDialog from '@/views/dialog/LoginExtDialog.vue';

export default {
  name: 'Main',
  components: {
    BottomNavi,
    LoginExtDialog,
  },
  computed: {
  },
  data: () => ({
    currVw: null,
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
  .theme--light.v-icon:hover {color: #34acfc}
  .theme--light.v-btn:hover {color: #34acfc}
  .gray--text {color: #141318 !important}
  .white--color {color: #FFFFFF !important}
  .display{
    background: #203A43;  /* fallback for old browsers */
    height:70px;color:white;font-size:20px;
  }
</style>

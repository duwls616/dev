<template>
  <v-app>
    <!--[좌 메뉴]--->
    <v-navigation-drawer app v-model="lm.isShow" clipped width="300">
      <template>
        <v-card flat tile dark color="#00ACC1" class="ubs-profile d-lg-none">
          <v-btn icon color="white" @click="lm.isShow = false" class="close">
            <!-- <v-icon>mdi-close</v-icon> -->
            <i class="ubs-icon ubs-icon-close-white"></i>
          </v-btn>
          <v-list-item three-line>
            <v-list-item-avatar tile size="52">
              <v-img src="@/assets/lib/img/profile.svg" class="elevation-6"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <p class="name">
                &#91;{{deptNm}}&#93;
                {{userNm}}
              </p>
              <a class="logout" @click="logout()">로그아웃</a>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-card flat tile dark color="#00ACC1" class="d-none d-lg-block">
          <v-card-actions @click="menuBar('')" style="height:56px; cursor:pointer;">
            <p class="ml-3">UBLink</p>
          </v-card-actions>
        </v-card>

        <v-card max-width="300" flat tile>
          <v-list
            v-for="item in lm.list"
            :key="item.MENU_NM"
          >
            <div
              v-if="!item.SUB"
            >
              <v-list-item
                @click="menuBar(item.ROUTER)"
              >
                <v-list-item-icon>
                  <v-icon>{{item.ICON}}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{item.MENU_NM}}</v-list-item-title>
              </v-list-item>
            </div>
            <v-list-group
              v-else
              v-model="item.active"
              no-action
              :prepend-icon="item.ICON"
              >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.MENU_NM }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <div
                v-for="subItem in item.SUB"
                :key="subItem.MENU_NM"
              >
                <v-list-group
                  v-if="subItem.LEAFSUB"
                  no-action
                  sub-group
                >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ subItem.MENU_NM }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
                  <v-list-item
                    v-for="leafsubItem in subItem.LEAFSUB"
                    :key="leafsubItem.MENU_NM"
                    @click="menuBar(leafsubItem.ROUTER)"
                  >
                    <v-list-item-title>
                      {{ leafsubItem.MENU_NM }}
                    </v-list-item-title>
                    <v-list-item-icon>
                      <v-icon>{{ leafsubItem.ICON }}</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list-group>
                <v-list-item
                  v-else
                  @click="menuBar(subItem.ROUTER)"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ subItem.MENU_NM }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-list-group>
          </v-list>
        </v-card>
      </template>
    </v-navigation-drawer>
    <!--//[좌 메뉴]--->

    <!--[헤더]-->
    <v-app-bar
      app
      color="white"
      flat
    >
      <v-app-bar-nav-icon
        v-if="!isBackArrow"
        @click.stop="lm.isShow = !lm.isShow"
        class="d-lg-none"
        color="222222">
      </v-app-bar-nav-icon>
      <!--왼쪽 화살표-->

      <v-btn v-if="isBackArrow" icon color="#222222" @click="$router.go(-1);">
        <v-icon large>mdi-chevron-left</v-icon>
      </v-btn>

      <v-toolbar-title>
        <a href="#" v-if="!vwTitle">
          <p class="ml-3">UBLink</p>
        </a>
        {{ vwTitle }}
      </v-toolbar-title>

      <div class="app-bar-account d-none d-lg-inline-block">
        <v-icon color="707070">mdi-account-circle</v-icon>
        <span class="team-name">
          &#91;{{deptNm}}&#93;
          {{userNm}}
        </span>
        <v-btn icon @click="logout()">
          <i class="ubs-icon ubs-icon-logout"></i>
        </v-btn>
      </div>

      <div v-if="isSubmitYn === 'Y'"
        class="app-bar-account d-flex d-sm-none"
        @click="doProcess()">
        <v-btn icon color="#222222">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </v-app-bar>
    <!--//[헤더]-->

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
  data: () => ({
    lm: {
      isShow: false,
      list: [
        {
          ICON: 'mdi-home-variant-outline',
          MENU_NM: '홈',
          ROUTER: 'dashboard',
        },
        {
          ICON: 'mdi-animation-play-outline',
          MENU_NM: '컨텐츠',
          SUB: [
            { ICON: '', MENU_NM: '초대장 발송', ROUTER: 'invitation' },
            { ICON: '', MENU_NM: '설문조사', ROUTER: 'survey' },
            { ICON: '', MENU_NM: '브로셔', ROUTER: 'brochure' },
            {
              ICON: '',
              MENU_NM: '제품설명회',
              LEAFSUB: [
                { ICON: 'mdi-content-copy', MENU_NM: '제품설명회 관리', ROUTER: 'seminar' },
                { ICON: 'mdi-account-group', MENU_NM: '신청현황', ROUTER: 'seminarreq' },
              ],
            },
          ],
        },
        {
          ICON: 'mdi-chart-areaspline',
          MENU_NM: '리포트',
          SUB: [
            { ICON: '', MENU_NM: '전송로그 관리', ROUTER: 'msglog' },
            { ICON: '', MENU_NM: '채널가입현황', ROUTER: 'chennelmem' },
            { ICON: '', MENU_NM: '레코드관리', ROUTER: 'mrrecord' },
          ],
        },
        {
          ICON: 'mdi-cog',
          MENU_NM: '설정',
          SUB: [
            { ICON: '', MENU_NM: '고객관리', ROUTER: 'contmng' },
            { ICON: '', MENU_NM: '사용자관리', ROUTER: 'usermng' },
            { ICON: '', MENU_NM: '부서관리', ROUTER: 'deptmng' },
            { ICON: '', MENU_NM: '그룹권한관리', ROUTER: 'groupauthmng' },
            { ICON: '', MENU_NM: '고객그룹화', ROUTER: 'contgroupmng' },
          ],
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
        this.$router.push(`/mr/${id}`);
      }
    },
    // 동일 라우터 요청시 오류발생으로 Validation 체크
    routerValidation(id) {
      const curUrl = this.$route.path;
      const nextUrl = `/mr/${id}`;

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
</style>

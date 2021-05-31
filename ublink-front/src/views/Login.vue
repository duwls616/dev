<template>
  <v-app>
    <v-content>
      <v-container>
        <!--[상세 본문 영역]-->
        <v-layout row wrap>
          <v-flex xs12 sm12 md12>

            <div class="login-header">
              <img class="logo" src="@/assets/lib/img/logo_white.svg" alt="UBSales">
            </div>

            <v-form name="f" action="/business/j_spring_security_check" method="POST">
              <div class="login-body">
                <v-row class="d-none d-sm-flex">
                  <v-col>
                    <img class="illust" src="@/assets/lib/img/main_illust_cyan.svg" alt="">
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                    label="회사코드"
                    outlined
                    flat
                    solo
                    height="48"
                    id="j_compid"
                    name="j_compid"
                    v-model="j_compid"
                  ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                    label="아이디"
                    outlined
                    flat
                    solo
                    height="48"
                    id="j_username"
                    name="j_username"
                    v-model="j_username"
                  ></v-text-field>
                  </v-col>
                </v-row>
                <input type="hidden" id="j_password" name="j_password" v-model="j_password"/>
                <v-row>
                  <v-col>
                    <v-text-field
                    label="비밀번호"
                    outlined
                    flat
                    solo
                    height="48"
                    :type="login.pass"
                    :rules="[login.passRules.required, login.passRules.min]"
                    id="j_password_scr"
                    name="j_password_scr"
                    v-model="j_password_scr"
                    @keyup.enter="loginProc()"
                  ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                </v-row>
                <v-row>
                  <v-col>
                    <v-checkbox v-model="isValueSave" label="로그인 정보 저장"></v-checkbox>
                  </v-col>
                  <v-col class="text-right">
                    <v-tooltip v-model="login.tooltip" bottom content-class="ubs-tooltip">
                      <template v-slot:activator="{ on }">
                        <v-btn v-on="on"
                          text small
                          @click="login.tooltip = !login.tooltip"
                          class="txt-info txt-info-underline">
                          <v-icon>mdi-alert-circle-outline</v-icon>
                          접속 도메인 변경
                        </v-btn>
                      </template>
                      <span>
                        커스터마이징 클라우드 이용 고객은
                        아래 접속 도메인에 발급 받은
                        사이트 URL을 입력해 주세요.
                      </span>
                    </v-tooltip>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn
                      class="btn-login"
                      dark depressed block height="48"
                      color="cyan darken-1"
                      @click="loginProc()">로그인</v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-form>

            <!--[푸터]-->
            <v-footer padless>
              <v-row justify="center" no-gutters>
                <v-col class="text-center" cols="12">
                  <strong>
                    Copyright ©{{ new Date().getFullYear() }} UBcare Co., Ltd. All rights reserved
                  </strong>
                </v-col>
                <v-btn
                  v-for="(item, index) in ft.list" :key="index"
                  color="black"
                  text
                  class="my-2"
                >
                  {{ item.txt }}
                </v-btn>
              </v-row>
            </v-footer>
            <!--//[푸터]-->

          </v-flex>
          <!--
          <v-flex xs12 sm12 md6 d-none d-md-flex>
            <img src="@/assets/lib/img/dummy_login_ad.jpg" alt="" style="width: 100%">
          </v-flex>
          -->
        </v-layout>
        <!--//[상세 본문 영역]-->

      <AlertDialog :parentData="alertData" />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import '@/assets/lib/css/login.css';
import sha256 from 'sha256';
import { Common } from '@/assets/lib/mixin/common';

export default {
  name: 'Main',
  mixins: [Common],
  components: {
  },
  data: () => ({
    isValueSave: true,
    tooltip: false,
    login: {
      pass: 'Password',
      passRules: {
        required: value => !!value || '비밀번호를 입력 해 주세요.',
        min: v => v.length <= 80 || '최소 8글자 이상 입력하세요',
      },
    },
    ft: {
      list: [
        /*
        { txt: '이용약관' },
        { txt: '개인정보처리취급방침' },
        */
      ],
    },
    j_compid: '',
    j_username: '',
    j_password: '',
    j_password_scr: '',
  }),
  mounted() {
    this.checkCookie();
    if (this.$route.query && this.$route.query.errMsg) {
      this.openAlertDialog({ status: 'ERROR', body: this.$route.query.errMsg.replace(/\\n/g, '<br>') });
    }
  },
  methods: {
    saveCookie() {
      this.$_comm_setCookie('ubsales_cloud_mr_dmn', this.j_compid, 365);
      this.$_comm_setCookie('ubsales_cloud_mr_userid', this.j_username, 365);
    },
    checkCookie() {
      const cookieDmn = this.$_comm_getCookie('ubsales_cloud_mr_dmn');
      const cookieUserId = this.$_comm_getCookie('ubsales_cloud_mr_userid');
      const password = document.getElementById('j_password_scr');

      if (cookieDmn) {
        this.j_compid = cookieDmn;
      }

      if (cookieUserId) {
        this.j_username = cookieUserId;
        password.focus();
      }
    },
    loginProc() {
      if (this.j_compid === '') {
        alert('회사코드를 입력하세요');
        return;
      }
      if (this.j_username === '') {
        alert('ID를 입력하세요');
        return;
      }
      if (this.j_password_scr === '') {
        alert('비밀번호를 입력하세요');
        return;
      }

      if (this.isValueSave) {
        this.saveCookie();
      }

      const pwd = document.getElementById('j_password');
      const pwdScr = document.getElementById('j_password_scr');
      pwd.value = (sha256(pwdScr.value)).toUpperCase();
      pwdScr.value = '';

      document.f.submit();
    },
  },
};
</script>

<style scope>

</style>

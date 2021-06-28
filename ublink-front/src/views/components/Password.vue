<template>
  <v-layout class="ubs-pannel bg-white bd-none mb15" row wrap>
    <v-flex v-if="!confirm" style="margin: 0 40px !important">
      <div class="mt15"></div>
      <v-row>
        <v-col>
          <p class="text-center password-box">
            비밀번호 변경
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p class="text-center">본인 확인을 위해 비밀번호를 입력하세요.</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            type="password"
            class="ubs-textfield"
            v-model="curInfo.password"></v-text-field>
        </v-col>
      </v-row>
      <div class="text-right mt5 mb15 mr10">
        <v-btn
          class="ubs-btn ubs-btn-primary"
          dark
          color="cyan darken-1"
          elevation="1"
          @click="selectPassword();">
          <v-icon small left>mdi-pencil</v-icon> 확인
        </v-btn>
      </div>
    </v-flex>
    <v-flex v-if="confirm">
      <v-row>
        <v-col>
          <p class="text-center">변경하실 비밀번호를 입력해주세요.</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field type="password"
            v-model="newInfo.password"
            class="ubs-textfield"
            label="신규 비밀번호 입력"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field type="password"
            v-model="newInfo.password1"
            class="ubs-textfield"
            label="신규 비밀번호 입력 확인"></v-text-field>
        </v-col>
      </v-row>
      <div class="text-right mt5 mb15 mr10">
        <v-btn
          class="ubs-btn ubs-btn-primary"
          dark
          color="cyan darken-1"
          elevation="1"
          @click="changePassword();">
          <v-icon small left>mdi-pencil</v-icon> 비밀번호 변경
        </v-btn>
      </div>
    </v-flex>
    <AlertDialog :parentData="alertData" />
  </v-layout>
</template>

<script>
import sha256 from 'sha256';

export default {
  name: 'Password',
  data: () => ({
    confirm: false,
    curInfo: {
      password: '',
    },
    newInfo: {
      password: '',
      password1: '',
    },
  }),
  methods: {
    selectPassword() {
      const param = {
        ac: 'MYINFO001',
        workType: 'Q_PASSWORD',
        password: (sha256(this.curInfo.password)).toUpperCase(),
      };

      this.axiosCall(param).then((rs) => {
        if (rs.data.errorCode === 'MSG0001' || rs.data.errorCode === 'MSG0006') {
          const clsRow = rs.data.resultList;
          const info = clsRow[0][0];
          if (info.AUTH_CHECK === 'Y') {
            this.openAlertDialog({ status: 'CHECK', body: '인증되었습니다.\n비밀번호를 변경하세요.' });
            this.confirm = true;
          } else {
            this.openAlertDialog({ status: 'ERROR', body: '비밀번호를 잘못 입력하였습니다.' });
          }
        } else {
          this.openAlertDialog({ status: 'ERROR', body: '비밀번호를 잘못 입력하였습니다.' });
        }
      });
    },
    passwordValidation() {
      if (this.curInfo.password === '' || this.curInfo.password1 === '') {
        this.openAlertDialog({ status: 'VALIDATION', body: '비밀번호를 입력하세요.' });
        return false;
      }
      if ((this.curInfo.password === this.newInfo.password)
        || (this.curInfo.password === this.newInfo.password1)) {
        this.openAlertDialog({ status: 'VALIDATION', body: '이전 비밀번호와 동일하게 사용할 수 없습니다.' });
        return false;
      }
      if (this.newInfo.password !== this.newInfo.password1) {
        this.openAlertDialog({ status: 'VALIDATION', body: '비밀번호가 일치하지 않습니다.' });
        return false;
      }

      const returnStr = this.$_comm_checkPassword(this.newInfo.password);
      if (returnStr === 'MSG1001') {
        this.openAlertDialog({ status: 'VALIDATION', body: '8 ~ 20자리 이내로 입력하세요.' });
        return false;
      }
      if (returnStr === 'MSG1002') {
        this.openAlertDialog({ status: 'VALIDATION', body: '공백을 제거하고 입력하세요.' });
        return false;
      }
      if (returnStr === 'MSG1003') {
        this.openAlertDialog({ status: 'VALIDATION', body: '영문, 숫자, 특수문자를 혼합하여 입력하세요.' });
        return false;
      }
      return true;
    },
    changePassword() {
      if (this.passwordValidation()) {
        const param = {
          ac: 'MYINFO002',
          workType: 'U_PASSWORD',
          password: (sha256(this.newInfo.password)).toUpperCase(),
        };

        this.axiosCall(param).then((rs) => {
          if (rs.data.errorCode === 'MSG0004' || rs.data.errorCode === 'MSG0006') {
            const alertParam = {
              status: 'CHECK',
              body: '정상적으로 수정되었습니다. \n메인화면으로 이동합니다',
              submitCallback: this.movePage,
            };
            this.openAlertDialog(alertParam);
          } else {
            this.openAlertDialog({ status: 'ERROR', body: '오류가 발생하였습니다.' });
          }
        });
      }
    },
    movePage() {
      this.$router.push({ path: '/mr' });
    },
  },
};
</script>

<style>
  .password-box {
    color:#00acc1;
    font-size:29px;
    border:3px solid #00acc1;
    border-radius:5px;
    height:50px;
  }
</style>

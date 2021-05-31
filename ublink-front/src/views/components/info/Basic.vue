<template>
  <v-layout class="bg-white mb5" row wrap>
    <v-flex>
      <v-row>
        <v-col cols="6" sm="6" md="6" xs="6">
          <v-text-field v-model="info.EMP_NM"
            class="ubs-textfield"
            label="사용자명"></v-text-field>
        </v-col>
        <v-col cols="6" sm="6" md="6" xs="6">
          <v-text-field v-model="info.EMP_NO"
            class="ubs-textfield"
            label="사번"></v-text-field>
        </v-col>
        <v-col cols="6" sm="6" md="6" xs="6">
          <v-text-field v-model="info.EMAIL_ADDR"
            class="ubs-textfield"
            label="이메일"></v-text-field>
        </v-col>
        <v-col cols="6" sm="6" md="6" xs="6">
          <v-text-field v-model="info.INTER_PHONE"
            class="ubs-textfield"
            label="내선번호"></v-text-field>
        </v-col>
        <v-col cols="6" sm="6" md="6" xs="6">
          <v-text-field v-model="info.OFFICE_TEL"
            class="ubs-textfield"
            label="회사번호"></v-text-field>
        </v-col>
        <v-col cols="6" sm="6" md="6" xs="6">
          <v-text-field v-model="info.MOBILE_PHONE"
            class="ubs-textfield"
            label="핸드폰번호"></v-text-field>
        </v-col>
        <v-col cols="6" sm="6" md="6" xs="6">
          <v-select
            :items="codeList.roleList"
            item-value="CODE_D"
            item-text="CODE_D_NM"
            label="직책"
            v-model="info.ROLE_CD"
            hide-details
            outlined
            dense
            solo
            flat
          ></v-select>
        </v-col>
        <v-col cols="6" sm="6" md="6" xs="6">
          <v-select
            :items="codeList.titleList"
            item-value="CODE_D"
            item-text="CODE_D_NM"
            label="직위"
            v-model="info.TITLE_CD"
            hide-details
            outlined
            dense
            solo
            flat
          ></v-select>
        </v-col>
      </v-row>
      <div class="text-right mt5 mb15 mr10">
        <v-btn
          class="ubs-btn ubs-btn-primary"
          dark
          color="cyan darken-1"
          elevation="1"
          @click="saveEmp();">
          <v-icon small left>mdi-pencil</v-icon> 정보변경
        </v-btn>
      </div>
    </v-flex>
    <AlertDialog :parentData="alertData" />
  </v-layout>
</template>

<script>
export default {
  name: 'Basic',
  data: () => ({
    query: {
      yyyymm: '',
      month: '3',
      deptId: '',
      isShow: false,
    },
    info: {},
    codeList: {
      deptList: [],
      empList: [],
    },
  }),
  async created() {
    await this.searchCodeList();
    this.selectEmpList();
  },
  methods: {
    // 공통코드 조회
    async searchCodeList() {
      const sysComboId = 'EMP_ROLE|EMP_TITLE';
      const rs = await this.sysCodeList(sysComboId);
      const clsRow = rs.data.resultList;

      const arrRole = clsRow[0];
      this.codeList.roleList = arrRole;

      const arrTitle = clsRow[1];
      this.codeList.titleList = arrTitle;
    },
    selectEmpList() {
      const param = {
        ac: 'MYINFO001',
        workType: 'Q_INFO',
      };

      this.axiosCall(param).then((rs) => {
        if (rs.data.errorCode === 'MSG0001' || rs.data.errorCode === 'MSG0006') {
          const clsRow = rs.data.resultList;
          const arrInfo = clsRow[0][0];
          this.info = arrInfo;
        }
      });
    },
    saveEmp() {
      const param = {
        ac: 'MYINFO002',
        workType: 'N_INFO',
        empNm: this.info.EMP_NM,
        empNo: this.info.EMP_NO,
        emailAddr: this.info.EMAIL_ADDR,
        interPhone: this.info.INTER_PHONE,
        officeTel: this.info.OFFICE_TEL,
        mobilePhone: this.info.MOBILE_PHONE,
        roleCd: this.info.ROLE_CD,
        titleCd: this.info.TITLE_CD,
      };

      this.axiosCall(param).then((rs) => {
        if (rs.data.errorCode === 'MSG0001' || rs.data.errorCode === 'MSG0004') {
          this.openAlertDialog({ status: 'CHECK', body: '정상적으로 수정되었습니다.' });
          this.selectEmpList();
        } else {
          this.openAlertDialog({ status: 'ERROR', body: '수정도중 오류가 발생하였습니다.' });
        }
      });
    },
  },
};
</script>

<style>
</style>

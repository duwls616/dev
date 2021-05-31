<template>
  <v-dialog
      content-class="ubs-dialog"
      v-model="visible"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-card-title :class="{ 'small': cls.smallTitle }">
          <p>{{ this.title }}</p>
          <v-btn
            class="btn-close"
            icon
            color="#222"
            @click="close()">
            <i class="ubs-icon ubs-icon-close-black"></i>
          </v-btn>
        </v-card-title>
        <v-card-text @scroll="scroll($event)" style="padding-bottom:0px !important">
          <div class="pb15 pl20 pr20 bg-white">
            <div class="mt15 pb10"></div>

            <label class="ubs-label">대상선택</label>
            <div class="ubs-chip-group ubs-chip-group-add" style="min-height:42px">
              <v-btn
                class="ubs-btn font-weight-medium ml10"
                width="72"
                height="29"
                color="primary"
                elevation="1"
                style="margin-top:1px;"
                @click="openEmpDialog();">
                + 추가
              </v-btn>
              <v-chip
                close
                class=""
                v-for="(item, i) in shareEmpList" :key=i
                @click:close="shareEmpList.splice(i, 1);">
                {{item.DEPT_NM}} / {{item.EMP_NM}}
              </v-chip>
            </div>

            <div class="mt15 pb10"></div>

            <label class="ubs-label">메일제목</label>
            <v-text-field
              readonly
              class="ubs-textfield"
              style="padding-top:0px !important; margin-top:0px !important;"
              :value="data.title"></v-text-field>

            <label class="ubs-label">내용</label>
            <p class="mail-content"
              v-html="$_comm_convertNewLineToBrTag(data.content)"></p>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            block
            depressed
            large
            tile
            height="52"
            color="#fff"
            class=""
            @click="close()"
          >
            <v-icon>mdi-close</v-icon>취소
          </v-btn>
          <v-btn
            block
            depressed
            large
            tile
            height="52"
            dark
            color="#00ACC1"
            class=""
            @click="submit()"
          >
            <v-icon class="mr-1">mdi-email-outline</v-icon> 발송
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- 공통모듈로 빠져있으나 다이얼로그에서는 적용이 되지 않아 작성함 -->
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
      <AlertDialog :parentData="alertData" />
      <EmpDialog multiple :visible="addEmpDialogIsShow" @close="closeEmpDialog" />
    </v-dialog>
</template>

<script>
import EmpDialog from '@/views/dialog/EmpDialog.vue';
import { pagination } from '@/assets/lib/mixin/pagination';

export default {
  name: 'MailDialog',
  components: {
    EmpDialog,
  },
  props: {
    visible: {
      type: Boolean,
    },
    title: {
      type: String,
      default: '메일발송',
    },
  },
  mixins: [pagination],
  data: () => ({
    data: {
      toMail: '',
      fromMail: '',
      title: '',
      content: '',
    },
    shareEmpList: [],
    cls: {
      smallTitle: false,
    },
    addEmpDialogIsShow: false,
    progressIsShow: false,
  }),
  created() {
    this.initCodeList();
  },
  methods: {
    scroll(e) {
      this.cls.smallTitle = (e.currentTarget.scrollTop > 0);
    },
    initCodeList() {
      const compComboId = 'EMAIL_FROM';
      this.compCodeList(compComboId).then((rs) => {
        const clsRow = rs.data.resultList;

        const mailInfo = clsRow[0][0];
        this.data.fromMail = mailInfo.CODE_D_NM;
      });
    },
    initData(e) {
      this.shareEmpList = [];
      this.data.title = e.title;
      this.data.content = e.content;
    },
    openEmpDialog() {
      this.addEmpDialogIsShow = true;
      this.$emit('onProgress', true);
    },
    closeEmpDialog(data) {
      this.$_comm_log(data);
      if (data) {
        let objData = [];
        if (this.shareEmpList === '') {
          objData = data;
          this.shareEmpList = objData;
        } else {
          const filt = data.filter((item) => {
            const exist = this.shareEmpList.find(el => (el.EMP_ID === item.EMP_ID));
            return exist === undefined;
          });
          if (filt.length) {
            filt.forEach((e) => {
              this.shareEmpList.push(e);
            });
          }
        }
      }
      this.addEmpDialogIsShow = false;
    },
    close() {
      this.$emit('close');
    },
    submit() {
      this.progressIsShow = true;
      const params = {
        fromMail: this.data.fromMail, // 보내는 사람
        toMail: this.$_comm_convertArrToStr(this.shareEmpList, 'EMAIL_ADDR', '¿'), // 받는사람
        title: this.data.title,
        contents: `${this.data.content}XSS_EXCEPTION`,
      };

      this.axiosCall(params, '/business/mail/sendMail.do', false).then((rs) => {
        if (rs) {
          if (rs.data.returnCode === 'MSG1001') {
            this.openAlertDialog({ status: 'CHECK', body: '메일 전송이 완료되었습니다.' });
            this.$emit('close');
          } else {
            this.openAlertDialog({ status: 'ERROR', body: '메일전송 도중 오류가 발생하였습니다.' });
          }
        }
        this.progressIsShow = false;
      });
    },
  },
};
</script>

<style scoped>
  .mail-content {
    min-height:300px;
    border-radius:10px;
    border:1px solid #c2c2c2;
    padding:10px;
    font-weight:500;
  }
</style>

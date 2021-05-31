<template>
  <!--[파일업로드 팝업]-->
  <v-dialog
    content-class="ubs-dialog"
    v-model="visible"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card tile>
      <v-card-title>
        <p>{{ this.title }}</p>
        <v-btn
          class="btn-close"
          icon
          color="#222"
          @click="close()">
          <i class="ubs-icon ubs-icon-close-black"></i>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <div class="pl20 pr20 pt30">
          <v-file-input
            v-model="files"
            color="primary accent-4"
            counter
            label="File input"
            :multiple="multiple"
            placeholder="파일을 선택하세요."
            prepend-icon="mdi-paperclip"
            outlined
            :loading="loading"
            :show-size="1000"
            @change="changeFile()"
          >
            <template v-slot:selection="{ index, text }">
              <v-chip
                color="primary accent-4"
                dark
                label
                small
              >
                {{ text }}
              </v-chip>
            </template>
          </v-file-input>
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
          class="fw400"
          @click.stop="close()"
        >
          취소
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
          @click.stop="submit()"
        >
          업로드
        </v-btn>
      </v-card-actions>
    </v-card>
    <!-- Alert 다이얼로그 -->
    <AlertDialog :parentData="alertData" />
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FileUploadDialog',
  props: {
    visible: {
      type: Boolean,
    },
    title: {
      type: String,
      default: '파일업로드',
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    files: [],
    loading: false,
  }),
  methods: {
    changeFile() {
    },
    clearFile() {
      this.files.splice(0);
    },
    submit() {
      // this.file = this.$refs.file.files[0];
      // formData.append('file', this.file);

      // 파일업로드 실행
      if (!this.files.length) {
        this.openAlertDialog({ status: 'VALIDATION', body: '파일을 하나 이상 선택하세요.' });
        return;
      }
      const formData = new FormData();
      for (let i = 0; i < this.files.length; i += 1) {
        const file = this.files[i];
        formData.append(`files[${i}]`, file);
      }
      this.loading = true;

      axios.post(
        '/business/fileUpload.do',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      ).then((rs) => {
        if (rs && rs.data) {
          this.openAlertDialog({
            status: 'CHECK',
            body: '파일업로드를 완료 하였습니다.',
            submitCallback: () => {
              const retVal = [];
              for (let i = 0; i < rs.data.fileIDList.length; i += 1) {
                retVal.push({
                  fileId: rs.data.fileIDList[i],
                  fileSize: rs.data.fileSizeList[i],
                  fileURL: rs.data.fileURLList[i],
                  oriFileName: rs.data.oriFileNameList[i],
                  newFileName: rs.data.newFileNameList[i],
                });
              }
              this.clearFile();
              this.$emit('close', retVal);
            },
          });
        }
      })
      .catch((err) => {
        this.openAlertDialog({ status: 'ERROR', body: '파일업로드 실행 중, 오류가 발생하였습니다.' });
        console.log(`파일업로드 실행 중, 오류가 발생하였습니다. \n${err.response}`);
      })
      .finally(() => {
        this.loading = false;
      });
    },
    close() {
      this.clearFile();
      this.$emit('close');
    },
  },
};
</script>

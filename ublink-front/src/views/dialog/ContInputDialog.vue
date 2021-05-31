<template>
  <!--[고객 직접 입력 팝업]-->
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
        <div class="pl20 pr20 pt20">
          <v-simple-table class="ubs-table no-row-border no-table-border no-padding">
            <template v-slot:default>
              <colgroup>
                <col width="">
                <col width="130px">
              </colgroup>
              <thead>
                <tr>
                  <th class="text-left">소속</th>
                  <th class="text-left">이름</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in list" :key="i">
                  <td class="text-left">
                    <div class="pr5">
                      <v-text-field v-model="item.COMP_NM" hide-details solo outlined flat dense
                        class="ubs-textfield" label="소속입력[필수]">
                      </v-text-field>
                    </div>
                  </td>
                  <td class="text-left pl5">
                    <div class="pl5">
                      <v-text-field v-model="item.CONT_NM" hide-details solo outlined flat dense
                        class="ubs-textfield" label="이름[필수]">
                      </v-text-field>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div class="text-center">
            <v-btn text class="fw400 underline" @click.stop="addInput()">+입력추가</v-btn>
          </div>
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
          추가
        </v-btn>
      </v-card-actions>
    </v-card>
    <!-- Alert 다이얼로그 -->
    <AlertDialog :parentData="alertData" />
    <ConfirmDialog :parentData="confirmData" />
  </v-dialog>
</template>

<script>
export default {
  name: 'ContInputDialog',
  props: {
    visible: {
      type: Boolean,
    },
    title: {
      type: String,
      default: '의료인 직접 입력',
    },
  },
  data: () => ({
    list: [],
  }),
  created() {
    this.list = [{
      COMP_NM: '', CONT_NM: '',
    }];
  },
  updated() {
    this.list = [{
      COMP_NM: '', CONT_NM: '',
    }];
  },
  methods: {
    addInput() {
      this.list.push({ COMP_NM: '', CONT_NM: '' });
    },
    close() {
      this.$emit('close');
    },
    submit() {
      const emptyList = [];
      for (let i = 0; i < this.list.length; i += 1) {
        const el = this.list[i];
        if (el.COMP_NM === '' || el.CONT_NM === '') {
          emptyList.push(el);
        }
      }
      if (emptyList.length === this.list.length) {
        this.openAlertDialog({ status: 'VALIDATION', body: '대상 정보를 한 건이상 입력하세요.' });
        return;
      }
      if (emptyList.length > 0) {
        const confirm = {
          body: '소속 또는 이름을 입력하지 않은 라인은 추가되지 않습니다. 진행하시겠습니까?',
          submitCallback: this.returnData,
        };
        this.openConfirmDialog(confirm);
      } else {
        this.returnData();
      }
    },
    returnData() {
      // 소속 또는 이름을 입력하지 않은 라인은 제외하고 반환
      const retVal = [];
      for (let i = 0; i < this.list.length; i += 1) {
        const el = this.list[i];
        if (el.COMP_NM !== '' && el.CONT_NM !== '') {
          retVal.push(el);
        }
      }
      this.$emit('close', retVal);
    },
  },
};
</script>

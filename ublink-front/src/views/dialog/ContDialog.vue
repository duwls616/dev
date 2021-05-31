<template>
  <!--[고객검색팝업]-->
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
          @click="close()"
        >
          <i class="ubs-icon ubs-icon-close-black"></i>
        </v-btn>
      </v-card-title>

      <v-card-text @scroll="scroll($event)">
        <div class="pb15 pl20 pr20 bg-f2f2f2">
          <div class="pt30"></div>
          <v-text-field
          v-model="param.queryStr"
          class="ubs-search-textfield"
          label="고객/거래처명/주소/진료과"
          solo
          dense
          clearable
          flat
          outlined
          hide-details
          background-color="#f8f8f8"
          append-icon="mdi-magnify"
          @click:append="search()"
          >
          </v-text-field>

          <div class="mb10"></div>
          <v-radio-group v-model="param.contType" class="ubs-radio-group" row hide-details>
            <v-radio label="전체" value="ALL" color="cyan darken-1"></v-radio>
            <v-radio label="의사" value="10" color="cyan darken-1"></v-radio>
            <v-radio label="약사" value="20" color="cyan darken-1"></v-radio>
            <v-radio label="간호사" value="40" color="cyan darken-1"></v-radio>
          </v-radio-group>
        </div>

        <v-layout class="pb7 pl20 pr20 bg-f2f2f2" row wrap>
          <v-flex>
            <v-checkbox v-model="param.myChargeYn" class="ubs-checkbox" label="담당고객만"
            hide-details color="cyan darken-1" true-value="Y" false-value="N"></v-checkbox>
          </v-flex>
          <v-flex class="text-right">
          </v-flex>
        </v-layout>

        <v-layout class="pl20 pr20 mb15 bg-f2f2f2">
          <v-flex>
            <!--
              [D] item-key에 각 row별로 unique한 값이 필요합니다.
              item-key="unique_id" (customer.js 참조)
            -->
            <v-data-table
              class="ubs-table"
              :headers="data.header"
              :items="data.list"
              item-key="CONT_ID"
              :hide-default-footer="!data.list || !data.list.length"
              mobile-breakpoint="320"
            >
              <template v-slot:item="{ item }">
                <tr :class="{ 'selected': isSelected(item) }" @click="clickRow(item)">
                  <td>{{ item.COMP_NM }}</td>
                  <td>{{ item.CONT_NM }}</td>
                  <td>{{ item.CONT_SP_NM }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>

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
  </v-dialog>
  <!--//[사원추가팝업]-->
</template>

<script>
export default {
  name: 'ContDialog',
  props: {
    visible: {
      type: Boolean,
    },
    title: {
      type: String,
      default: '고객검색',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    param: {
      queryStr: '',
      contType: 'ALL',
      myChargeYn: 'Y',
    },
    data: {
      header: [
        { text: '소속', value: 'COMP_NM', align: 'left' },
        { text: '이름', value: 'CONT_NM', align: 'left' },
        { text: '전공', value: 'CONT_SP_NM', align: 'left' },
      ],
      list: [],
    },
    cls: {
      smallTitle: false,
    },
    selectedItem: {},
    selectedList: [],
  }),
  updated() {
    this.selectedItem = {};
    this.selectedList = [];
  },
  methods: {
    scroll(e) {
      this.cls.smallTitle = (e.currentTarget.scrollTop > 0);
    },
    search() {
      if ((!this.param.queryStr || this.param.queryStr.length) < 2
          && this.param.myChargeYn === 'N') {
          this.openAlertDialog({
            status: 'VALIDATION',
            body: '담당고객 체크 해제시 검색조건을 두글자 이상 입력해야 합니다.',
          });
          return;
      }
      const params = {
        ac: 'P_CONTACT',
        workType: 'Q_LIST',
        contType: this.param.contType === 'ALL' ? '' : this.param.contType,
        myChargeYn: this.param.myChargeYn || 'Y',
        queryStr: this.param.queryStr ? this.param.queryStr : '',
      };
      this.axiosCall(params).then((rs) => {
        this.data.list = [];
        if (rs.data.errorCode === 'MSG0001' || rs.data.errorCode === 'MSG0006') {
          const clsRow = rs.data.resultList;
          const data = clsRow[0];
          this.data.list = data;
        }
      });
    },
    clickRow(item) {
      if (this.multiple) {
        // 다중선택 일 때,
        const idx = this.selectedList.indexOf(item);
        if (idx !== -1) {
          this.selectedList.splice(idx, 1);
        } else {
          this.selectedList.push(item);
        }
      } else {
        this.selectedItem = item;
      }
    },
    isSelected(item) {
      let retVal = false;
      if (this.multiple) {
        retVal = this.selectedList.indexOf(item) !== -1;
      } else {
        retVal = this.selectedItem === item;
      }
      return retVal;
    },
    close() {
      this.$emit('close');
    },
    submit() {
      if ((this.multiple && !this.selectedList.length)
      || (!this.multiple && !this.selectedItem.CONT_ID)) {
        this.openAlertDialog({ status: 'VALIDATION', body: '추가할 대상을 선택하세요.' });
      } else {
        const retVal = (this.multiple ? this.selectedList : this.selectedItem);
        this.$emit('close', retVal);
      }
    },
  },
};
</script>

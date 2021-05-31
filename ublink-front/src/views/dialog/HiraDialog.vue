<template>
  <!--[Hira검색팝업]-->
  <v-dialog
      content-class="ubs-dialog"
      v-model="visible"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
      persistent
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
        <v-card-text @scroll="scroll($event)">
          <div class="pt30 pb15 pl20 pr20 bg-f2f2f2">
            <v-row class="mb5" no-gutters>
              <v-col>
                <v-text-field
                  v-model="searchCond.name"
                  class="ubs-search-textfield"
                  label="거래처명"
                  solo dense flat outlined hide-details
                  append-icon="mdi-magnify"
                  @click:append="searchHira()"
                  @keydown.enter.prevent="searchHira()"
                />
              </v-col>
            </v-row>
            <v-row no-gutters class="mb5">
              <v-col class="mr-1">
                <v-select
                  :items="codeList.cboType"
                  item-value="CODE_D"
                  item-text="CODE_D_NM"
                  label="구분"
                  v-model="searchCond.cboType"
                  hide-details outlined dense solo flat
                  clearable
                />
              </v-col>
              <v-col class="col-6">
                <v-select
                  :items="codeList.cboSubType"
                  item-value="CODE_D"
                  item-text="CODE_D_NM"
                  label="종별"
                  v-model="searchCond.cboSubType"
                  hide-details outlined dense solo flat
                  clearable
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="mr-1">
                <v-select
                  :items="codeList.sido"
                  item-value="CODE_D"
                  item-text="CODE_D_NM"
                  label="시도"
                  v-model="searchCond.sido"
                  hide-details outlined dense solo flat
                  clearable
                />
              </v-col>
              <v-col class="col-6">
                <v-select
                  :items="codeList.sggu.filter((sggu) => sggu.EXT_FIELD1 === this.searchCond.sido )"
                  item-value="CODE_D"
                  item-text="CODE_D_NM"
                  label="구군"
                  v-model="searchCond.sggu"
                  hide-details outlined dense solo flat
                  clearable
                />
              </v-col>
            </v-row>
          </div>
          <!-- 리스트 -->
          <v-layout class="ubs-list-header pb10" row wrap>
            <v-flex>
              <p class="result">검색결과<em>{{ addrList.length }}건</em></p>
            </v-flex>
          </v-layout>
          <v-layout class="pt10" row wrap>
            <v-flex>
              <v-list class="ubs-list" flat>
                <v-list-item-group color="primary">
                  <v-list-item v-for="(item, i) in addrPageList" :key = i
                    :class="item.ykiho === selectedAddr.ykiho ? 'selected': 'white'"
                  >
                    <v-list-item-content @click="doSelectAddr(item)">
                      <div class="call cyan--text darken-4"><b>{{item.clCdNm}}</b></div>
                      <div class="name mt-3">{{item.yadmNm}}</div>
                      <div class="pt-1 address grey--text lighten-2">우편번호 : {{item.postNo}}</div>
                      <div class="pt-1 address grey--text lighten-2">전화번호 : {{item.telno}}</div>
                      <div class="pt-1 address grey--text lighten-2">주소 : {{item.addr}}</div>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <div v-if="this.addrPageList.length !== this.addrList.length"
                class="text-center mt15 mb14"
                @click="searchMore();">
                <v-btn class="ubs-btn-more-round" rounded outlined color="#222">
                  더보기 +
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block depressed large tile
            height="52"
            color="#fff"
            @click="close()"
          >
            취소
          </v-btn>
          <v-btn
            block depressed large tile dark
            height="52"
            color="#00ACC1"
            @click="submit()"
          >
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
      <!-- Alert 다이얼로그 -->
    <AlertDialog :parentData="alertData" />
    </v-dialog>
    <!--//[Hira검색팝업]-->
</template>

<script>
import { pagination } from '@/assets/lib/mixin/pagination';

export default {
  name: 'AddrDialog',
  props: {
    visible: {
      type: Boolean,
    },
    title: {
      type: String,
      default: '심평원 검색',
    },
  },
  mixins: [pagination],
  data: () => ({
    pageParam: {
      countPerLoad: 10,
      startInd: 0,
    },
    searchCond: {
      name: '',
      cboType: '',
      cboSubType: '',
      sido: '',
      sggu: '',
      tp: '',
      subTp: '',
    },
    cls: {
      smallTitle: false,
    },
    addrList: [],
    addrPageList: [],
    selectedAddr: {},
    codeList: {
      cboType: [
        { CODE_D: '1', CODE_D_NM: '병원' },
        { CODE_D: '2', CODE_D_NM: '약국' },
      ],
      cboSubType: [],
      sido: [],
      sggu: [],
    },
  }),
  mounted() {
    this.clearForm();
  },
  async created() {
    await this.sysCodeList('COMP_VOL|ADDR_SIDO|ADDR_GUGUN').then((rs) => {
      [this.codeList.cboSubType, this.codeList.sido, this.codeList.sggu] = rs.data.resultList;
    });
  },
  methods: {
    searchHira() {
      if (!this.searchCond.name) {
        this.openAlertDialog({ status: 'VALIDATION', body: '거래처명을 입력해 주세요' });
        return;
      }
      const params = {
        ac: 'HR000',
        workType: 'Q1',
        name: this.searchCond.name,
        tp: this.searchCond.cboType ? this.searchCond.cboType : '',
        sido: this.searchCond.sido ? this.searchCond.sido : '',
        sggu: this.searchCond.sggu ? this.searchCond.sggu : '',
        subTp: this.searchCond.cboSubType ? this.searchCond.cboSubType : '',
        addr: '',
        ykiho: '',
      };
      this.axiosCall(params).then((rs) => {
        if (rs) {
          if (rs.data.errorCode === 'MSG0001' || rs.data.errorCode === 'MSG0006') {
            const clsRow = rs.data.resultList;
            const addrList = clsRow[0];
            this.addrList = addrList;

            this.selectedAddr = {};
            this.addrPageList = [];
            this.pageParam = { countPerLoad: 10, startInd: 0 };

            this.searchMore();
          } else {
            this.openAlertDialog({ status: 'ERROR', body: '오류가 발생했습니다.' });
          }
        }
      });
    },
    doPaging(stIndex) {
      const enIndex = stIndex + this.pageParam.countPerLoad;
      const tempArr = this.addrList.slice(stIndex, enIndex);
      tempArr.forEach((addr) => {
        this.addrPageList.push(addr);
      });
      this.pageParam.startInd = enIndex;
    },
    searchMore() {
      this.doPaging(this.pageParam.startInd);
    },
    scroll(e) {
      this.cls.smallTitle = (e.currentTarget.scrollTop > 0);
    },
    clearForm() {
      this.searchCond = {
        name: '',
        cboType: '',
        cboSubType: '',
        sido: '',
        sggu: '',
      };
      this.addrList = [];
      this.addrPageList = [];
      this.selectedAddr = {};
      this.pageParam = {
        countPerLoad: 10,
        startInd: 0,
      };
    },
    close() {
      this.clearForm();
      this.$emit('close');
    },
    doSelectAddr(item) {
      if (item.ykiho === this.selectedAddr.ykiho) {
        this.selectedAddr = {};
      } else {
        this.selectedAddr = item;
      }
    },
    submit() {
      if (!this.selectedAddr.addr) {
        this.openAlertDialog({ status: 'VALIDATION', body: '추가할 데이터를 선택하세요.' });
      } else {
        const retVal = this.selectedAddr;
        this.clearForm();
        this.$emit('close', retVal);
      }
    },
  },
};
</script>

<style scoped>
  .v-list-item.v-item--active.selected {
    background-color:#E0FAF6;
  }
</style>

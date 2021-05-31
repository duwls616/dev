<template>
  <!--[사원조회팝업]-->
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
        <v-card-text @scroll="scroll($event)">
          <div class="pb15 pl20 pr20 bg-f2f2f2">
            <div class="pt30"></div>
            <v-text-field
              v-model="data.queryAddr"
              class="ubs-search-textfield"
              label="지번주소(동) / 도로명주소"
              solo
              dense
              flat
              outlined
              hide-details
              background-color="#f8f8f8"
              append-icon="mdi-magnify"
              @click:append="searchAddr()"
            >
            </v-text-field>
          </div>

          <!--테이블-->
          <v-layout style="min-height:416px;"
            class="pb7 pl20 pr20 bg-f2f2f2"
            row
            wrap>
            <v-flex>
              <v-simple-table single-select class="ubs-table">
                <template v-slot:default>
                  <colgroup>
                    <col width="100px">
                    <col width="">
                  </colgroup>
                  <thead>
                    <tr>
                      <th class="text-left">우편번호</th>
                      <th class="text-center">주소지</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, i) in pagingData" :key=i
                      :class="{ 'selected': selectedAddr === item }"
                      @click="clickRow(item)">
                      <td class="text-left">{{ item.zipNo}}</td>
                      <td class="text-left">{{ item.roadAddr }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-flex>
          </v-layout>

          <v-layout v-if="filteredData.length > 0"
            class="pt10 pb7 pl15 pr15 bg-f2f2f2"
            row
            wrap>
            <v-flex>
              <v-pagination color="#00bcd4" v-model="currentPage" :length="pages"></v-pagination>
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
            class=""
            @click="close()"
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
            @click="submit()"
          >
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
      <!-- Alert 다이얼로그 -->
    <AlertDialog :parentData="alertData" />
    </v-dialog>
    <!--//[주소검색팝업]-->
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
      default: '주소검색',
    },
  },
  mixins: [pagination],
  data: () => ({
    param: {
    },
    data: {
      addrKey: '',
      queryStr: '',
    },
    cls: {
      smallTitle: false,
    },
    addrList: [],
    selectedAddr: {},
  }),
  mounted() {
    this.initCodeList();
  },
  methods: {
    scroll(e) {
      this.cls.smallTitle = (e.currentTarget.scrollTop > 0);
    },
    clearForm() {
      this.data.queryAddr = '';

      this.addrList = [];
      this.currentPage = 1;
      this.setPagination(this.addrList);
      this.renderData(0, this.rowPerPage);
    },
    initCodeList() {
      const sysComboId = 'ADDR_KEY';
      this.sysCodeList(sysComboId).then((rs) => {
        const clsRow = rs.data.resultList;

        const addrKey = clsRow[0][0];
        this.data.addrKey = addrKey.EXT_FIELD1;
      });
    },
    searchAddr() {
      const params = {
        type: 'Juso',
        currentPage: 1,
        countPerPage: 200,
        confmKey: this.data.addrKey,
        keyword: this.data.queryAddr,
      };
      this.axiosCall(params, '/business/OpenApi.do').then((rs) => {
        const dom = rs.data;
        const xmlData = this.$_comm_convertStringToXml(dom);
        const jsonData = this.$_comm_xml2json(xmlData);

        this.addrList = [];
        if (jsonData.results.juso) {
          if (jsonData.results.juso.length > 1) {
            this.addrList = jsonData.results.juso;
          } else {
            this.addrList.push(jsonData.results.juso);
          }

          this.currentPage = 1;
          this.setPagination(this.addrList);
          this.renderData(0, this.rowPerPage);
        } else {
          this.openAlertDialog({ status: 'CHECK', body: '검색어에 해당하는 주소가 존재하지 않습니다.' });
        }
      });
    },
    clickRow(row) {
      this.selectedAddr = row;
    },
    close() {
      this.$emit('close');
    },
    setParentData(data) {
      this.currentPage = 1;
      this.setPagination(data);
      this.renderData(0, this.rowPerPage);
    },
    setQueryAddr(addr) {
      this.data.queryAddr = addr;
    },
    submit() {
      if (!this.selectedAddr.zipNo) {
        this.openAlertDialog({ status: 'VALIDATION', body: '추가할 주소지를 선택하세요.' });
      } else {
        const retVal = this.selectedAddr;
        this.$emit('close', retVal);
      }
    },
  },
};
</script>

<style scoped>
  .ubs-tbl-row {background-color:#FFF !important}
  .ubs-tbl-selRow {background-color:#b9e8ee !important}
</style>

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
            label="부서명/팀명/사원명"
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
        </div>

        <v-layout class="pb7 pl20 pr20 bg-f2f2f2" row wrap>
          <v-flex>
            <v-checkbox
              v-model="param.leaderYn"
              class="ubs-checkbox"
              label="팀장만"
              hide-details
              color="cyan darken-1"
              true-value="Y" false-value="N">
            </v-checkbox>
          </v-flex>
        </v-layout>

        <v-layout class="pl20 pr20 mb15 bg-f2f2f2">
          <v-flex>
            <v-data-table
              class="ubs-table"
              :headers="data.header"
              :items="data.list"
              item-key="EMP_ID"
              :hide-default-footer="!data.list || !data.list.length"
              mobile-breakpoint="320"
            >
              <template v-slot:item="{ item }">
                <tr :class="{ 'selected': isSelected(item) }" @click="clickRow(item)">
                  <td>{{ item.PRNT_DEPT_NM }}</td>
                  <td>{{ item.DEPT_NM }}</td>
                  <td>{{ item.EMP_NM }}</td>
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
  name: 'EmpDialog',
  props: {
    visible: {
      type: Boolean,
    },
    title: {
      type: String,
      default: '사원검색',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    param: {
      queryStr: '',
      leaderYn: 'N',
    },
    data: {
      header: [
        { text: '부서', value: 'PRNT_DEPT_NM', align: 'center' },
        { text: '팀', value: 'DEPT_NM', align: 'center' },
        { text: '이름', value: 'EMP_NM', align: 'center' },
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
      const params = {
        ac: 'P_EMP',
        workType: 'Q_LIST',
        queryStr: this.param.queryStr ? this.param.queryStr : '',
        leaderYn: this.param.leaderYn || 'N',
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
      || (!this.multiple && !this.selectedItem.EMP_ID)) {
        this.openAlertDialog({ status: 'VALIDATION', body: '추가할 대상을 선택하세요.' });
      } else {
        const retVal = (this.multiple ? this.selectedList : this.selectedItem);
        this.$emit('close', retVal);
      }
    },
  },
};
</script>

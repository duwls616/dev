<template>
  <v-container class="bg-gray">
    <!--대시보드 콘텐츠 -->
    <v-layout row wrap>
      <v-flex class="ubs-dash-flex" xs12 sm12 v-for="vw in this.views" :key="vw.VW_ID">
        <component :is="vw.VW_ID"
        :title="vw.VW_NM"
        :bindData="vw.DATA"
        :isMultiData="vw.isMultiData"
        />
      </v-flex>
    </v-layout>
    <!--//대시보드 콘텐츠-->

    <!--대시보드 편집-->
    <!--
      [D] 헤더 변형 디자인
        .v-card__title 에 스크롤 최상단이 아닐경우 : 'small' 클래스 add해야합니다.
    -->
    <v-btn
      class="mt-4 dashboard-edit-btn"
      block
      depressed
      large
      tile
      height="52"
      dark
      color="#999999"
      @click="openDashboardEdit()"
    >
      <v-icon left>mdi-wrap</v-icon>
        대시보드 편집 (위치/구성)
    </v-btn>

    <v-dialog
    content-class="ubs-dialog"
    v-model="popDashboardEdit.isShow"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
    >
      <v-card tile>
        <v-card-title>
          <p>대시보드 구성 변경</p>
          <v-btn
            class="btn-close"
            icon
            color="#222"
            @click="popDashboardEdit.isShow = false"
          >
            <i class="ubs-icon ubs-icon-close-black"></i>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <div class="pb15 pl20 pr20 pt20"><!--[QC.26]-->
            <v-card tile class="dash-edit-list dash-edit-list-now">
              <v-list flat>
                <v-subheader>현재 표시중인 콘텐츠</v-subheader>
                <v-list-item-group>
                  <draggable v-model="popDashboardEdit.useList"
                    :options="{handle:'.btn-handle'}">
                    <template v-for="item in popDashboardEdit.useList">
                      <v-list-item :key="item.VW_ID">
                        <v-btn depressed icon color="#C6C6C6" class="btn-delete"
                          @click.stop="remView(item)">
                          <v-icon>mdi-close-circle</v-icon>
                        </v-btn>
                        {{ item.VW_NM }}
                        <v-btn depressed icon color="#222222" class="btn-handle">
                          <v-icon>mdi-menu</v-icon>
                        </v-btn>
                      </v-list-item>
                    </template>
                  </draggable>
                </v-list-item-group>
              </v-list>
            </v-card>
            <v-card tile class="dash-edit-list dash-edit-list-add">
              <v-list>
                <v-subheader>콘텐츠 추가</v-subheader>
                <v-list-item-group v-if="getFilterViewList(false).length" color="cyan">
                  <v-list-item v-for="item in getFilterViewList(false)" :key="item.VW_ID">
                    {{ item.VW_NM }}
                    <v-btn depressed color="white" class="btn-add"
                      @click.stop="addView(item)">추가</v-btn>
                  </v-list-item>
                </v-list-item-group>
                <div v-else class="ubs-nolist">모든 콘텐츠를 표시중입니다.</div>
              </v-list>
            </v-card>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            depressed
            large
            tile
            height="52"
            dark
            color="cyan"
            class=""
            @click.stop="saveUseViewList()"
          >
            적용
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--//대시보드 편집-->
    <!-- Alert 다이얼로그 -->
    <AlertDialog :parentData="alertData" />
    <ConfirmDialog :parentData="confirmData" />
  </v-container>
</template>

<script>
import draggable from 'vuedraggable';
// component id는 시스템코드에 정의된 View ID를 동일하게 사용

export default {
  name: 'Dashboard',
  components: {
    draggable,
  },
  data: () => ({
    views: [],
    popDashboardEdit: {
      isShow: false,
      useList: [],
      allList: [],
    },
  }),
  mounted() {
    this.$nextTick(() => {
      this.searchViews();
      this.searchList();
    });
  },
  methods: {
    // 대시보드 전체 콘텐츠 조회
    async searchViews() {
      const params = {
        ac: 'SFE_MAIN_SELECT',
        workType: 'Q_VIEWS',
      };
      this.axiosCall(params).then((rs) => {
        if (rs.data.errorCode === 'MSG0001' || rs.data.errorCode === 'MSG0006') {
          const cls = rs.data.resultList;
          const viewList = cls[0];
          for (let i = 0; i < viewList.length; i += 1) {
            viewList[i].state = false;
          }
          this.popDashboardEdit.allList = viewList;
        }
      }).catch((err) => {
        console.log(`대시보드를 조회하는 도중 오류가 발생하였습니다. \n${err}`);
      });
    },
    // Home(대시보드) 조회
    searchList() {
      const params = {
        ac: 'SFE_MAIN_SELECT',
        workType: 'Q1',
      };
      this.axiosCall(params).then((rs) => {
        if (rs.data.errorCode === 'MSG0001' || rs.data.errorCode === 'MSG0006') {
          const cls = rs.data.resultList;
          const clsViews = cls[0];
          for (let i = 0; i < clsViews.length; i += 1) {
            const view = clsViews[i];
            view.isMultiData = false;
            for (let j = 1; j < cls.length; j += 1) {
              if (cls[j].length && view.VW_ID === cls[j][0].VW_ID) {
                if (view.DATA) {
                  if (!view.isMultiData) {
                    const multiData = [view.DATA];
                    multiData.push(cls[j]);
                    view.isMultiData = true;
                    view.DATA = multiData;
                  } else {
                    view.DATA.push(cls[j]);
                  }
                } else {
                  view.DATA = cls[j];
                }
              }
            }
            if (!view.DATA) {
              view.DATA = [];
            }
          }
          this.views = clsViews;
        } else {
          this.openAlertDialog({
            status: 'ERROR',
            body: rs.data.returnStr,
          });
        }
      }).catch((err) => {
        console.log(`대시보드를 조회하는 도중 오류가 발생하였습니다. \n${err}`);
      });
    },
    openDashboardEdit() {
      const viewList = this.popDashboardEdit.allList;
      for (let i = 0; i < viewList.length; i += 1) {
        const exist = this.views.find(item => (viewList[i].VW_ID === item.VW_ID));
        if (exist) {
          viewList[i].state = true;
        } else {
          viewList[i].state = false;
        }
      }
      // 사용중인 콘텐츠 목록
      const useList = this.$_comm_cloneDeep(this.views);
      this.popDashboardEdit.useList.splice(0);
      this.popDashboardEdit.useList = useList;
      this.popDashboardEdit.isShow = true;
    },
    getFilterViewList(state) {
      return this.popDashboardEdit.allList.filter(item => (item.state === state));
    },
    addView(item) {
      const view = item;
      view.state = true;
      const list = this.popDashboardEdit.useList;
      const exist = list.find(vw => (view.VW_ID === vw.VW_ID));
      if (!exist) {
        list.push(view);
      }
    },
    remView(item) {
      const viewId = item.VW_ID;
      const list = this.popDashboardEdit.useList;
      list.splice(list.indexOf(item), 1);
      this.popDashboardEdit.allList.forEach((m) => {
        const view = m;
        if (view.VW_ID === viewId) {
          view.state = false;
        }
      });
    },
    saveUseViewList() {
      const confirm = {
        body: '대시보드 콘텐츠 구성을 변경하시겠습니까?',
        submitCallback: () => {
          const params = {
            ac: 'SFE_MAIN_MGR',
            workType: 'U',
            vwIdList: this.$_comm_convertArrToStr(this.popDashboardEdit.useList, 'VW_ID'),
          };
          this.axiosCall(params).then((rs) => {
            if (rs) {
              if (rs.data.errorCode === 'MSG0004') {
                this.openAlertDialog({ status: 'CHECK', body: '정상적으로 변경되었습니다.' });
                this.searchList();
                this.popDashboardEdit.isShow = false;
              } else {
                this.openAlertDialog({ status: 'ERROR', body: '처리 중, 오류가 발생하였습니다.' });
              }
            }
          });
        },
      };
      this.openConfirmDialog(confirm);
    },
  },
};
</script>

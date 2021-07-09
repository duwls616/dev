<template>
<v-container>
  <div class="ml15 mr15">
    <v-text-field
    type="search"
    v-model="query.searchStr"
    class="ubs-search-textfield"
    label="채널명"
    rounded
    solo
    clearable
    flat
    hide-details
    background-color="#EEEEEE"
    append-outer-icon="mdi-magnify"
    @keyup.enter="searchChannel();"
    @click:append-outer="searchChannel();"
    >
    </v-text-field>
  </div>
  <v-layout class="ubs-list-header pb10 pt10" row wrap>
    <v-flex>
      <p class="result">검색결과<em>{{ page.totCnt }}건</em></p>
    </v-flex>
    <v-flex class="text-right">
    </v-flex>
  </v-layout>
  <v-layout row wrap>
    <v-flex>
        <v-list class="ubs-list" flat>
          <v-list-item-group color="primary">
            <v-list-item v-for="(item, i) in main.list" :key=i>
              <v-list-item-content @click="moveDetail(item);">
                <div class="mb-1">
                  <p class="job">{{ item.CHA_NAME }}</p>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
    </v-flex>
  </v-layout>
  <!--플로팅 버튼-->
  <!-- 추후 정보등록 수정요청처리 화면으로 라우터명 변경 -->
  <v-btn
  class="ubs-function-btn"
  bottom
  color="#222222"
  dark
  fab
  fixed
  right
  @click="editAdd();"
  >
  <v-icon>mdi-plus</v-icon>
  </v-btn>
</v-container>
</template>

<script>
export default {
  name: 'ChannelMng',
  data: () => ({
    page: {
      totCnt: 0, // 리스트 전체 갯수
      rowPerPage: 10, // 최초 가지고 올 데이터 갯수
      currPage: 1, // 현재 페이지
    },
    query: {
      searchStr: '',
    },
    main: {
      list: [],
    },
  }),
  async created() {
    this.searchChannel();
  },
  methods: {
    searchChannel(isMore) {
      if (isMore !== 'MORE') {
        this.page.currPage = 1;
        this.main.list = [];
      }

      this.$axios.get('/api/channel')
      .then((response) => {
        this.main.list = response.data;
      }).catch((ex)=> {
        console.log('err!!!'+ ex);
      })
    },
  },
};
</script>

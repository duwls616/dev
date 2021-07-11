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
        <!-- <v-list class="ubs-list" flat>
          <v-list-item-group color="primary">
            <v-list-item v-for="(item, i) in main.list" :key=i>
              <v-list-item-content @click="moveDetail(item);">
                <div class="mb-1">
                  <p class="job">{{ item.CHA_NAME }}</p>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list> -->
        <v-list
          three-line
        >
          <v-list-item @click="goDetail();">
            <v-list-item-avatar>
              <img src="@/assets/lib/img/kakao.png"/>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>박스터</v-list-item-title>

              <v-list-item-subtitle>ID 12345</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-information</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider inset></v-divider>
          <v-list-item>
            <v-list-item-avatar>
              <img src="@/assets/lib/img/kakao.png"/>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>성보화학</v-list-item-title>

              <v-list-item-subtitle>ID 12345</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-information</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
    </v-flex>
  </v-layout>
  <!--플로팅 버튼-->
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
  name: 'ChannelList',
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
    async searchChannel(isMore) {
      if (isMore !== 'MORE') {
        this.page.currPage = 1;
        this.main.list = [];
      }

      await this.$axios.get('/channel/list')
      .then((response) => {
        this.main.list = response.data;
      }).catch((ex) => {
        console.log(ex);
      });
    },
    goDetail() {

    },
  },
};
</script>

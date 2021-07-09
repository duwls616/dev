<template>
    <v-container>
        <v-layout row wrap>
            <v-flex>
                <v-list class="ubs-list" flat>
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
  name: 'Seminar',
  data: () => ({

  }),
  async created() {
    console.log('111');
  },
  methods: {

  },
};
</script>

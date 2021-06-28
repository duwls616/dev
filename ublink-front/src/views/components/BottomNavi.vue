<template>
  <v-bottom-navigation
    app
    grow
    height="60"
    class="d-lg-none"
  >
    <v-btn v-for="(item, i) in bm.list" :key=i
      :class="{ 'd-none d-sm-flex' : item.isMobileHide }"
      @click="naviBar(item.id)" v-show="item.isShow">
      <v-badge
        v-if="item.hasBadge"
        color="red" dot offset-x="-4" offset-y="-15"
      ></v-badge>
      <span>{{ item.txt }}</span>
      <v-icon>{{ item.icon }}</v-icon>
      <i class="ubs-icon" :class="item.icon"></i>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: 'BottomNavi',
  data: () => ({
    bm: {
      list: [
        { id: '', txt: '홈', icon: 'ubs-icon-home', isMobileHide: false, hasBadge: false, isShow: true },
      ],
    },
    lm: {
      list: [],
    },
  }),
  created() {
    this.$store.dispatch('getUserInfo', { router: this.$router }).then(() => {
      this.lm.list = this.$store.getters.getUserMenu;

      const clsRow = this.bm.list;
      this.lm.list.forEach((e) => {
        e.SUB.forEach((f) => {
          if (f.ROUTER === 'cont') clsRow[1].isShow = true;
          if (f.ROUTER === 'call') clsRow[2].isShow = true;
          if (f.ROUTER === 'feedback') clsRow[3].isShow = true;
          if (f.ROUTER === 'dmseminar') clsRow[4].isShow = true;
          if (f.ROUTER === 'lib') clsRow[5].isShow = true;
        });
      });
    });
  },
  methods: {
    // 동일 라우터 요청시 오류발생으로 Validation 체크
    routerValidation(id) {
      const curUrl = this.$route.path;
      const nextUrl = `/mr/${id}`;

      if (curUrl === nextUrl) {
        return false;
      }
      return true;
    },
    naviBar(id) {
      if (this.routerValidation(id)) {
        if (id === 'menu') {
          this.$emit('showMenus');
        } else if (id === 'fav') {
          this.$emit('showFavMenus');
        } else {
          this.$router.push(`/mr/${id}`);
        }
      }
    },
  },
};
</script>

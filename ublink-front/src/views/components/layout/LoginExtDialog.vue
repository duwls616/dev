<template>
  <!-- [로그인연장 팝업] -->
  <v-dialog content-class="ubs-dialog-sm bg-white"
    v-model="visible" max-width="350px">
    <v-card elevation="1">
      <v-card-title>
        로그인 연장
        <v-btn icon color="#707070" @click="close()"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-text>
      </v-card-text>
      <v-card-actions>
        <v-btn class="ubs-btn ubs-btn-primary"
          width="100" elevation="1" color="cyan darken-1" dark @click="submit()">
          로그인
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LoginExtDialog',
  props: {
    visible: {
      type: Boolean,
    },
  },
  data: () => ({
    j_password: '',
    j_password_scr: '',
  }),
  mounted() {
    console.log('mounted');
  },
  methods: {
    close() {
      this.$emit('close');
    },
    submit() {
      console.log('submit');
    },
  },
};
</script>

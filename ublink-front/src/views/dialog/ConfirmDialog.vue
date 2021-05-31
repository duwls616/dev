<template>
  <v-dialog
    v-model="parentData.isOpen"
    content-class="ubs-alert"
    max-width="295"
  >
    <v-card>
      <v-card-text>
        <p class="txt-black" v-html="parentData.body"></p>
      </v-card-text>
      <v-card-actions>
        <v-btn class="ubs-btn" color="#f2f2f2" @click="closeModal();">취소</v-btn>
        <v-btn class="ubs-btn ubs-btn-primary" color="primary" @click="submit();">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['parentData'],
  methods: {
    closeModal() {
      if (this.parentData.cancelCallback) {
        this.parentData.cancelCallback();
      }

      this.parentData.isOpen = false;
    },
    submit() {
      if (this.parentData.submitCallback) {
        this.parentData.submitCallback(
          this.parentData.param1,
          this.parentData.param2,
          this.parentData.param3,
        );
      }

      this.parentData.isOpen = false;
    },
  },
};
</script>

<template>
  <v-dialog
    v-model="parentData.isOpen"
    content-class="ubs-alert"
    persistent max-width="290">
    <v-card>
      <v-card-text>
        <v-icon
          :color="parentData.iconClass">{{parentData.icon}}</v-icon>
        <p style="margin-top:5px;"
          :class="parentData.pClass"
          v-html="$_comm_convertNewLineToBrTag(parentData.body)">
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          class="ubs-btn ubs-btn-primary"
          color="primary"
          @click="submit()">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['parentData'],
  methods: {
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

<style scoped>
</style>

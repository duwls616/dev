import ConfirmDialog from '@/views/dialog/ConfirmDialog.vue';
import AlertDialog from '@/views/dialog/AlertDialog.vue';

export const dialog = {
  data() {
    return {
      confirmData: {
        isOpen: false,
        status: '',
        body: '',
        param1: '',
        param2: '',
        param3: '',
        submitCallback: null,
        cancelCallback: null,
      },
      alertData: {
        isOpen: false,
        status: '',
        body: '',
        pClass: '',
        iconClass: '',
        icon: '',
        param1: '',
        param2: '',
        param3: '',
        submitCallback: null,
      },
    };
  },
  components: {
    ConfirmDialog,
    AlertDialog,
  },
  methods: {
    openConfirmDialog(e) {
      this.confirmData.isOpen = true;
      this.confirmData.status = e.status;
      this.confirmData.body = e.body;
      this.confirmData.param1 = e.param1;
      this.confirmData.param2 = e.param2;
      this.confirmData.param3 = e.param3;
      this.confirmData.submitCallback = (e.submitCallback || null);
      this.confirmData.cancelCallback = (e.cancelCallback || null);

      return this.confirmData;
    },
    openAlertDialog(e) {
      this.alertData.isOpen = true;
      this.alertData.status = e.status;
      this.alertData.body = e.body;
      this.alertData.param1 = e.param1;
      this.alertData.param2 = e.param2;
      this.alertData.param3 = e.param3;
      this.alertData.submitCallback = (e.submitCallback || null);

      if (this.alertData.status === 'VALIDATION') {
        this.alertData.pClass = 'txt-red';
        this.alertData.iconClass = '#FF5656';
        this.alertData.icon = 'mdi-alert';
      } else if (this.alertData.status === 'CHECK') {
        this.alertData.pClass = 'txt-black';
        this.alertData.iconClass = 'primary';
        this.alertData.icon = 'mdi-check-bold';
      } else if (this.alertData.status === 'ERROR') {
        this.alertData.pClass = 'txt-red';
        this.alertData.iconClass = '#FF5656';
        this.alertData.icon = 'mdi-close-circle';
      }

      return this.alertData;
    },
  },
};

export default { dialog };

import axios from 'axios';
import 'url-search-params-polyfill';

export const CommAxios = {
  data: () => ({
    commAxiosUrl: '/business/SWNAjaxL.do',
  }),

  methods: {
    axiosCall(params, strUrl, isProgress = true) {
      if (strUrl) this.commAxiosUrl = strUrl;
      else this.commAxiosUrl = '/business/SWNAjaxL.do';
      const searchParams = new URLSearchParams(params);

      if (isProgress === true) {
        this.$emit('onProgress', true);
      }
      return axios.post(
        this.commAxiosUrl,
        searchParams,
        { headers: { 'X-Requested-Type': 'XHR' } },
      )
      .catch((err) => {
        let unauthorized = false;
        if (process.env.NODE_ENV === 'development') {
          // 개발환경에서는 proxy로 인한 CORS 문제가 있어, xhr에러발생 시 권한없음(401)으로 간주
          unauthorized = true;
        } else if (err.response && err.response.status === 401) {
          // 운영환경에서 권한없음(401)이 반환되었을 때
          unauthorized = true;
        }
        if (unauthorized) {
          console.log('unauthorized');
        } else {
          throw new Error(err.message);
        }
      })
      .finally(() => {
        if (isProgress === true) {
          this.$emit('onProgress', false);
        }
      });
    },

    axiosFileUpload(files) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        formData.append(`files[${i}]`, file);
      }
      return axios.post(
        '/business/fileUpload.do',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    },

    sysCodeList(comboId, extParam1, extParam2) {
      const params = {
        ac: 'SYS_CODE',
        workType: 'Q',
        comboId: '',
        param: extParam1 || '',
        param1: extParam2 || '',
      };
      if (comboId) params.comboId = comboId;
      const searchParams = new URLSearchParams(params);

      return axios.post(this.commAxiosUrl, searchParams)
        .catch((err) => {
          throw new Error(err.message);
        });
    },

    compCodeList(comboId, extParam1, extParam2) {
      const params = {
        ac: 'COMP_CODE',
        workType: 'Q',
        comboId: '',
        param: extParam1 || '',
        param1: extParam2 || '',
      };
      if (comboId) params.comboId = comboId;
      const searchParams = new URLSearchParams(params);

      return axios.post(this.commAxiosUrl, searchParams)
        .catch((err) => {
          throw new Error(err.message);
        });
    },
  },
};

export default CommAxios;

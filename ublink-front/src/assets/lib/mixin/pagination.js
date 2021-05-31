export const pagination = {
  data: () => ({
    pagingData: [],
    filteredData: [],
    currentPage: 1,
    rowPerPage: 10, // 한 페이지당 보여지는 데이터 수
    pages: 1, // 페이징 갯수
  }),
  watch: {
    currentPage(e) {
      const startIndex = Number(e - 1) * this.rowPerPage;
      const endIndex = startIndex + this.rowPerPage;
      this.renderData(startIndex, endIndex);
    },
  },
  methods: {
    setClear() {
      this.pagingData = [];
      this.filteredData = [];
      this.pages = 1;
    },
    setRowPerPage(e) {
      this.rowPerPage = e;
    },
    setPages(e) {
      this.pages = Math.ceil(e);
    },
    setPagination(e) {
      this.filteredData = e;
    },
    setOrder(descType) {
      if (descType === 'asc') {
        this.pagingData.sort((a, b) => new Date(a.createDate) - new Date(b.createDate));
      } else if (descType === 'desc') {
        this.pagingData.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
      }
    },
    renderData(startIndex, endIndex) {
      this.pages = Math.ceil((this.filteredData.length / this.rowPerPage)) < 1
        ? 1 : Math.ceil((this.filteredData.length / this.rowPerPage));

      this.pagingData = [];
      const maxLength = endIndex < this.filteredData.length ? endIndex : this.filteredData.length;

      for (let rowIndex = startIndex; rowIndex < maxLength; rowIndex += 1) {
        this.pagingData.push(this.filteredData[rowIndex]);
      }
    },
  },
};

export default { pagination };

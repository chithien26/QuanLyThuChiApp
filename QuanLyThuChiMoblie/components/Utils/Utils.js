import moment from "moment";

export const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
};
export const  formatDate = (date) => {
  const formattedDate = moment(date).format("DD/MM/YYYY [(]ddd[)]");
  return formattedDate;
};
export const formatAmount = (text) => {
  let truncated = text.slice(0, -2);

  // Xóa các ký tự không phải số
  let cleaned = truncated.replace(/\D/g, '');

  // Đảo ngược chuỗi số để thêm dấu phẩy từ phải qua trái
  let reversed = cleaned.split('').reverse().join('');

  // Thêm dấu phẩy sau mỗi ba chữ số
  let formatted = '';
  for (let i = 0; i < reversed.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      formatted += ',';
    }
    formatted += reversed[i];
  }

  // Đảo ngược lại để trở về trình tự ban đầu
  formatted = formatted.split('').reverse().join('');

  // Lưu giá trị đã được định dạng vào state
  return formatted;
};
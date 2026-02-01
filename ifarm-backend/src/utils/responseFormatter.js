export const formatResponse = ({ status = 'success', data = null, message = null, meta = null }) => ({
  status,
  message,
  data,
  meta,
});

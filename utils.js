function sendResponse(
  res,
  code,
  message,
  data,
  error = undefined,
  captureError = true
) {
  if (error && captureError) console.error(error);

  return res.status(code).send({
    code,
    message,
    data,
    error: error ? (error.message ? error.message : error) : null,
  });
}

module.exports = { sendResponse };

const gunzipStream = (stream) => {
  return new Promise((resolve, reject) => {
    let decompressedData = Buffer.alloc(0);
    stream.on('data', (chunk) => {
      decompressedData = Buffer.concat([decompressedData, chunk]);
    });
    stream.on('end', () => {
      resolve(decompressedData);
    });
    stream.on('error', (err) => {
      reject(err);
    });
  });
};

module.exports = gunzipStream
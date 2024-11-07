import B2 from "backblaze-b2";
import dotenv from "dotenv";

dotenv.config();

export const streamToBuffer = async (
  stream: NodeJS.ReadableStream
): Promise<Buffer> => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_KEY_ID,
  applicationKey: process.env.BACKBLAZE_APPLICATION_KEY,
});

export const uploadFile = async (fileName: string, buffer: Buffer) => {
  await b2.authorize();
  const uploadUrlResponse = await b2.getUploadUrl({
    bucketId: process.env.BACKBLAZE_BUCKET_ID,
  });
  const uploadUrl = uploadUrlResponse.data.uploadUrl;
  const uploadAuthorizationToken = uploadUrlResponse.data.authorizationToken;
  const uploadResponse = await b2.uploadFile({
    uploadUrl,
    uploadAuthToken: uploadAuthorizationToken,
    fileName,
    data: buffer,
  });
  return {
    id: uploadResponse.data.fileId,
    url: `https://${process.env.BACKBLAZE_BUCKET_NAME}.${process.env.BACKBLAZE_BUCKET_ENDPOINT}/${fileName}`,
  };
};

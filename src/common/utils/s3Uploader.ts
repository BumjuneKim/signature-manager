import { isEmpty } from "lodash";
import { S3 } from "aws-sdk";

export const putImageToS3 = (options: { [key: string]: any }): Promise<any> => {
    const key = process.env.AWS_KEY;
    const secret = process.env.AWS_SECRET;
    const s3Sdk = new S3({ accessKeyId: key, secretAccessKey: secret });
    const { buffer, mimetype } = options;
    const ext = mimetype.split("/")[1];

    if (isEmpty(buffer) || !(buffer instanceof Buffer)) throw new Error("Upload body is not buffer");

    const randomNumber = Number(Math.random() * 1000000);
    const region = process.env.S3_REGION;
    const Bucket = process.env.S3_BUCKET;
    const ContentType = mimetype;
    const CacheControl = "max-age=2592000";
    const Key = `sign-test/images/${new Date().getTime()}-${randomNumber}.${ext}`;
    const ACL = "public-read";
    const params = { ACL, ContentType, Bucket, CacheControl, Key, Body: buffer };

    return new Promise((resolve, reject) => {
        s3Sdk.upload(params, (err, result) => {
            if (err) return reject(err);

            const relative_url = `/${result.key || ""}`;
            const url = `//s3-${region}.amazonaws.com/${Bucket}${relative_url}`;
            return resolve({ url, relative_url });
        });
    });
};

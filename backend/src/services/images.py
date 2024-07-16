import boto3


class ImageService:
    def upload(self, name, file) -> str:
        s3 = boto3.resource("s3")
        BUCKET = "team-track-user-images"

        s3.Bucket(BUCKET).upload_fileobj(file, name, ExtraArgs={'ACL':'public-read'})

        s3_client = boto3.client("s3")

        location = s3_client.get_bucket_location(Bucket=BUCKET)["LocationConstraint"]

        if location is None:
            url = f"https://s3.amazonaws.com/{BUCKET}/{name}"
        else:
            url = f"https://{BUCKET}.s3.{location}.amazonaws.com/{name}"

        return url

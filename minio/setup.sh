create_bucket(){
    # $1 for the name of the bucket 

    # checks if the bucket exists 
    isCreated=$(aws --endpoint-url $MINIO_ENDPOINT_URL s3 ls | grep $1)
    
    # if it doesn't exist
    if [ -z "$isCreated" ]
    then 
        # it creates the bucket
        aws --endpoint-url $MINIO_ENDPOINT_URL s3 mb s3://"$1"
    else
        echo "$1 exists!"
    fi
    
}

# configure minio access key, secret key, region and s3 signature
aws configure set profile.default.aws_access_key_id $MINIO_ACCESS_KEY
aws configure set profile.default.aws_secret_access_key $MINIO_SECRET_KEY
aws configure set profile.default.s3.signature_version s3v4

# create minio buckets 
create_bucket "pipelines"
create_bucket "parquets"
create_bucket "repan-bucket"
create_bucket "avatars"

# upload templates
aws --endpoint-url $MINIO_ENDPOINT_URL s3 sync /aws/templates/ s3://pipelines/templates/
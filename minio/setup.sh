create_bucket(){
    # $1 for the alias
    # $2 for the name of the bucket

    # checks if the bucket exists
    isCreated=$(mc ls $1 | grep $2)

    # if it doesn't exist
    if [ -z "$isCreated" ]
    then
        # it creates the bucket
        mc mb "$1/$2"
    else
        echo "$1/$2 exists!"
    fi

}

# create an alias to connect to minio container
mc alias set minio-remote $MINIO_MC_REMOTE_SERVER_URL $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD

# create minio buckets
create_bucket "minio-remote" "pipelines"
create_bucket "minio-remote" "parquets"
create_bucket "minio-remote" "avatars"

mc mirror  /tmp/templates/ minio-remote/pipelines/templates

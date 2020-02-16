#!/usr/bin/env bash
source /home/pi/Documents/automated_finances/drive/drive_token.sh
now=$(date +'20%y/%m/%d')
file_name="Finances_$now"
# echo $file_name
curl --location --request POST ${DriveApiUrl} \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer '${AccessToken} \
--data '{"name": '"'${file_name}'"', "parents": ["1OqEcOeNQlhEeQsxhAdEb_uYexFp4fhTS"]}'

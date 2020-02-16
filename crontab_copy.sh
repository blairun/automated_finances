# Copy of cron jobs 
# Test by running this command:
# bash /home/pi/Documents/automated_finances/crontab_copy.sh


# 30 11,23 * * * cd /home/pi/Documents/automated_finances && /usr/bin/node update_transactions.js

# 35 11,23 * * * cd /home/pi/Documents/automated_finances && /usr/bin/node update_balances.js

# 40 23 * * * cd /home/pi/Documents/automated_finances/drive && /usr/bin/node copy_file.js
# #5 0 * * * bash /home/pi/Documents/automated_finances/curl_copy.sh

# 45 23 * * * cd /home/pi/Documents/automated_finances && /usr/bin/node update_past_files.js


echo "Updating transactions..."
cd /home/pi/Documents/automated_finances && /usr/bin/node update_transactions.js
echo "-------"
# sleep is not necessary since it doesn't continue until previous command is finished
# echo "waiting 20 seconds"
# sleep 20
echo "Updating balances..."
cd /home/pi/Documents/automated_finances && /usr/bin/node update_balances.js
echo "-------"
echo "Making backup of file..."
cd /home/pi/Documents/automated_finances/drive && /usr/bin/node copy_file.js
echo "-------"
echo "Updating past file list..."
cd /home/pi/Documents/automated_finances && /usr/bin/node update_past_files.js

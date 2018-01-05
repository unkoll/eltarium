sudo ln -s /home/unkoll/eltarium/configs/nginx.conf /etc/nginx/sites-enabled/eltarium.conf 
sudo unlink /etc/nginx/sites-enabled/task.conf
sudo service nginx restart

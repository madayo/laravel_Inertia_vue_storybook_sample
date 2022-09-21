# Laravel の artisan コマンド storage:link で生成される public/storage シンボリックリンクであることが原因でうまく html を export できない
# 作業の瞬間だけシンボリックリンクを解除する
docker-compose exec php ash -c "unlink public/storage"
docker-compose run --rm node npm run build-storybook -o .storybook-static
docker-compose exec php ash -c "php artisan storage:link"
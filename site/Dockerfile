FROM nginx
MAINTAINER pedrow83

WORKDIR /stickermap
COPY app /usr/share/nginx/html
COPY assets /usr/share/nginx/html
COPY css /usr/share/nginx/html
COPY lib /usr/share/nginx/html

EXPOSE 80
# ENV accesstokenmapbox World
CMD ["nginx"]

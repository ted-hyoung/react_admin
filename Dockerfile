# For Develop Any React Static Site
FROM 144908600381.dkr.ecr.ap-northeast-2.amazonaws.com/build/rss:latest
MAINTAINER RSS by Munsu Seo <grouchy.seo@imform.co.kr>

# Copy Built Static Application
COPY build/. /usr/share/nginx/html

# Expose Port
EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]

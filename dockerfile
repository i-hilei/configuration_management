FROM nginx
MAINTAINER Eduard van den Bongard <evdb@x-idra.de>
COPY dist/konfigure-ui /usr/share/nginx/html

EXPOSE 80
STOPSIGNAL SIGTERM

# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/config/config.template.json > /usr/share/nginx/html/assets/config/config.json && exec nginx -g 'daemon off;'"]

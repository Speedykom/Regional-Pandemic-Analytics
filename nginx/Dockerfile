FROM nginx:1.25.1-alpine

COPY nginxReloader.sh /nginxReloader.sh

RUN chmod +x nginxReloader.sh

ENTRYPOINT [ "./nginxReloader.sh" ]

CMD ["nginx", "-g", "daemon off;"]

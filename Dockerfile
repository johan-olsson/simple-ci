FROM centos


ENV DATABASE mongodb://database:27015
ENV DOCKER_SOCKET /var/run/docker.sock

VOLUME /var/run/docker.sock /var/run/docker.sock
VOLUME /build/ /build/

RUN yum install -y ruby
RUN gem install sass

COPY ./ /SRC/


RUN npm install -g gulp

WORKDIR /SRC/
RUN npm install

WORKDIR /SRC/client
RUN npm install

WORKDIR /SRC/server
RUN npm install

WORKDIR /SRC/
RUN gulp build

EXPOSE 80 3000

CMD node /server/app.js

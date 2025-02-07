FROM node:20.10.0

WORKDIR /app

RUN npm install -g @angular/cli@15.2.8

RUN apt update
RUN apt install vim less nano git -y

CMD ["bash"]
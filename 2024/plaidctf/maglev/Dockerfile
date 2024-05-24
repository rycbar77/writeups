FROM ubuntu@sha256:aa772c98400ef833586d1d517d3e8de670f7e712bf581ce6053165081773259d

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get -y upgrade && apt-get install -yq build-essential xxd socat hashcash && rm -rf /var/lib/apt/lists/*
RUN adduser --no-create-home --disabled-password --gecos "" ctf
WORKDIR /home/ctf
COPY --chown=root:ctf bin/d8 bin/snapshot_blob.bin run /home/ctf/
RUN chmod 755 d8
RUN chmod 755 snapshot_blob.bin
RUN chmod 755 run
RUN mkdir /scripts
RUN chmod 733 /scripts
# USER ctf
CMD ["socat", "tcp-listen:2018,fork,reuseaddr", "/home/ctf/run"]
EXPOSE 2018